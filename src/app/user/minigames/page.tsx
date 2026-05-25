'use client';

import React, { useState } from 'react';
import { ChevronRight, Clock3, Gamepad2, Rocket, Shield, Sparkles, Trophy, Zap } from 'lucide-react';
import SatWormMiniGame from '@/components/user/dashboard/SatWormMiniGame';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { fetchUserNotifications } from '@/features/user/userNotificationsSlice';

const upcomingCards = [
  {
    title: 'SAT-WORM Arena+',
    description: 'Expanded levels, daily challenges, and higher streak-based bonus rewards.',
    icon: Gamepad2,
    accent: 'text-sats-orange-500',
    border: 'border-sats-orange-500/20',
    bg: 'bg-sats-orange-500/10',
  },
  {
    title: 'Lightning Sprint',
    description: 'A fast tap-and-dodge challenge with timed missions and leaderboard resets.',
    icon: Zap,
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
  },
  {
    title: 'XP Quest Boards',
    description: 'Progressive mini objectives that unlock seasonal cards, boosts, and rare badges.',
    icon: Trophy,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Secure Battle Modes',
    description: 'Protected score sessions, verified rewards, and anti-abuse gameplay improvements.',
    icon: Shield,
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Daily Drop Events',
    description: 'Special event cards that appear on selected days with boosted sats and XP.',
    icon: Sparkles,
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
    bg: 'bg-pink-500/10',
  },
  {
    title: 'Pro Launch Queue',
    description: 'Competitive game modes, reward ladders, and premium mini-game unlocks.',
    icon: Rocket,
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
  },
];

export default function UserMiniGamesPage() {
  const dispatch = useAppDispatch();
  const [activeGame, setActiveGame] = useState<'sat-worm' | null>(null);

  return (
    <div className="px-4 py-5 md:px-6 md:py-6 xl:px-8 space-y-6">
      <section className="rounded-[28px] border border-sats-orange-500/20 bg-gradient-to-b from-[#0d0d0d] to-[#070707] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-sats-orange-500/10 blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-sats-orange-400">
              <Gamepad2 className="h-3.5 w-3.5" />
              Mini Games Hub
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">One live game, more on the way</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-400 leading-relaxed">
              SAT-WORM is live now. This section also shows the upcoming mini-game roadmap, feature cards, and what is coming next.
            </p>
          </div>

          <div className="rounded-[22px] border border-[#1d1d1d] bg-[#0a0a0a] px-5 py-4 min-w-[220px]">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-[0.22em] mb-2">
              <Clock3 className="h-4 w-4 text-sats-orange-500" />
              Status
            </div>
            <p className="text-xl font-black text-white">Live Now</p>
            <p className="mt-1 text-sm text-gray-500">SAT-WORM is playable today. More game cards are coming next.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <button
          type="button"
          onClick={() => setActiveGame('sat-worm')}
          className="text-left rounded-[28px] border border-sats-orange-500/25 bg-[#090909] p-6 relative overflow-hidden transition-all hover:border-sats-orange-500/45 hover:-translate-y-1 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.52)_48%,rgba(0,0,0,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%)]" />
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-black/45 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sats-orange-300 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" /> ~10 SATS
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/45 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.95)]" /> LIVE NOW
              </span>
            </div>

            <div className="mt-20 sm:mt-24">
              <h2 className="text-[30px] font-black text-sats-orange-400 tracking-tight">SAT-WORM</h2>
              <p className="mt-2 text-sm text-white/78">Eat sats to grow, avoid inflation traps!</p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-sm font-bold text-white/85">
                <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.95)]" />
                LIVE NOW
              </div>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-sats-orange-500 px-5 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(249,115,22,0.35)]">
                <Zap className="h-4 w-4" /> Play Now
                <ChevronRight className="h-4 w-4 transition-transform" />
              </div>
            </div>
          </div>
        </button>

        {upcomingCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-[24px] border ${card.border} bg-[#090909] p-6 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.74)_62%,rgba(0,0,0,0.95)_100%)]" />
              <div className={`absolute top-0 right-0 h-24 w-24 ${card.bg} blur-3xl pointer-events-none`} />
              <div className="relative z-10">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${card.border} ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.accent}`} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-white tracking-tight">{card.title}</h2>
                  <span className="rounded-full border border-[#262626] bg-[#111] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{card.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {activeGame === 'sat-worm' && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-sm p-3 sm:p-5 overflow-auto">
          <div className="mx-auto max-w-[1600px] space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#1d1d1d] bg-[#090909] px-5 py-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">SAT-WORM Full Screen</h2>
                <p className="text-sm text-gray-400">Finish a run and the earned XP is claimed automatically. SAT-WORM no longer gives sats rewards.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-2 text-sm font-bold text-gray-300 hover:bg-[#171717] hover:text-white transition-colors"
              >
                Exit
              </button>
            </div>

            <SatWormMiniGame
              fullscreen
              onExit={() => setActiveGame(null)}
              onRewardClaimed={() => {
                dispatch(fetchUserDashboard());
                dispatch(fetchUserNotifications());
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
