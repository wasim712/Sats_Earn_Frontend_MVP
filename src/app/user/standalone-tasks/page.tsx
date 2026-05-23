'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, ArrowRight, CheckCircle2, CheckSquare, Flame, LayoutGrid, Monitor, Search, Sparkles, Target } from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type DeviceFilter = 'ALL' | 'DESKTOP' | 'ANDROID' | 'IOS';

type StandaloneTask = {
  id: string;
  campaignId: string;
  title: string;
  description?: string | null;
  targetUrl?: string | null;
  proofType?: string | null;
  requiredPlatform?: 'NONE' | 'DESKTOP' | 'ANDROID' | 'IOS';
  taskRewardSats?: number;
  xpReward?: number;
  doubleRewardsActive?: boolean;
  isCompleted?: boolean;
  hasStarted?: boolean;
  userCompletionStatus?: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  campaign?: {
    id: string;
    title: string;
    description?: string;
  };
};

const deviceOptions = [
  { key: 'ALL', label: 'All Devices', iconType: 'lucide', icon: LayoutGrid },
  { key: 'DESKTOP', label: 'Desktop', iconType: 'lucide', icon: Monitor },
  { key: 'ANDROID', label: 'Android', iconType: 'image', icon: '/svgs/android.svg' },
  { key: 'IOS', label: 'iOS', iconType: 'image', icon: '/svgs/ios.svg' },
] as const;

const formatCompact = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const getRequiredPlatform = (task: StandaloneTask) => {
  const platform = String(task.requiredPlatform || 'NONE').toUpperCase();
  if (platform === 'DESKTOP') return { icon: Monitor, label: 'Desktop Only' };
  if (platform === 'ANDROID') return { icon: null, iconSrc: '/svgs/android.svg', label: 'Android Only' };
  if (platform === 'IOS') return { icon: null, iconSrc: '/svgs/ios.svg', label: 'iOS Only' };
  return { icon: LayoutGrid, label: 'All Devices' };
};

export default function StandaloneTasksPage() {
  const [tasks, setTasks] = useState<StandaloneTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('ALL');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        const data = await obfuscatedJsonRequest<StandaloneTask[]>(`${API_URL}/users/standalone-tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);
console.log(tasks);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const taskDevice = typeof task.requiredPlatform === 'string' ? task.requiredPlatform.toUpperCase() : 'NONE';
        const matchesDevice = deviceFilter === 'ALL' ? true : taskDevice === deviceFilter;
        return matchesSearch && matchesDevice;
      })
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [tasks, searchQuery, deviceFilter]);

  const summary = useMemo(() => {
    const completed = filteredTasks.filter((task) => task.isCompleted).length;
    const active = filteredTasks.filter((task) => !task.isCompleted).length;
    const doubleRewards = filteredTasks.filter((task) => Boolean(task.doubleRewardsActive)).length;
    return { total: filteredTasks.length, active, completed, doubleRewards };
  }, [filteredTasks]);

  if (isLoading) return <div className="min-h-screen bg-[#020202] p-6 text-white">Loading standalone tasks...</div>;
  if (error) return <div className="min-h-screen bg-[#020202] p-6 text-red-400">{error}</div>;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-4 lg:p-6">
      <section className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 sm:p-6 lg:p-6 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sats-orange-400">
              <Sparkles className="h-3.5 w-3.5" /> Standalone Rewards
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Standalone Tasks</h1>
              <p className="text-sm sm:text-[15px] font-medium leading-7 text-gray-400">Quick one-off tasks to earn sats without entering a multi-step campaign.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <SummaryCard label="Total" value={summary.total} icon={CheckSquare} tone="blue" />
            <SummaryCard label="Active" value={summary.active} icon={Target} tone="green" />
            <SummaryCard label="Completed" value={summary.completed} icon={CheckCircle2} tone="purple" />
            <SummaryCard label="2x Live" value={summary.doubleRewards} icon={Flame} tone="yellow" />
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#1a1a1a] bg-black p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md group">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input type="text" placeholder="Search standalone tasks" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-2xl border border-[#1a1a1a] bg-[#050505] py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-gray-600 focus:border-sats-orange-500/40" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {deviceOptions.map(({ key, label, iconType, icon }) => (
              <button key={key} type="button" onClick={() => setDeviceFilter(key)} className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition-all ${deviceFilter === key ? 'border-sats-orange-500/40 bg-sats-orange-500/10 text-sats-orange-400' : 'border-[#1a1a1a] bg-[#050505] text-gray-400 hover:border-[#2a2a2a] hover:text-white'}`}>
                {iconType === 'lucide' ? React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'h-4 w-4' }) : <Image src={icon as string} alt={label} width={16} height={16} />}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
          const platformMeta = getRequiredPlatform(task);
          const reward = Number(task.taskRewardSats || 0);
          return (
            <div key={task.id} className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/18 bg-sats-orange-500/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sats-orange-400">Standalone Task</div>
                  <h2 className="mt-4 text-xl font-black text-white">{task.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{task.description}</p>
                </div>
                <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">Reward</div>
                  <div className="mt-1 text-lg font-black text-sats-orange-400">{formatCompact(reward)} sats</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#050505] px-3 py-1.5">
                  {platformMeta.icon ? React.createElement(platformMeta.icon, { className: 'h-4 w-4 text-sats-orange-400' }) : platformMeta.iconSrc ? <Image src={platformMeta.iconSrc} alt={platformMeta.label} width={16} height={16} /> : null}
                  {platformMeta.label}
                </span>
                {task.doubleRewardsActive ? <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-yellow-300"><Flame className="h-4 w-4" /> 2x Live</span> : null}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">{task.isCompleted ? 'Completed' : task.hasStarted ? 'In progress' : 'Ready to start'}</div>
                <Link href={`/user/standalone-tasks/${task.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2.5 text-sm font-black text-sats-orange-400 transition hover:bg-sats-orange-500/15">
                  Open Task <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full rounded-[28px] border border-dashed border-[#2a2a2a] bg-black p-10 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-gray-600" />
            <h3 className="mt-4 text-xl font-black text-white">No standalone tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">Try a different search or device filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: 'blue' | 'green' | 'purple' | 'yellow' }) {
  const toneMap = {
    blue: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
    green: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    purple: 'text-purple-300 border-purple-500/20 bg-purple-500/10',
    yellow: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
  } as const;

  return (
    <div className={`rounded-2xl border px-4 py-4 ${toneMap[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">{label}</div>
          <div className="mt-2 text-2xl font-black text-white">{value}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
