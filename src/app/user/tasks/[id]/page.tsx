'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { obfuscatedFetch, obfuscatedJsonRequest, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import {
  mapSubmissionStatusToTaskStatus,
  PageSkeleton,
  PROOF_META,
  TaskCard,
  type UserTaskPageTask as Task,
  type UserTaskResult as TaskResult,
  type UserTaskStatus as TaskStatus,
} from '@/components/user/tasks/CampaignTaskPageComponents';
import { ArrowLeft, AlertTriangle, CheckCircle2, ExternalLink, Zap } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getDoubleRewardsStatus(startAt?: string | null, endAt?: string | null) {
  if (!startAt || !endAt) return 'none' as const;

  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return 'none' as const;
  if (now < start) return 'upcoming' as const;
  if (now >= start && now <= end) return 'live' as const;
  return 'ended' as const;
}

function getCurrentDevicePlatform(): 'DESKTOP' | 'ANDROID' | 'IOS' {
  if (typeof window === 'undefined') return 'DESKTOP';

  const userAgent = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';
  const touchPoints = window.navigator.maxTouchPoints || 0;

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent) || (platform === 'MacIntel' && touchPoints > 1);

  if (isAndroid) return 'ANDROID';
  if (isIOS) return 'IOS';
  return 'DESKTOP';
}

function getTaskDevicePriority(task: Task, currentDevice: 'DESKTOP' | 'ANDROID' | 'IOS') {
  const platform = String(task.requiredPlatform || 'NONE').toUpperCase();

  if (platform === currentDevice) return 0;
  if (platform === 'NONE') return 1;
  return 2;
}

function formatLiveUntil(value?: string | null) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  baseRewardSats: number;
  displayRewardSats?: number;
  xpReward?: number;
  doubleRewardsActive?: boolean;
  doubleRewardsStartAt?: string | null;
  doubleRewardsEndAt?: string | null;
  coverImageUrl?: string | null;
  tierRewardMatrix?: Record<string, number>;
  targetUrl: string | null;
  tasks: Task[];
  isPremiumOnly?: boolean;
  totalCompletions?: number;
  maxCompletions?: number;
  requiredPlatform?: string;
}

export default function CampaignDetailsPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<{ [taskId: string]: File | null }>({});
  const [textInputs, setTextInputs] = useState<{ [taskId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [taskId: string]: boolean }>({});
  const [submissionResults, setSubmissionResults] = useState<{ [taskId: string]: TaskResult | null }>({});

  const [taskStatuses, setTaskStatuses] = useState<{ [taskId: string]: TaskStatus }>({});
  const doubleRewardsStatus = getDoubleRewardsStatus(campaign?.doubleRewardsStartAt, campaign?.doubleRewardsEndAt);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token =
          sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

        const response = await obfuscatedFetch(`${API_URL}/users/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch campaign details.');

        const data: Campaign = await parseObfuscatedJson<Campaign>(response);
        setCampaign(data);

        const initialStatuses: { [id: string]: TaskStatus } = {};
        data.tasks?.forEach((task) => {
          const latestStatus = task.userSubmission?.status || task.submissions?.[0]?.status;
          initialStatuses[task.id] = mapSubmissionStatusToTaskStatus(latestStatus);
        });
        setTaskStatuses(initialStatuses);

        const hasAnyEmbedded = data.tasks?.some(
          (t) => t.userSubmission !== undefined || (t.submissions && t.submissions.length > 0)
        );

        if (!hasAnyEmbedded && data.tasks?.length) {
          const statusFetches = data.tasks.map(async (task) => {
            try {
              const r = await obfuscatedFetch(`${API_URL}/users/tasks/${task.id}/status`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!r.ok) return;
              const s = await parseObfuscatedJson<{ status?: string }>(r);
              const mapped = mapSubmissionStatusToTaskStatus(s?.status);
              setTaskStatuses((prev) => ({ ...prev, [task.id]: mapped }));
            } catch {
            }
          });
          await Promise.allSettled(statusFetches);
        }
      } catch (err: unknown) {
        setPageError(err instanceof Error ? err.message : 'Failed to fetch campaign details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const handleFileChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionResults((prev) => ({ ...prev, [taskId]: null }));
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return alert('Please upload a valid image file (JPG, PNG).');
      if (file.size > 5 * 1024 * 1024) return alert('Image must be smaller than 5MB.');
      setSelectedFiles((prev) => ({ ...prev, [taskId]: file }));
    }
  };

  const handleTextChange = (taskId: string, value: string) => {
    setSubmissionResults((prev) => ({ ...prev, [taskId]: null }));
    setTextInputs((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleSubmitProof = async (taskId: string, proofType: string) => {
    setIsSubmitting((prev) => ({ ...prev, [taskId]: true }));

    try {
      const token =
        sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const task = orderedTasks.find((item) => item.id === taskId);
      const requiredPlatform = task?.requiredPlatform || 'NONE';

      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      };

      if (proofType === 'SCREENSHOT') {
        const file = selectedFiles[taskId];
        if (!file) throw new Error('Please upload a screenshot.');
        const formData = new FormData();
        formData.append('proofImage', file);
        formData.append('requiredPlatform', requiredPlatform);
        fetchOptions.body = formData;
      } else if (proofType === 'URL' || proofType === 'TEXT_RESPONSE') {
        const text = textInputs[taskId];
        if (!text || text.trim() === '') throw new Error('Response cannot be empty.');
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ proofText: text.trim(), requiredPlatform });
      } else if (proofType === 'API_VERIFIED') {
        fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
        fetchOptions.body = JSON.stringify({ triggerVerification: true, requiredPlatform });
      }

      const response = await obfuscatedFetch(`${API_URL}/users/tasks/${taskId}/submit`, fetchOptions);
      const data = await parseObfuscatedJson<{ error?: string; status?: string; submissionId?: string; message?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Submission failed.');

      setSubmissionResults((prev) => ({
        ...prev,
        [taskId]: { success: true, message: data.message || 'Submitted successfully!' },
      }));
      setTaskStatuses((prev) => ({ ...prev, [taskId]: 'pending_review' }));
      dispatch(fetchUserDashboard());

    } catch (err: unknown) {
      setSubmissionResults((prev) => ({
        ...prev,
        [taskId]: { success: false, message: err instanceof Error ? err.message : 'Submission failed.' },
      }));
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const completedCount = campaign
    ? Object.values(taskStatuses).filter(
        (s) => s === 'completed' || s === 'pending_review'
      ).length
    : 0;
  const totalTasks = campaign?.tasks?.length ?? 0;
  const progressPct = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const allDone = completedCount === totalTasks && totalTasks > 0;
  const currentDevicePlatform = getCurrentDevicePlatform();
  const orderedTasks = campaign
    ? [...(campaign.tasks || [])].sort((left, right) => {
        const priorityDiff =
          getTaskDevicePriority(left, currentDevicePlatform) - getTaskDevicePriority(right, currentDevicePlatform);

        if (priorityDiff !== 0) return priorityDiff;

        return left.title.localeCompare(right.title);
      })
    : [];

  const isPremiumOnly = Boolean(campaign?.isPremiumOnly);
  const themeColors = {
    primary: isPremiumOnly ? 'text-violet-400' : 'text-sats-orange-500',
    primaryBg: isPremiumOnly ? 'bg-violet-500' : 'bg-sats-orange-500',
    primaryBgLight: isPremiumOnly ? 'bg-violet-500/10' : 'bg-sats-orange-500/10',
    primaryBorderLight: isPremiumOnly ? 'border-violet-500/20' : 'border-sats-orange-500/20',
    primaryDropShadow: isPremiumOnly ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'drop-shadow-[0_0_12px_rgba(249,115,22,0.45)]',
    gradientProgress: isPremiumOnly ? 'bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400' : 'bg-gradient-to-r from-sats-orange-500 to-yellow-500',
    glowLarge: isPremiumOnly ? 'bg-violet-500/4' : 'bg-sats-orange-500/4',
    glowSmall: isPremiumOnly ? 'bg-violet-500/3' : 'bg-sats-orange-500/3',
  };

  let difficulty = 'Easy';
  if (totalTasks > 10) difficulty = 'Hard';
  else if (totalTasks > 5) difficulty = 'Medium';
  else if (totalTasks > 2) difficulty = 'Moderate';

  const formatCompact = (num: number) =>
    new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 }).format(num);

  const safeTotal = Number(campaign?.totalCompletions) || 0;
  const safeMax = Number(campaign?.maxCompletions) || 1;
  const spotsLeft = Math.max(0, safeMax - safeTotal);
  let completionPct = Math.round(Math.min((safeTotal / safeMax) * 100, 100));
  if (completionPct < 0) completionPct = 0;

  let deviceDisplay = 'All Devices';
  const reqPlat = String(campaign?.requiredPlatform || 'NONE').toUpperCase();
  if (reqPlat === 'DESKTOP') deviceDisplay = 'Desktop Only';
  if (reqPlat === 'ANDROID') deviceDisplay = 'Android Only';
  if (reqPlat === 'IOS') deviceDisplay = 'iOS Only';

  const rawDescription = campaign?.description || '';
  const descriptionSteps = rawDescription
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const coverImg = campaign?.coverImageUrl || '/round_logo.png';
  
  // Derive base reward from raw campaign detail payload the same way list data is built
  const computedBaseReward = React.useMemo(() => {
    if (!campaign) return 0;

    const tasks = Array.isArray(campaign.tasks) ? campaign.tasks : [];
    const campaignMatrix = ((campaign as any)?.tierRewardMatrix || {}) as Record<string, number>;

    if (tasks.length > 0) {
      const taskLevelBaseReward = tasks.reduce((sum, task) => {
        const overrideMatrix = (((task as any)?.tierRewardMatrixOverride || {}) as Record<string, number>);
        const overrideBasicReward = Number(overrideMatrix.BASIC || 0);
        const campaignBasicReward = Number(campaignMatrix.BASIC || 0);
        return sum + (overrideBasicReward > 0 ? overrideBasicReward : campaignBasicReward);
      }, 0);

      if (taskLevelBaseReward > 0) {
        return taskLevelBaseReward;
      }
    }

    return Number(
      (campaign as any)?.basicTierRewardSats ??
      campaign?.baseRewardSats ??
      campaignMatrix.BASIC ??
      (campaign as any)?.rewardAmount ??
      (campaign as any)?.taskRewardSats ??
      0
    );
  }, [campaign]);

  if (isLoading) {
    return (
      <div className="min-h-screen lg:h-screen bg-[#020202] flex flex-col relative overflow-hidden animate-pulse">
        {/* Ambient glows */}
        <div className="fixed top-0 right-1/4 w-[400px] h-[400px] bg-sats-orange-500/4 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-64 h-64 bg-sats-orange-500/3 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-[1200px] w-full mx-auto px-4 py-6 md:py-8 flex-1 flex flex-col min-h-0">
          
          {/* Back Button Skeleton */}
          <div className="h-10 w-40 bg-[#111] border border-[#1a1a1a] rounded-xl mb-6 shadow-sm"></div>

          <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0">
            
            {/* LEFT COLUMN Skeleton */}
            <div className="flex-1 min-w-0 w-full space-y-6 lg:overflow-y-auto lg:h-full lg:pr-3 pb-24 lg:pb-6 scrollbar-hide">
              
              {/* Hero Image Header */}
              <div className="h-[140px] md:h-[180px] w-full rounded-[24px] border border-[#1a1a1a] bg-[#080808]"></div>

              {/* Title & Reward Pill */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="h-8 w-32 bg-[#1a1a1a] rounded-xl"></div>
                </div>
                <div className="h-8 md:h-10 w-3/4 max-w-xl bg-[#1a1a1a] rounded-lg mb-5"></div>
                <div className="space-y-2 mt-6 pl-1">
                  <div className="h-4 w-full max-w-2xl bg-[#111] rounded"></div>
                  <div className="h-4 w-5/6 max-w-xl bg-[#111] rounded"></div>
                  <div className="h-4 w-4/5 max-w-lg bg-[#111] rounded"></div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl px-5 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 w-24 bg-[#1a1a1a] rounded"></div>
                </div>
                <div className="h-1.5 bg-[#141414] rounded-full overflow-hidden mb-2.5"></div>
                <div className="h-4 w-32 bg-[#111] rounded"></div>
              </div>

              {/* Warning Message */}
              <div className="bg-[#140e05] border border-[#1a1a1a] rounded-2xl p-5 flex items-start gap-3">
                <div className="w-5 h-5 bg-[#111] rounded-full shrink-0 mt-0.5"></div>
                <div className="w-full">
                  <div className="h-4 w-48 bg-[#1a1a1a] rounded mb-2"></div>
                  <div className="h-3 w-full bg-[#111] rounded mb-1"></div>
                  <div className="h-3 w-5/6 bg-[#111] rounded"></div>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5 pb-5 border-b border-[#1a1a1a]">
                  <div className="h-5 w-24 bg-[#1a1a1a] rounded"></div>
                  <div className="h-6 w-16 bg-[#111] rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-[220px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#111]"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 w-3/4 bg-[#111] rounded"></div>
                          <div className="h-4 w-1/2 bg-[#111] rounded"></div>
                          <div className="h-[60px] w-full bg-[#111] rounded-xl mt-4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN Skeleton */}
            <div className="w-full lg:w-[320px] shrink-0 space-y-4 lg:h-full lg:overflow-y-auto pb-24 lg:pb-6 scrollbar-hide">
              
              {/* Reward Breakdown */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="h-2.5 w-32 bg-[#1a1a1a] rounded mb-5"></div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center"><div className="h-4 w-20 bg-[#111] rounded"></div><div className="h-4 w-20 bg-[#111] rounded"></div></div>
                  <div className="flex justify-between items-center"><div className="h-4 w-20 bg-[#111] rounded"></div><div className="h-4 w-20 bg-[#111] rounded"></div></div>
                  <div className="flex justify-between items-center"><div className="h-4 w-20 bg-[#111] rounded"></div><div className="h-4 w-20 bg-[#111] rounded"></div></div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="h-2.5 w-32 bg-[#1a1a1a] rounded mb-5"></div>
                <div className="space-y-4 text-sm">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex justify-between items-center"><div className="h-4 w-20 bg-[#111] rounded"></div><div className="h-4 w-20 bg-[#111] rounded"></div></div>
                  ))}
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="h-2.5 w-32 bg-[#1a1a1a] rounded mb-5"></div>
                <div className="mb-3 flex items-baseline gap-2">
                  <div className="h-8 w-16 bg-[#1a1a1a] rounded"></div>
                  <div className="h-3 w-24 bg-[#111] rounded"></div>
                </div>
                <div className="h-1 bg-[#141414] rounded-full mb-4"></div>
                <div className="h-3 w-48 bg-[#111] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !campaign) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Campaign Unavailable</h2>
        <p className="text-sm text-white/35 mb-8 leading-relaxed">
          {pageError || "We couldn't load this campaign. It may have ended or been removed."}
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-[#020202] flex flex-col relative overflow-hidden">
      {/* Ambient glows */}
      <div className={`fixed top-0 right-1/4 w-[400px] h-[400px] ${themeColors.glowLarge} rounded-full blur-[140px] pointer-events-none`} />
      <div className={`fixed bottom-0 left-0 w-64 h-64 ${themeColors.glowSmall} rounded-full blur-[100px] pointer-events-none`} />

      <div className="relative max-w-[1200px] w-full mx-auto px-4 py-6 md:py-8 flex-1 flex flex-col min-h-0">
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 w-fit text-sm font-bold text-white/60 hover:text-white mb-6 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0">
          
          {/* LEFT COLUMN - Scrollable independently */}
          <div className="flex-1 min-w-0 w-full space-y-6 lg:overflow-y-auto lg:h-full lg:pr-3 pb-24 lg:pb-6 scrollbar-hide">
            
            {/* Hero Image Header */}
            <div className={`relative h-[140px] md:h-[180px] w-full overflow-hidden rounded-[24px] border ${isPremiumOnly ? 'border-violet-400/12 bg-[linear-gradient(180deg,#11111a_0%,#0e0a14_100%)]' : 'border-[#1a1a1a] bg-[#080808]'}`}>
              {/* Blurred background */}
              <Image src={coverImg} alt={campaign.title} fill className="object-cover blur-[80px] opacity-35" unoptimized />
              <div className={`absolute inset-0 ${isPremiumOnly ? 'bg-gradient-to-t from-[#080808] via-[#0f0a16]/40 to-transparent' : 'bg-gradient-to-t from-[#080808] via-[#080808]/35 to-transparent'}`} />
              
              {/* Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative aspect-square h-[60%] w-[60%] max-h-[80px] max-w-[80px]">
                  <Image src={coverImg} alt={campaign.title} fill className={`object-contain ${themeColors.primaryDropShadow}`} unoptimized />
                </div>
              </div>
            </div>

            {/* Title & Reward Pill */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${themeColors.primaryBgLight} ${themeColors.primaryBorderLight}`}>
                  <Zap className={`w-3.5 h-3.5 ${themeColors.primary}`} />
                  <span className={`text-sm font-black ${themeColors.primary}`}>
                   ~ {Number(campaign.displayRewardSats || 0)} sats
                  </span>
                  <span className={`text-xs ${themeColors.primary} opacity-70 font-medium`}> total reward</span>
                </div>
                {isPremiumOnly && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                    <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                    <span className="text-sm font-black text-violet-400 tracking-wide">Premium Only</span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug mb-5 break-words">
                {campaign.title}
              </h1>

              {/* Instructions / Steps */}
              {descriptionSteps.length > 0 && (
                <div className="space-y-1.5 mt-6 pl-1">
                  {descriptionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-white/60 leading-relaxed">
                      <span className="font-bold text-white/30 shrink-0">{idx + 1}.</span>
                      <span className="break-words min-w-0">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {campaign.targetUrl && (
                <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                  <a
                    href={campaign.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    Open Target Link <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Progress Tracker */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl px-5 py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Your Progress</span>
                  {allDone && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400">
                      <CheckCircle2 className="w-2.5 h-2.5" /> All done
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-[#141414] rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    allDone 
                      ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.45)]' 
                      : isPremiumOnly 
                        ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.45)]'
                        : 'bg-sats-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.45)]'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-white/40">
                <span className={completedCount > 0 ? 'text-white' : ''}>{completedCount}</span>
                /{totalTasks} tasks complete
              </span>
            </div>

            {/* Warning Message */}
            <div className="bg-[#140e05] border border-sats-orange-500/30 rounded-2xl p-5 flex items-start gap-3 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-sats-orange-500/50 rounded-l-2xl" />
              <AlertTriangle className="w-5 h-5 text-sats-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-sats-orange-500 mb-1.5">Keep your action live to keep your sats.</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  Undoing a rewarded task â€” unfollowing, unliking, deleting a comment, or removing a repost â€” is treated as gaming the system and can lead to clawed-back sats or an account ban. Only complete tasks you intend to keep.
                </p>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-[#1a1a1a]">
                <h2 className="text-base font-bold text-white">Task Steps</h2>
                <div className="px-3 py-1 rounded-full bg-[#111] border border-[#222] text-xs font-bold text-white/50">
                  {totalTasks} steps
                </div>
              </div>

              <div className="space-y-4">
                {orderedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-[#0a0a0a] border border-[#1a1a1a] border-dashed rounded-xl">
                    <p className="text-sm text-white/25">No tasks found for this campaign.</p>
                  </div>
                ) : (
                  orderedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      taskStatus={taskStatuses[task.id] ?? 'idle'}
                      result={submissionResults[task.id] ?? null}
                      isSubmitting={!!isSubmitting[task.id]}
                      selectedFile={selectedFiles[task.id] ?? null}
                      textInput={textInputs[task.id] ?? ''}
                      onFileChange={handleFileChange}
                      onTextChange={handleTextChange}
                      onSubmit={handleSubmitProof}
                      isPremiumOnly={isPremiumOnly}
                    />
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Fixed position alongside */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-4 lg:h-full lg:overflow-y-auto pb-24 lg:pb-6 scrollbar-hide">
            
            {/* Reward Breakdown */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] mb-4">Reward Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Base reward</span>
                  <span className={`font-bold ${themeColors.primary}`}>{computedBaseReward.toLocaleString()} sats</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Your reward</span>
                  <span className={`font-bold ${themeColors.primary}`}>{Number(campaign.displayRewardSats || 0).toLocaleString()} sats</span>
                </div>
                {Number(campaign.xpReward || 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">XP reward</span>
                    <span className="font-bold text-violet-400">{Number(campaign.xpReward).toLocaleString()} XP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] mb-4">Campaign Info</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 flex items-center gap-2">Difficulty</span>
                  <span className="font-bold text-white/80">{difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 flex items-center gap-2">Device</span>
                  <span className="font-bold text-white/80">{deviceDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 flex items-center gap-2">Slots left</span>
                  <span className="font-bold text-white/80">{safeMax > 0 ? `${formatCompact(Math.max(spotsLeft, 0))}/${formatCompact(safeMax)}` : 'Unlimited'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 flex items-center gap-2">Verify time</span>
                  <span className="font-bold text-white/80">~24h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 flex items-center gap-2">Status</span>
                  <span className={`font-bold ${allDone ? 'text-green-500' : 'text-white/80'}`}>{allDone ? 'Completed' : 'In Progress'}</span>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            {safeMax > 0 && (
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-5">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] mb-4">Completion Rate</h3>
                <div className="mb-2">
                  <span className="text-2xl font-black text-green-400">{completionPct}%</span>
                  <span className="text-xs text-white/40 ml-2">of all slots taken</span>
                </div>
                <div className="h-1 bg-[#141414] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] rounded-full" style={{ width: `${completionPct}%` }} />
                </div>
                <p className="text-[11px] text-white/30">
                  {completionPct < 20 ? "You're among the first." : completionPct > 80 ? "Hurry, slots filling up fast!" : "Complete it before slots run out."}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
