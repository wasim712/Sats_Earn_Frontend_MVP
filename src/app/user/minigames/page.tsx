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
      
      {/* ─── HEADER SECTION ─── */}
      <section className="rounded-[32px] border border-white/[0.06] bg-gradient-to-b from-[#111] to-[#050505] p-6 sm:p-8 relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-sats-orange-500/10 blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-10 h-40 w-40 bg-emerald-500/5 blur-[60px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-sats-orange-400 shadow-[inset_0_0_12px_rgba(249,115,22,0.1)]">
              <Gamepad2 className="h-3.5 w-3.5" />
              Mini Games Hub
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              One live game, more on the way
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed font-medium">
              SAT-WORM is live now. This section also shows the upcoming mini-game roadmap, feature cards, and what is coming next.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.06] bg-black/40 px-6 py-5 min-w-[240px] md:block hidden backdrop-blur-md shadow-inner">
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.22em] mb-2">
              <Clock3 className="h-3.5 w-3.5 text-sats-orange-500" />
              Status
            </div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </span>
              <p className="text-xl font-black text-white tracking-wide">Live Now</p>
            </div>
            <p className="mt-2 text-xs text-gray-400 font-medium leading-relaxed">
              SAT-WORM is playable today. More games are currently in development.
            </p>
          </div>
        </div>
      </section>

      {/* ─── GAMES GRID ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
        
        {/* FEATURED GAME CARD (SAT-WORM) */}
        <button
          type="button"
          onClick={() => setActiveGame('sat-worm')}
          className="group text-left rounded-[32px] border border-sats-orange-500/30 bg-[#050505] relative overflow-hidden transition-all duration-500 hover:border-sats-orange-500/60 hover:-translate-y-1.5 shadow-[0_15px_40px_rgba(249,115,22,0.12)] hover:shadow-[0_25px_50px_rgba(249,115,22,0.2)] flex flex-col min-h-[340px]"
        >
          {/* Background Image Layer: Set to 'contain' at the 'top' so the full worm is visible */}
          <div
            className="absolute inset-x-0 top-0 h-[50%] z-0 transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundImage: "url('/minigames/snake_game.png')",
              backgroundSize: 'contain',
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Gradients to seamlessly blend the image bottom into the black card bottom */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-[30%]" />
          <div className="absolute inset-x-0 bottom-0 z-0 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent h-[65%]" />
          
          <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full w-full">
            
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sats-orange-500/30 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sats-orange-400 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" /> ~10 SATS
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" /> LIVE
              </span>
            </div>

            {/* Bottom Content Area - Reduced top margin to pull it closer to the image */}
            <div className="mt-auto pt-6">
              <h2 className="text-[32px] font-black text-white tracking-tight drop-shadow-lg group-hover:text-sats-orange-400 transition-colors duration-300">
                SAT-WORM
              </h2>
              <p className="mt-1 text-sm text-gray-300 font-medium max-w-[90%]">
                Eat sats to grow, avoid inflation traps!
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                  Playable Now
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sats-orange-500 to-orange-400 px-5 py-3 text-sm font-black text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform group-hover:scale-105 active:scale-95">
                  <Zap className="h-4 w-4" /> Play
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* UPCOMING GAMES CARDS */}
        {upcomingCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`flex flex-col justify-between rounded-[32px] border ${card.border || 'border-white/[0.05]'} bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-7 relative overflow-hidden transition-colors hover:bg-[#0c0c0c] hover:border-white/10`}
            >
              {/* Internal Glows */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none" />
              <div className={`absolute top-0 right-0 h-32 w-32 ${card.bg || 'bg-white/5'} blur-[60px] pointer-events-none`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${card.border || 'border-white/10'} ${card.bg || 'bg-black/50'} shadow-inner`}>
                    <Icon className={`h-6 w-6 ${card.accent || 'text-white'}`} />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 backdrop-blur-sm">
                    Coming Soon
                  </span>
                </div>
                
                <h2 className="text-xl font-black text-white tracking-tight">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-400 font-medium">{card.description}</p>
              </div>
              
              {/* Decorative locked footer to match height of the playable card slightly */}
              <div className="relative z-10 mt-8 pt-5 border-t border-white/[0.05] flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
                <Clock3 className="w-4 h-4" /> In Development
              </div>
            </div>
          );
        })}
      </section>

      {/* ─── FULLSCREEN MODAL ─── */}
      {activeGame === 'sat-worm' && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-auto animate-in fade-in duration-300">
          <div className="mx-auto max-w-[1600px] h-full flex flex-col gap-4">
            
            <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#0a0a0a] px-6 py-4 shadow-2xl shrink-0">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  SAT-WORM <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest">Live</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1 font-medium">Finish a run and the earned XP is claimed automatically. SAT-WORM no longer gives sats rewards.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGame(null)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              >
                Close Game
              </button>
            </div>

            <div className="flex-1 rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative bg-[#050505]">
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
        </div>
      )}
    </div>
  );
}
