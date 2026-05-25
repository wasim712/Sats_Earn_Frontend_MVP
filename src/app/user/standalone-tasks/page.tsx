'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, ArrowRight, Flame, LayoutGrid, Monitor, Search } from 'lucide-react';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type StandaloneTask = {
  id: string;
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
};

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
          || (task.description || '').toLowerCase().includes(normalizedSearch);
      })
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [tasks, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-20 p-4 md:p-4 lg:p-6">
        <section className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <div className="h-12 rounded-2xl border border-[#1a1a1a] bg-[#050505] pl-12" />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-24 rounded-full bg-[#111]" />
                  <div className="h-7 w-3/4 rounded-xl bg-[#111]" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded-lg bg-[#0d0d0d]" />
                    <div className="h-4 w-5/6 rounded-lg bg-[#0d0d0d]" />
                  </div>
                </div>
                <div className="h-16 w-24 rounded-2xl bg-[#0d0d0d]" />
              </div>
              <div className="mt-5 flex gap-3">
                <div className="h-8 w-28 rounded-full bg-[#0d0d0d]" />
                <div className="h-8 w-20 rounded-full bg-[#0d0d0d]" />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="h-4 w-24 rounded-lg bg-[#0d0d0d]" />
                <div className="h-10 w-32 rounded-2xl bg-[#111]" />
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-4 lg:p-6">
      <section className="rounded-[28px] border border-[#1a1a1a] bg-black p-5 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search standalone tasks"
            className="w-full rounded-2xl border border-[#1a1a1a] bg-[#050505] py-3 pl-12 pr-4 text-sm font-medium text-white outline-none transition focus:border-sats-orange-500"
          />
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
            <p className="mt-2 text-sm text-gray-500">Try a different search term.</p>
          </div>
        )}
      </section>
    </div>
  );
}
