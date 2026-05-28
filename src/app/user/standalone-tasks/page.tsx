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
  Monitor,
  Search,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type StandaloneTask = {
  id: string;
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
};

const formatCompact = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const getRequiredPlatform = (task: StandaloneTask) => {
  const platform = String(task.requiredPlatform || 'NONE').toUpperCase();
  if (platform === 'DESKTOP') return { icon: Monitor, label: 'Desktop Only' };
  if (platform === 'ANDROID') return { icon: null, iconSrc: '/svgs/android.svg', label: 'Android Only' };
  if (platform === 'IOS') return { icon: null, iconSrc: '/svgs/ios.svg', label: 'iOS Only' };
  return { icon: LayoutGrid, label: 'All Devices' };
};

const getStandaloneStatus = (task: StandaloneTask) => {
  if (task.isCompleted) {
    return {
      label: 'Completed',
      tone: 'text-green-400 border-green-500/20 bg-green-500/10',
      cta: 'Review Submission',
    };
  }

  if (task.hasStarted) {
    return {
      label: 'In Progress',
      tone: 'text-sats-orange-400 border-sats-orange-500/20 bg-sats-orange-500/10',
      cta: 'Continue Task',
    };
  }

  return {
    label: 'Live',
    tone: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    cta: 'View Task Details',
  };
};

const getPreviewDescription = (text: string) => {
  if (text.length <= 120) return text;
  return `${text.slice(0, 120).trim()}...`;
};

export default function StandaloneTasksPage() {
  const [tasks, setTasks] = useState<StandaloneTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (!normalizedSearch) {
          return true;
        }

        return task.title.toLowerCase().includes(normalizedSearch)
          || (task.description || '').toLowerCase().includes(normalizedSearch)
          || String(task.proofType || '').toLowerCase().includes(normalizedSearch);
      })
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [tasks, searchQuery]);

  const summary = useMemo(() => {
    const completed = filteredTasks.filter((task) => task.isCompleted).length;
    const live = filteredTasks.filter((task) => !task.isCompleted).length;
    const totalReward = filteredTasks.reduce((sum, task) => sum + Number(task.taskRewardSats || 0), 0);
    return { total: filteredTasks.length, completed, live, totalReward };
  }, [filteredTasks]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4 md:p-6 lg:p-8 pb-24">
        <section className="rounded-[30px] border border-[#1a1a1a] bg-[#050505] p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="h-8 w-56 rounded-xl bg-[#111]" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-xl bg-[#0e0e0e]" />
          <div className="mt-2 h-5 w-full max-w-xl rounded-xl bg-[#0e0e0e]" />
          <div className="mt-6 h-12 w-full rounded-2xl bg-[#0d0d0d]" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-5 h-28" />
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[30px] border border-[#1a1a1a] bg-[#050505] overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <div className="h-52 bg-[#111]" />
              <div className="p-6 space-y-4">
                <div className="h-7 w-3/4 rounded-xl bg-[#111]" />
                <div className="h-4 w-full rounded-lg bg-[#0d0d0d]" />
                <div className="h-4 w-5/6 rounded-lg bg-[#0d0d0d]" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#020202] p-6 text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-6 lg:p-8 pb-24">
      <section className="rounded-[30px] border border-[#1a1a1a] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_32%),#050505] p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
            <Sparkles className="h-4 w-4" /> Standalone Tasks
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Explore standalone tasks</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-gray-400">
              Jump into quick standalone earning opportunities with campaign-style browsing and cleaner task cards.
            </p>
          </div>
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search standalone tasks by title, description, or proof type"
              className="w-full rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition focus:border-sats-orange-500"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard label="Visible Tasks" value={summary.total} tone="orange" />
        <SummaryCard label="Live Now" value={summary.live} tone="green" />
        <SummaryCard label="Completed" value={summary.completed} tone="blue" />
        <SummaryCard label="Listed Reward" value={`${formatCompact(summary.totalReward)} sats`} tone="yellow" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
          const reward = Number(task.taskRewardSats || 0);
          const { label, tone, cta } = getStandaloneStatus(task);
          const platformMeta = getRequiredPlatform(task);
          const previewText = getPreviewDescription(task.description || 'No task description available yet.');
          const coverImage = task.coverImageUrl || null;

          return (
            <Link key={task.id} href={`/user/standalone-tasks/${task.id}`} className="group block">
              <div className="relative rounded-[30px] border border-[#1a1a1a] bg-[#050505] overflow-hidden shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-2 hover:border-sats-orange-500/40 hover:shadow-[0_30px_80px_rgba(249,115,22,0.12)]">
                <div className="relative h-56 w-full overflow-hidden border-b border-[#1a1a1a] bg-[#0c0c0c]">
                  {coverImage ? (
                    <Image src={coverImage} alt={task.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_30%),linear-gradient(180deg,#101010_0%,#050505_100%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/35 to-transparent" />

                  <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sats-orange-400 backdrop-blur-md">
                    <Target className="h-3.5 w-3.5" /> Standalone
                  </div>

                  <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
                    <div className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[11px] font-black uppercase tracking-wide backdrop-blur-md ${tone}`}>
                      {label === 'Completed' ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      {label}
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-5 z-20 rounded-xl bg-sats-orange-500/90 px-3.5 py-2 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em]">Reward</div>
                    <div className="text-sm font-black">{formatCompact(reward)} sats</div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col grow relative z-10">
                  <h3 className="text-2xl font-black text-white mb-3 leading-tight group-hover:text-sats-orange-500 transition-colors line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-[15px] text-gray-400 leading-relaxed line-clamp-2">
                    {previewText}
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 mt-5 mb-8">
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 shadow-sm">
                      {platformMeta.icon ? React.createElement(platformMeta.icon, { className: 'w-3.5 h-3.5 text-sats-orange-500' }) : platformMeta.iconSrc ? <Image src={platformMeta.iconSrc} alt={platformMeta.label} width={14} height={14} /> : null}
                      {platformMeta.label}
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 shadow-sm">
                      <Zap className="w-3.5 h-3.5" /> XP {Number(task.xpReward || 0)}
                    </div>

                    {task.doubleRewardsActive ? (
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                        <Flame className="w-3.5 h-3.5" /> 2x Rewards
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-auto">
                    <div className={`w-full py-4 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border group/btn ${
                      task.isCompleted
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-[#111] border-[#2a2a2a] text-white group-hover:bg-sats-orange-500 group-hover:border-sats-orange-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    }`}>
                      <span>{cta}</span>
                      {!task.isCompleted && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="col-span-full rounded-[30px] border border-dashed border-[#2a2a2a] bg-[#050505] p-12 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <AlertTriangle className="mx-auto h-10 w-10 text-gray-600" />
            <h3 className="mt-4 text-2xl font-black text-white">No standalone tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">Try a different search term or check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number | string; tone: 'orange' | 'green' | 'blue' | 'yellow' }) {
  const toneMap = {
    orange: 'text-sats-orange-300 border-sats-orange-500/20 bg-sats-orange-500/10',
    green: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    blue: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
    yellow: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
  } as const;

  return (
    <div className={`rounded-3xl border p-5 ${toneMap[tone]}`}>
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">{label}</div>
      <div className="mt-3 text-3xl font-black text-white">{value}</div>
    </div>
  );
}
