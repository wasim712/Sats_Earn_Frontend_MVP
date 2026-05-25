'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, CheckSquare, ChevronRight, Clock3, Plus, Search, Sparkles, ShieldAlert, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStandaloneTasks } from '@/features/admin/adminTasksSlice';

export default function AdminStandaloneTasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.adminTasks);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchStandaloneTasks());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (!normalizedSearch) {
        return true;
      }

      return task.title.toLowerCase().includes(normalizedSearch)
        || (task.description || '').toLowerCase().includes(normalizedSearch)
        || String(task.proofType || '').toLowerCase().includes(normalizedSearch)
        || String(task.requiredPlatform || '').toLowerCase().includes(normalizedSearch);
    });
  }, [tasks, searchQuery]);

  const summary = useMemo(() => {
    const active = filteredTasks.filter((task) => task.isActive !== false).length;
    const screenshot = filteredTasks.filter((task) => task.proofType === 'SCREENSHOT').length;
    const textBased = filteredTasks.filter((task) => task.proofType === 'URL' || task.proofType === 'TEXT_RESPONSE').length;
    return { total: filteredTasks.length, active, screenshot, textBased };
  }, [filteredTasks]);

  if (isLoading) {
    return <div className="min-h-screen bg-sats-black-950 p-8 text-white">Loading standalone tasks...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-sats-black-950 p-8 text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1600px] mx-auto w-full space-y-8">
        <section className="rounded-[30px] border border-[#1a1a1a] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_30%),#050505] p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
                <Sparkles className="h-4 w-4" /> Admin Standalone Flow
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Standalone Tasks</h1>
                <p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-gray-400">
                  Review, edit, and manage isolated standalone tasks without touching campaign data.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div className="relative min-w-[280px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search title, proof type, platform"
                  className="w-full rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition focus:border-sats-orange-500"
                />
              </div>

              <Link href="/admin/addtask" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sats-orange-500 px-5 py-3.5 text-sm font-black text-black transition hover:bg-sats-orange-400">
                <Plus className="h-4 w-4" /> Create Task
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard label="Visible Tasks" value={summary.total} icon={CheckSquare} tone="orange" />
          <SummaryCard label="Active" value={summary.active} icon={CheckCircle2} tone="green" />
          <SummaryCard label="Screenshot Proof" value={summary.screenshot} icon={Zap} tone="yellow" />
          <SummaryCard label="Text / URL" value={summary.textBased} icon={Clock3} tone="blue" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => {
            const highestReward = Math.max(...Object.values(task.tierRewardMatrix || {}).map((value) => Number(value || 0)), 0);

            return (
              <div key={task.id} className="group rounded-[28px] border border-[#1a1a1a] bg-[#050505] p-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition hover:border-sats-orange-500/25 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sats-orange-400">
                      <CheckSquare className="h-3.5 w-3.5" /> Standalone
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white truncate">{task.title}</h2>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-3 leading-6">{task.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">Top Reward</div>
                    <div className="mt-1 text-lg font-black text-sats-orange-400">{highestReward} sats</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-1.5 text-gray-300">{task.proofType || 'SCREENSHOT'}</span>
                  <span className="rounded-full border border-[#1a1a1a] bg-[#0a0a0a] px-3 py-1.5 text-gray-300">{task.requiredPlatform || 'NONE'}</span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">XP {task.xpReward ?? task.xpRewardOverride ?? 0}</span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-500">Updated task configuration</div>
                  <Link href={`/admin/tasks/${task.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2.5 text-sm font-black text-sats-orange-400 transition hover:bg-sats-orange-500/15">
                    Manage <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900">
              <ShieldAlert className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Standalone Tasks Found</h3>
              <p className="text-gray-500 text-sm max-w-md">Create a task or try a different search query.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: 'orange' | 'green' | 'yellow' | 'blue' }) {
  const toneMap = {
    orange: 'text-sats-orange-300 border-sats-orange-500/20 bg-sats-orange-500/10',
    green: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    yellow: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
    blue: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
  } as const;

  return (
    <div className={`rounded-3xl border p-5 ${toneMap[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">{label}</div>
          <div className="mt-3 text-3xl font-black text-white">{value}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
