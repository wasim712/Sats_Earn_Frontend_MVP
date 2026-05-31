'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flame,
  LayoutGrid,
  ListChecks,
  Monitor,
  Search,
  Shield,
  Sparkles,
  Target,
  Users,
  Crown,
  Zap,
} from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import { useAppSelector } from '@/store/hooks';
import type { Campaign } from '@/types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type FilterMode = 'ALL' | 'AVAILABLE' | 'COMPLETED';
type DeviceFilter = 'ALL' | 'DESKTOP' | 'ANDROID' | 'IOS';
type DeviceOption = {
  key: DeviceFilter;
  label: string;
  iconType: 'lucide' | 'image';
  icon: React.ComponentType<{ className?: string }> | string;
};

const filterOptions: { key: FilterMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'ALL', label: 'All Tasks', icon: LayoutGrid },
  { key: 'AVAILABLE', label: 'Available', icon: Target },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
];

const deviceOptions: DeviceOption[] = [
  { key: 'ALL', label: 'All Devices', iconType: 'lucide', icon: LayoutGrid },
  { key: 'DESKTOP', label: 'Desktop', iconType: 'lucide', icon: Monitor },
  { key: 'ANDROID', label: 'Android', iconType: 'image', icon: '/svgs/android.svg' },
  { key: 'IOS', label: 'iOS', iconType: 'image', icon: '/svgs/ios.svg' },
];

const formatCompact = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const getTopReward = (campaign: Campaign) => Number(campaign.displayRewardSats || 0);

const getRequiredPlatform = (campaign: Campaign) => {
  const platform = String(campaign.requiredPlatform || 'NONE').toUpperCase();
  if (platform === 'DESKTOP') return { icon: Monitor, label: 'Desktop Only' };
  if (platform === 'ANDROID') return { icon: null, iconSrc: '/svgs/android.svg', label: 'Android Only' };
  if (platform === 'IOS') return { icon: null, iconSrc: '/svgs/ios.svg', label: 'iOS Only' };
  return { icon: LayoutGrid, label: 'All Devices' };
};

const getCampaignStatus = (campaign: Campaign) => {
  const safeTotal = Number(campaign.totalCompletions) || 0;
  const safeMax = Number(campaign.maxCompletions) || 1;
  const spotsLeft = Math.max(0, safeMax - safeTotal);
  const isFull = safeTotal >= safeMax;
  const isCompleted = Boolean(campaign.isCompleted);
  const progressPercent = Math.min((safeTotal / safeMax) * 100, 100);

  if (isCompleted) {
    return {
      label: 'Completed',
      tone: 'text-green-400 border-green-500/20 bg-green-500/10',
      cta: 'Review Submission',
      progressText: 'Completed by you',
      progressPercent,
      spotsLeft,
      isCompleted,
      isFull,
    };
  }

  if (isFull) {
    return {
      label: 'Full',
      tone: 'text-red-400 border-red-500/20 bg-red-500/10',
      cta: 'Campaign Full',
      progressText: 'No spots left',
      progressPercent,
      spotsLeft,
      isCompleted,
      isFull,
    };
  }

  return {
    label: campaign.hasStarted ? 'In Progress' : 'Live',
    tone: campaign.hasStarted ? 'text-sats-orange-400 border-sats-orange-500/20 bg-sats-orange-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    cta: campaign.hasStarted ? 'Continue Campaign' : 'Start Campaign',
    progressText: `${spotsLeft.toLocaleString()} spots left`,
    progressPercent,
    spotsLeft,
    isCompleted,
    isFull,
  };
};

const getPreviewDescription = (text: string) => {
  if (text.length <= 120) return text;
  return `${text.slice(0, 120).trim()}...`;
};

type StandaloneTask = {
  id: string;
  campaignId?: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  targetUrl?: string | null;
  proofType?: string | null;
  requiredPlatform?: 'NONE' | 'DESKTOP' | 'ANDROID' | 'IOS';
  taskRewardSats?: number;
  xpReward?: number;
  doubleRewardsActive?: boolean;
  isCompleted?: boolean;
  hasStarted?: boolean;
  isPremiumOnly?: boolean;
  isNewUserOnly?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const mapStandaloneTaskToCampaign = (task: StandaloneTask): Campaign => ({
  id: task.id,
  title: task.title,
  description: task.description || 'Quick standalone earning task.',
  category: 'Standalone Task',
  socialHandleTarget: null,
  targetCountries: [],
  isPremiumOnly: Boolean(task.isPremiumOnly),
  isNewUserOnly: Boolean(task.isNewUserOnly),
  requiredFreeTier: 'BASIC',
  targetUrl: task.targetUrl || null,
  requiredPlatform: task.requiredPlatform || 'NONE',
  coverImageUrl: task.coverImageUrl || null,
  baseRewardSats: Number(task.taskRewardSats || 0),
  xpReward: Number(task.xpReward || 0),
  doubleRewardsStartAt: null,
  doubleRewardsEndAt: null,
  doubleRewardsActive: Boolean(task.doubleRewardsActive),
  tierRewardMatrix: {},
  totalCompletions: task.isCompleted ? 1 : 0,
  maxCompletions: 1,
  isActive: true,
  isStandalone: true,
  itemSource: 'standalone',
  isCompleted: Boolean(task.isCompleted),
  hasStarted: Boolean(task.hasStarted),
  completedTasksCount: task.isCompleted ? 1 : 0,
  totalTasksCount: 1,
  displayRewardSats: Number(task.taskRewardSats || 0),
  userCompletionStatus: task.isCompleted ? 'COMPLETED' : task.hasStarted ? 'IN_PROGRESS' : 'AVAILABLE',
  createdAt: task.createdAt || new Date().toISOString(),
  updatedAt: task.updatedAt || new Date().toISOString(),
});

const PREMIUM_REWARDS_ANCHOR = '/user/rewards#premium-tiers';

export default function TasksPage() {
  const { user } = useAppSelector((state) => state.auth);
  const isPremiumUser = Boolean(user?.isPremium);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('ALL');
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const [campaignData, standaloneData] = await Promise.all([
          obfuscatedJsonRequest<Campaign[]>(`${API_URL}/users/campaigns`, {
            method: 'GET',
            headers,
          }),
          obfuscatedJsonRequest<StandaloneTask[]>(`${API_URL}/users/standalone-tasks`, {
            method: 'GET',
            headers,
          }),
        ]);
console.log(standaloneData);

        setCampaigns([
          ...(Array.isArray(campaignData) ? campaignData.map((campaign) => ({ ...campaign, itemSource: 'campaign' as const })) : []),
          ...(Array.isArray(standaloneData) ? standaloneData.map(mapStandaloneTaskToCampaign) : []),
        ]);
      } catch (err: unknown) {
        console.error('Error fetching tasks:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

      const campaignDevice = typeof campaign.requiredPlatform === 'string'
        ? campaign.requiredPlatform.toUpperCase()
        : 'NONE';

      const matchesDevice =
        deviceFilter === 'ALL'
          ? true
          : campaignDevice === deviceFilter || campaignDevice === 'NONE';

      const matchesFilter =
        filterMode === 'ALL'
          ? true
          : filterMode === 'COMPLETED'
            ? Boolean(campaign.isCompleted)
            : !campaign.isCompleted;

      return matchesSearch && matchesFilter && matchesDevice;
    });

    if (filterMode !== 'ALL') {
      return filtered;
    }

    const getOrderBucket = (campaign: Campaign) => {
      if (campaign.isCompleted) return 2;
      if (campaign.hasStarted) return 0;
      return 1;
    };

    return [...filtered].sort((left, right) => {
      if (deviceFilter !== 'ALL') {
        const leftPlatform = typeof left.requiredPlatform === 'string' ? left.requiredPlatform.toUpperCase() : 'NONE';
        const rightPlatform = typeof right.requiredPlatform === 'string' ? right.requiredPlatform.toUpperCase() : 'NONE';

        const leftDevicePriority = leftPlatform === deviceFilter ? 0 : leftPlatform === 'NONE' ? 1 : 2;
        const rightDevicePriority = rightPlatform === deviceFilter ? 0 : rightPlatform === 'NONE' ? 1 : 2;
        const devicePriorityDiff = leftDevicePriority - rightDevicePriority;

        if (devicePriorityDiff !== 0) return devicePriorityDiff;
      }

      const bucketDiff = getOrderBucket(left) - getOrderBucket(right);
      if (bucketDiff !== 0) return bucketDiff;
      return left.title.localeCompare(right.title);
    });
  }, [campaigns, searchQuery, filterMode, deviceFilter]);

  const summary = useMemo(() => {
    const available = campaigns.filter((campaign) => !campaign.isCompleted).length;
    const completed = campaigns.filter((campaign) => campaign.isCompleted).length;
    const doubleRewards = campaigns.filter((campaign) => Boolean(campaign.doubleRewardsActive)).length;

    return { total: campaigns.length, available, completed, doubleRewards };
  }, [campaigns]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-4 lg:p-6">
      <section className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 sm:p-6 lg:p-6 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              Browse Tasks
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Available Tasks</h1>
              <p className="text-sm sm:text-[15px] font-medium leading-7 text-gray-400">
                Complete campaigns and standalone tasks in one place and stack sats faster.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <SummaryCard label="Total" value={summary.total} icon={LayoutGrid} tone="blue" />
            <SummaryCard label="Available" value={summary.available} icon={Target} tone="green" />
            <SummaryCard label="Completed" value={summary.completed} icon={CheckCircle2} tone="purple" />
            <SummaryCard label="2x Live" value={summary.doubleRewards} icon={Flame} tone="yellow" />
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#1a1a1a] bg-black p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md group">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search className="h-5 w-5 text-gray-500 transition-colors group-focus-within:text-sats-orange-500" />
            </div>
            <input
              type="text"
                placeholder="Search tasks, rewards, or task keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#1a1a1a] bg-[#050505] py-3.5 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-600 hover:border-[#2a2a2a] focus:border-sats-orange-500/40"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap items-center gap-3">
              {filterOptions.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilterMode(key)}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-2 md:px-4 py-2.5 text-sm font-bold transition-all ${
                    filterMode === key
                      ? 'border-sats-orange-500/40 bg-sats-orange-500/10 text-sats-orange-400 shadow-[0_0_18px_rgba(238,139,18,0.08)]'
                      : 'border-[#1a1a1a] bg-[#050505] text-gray-400 hover:border-[#2a2a2a] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{key === 'ALL' ? <><span className="md:hidden">All</span><span className="hidden md:inline">{label}</span></> : label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {deviceOptions.map(({ key, label, iconType, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDeviceFilter(key)}
                  className={`inline-flex ${key=='IOS'?'':'items-center'} justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition-all ${
                    deviceFilter === key
                      ? 'border-sats-orange-500/40 bg-sats-orange-500/10 text-sats-orange-400 shadow-[0_0_18px_rgba(238,139,18,0.08)]'
                      : 'border-[#1a1a1a] bg-[#050505] text-gray-400 hover:border-[#2a2a2a] hover:text-white'
                  }`}
                >
                  {iconType === 'image' ? (
                    <Image src={icon as string} alt={label} width={16} height={16} className="h-4 w-4" />
                  ) : (
                    React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'h-4 w-4' })
                  )}
                  <span className={key === 'ALL' ? '' : 'hidden md:inline'}>{key === 'ALL' ? <><span className="md:hidden">All</span><span className="hidden md:inline">{label}</span></> : label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 p-4 text-red-300 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {!error && filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <TaskPreviewCard key={campaign.id} campaign={campaign} isPremiumUser={isPremiumUser} />
              ))}
            </div>
          ) : !error && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#1a1a1a] bg-black px-4 py-24 text-center shadow-lg">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#1a1a1a] bg-sats-black-950 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-white">You are all caught up!</h3>
              <p className="font-medium text-gray-400">There are no new tasks matching your criteria right now.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const toneStyles = {
    blue: {
      card: 'border-sky-500/16 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_38%),#050505]',
      badge: 'border-sky-400/20 bg-sky-500/12 text-sky-300',
      icon: 'text-sky-300',
      value: 'text-white',
    },
    green: {
      card: 'border-emerald-500/16 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_38%),#050505]',
      badge: 'border-emerald-400/20 bg-emerald-500/12 text-emerald-300',
      icon: 'text-emerald-300',
      value: 'text-white',
    },
    purple: {
      card: 'border-violet-500/16 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_38%),#050505]',
      badge: 'border-violet-400/20 bg-violet-500/12 text-violet-300',
      icon: 'text-violet-300',
      value: 'text-white',
    },
    yellow: {
      card: 'border-amber-500/16 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_38%),#050505]',
      badge: 'border-amber-400/20 bg-amber-500/12 text-amber-300',
      icon: 'text-amber-300',
      value: 'text-white',
    },
  } as const;

  const style = toneStyles[tone];

  return (
    <div className={`rounded-2xl border px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.015)] ${style.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase ] text-gray-500">{label}</p>
          <p className={`mt-2 text-2xl font-black ${style.value}`}>{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-[0_10px_25px_rgba(0,0,0,0.2)] ${style.badge}`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
      </div>
    </div>
  );
}

function TaskPreviewCard({ campaign, isPremiumUser }: { campaign: Campaign; isPremiumUser: boolean }) {
  const status = getCampaignStatus(campaign);
  const detailHref = campaign.itemSource === 'standalone' ? `/user/standalone-tasks/${campaign.id}` : `/user/tasks/${campaign.id}`;
  const topReward = getTopReward(campaign);
  const isPremiumOnly = Boolean(campaign.isPremiumOnly);
  const isNewUserOnly = Boolean(campaign.isNewUserOnly);
  console.log(isNewUserOnly);
  
  const isLockedPremium = isPremiumOnly && !isPremiumUser;
  const ctaLabel = isLockedPremium ? 'Upgrade to Premium' : status.cta;
  const resolvedHref = isLockedPremium ? PREMIUM_REWARDS_ANCHOR : detailHref;
  const { icon: DeviceIcon, iconSrc: deviceIconSrc, label: deviceLabel } = getRequiredPlatform(campaign) as {
    icon?: React.ComponentType<{ className?: string }> | null;
    iconSrc?: string;
    label: string;
  };
  const completedTasksCount = Number(campaign.completedTasksCount) || 0;
  const totalTasksCount = Number(campaign.totalTasksCount) || 0;
  const stepsLabel = totalTasksCount > 0 ? `${completedTasksCount}/${totalTasksCount} steps` : 'Multi-step task';
  const description = getPreviewDescription(campaign.description);

  return (
    <Link href={resolvedHref} className="group block h-full">
      <article
        className={[
          'relative flex h-full min-h-[480px] flex-col overflow-hidden rounded-[32px] border transition-all duration-300 hover:-translate-y-1.5',
          isPremiumOnly
            ? 'border-violet-400/30 bg-[linear-gradient(180deg,rgba(20,12,32,1)_0%,rgba(8,8,8,1)_52%,rgba(6,6,6,1)_100%)] shadow-[0_20px_60px_rgba(88,28,135,0.2)] hover:border-violet-300/45 hover:shadow-[0_30px_90px_rgba(88,28,135,0.32)]'
            : 'border-[#1a1a1a] bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-[#2a2a2a] hover:shadow-[0_28px_80px_rgba(0,0,0,0.45)]',
        ].join(' ')}
      >
        <div
          className={[
            'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            isPremiumOnly
              ? 'bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_26%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]'
              : 'bg-[radial-gradient(circle_at_top_right,rgba(238,139,18,0.10),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_22%)]',
          ].join(' ')}
        />

        {isPremiumOnly ? (
          <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-white/6" />
        ) : null}

        <div className={`relative h-[208px] shrink-0 overflow-hidden border-b ${isPremiumOnly ? 'border-violet-400/12 bg-[linear-gradient(180deg,#11111a_0%,#0e0a14_100%)]' : 'border-[#141414] bg-[#111]'}`}>
          {campaign.coverImageUrl ? (
            <>
              <Image
                src={campaign.coverImageUrl}
                alt={campaign.title}
                fill
                className="scale-110 object-cover opacity-40 blur-2xl transition-all duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative aspect-square h-[62%] w-[62%] max-h-[130px] max-w-[130px]">
                  <Image
                    src={campaign.coverImageUrl}
                    alt={campaign.title}
                    fill
                    className="rounded-xl object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                    sizes="240px"
                    unoptimized
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                src="/round_logo.png"
                alt={campaign.title}
                fill
                className="scale-110 object-cover opacity-40 blur-2xl transition-all duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative aspect-square h-[62%] w-[62%] max-h-[130px] max-w-[130px]">
                  <Image
                    src="/round_logo.png"
                    alt={campaign.title}
                    fill
                    className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                    sizes="240px"
                    unoptimized
                  />
                </div>
              </div>
            </>
          )}

          <div className={`absolute inset-0 ${isPremiumOnly ? 'bg-gradient-to-t from-[#080808] via-[#0f0a16]/40 to-transparent' : 'bg-gradient-to-t from-[#080808] via-[#080808]/35 to-transparent'}`} />

          <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
            {isPremiumOnly ? (
              <div className="absolute right-0 top-0 z-30 inline-flex items-center gap-1.5 rounded-bl-2xl rounded-tr-2xl border border-violet-300/45 bg-[linear-gradient(135deg,#a855f7,#7c3aed)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(168,85,247,0.34)]">
                <Crown className="h-3.5 w-3.5" />
                Premium Only
              </div>
            ) : null}

            {isNewUserOnly ? (
              <div className={`absolute z-30 inline-flex items-center gap-1.5 rounded-bl-2xl border border-sats-orange-500/35 bg-[linear-gradient(135deg,#f97316,#fb923c)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_0_22px_rgba(249,115,22,0.28)] ${isPremiumOnly ? 'right-0 top-11 rounded-tr-none' : 'right-0 top-0 rounded-tr-2xl'}`}>
                <Shield className="h-3.5 w-3.5" />
                New Users Only
              </div>
            ) : null}

            <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-md ${status.tone}`}>
              <span className="h-2 w-2 rounded-full bg-current opacity-80" />
              {status.label}
            </div>

            <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-black shadow-[0_0_18px_rgba(238,139,18,0.08)] backdrop-blur-md ${isPremiumOnly ? 'border border-violet-300/20 bg-[#140d1f]/80 text-violet-200 shadow-[0_0_24px_rgba(168,85,247,0.12)]' : 'border border-sats-orange-500/20 bg-black/65 text-sats-orange-400'}`}>
              <Zap className="h-3.5 w-3.5" />
              <span>{topReward.toLocaleString()} sats</span>
            </div>
          </div>

          {campaign.doubleRewardsActive ? (
            <div className="absolute bottom-5 left-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-black/70 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.08)] backdrop-blur-md">
                <Flame className="h-4 w-4 text-sats-orange-500" />
                2x Rewards Live
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative flex grow flex-col p-6 md:p-7">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <MetaPill icon={DeviceIcon} iconSrc={deviceIconSrc} label={deviceLabel} premium={isPremiumOnly} />
                <MetaPill icon={ListChecks} label={stepsLabel} premium={isPremiumOnly} />
                <MetaPill icon={Users} label={`${formatCompact(Math.max(status.spotsLeft, 0))} slots`} premium={isPremiumOnly} />
                {isNewUserOnly ? <MetaPill icon={Shield} label="New Account" premium={false} /> : null}
              </div>

              <div>
                <h3 className={`line-clamp-2 text-2xl font-black leading-tight text-white transition-colors ${isPremiumOnly ? 'group-hover:text-violet-200' : 'group-hover:text-sats-orange-500'}`}>
                  {campaign.title}
                </h3>
                <p className={`mt-3 line-clamp-3 text-[15px] leading-relaxed ${isPremiumOnly ? 'text-gray-300/85' : 'text-gray-400'}`}>{description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CompactStat label="Base Reward" value={`${topReward.toLocaleString()} sats`} premium={isPremiumOnly} />
              <CompactStat label="XP Reward" value={`${Number(campaign.xpReward || 0).toLocaleString()} XP`} premium={isPremiumOnly} />
            </div>
          </div>

          <div className="mt-auto pt-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em]">
                <span className={status.isCompleted ? 'text-green-400' : status.isFull ? 'text-red-400' : 'text-gray-500'}>
                  {status.progressText}
                </span>
                <span className="text-gray-500">{status.progressPercent.toFixed(0)}%</span>
              </div>
              <div className={`h-2.5 overflow-hidden rounded-full border ${isPremiumOnly ? 'border-violet-400/12 bg-[#120d19]' : 'border-[#1a1a1a] bg-[#111]'}`}>
                <div
                  className={[
                    'h-full rounded-full transition-all duration-1000',
                    status.isCompleted ? 'bg-green-500' : status.isFull ? 'bg-red-500' : isPremiumOnly ? 'bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400 shadow-[0_0_14px_rgba(168,85,247,0.38)]' : 'bg-sats-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.45)]',
                  ].join(' ')}
                  style={{ width: `${status.progressPercent}%` }}
                />
              </div>
            </div>

            <div
              className={[
                'w-full rounded-2xl border px-4 py-4 text-sm font-black transition-all',
                'flex items-center justify-center gap-2',
                status.isCompleted
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : status.isFull
                    ? 'border-red-500/20 bg-red-500/10 text-red-400'
                    : isLockedPremium
                      ? 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300 group-hover:border-yellow-400/40 group-hover:bg-yellow-500/20 group-hover:text-yellow-200'
                      : isPremiumOnly
                        ? 'border-violet-400/24 bg-[linear-gradient(135deg,#171025,#120b1d)] text-violet-100 group-hover:border-violet-300/45 group-hover:bg-[linear-gradient(135deg,#a855f7,#7c3aed)] group-hover:text-white group-hover:shadow-[0_0_24px_rgba(168,85,247,0.28)]'
                      : 'border-[#2a2a2a] bg-[#111] text-white group-hover:border-sats-orange-500 group-hover:bg-sats-orange-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
              ].join(' ')}
            >
              <span>{ctaLabel}</span>
              {!status.isCompleted && !status.isFull ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> : null}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function MetaPill({
  icon: Icon,
  iconSrc,
  label,
  premium = false,
}: {
  icon?: React.ComponentType<{ className?: string }> | null;
  iconSrc?: string;
  label: string;
  premium?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold shadow-[0_0_0_1px_rgba(255,255,255,0.015)] ${premium ? 'border border-violet-400/14 bg-[#0d0914] text-violet-100' : 'border border-[#1a1a1a] bg-[#050505] text-gray-300'}`}>
      {iconSrc ? (
        <Image src={iconSrc} alt={label} width={14} height={14} className="h-3.5 w-3.5" />
      ) : Icon ? (
        <Icon className={`h-3.5 w-3.5 ${premium ? 'text-violet-300' : 'text-gray-500'}`} />
      ) : null}
      <span>{label}</span>
    </div>
  );
}

function CompactStat({ label, value, premium = false }: { label: string; value: string; premium?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.015)] ${premium ? 'border border-violet-400/14 bg-[linear-gradient(180deg,#110c18,#09070d)]' : 'border border-[#1a1a1a] bg-[#050505]'}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${premium ? 'text-violet-300/70' : 'text-gray-500'}`}>{label}</p>
      <p className={`mt-2 line-clamp-1 text-sm font-bold ${premium ? 'text-violet-50' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[32px] border border-[#1a1a1a] bg-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-pulse">
      <div className="relative h-[208px] shrink-0 overflow-hidden border-b border-[#141414] bg-[#111]">
        <div className="absolute left-5 top-5 h-10 w-28 rounded-xl bg-[#181818]" />
        <div className="absolute right-5 top-5 h-10 w-28 rounded-xl bg-[#181818]" />
        <div className="absolute bottom-5 left-5 h-10 w-36 rounded-full bg-[#181818]" />
      </div>

      <div className="flex grow flex-col p-6 md:p-7">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="h-9 w-28 rounded-full bg-[#141414]" />
            <div className="h-9 w-24 rounded-full bg-[#141414]" />
            <div className="h-9 w-20 rounded-full bg-[#141414]" />
          </div>

          <div>
            <div className="h-7 w-4/5 rounded-lg bg-[#1a1a1a]" />
            <div className="mt-4 space-y-2.5">
              <div className="h-4 w-full rounded bg-[#141414]" />
              <div className="h-4 w-11/12 rounded bg-[#141414]" />
              <div className="h-4 w-3/4 rounded bg-[#141414]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-[76px] rounded-2xl border border-[#1a1a1a] bg-[#111]" />
            <div className="h-[76px] rounded-2xl border border-[#1a1a1a] bg-[#111]" />
          </div>
        </div>

        <div className="mt-auto pt-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-[#141414]" />
              <div className="h-3 w-10 rounded bg-[#141414]" />
            </div>
            <div className="h-2.5 rounded-full bg-[#141414]" />
          </div>
          <div className="h-[56px] rounded-2xl border border-[#1a1a1a] bg-[#111]" />
        </div>
      </div>
    </div>
  );
}




