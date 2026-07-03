'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, CheckSquare, Clock3, Loader2, Plus, Search, Sparkles, ShieldAlert, Zap, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStandaloneTasks, deleteStandaloneTask, updateStandaloneTask } from '@/features/admin/adminTasksSlice';

export default function AdminStandaloneTasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, isSaving, error } = useAppSelector((state) => state.adminTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  const getTaskPlatform = (task: any) => {
    const platform = task.requiredPlatform || task.platform || task.deviceTarget || task.requirements?.requiredPlatform || 'NONE';
    return platform === 'NONE' ? 'ALL DEVICES' : platform;
  };

  useEffect(() => {
    dispatch(fetchStandaloneTasks());
  }, [dispatch]);

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this standalone task?")) {
      dispatch(deleteStandaloneTask(taskId));
    }
  };

  const handleToggleTaskStatus = async (e: React.MouseEvent, taskId: string, currentStatus: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setTogglingTaskId(taskId);
      await dispatch(updateStandaloneTask({ taskId, data: { isActive: !currentStatus } })).unwrap();
    } finally {
      setTogglingTaskId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (!normalizedSearch) {
        return true;
      }

      return task.title.toLowerCase().includes(normalizedSearch)
        || (task.description || '').toLowerCase().includes(normalizedSearch)
        || String(task.proofType || '').toLowerCase().includes(normalizedSearch)
        || String(getTaskPlatform(task) || '').toLowerCase().includes(normalizedSearch);
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
              <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-[12px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
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
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
  {filteredTasks.length > 0 ? filteredTasks.map((task) => {
    const highestReward = Math.max(...Object.values(task.tierRewardMatrix || {}).map((value) => Number(value || 0)), 0);

    const isToggling = togglingTaskId === task.id && isSaving;

    return (
      <Link 
        key={task.id} 
        href={`/admin/tasks/${task.id}`}
        className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#050505] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/30 hover:bg-[#0a0a0a] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)]"
      >
        {/* Ambient Top-Right Glow on Hover */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sats-orange-500/5 blur-[50px] transition-colors duration-500 group-hover:bg-sats-orange-500/20" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sats-orange-400 shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]">
              <CheckSquare className="h-3.5 w-3.5" /> Standalone
            </div>
            <div>
              <h2 className="text-xl font-black text-white truncate transition-colors duration-300 group-hover:text-sats-orange-400">
                {task.title}
              </h2>
              {/* Strict 2-line limit so cards stay uniform in height */}
              <p className="mt-2 text-sm font-medium text-gray-400 line-clamp-2 leading-relaxed pr-2">
                {task.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-[20px] border border-white/5 bg-white/[0.02] px-4 py-3 text-right backdrop-blur-sm transition-colors duration-300 group-hover:border-sats-orange-500/20 group-hover:bg-sats-orange-500/5">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Top Reward</div>
            <div className="mt-1 flex items-baseline justify-end gap-1">
              <span className="text-xl font-black tracking-tight text-sats-orange-400">{highestReward}</span>
              <span className="text-xs font-bold text-sats-orange-500/70">sats</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2 text-[12px] font-bold uppercase tracking-wider">
          <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-gray-300 shadow-inner">
            {task.proofType || 'SCREENSHOT'}
          </span>
          <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-gray-300 shadow-inner">
            {getTaskPlatform(task)}
          </span>
          <span className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-purple-400 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]">
            XP {task.xpReward ?? task.xpRewardOverride ?? 0}
          </span>
        </div>

        <div className="relative z-10 mt-4 rounded-xl border border-white/5 bg-black/60 px-4 py-3 transition-colors duration-300 group-hover:border-white/10">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Cover Image URL</div>
          {/* Truncated single line so long URLs don't break the card */}
          <div className="mt-1 truncate text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
            {task.coverImageUrl || 'Not provided'}
          </div>
        </div>

        {/* Footer pushed to bottom dynamically using mt-auto */}
        <div className="relative z-10 mt-auto pt-6 flex items-center justify-between">
          <button
            onClick={(e) => handleDeleteTask(e, task.id)}
            className="group/btn cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 transition-colors duration-300 hover:text-red-400 z-20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all duration-300 group-hover/btn:bg-red-500 group-hover/btn:text-white group-hover/btn:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
            </div>
            Delete Task
          </button>

          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${task.isActive !== false ? 'text-emerald-400' : 'text-gray-500'}`}>
              {task.isActive !== false ? 'Active' : 'Paused'}
            </span>
            <button
              type="button"
              onClick={(e) => handleToggleTaskStatus(e, task.id, task.isActive !== false)}
              disabled={isToggling}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${
                task.isActive !== false ? 'bg-green-500' : 'bg-sats-black-700'
              } ${isToggling ? 'opacity-50 pointer-events-none' : 'hover:ring-2 ring-sats-black-700 ring-offset-2 ring-offset-[#050505]'}`}
              title={isToggling ? (task.isActive !== false ? 'Pausing task...' : 'Activating task...') : task.isActive !== false ? 'Pause Task' : 'Activate Task'}
            >
              {isToggling ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </span>
              ) : null}
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  task.isActive !== false ? 'translate-x-[18px]' : 'translate-x-0.5'
                } ${isToggling ? 'opacity-0' : 'opacity-100'}`}
              />
            </button>
          </div>
        </div>
      </Link>
    )
  }) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900">
              <ShieldAlert className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Standalone Tasks Found</h3>
              <p className="text-gray-400 text-sm max-w-md">Create a task or try a different search query.</p>
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
          <div className="text-[12px] font-black uppercase tracking-[0.18em] text-white/60">{label}</div>
          <div className="mt-3 text-3xl font-black text-white">{value}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
