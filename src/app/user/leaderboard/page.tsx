'use client';

import React, { useEffect } from 'react';
import { Trophy, Flame, Coins, Loader2, CalendarDays } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserLeaderboard } from '@/features/user/userLeaderboardSlice';
import type { LeaderboardEntry } from '@/types/user';

export default function UserLeaderboardPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.userLeaderboard);

  useEffect(() => {
    dispatch(fetchUserLeaderboard());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-400 text-xs font-black uppercase tracking-widest mb-4">
                <Trophy className="w-3.5 h-3.5" /> Rankings
              </div>
              <h1 className="text-2xl md:text-3xl font-black">Leaderboard</h1>
              <p className="text-sm text-gray-400 mt-2">Top earners in the last 24 hours, weekly, monthly, and top current streak holders.</p>
            </div>

            {data?.generatedAt && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-xs text-gray-400 font-bold">
                <CalendarDays className="w-4 h-4 text-sats-orange-400" />
                Updated {new Date(data.generatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="min-h-[240px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-sats-orange-500" />
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}

        {!isLoading && data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LeaderboardCard title="Last 24 Hours" icon={<Coins className="w-5 h-5 text-green-400" />} entries={data.daily} suffix="Sats" />
            <LeaderboardCard title="Weekly Earnings" icon={<Coins className="w-5 h-5 text-blue-400" />} entries={data.weekly} suffix="Sats" />
            <LeaderboardCard title="Monthly Earnings" icon={<Coins className="w-5 h-5 text-yellow-400" />} entries={data.monthly} suffix="Sats" />
            <LeaderboardCard title="Top Streaks" icon={<Flame className="w-5 h-5 text-red-400" />} entries={data.streaks} suffix="Days" />
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardCard({ title, icon, entries, suffix }: { title: string; icon: React.ReactNode; entries: LeaderboardEntry[]; suffix: string }) {
  return (
    <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl">{icon}</div>
        <div>
          <h2 className="text-lg font-black text-white">{title}</h2>
          <p className="text-xs text-gray-500">Top 20 users</p>
        </div>
      </div>

      <div className="space-y-3">
        {entries.length > 0 ? entries.map((entry) => (
          <div key={`${title}-${entry.userId}`} className="flex items-center gap-4 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center font-black text-sats-orange-400">
              #{entry.rank}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-white truncate">{entry.fullName}</p>
              <p className="text-xs text-gray-500 truncate">@{entry.username}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-white">{entry.value.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{suffix}</p>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-[#2a2a2a] px-4 py-8 text-center text-sm text-gray-500">No leaderboard data yet.</div>
        )}
      </div>
    </div>
  );
}
