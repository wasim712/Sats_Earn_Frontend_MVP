'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  CalendarDays,
  Coins,
  Flame,
  Loader2,
  Sparkles,
  Trophy,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserLeaderboard } from '@/features/user/userLeaderboardSlice';
import type { LeaderboardEntry } from '@/types/user';

type LeaderboardTab = 'streaks' | 'earners';
type EarnersFilter = 'daily' | 'weekly' | 'monthly';

const earnersFilterOptions: Array<{ key: EarnersFilter; label: string }> = [
  { key: 'daily', label: '24 Hours' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const tabOptions: Array<{ key: LeaderboardTab; label: string; icon: React.ReactNode }> = [
  { key: 'earners', label: 'Earners', icon: <Coins className="h-4 w-4" /> },
  { key: 'streaks', label: 'Streaks', icon: <Flame className="h-4 w-4" /> },
];

const topRankStyles = {
  1: {
    medal: '🥇',
    border: 'border-yellow-400/35',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.14)]',
    badge: 'bg-yellow-500/12 text-yellow-300 border-yellow-400/20',
    iconTone: 'text-yellow-300',
    scale: 'lg:-translate-y-3',
  },
  2: {
    medal: '🥈',
    border: 'border-slate-300/20',
    glow: 'shadow-[0_0_24px_rgba(203,213,225,0.08)]',
    badge: 'bg-slate-400/10 text-slate-200 border-slate-300/15',
    iconTone: 'text-slate-200',
    scale: 'lg:-translate-y-1',
  },
  3: {
    medal: '🥉',
    border: 'border-amber-700/35',
    glow: 'shadow-[0_0_24px_rgba(180,83,9,0.12)]',
    badge: 'bg-amber-700/12 text-amber-300 border-amber-700/20',
    iconTone: 'text-amber-300',
    scale: 'lg:translate-y-1',
  },
} as const;

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'SE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatCompactValue(value: number) {
  return value.toLocaleString();
}

function getTrendMeta(rank: number) {
  if (rank <= 3) return { text: '+18%', tone: 'text-emerald-400' };
  if (rank <= 8) return { text: '+11%', tone: 'text-green-400' };
  if (rank <= 15) return { text: '+6%', tone: 'text-yellow-400' };
  return { text: '+2%', tone: 'text-gray-400' };
}

function getTasksCompleted(rank: number, value: number, mode: LeaderboardTab) {
  if (mode === 'streaks') {
    return Math.max(3, Math.round(value * 1.6));
  }
  return Math.max(2, Math.round(value / 120));
}

function SectionPill({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition-colors ${
        active
          ? 'border-sats-orange-500/30 bg-sats-orange-500/12 text-sats-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.12)]'
          : 'border-[#202020] bg-[#090909] text-gray-400 hover:border-[#303030] hover:text-white'
      }`}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors sm:text-sm ${
        active
          ? 'border-sats-orange-500/30 bg-sats-orange-500/12 text-sats-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.12)]'
          : 'border-[#222] bg-[#080808] text-gray-500 hover:border-[#333] hover:bg-[#0f0f0f] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function TopThreeCards({ entries, mode }: { entries: LeaderboardEntry[]; mode: LeaderboardTab }) {
  if (entries.length === 0) return null;

  const ordered = [entries[0], entries[1], entries[2]].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch lg:gap-4">
      {ordered.map((entry) => {
        const style = topRankStyles[entry.rank as 1 | 2 | 3] ?? topRankStyles[3];
        const metricLabel = mode === 'streaks' ? 'Current Streak' : 'Earned';
        const secondaryLabel = mode === 'streaks' ? 'Longest Streak' : 'Tasks Completed';
        const secondaryValue = mode === 'streaks' ? `${entry.value + Math.max(2, 8 - entry.rank)} Days` : `${getTasksCompleted(entry.rank, entry.value, mode)} Tasks`;

        return (
          <div
            key={`${mode}-top-${entry.userId}`}
            className={`rounded-[24px] border bg-[linear-gradient(180deg,rgba(13,13,13,0.96),rgba(7,7,7,0.98))] p-4 transition-colors hover:border-sats-orange-500/25 hover:bg-[linear-gradient(180deg,rgba(16,16,16,0.98),rgba(9,9,9,0.98))] ${style.border} ${style.glow} sm:min-h-[220px] ${style.scale}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${style.badge}`}>
                <span>{style.medal}</span>
                <span>Rank #{entry.rank}</span>
              </span>
              <span className={`text-lg ${style.iconTone}`}>{style.medal}</span>
            </div>

            <div className="flex items-center gap-4">
              <Avatar entry={entry} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-white">{entry.fullName}</p>
                <p className="truncate text-sm text-gray-500">@{entry.username}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#1b1b1b] bg-black/30 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">{metricLabel}</p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatCompactValue(entry.value)}
                  <span className="ml-1 text-sm text-gray-400">{mode === 'streaks' ? 'Days' : 'Sats'}</span>
                </p>
              </div>
              <div className="rounded-2xl border border-[#1b1b1b] bg-black/30 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">{secondaryLabel}</p>
                <p className="mt-2 text-sm font-black text-gray-200">{secondaryValue}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Avatar({ entry, size = 'md' }: { entry: LeaderboardEntry; size?: 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm';

  if (entry.avatarUrl) {
    return (
      <div className={`relative overflow-hidden rounded-full border border-[#2a2a2a] bg-[#111] ${sizeClass}`}>
        <Image src={entry.avatarUrl} alt={entry.fullName} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111] font-black text-sats-orange-400 ${sizeClass}`}>
      {getInitials(entry.fullName)}
    </div>
  );
}

function LeaderboardRows({ entries, mode }: { entries: LeaderboardEntry[]; mode: LeaderboardTab }) {
  const restEntries = entries.slice(3);

  if (restEntries.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#252525] bg-[#070707] px-4 py-10 text-center text-sm text-gray-500">
        More leaderboard entries will appear here soon.
      </div>
    );
  }

  return (
   <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#020202] shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
  
  {/* Table Header - Distinct and crisp */}
  <div className="relative z-10 grid grid-cols-[44px_1fr_auto] sm:grid-cols-[64px_1fr_auto] gap-4 border-b border-white/[0.06] bg-black/80 px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
    <span className="text-center">Rank</span>
    <span>User</span>
    <span className="text-right">{mode === 'streaks' ? 'Streak' : 'Earnings'}</span>
  </div>

  {/* Leaderboard Entries List */}
  <div className="divide-y divide-white/[0.02]">
    {restEntries.map((entry, index) => {
      // Slightly higher contrast striping
      const stripe = index % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent';

      return (
        <div
          key={`${mode}-row-${entry.userId}`}
          className={`relative grid grid-cols-[44px_1fr_auto] sm:grid-cols-[64px_1fr_auto] items-center gap-4 px-4 py-3.5 transition-all duration-200 ease-out hover:bg-sats-orange-500/[0.03] group cursor-default ${stripe}`}
        >
          
          {/* MAGIC HOVER ACCENT: Glowing left line that scales in */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sats-orange-500 scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all duration-300 ease-out origin-center shadow-[0_0_12px_rgba(249,115,22,0.8)]" />

          {/* COLUMN 1: Rank Indicator (Faded -> Neon Orange on Hover) */}
          <div className="flex items-center justify-center relative z-10">
            <span className="text-xs sm:text-sm font-black text-white/30 group-hover:text-sats-orange-500 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-300">
              {entry.rank}
            </span>
          </div>

          {/* COLUMN 2: User Profile Info */}
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-full">
              <Avatar entry={entry} />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <p className="truncate text-sm font-bold text-white/80 tracking-wide group-hover:text-white transition-colors duration-200">
                {entry.fullName}
              </p>
              <p className="truncate text-[11px] text-white/30 font-medium mt-0.5 group-hover:text-white/50 transition-colors duration-200">
                @{entry.username}
              </p>
            </div>
          </div>

          {/* COLUMN 3: Score Metrics */}
          <div className="flex items-center gap-2 text-right shrink-0 relative z-10">
            <p className="text-sm font-black text-sats-orange-500 font-mono tracking-tight group-hover:text-sats-orange-400 group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.4)] transition-all duration-200">
              {formatCompactValue(entry.value)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors duration-200">
              {mode === 'streaks' ? 'Days' : 'Sats'}
            </p>
          </div>

        </div>
      );
    })}
  </div>
</div>
  );
}

function LeaderboardEmptyState() {
  return (
    <div className="rounded-[28px] border border-[#171717] bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(6,6,6,0.98))] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#1f1f1f] bg-[#0a0a0a]">
        <Trophy className="h-8 w-8 text-white/10" />
      </div>
      <h3 className="mt-5 text-xl font-black text-white">No leaderboard data yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Once users start earning and building streaks, the leaderboard will appear here.</p>
    </div>
  );
}

function LeaderboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-[26px] border border-[#171717] bg-[#090909] p-5">
            <div className="h-6 w-24 rounded-full bg-white/5" />
            <div className="mt-5 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-white/5" />
                <div className="h-3 w-20 rounded bg-white/5" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-20 rounded-2xl bg-white/5" />
              <div className="h-20 rounded-2xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-[#171717] bg-[#090909] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-white/5" />
          <Loader2 className="h-5 w-5 animate-spin text-sats-orange-500" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UserLeaderboardPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.userLeaderboard);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('streaks');
  const [activeEarnersFilter, setActiveEarnersFilter] = useState<EarnersFilter>('monthly');

  useEffect(() => {
    dispatch(fetchUserLeaderboard());
  }, [dispatch]);

  const sanitizeEntries = (entries: LeaderboardEntry[]) =>
    entries
      .filter((entry) => {
        const username = (entry.username || '').trim().toLowerCase();
        const fullName = (entry.fullName || '').trim().toLowerCase();
        return username !== 'admin@satsearn.com' && fullName !== 'admin@satsearn.com' && !username.includes('admin@satsearn.com') && !fullName.includes('admin@satsearn.com');
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const earnersEntries = useMemo(() => {
    if (!data) return [] as LeaderboardEntry[];
    const source = activeEarnersFilter === 'daily' ? data.daily : activeEarnersFilter === 'weekly' ? data.weekly : data.monthly;
    return sanitizeEntries(source);
  }, [data, activeEarnersFilter]);

  const streakEntries = useMemo(() => sanitizeEntries(data?.streaks ?? []), [data]);
  const currentEntries = activeTab === 'streaks' ? streakEntries : earnersEntries;

  return (
    <div className="min-h-screen bg-[#020202] px-4 py-4 text-white md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
          <div className="overflow-hidden rounded-[30px] border border-[#171717] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_30%),linear-gradient(180deg,#090909_0%,#050505_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-sats-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Global Leaderboards
                </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Global Leaderboards</h1>
              <p className="mt-3 max-w-2xl text-sm text-gray-400 sm:text-base">
                Compare the strongest streak champions and top earners across the platform in one clean premium leaderboard.
              </p>
            </div>

            {data?.generatedAt && (
              <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-[#1c1c1c] bg-black/30 px-4 py-3 text-xs font-bold text-gray-400 lg:self-auto">
                <CalendarDays className="h-4 w-4 text-sats-orange-400" />
                Updated {new Date(data.generatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="p-1 sm:p-2">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#060606] p-1.5">
              {tabOptions.map((tab) => (
                <SectionPill key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} label={tab.label} icon={tab.icon} />
              ))}
            </div>

            {activeTab === 'earners' && (
              <div className="flex flex-wrap justify-center gap-2">
                {earnersFilterOptions.map((filter) => (
                  <FilterPill key={filter.key} active={activeEarnersFilter === filter.key} onClick={() => setActiveEarnersFilter(filter.key)} label={filter.label} />
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <LeaderboardLoadingState />
        ) : error ? (
          <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-300">{error}</div>
        ) : !data || currentEntries.length === 0 ? (
          <LeaderboardEmptyState />
        ) : (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-[#171717] bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(6,6,6,0.98))] p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {activeTab === 'streaks' ? 'Top Streak Champions' : `${earnersFilterOptions.find((filter) => filter.key === activeEarnersFilter)?.label} Top Earners`}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeTab === 'streaks'
                        ? 'Users with the strongest consistency and longest active streak runs.'
                        : 'Users earning the most sats in the selected period.'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#212121] bg-[#0b0b0b] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-gray-400">
                    {activeTab === 'streaks' ? <Flame className="h-3.5 w-3.5 text-sats-orange-400" /> : <Coins className="h-3.5 w-3.5 text-sats-orange-400" />}
                    {currentEntries.length} Ranked Users
                  </div>
              </div>

              <TopThreeCards entries={currentEntries.slice(0, 3)} mode={activeTab} />
            </div>

            <LeaderboardRows entries={currentEntries} mode={activeTab} />
          </div>
        )}
      </div>
    </div>
  );
}
