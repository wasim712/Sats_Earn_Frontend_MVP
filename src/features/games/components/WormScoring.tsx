'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormScoring = () => {
  const satMilestones = [
    { score: '100 points', reward: '1 sat ⚡' },
    { score: '200 points', reward: '2 sats ⚡' },
    { score: '300 points', reward: '3 sats ⚡' },
    { score: '400 points', reward: '4 sats ⚡' },
    { score: '500 points', reward: '5 sats ⚡' },
    { score: '600 points', reward: '6 sats ⚡' },
    { score: '700 points', reward: '7 sats ⚡' },
    { score: '800 points', reward: '8 sats ⚡' },
    { score: '900 points', reward: '9 sats ⚡' },
    { score: '1,000 points (max)', reward: '10 sats ⚡' }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="mb-12">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            Scoring &amp; Rewards
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono leading-none mb-4 uppercase">
            Points, XP &amp; sats
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Every bolt is 10 points. Right now SAT WORM rewards <strong className="text-white font-medium">XP for all players</strong>. Sat rewards are on the way for <strong className="text-white font-medium">paid tiers</strong> — the planned milestone ladder is shown below.
          </p>
        </FadeUp>
      </div>

      <div className="flex flex-col gap-8">
        {/* XP REWARDS CONTAINER */}
        <FadeUp delay={0.4}>
          <div className="bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            {/* header status bar */}
            <div className="bg-sats-orange-500/5 border-b border-sats-orange-500/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">XP Rewards</span>
              <div className="flex gap-2">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1">
                  ● Live now
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold text-gray-300 bg-sats-black-950 border border-sats-orange-500/10 rounded px-2.5 py-1">
                  All players
                </span>
              </div>
            </div>

            {/* rows */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-sats-orange-500/5 hover:bg-white/[0.008] transition-colors duration-200">
              <span className="text-sm sm:text-base text-gray-300 font-medium">Each ⚡ bolt eaten</span>
              <span className="font-mono text-sm sm:text-base font-bold text-sats-orange-500">+10 points</span>
            </div>
            <div className="flex justify-between items-center px-6 py-4 border-b border-sats-orange-500/5 hover:bg-white/[0.008] transition-colors duration-200">
              <span className="text-sm sm:text-base text-gray-300 font-medium">Score above 100 <small className="text-gray-400">(per run)</small></span>
              <span className="font-mono text-sm sm:text-base font-bold text-sats-orange-500">+5 XP 🔮</span>
            </div>

            {/* footer */}
            <div className="bg-sats-black-950 px-6 py-4.5 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-sats-orange-500/5">
              XP is earned by everyone and counts toward your SatsEarn level and tier progression. Your best score is saved locally so you always have a target to beat.
            </div>
          </div>
        </FadeUp>

        {/* SAT MILESTONES CONTAINER */}
        <FadeUp delay={0.5}>
          <div className="bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            {/* header status bar */}
            <div className="bg-sats-orange-500/5 border-b border-sats-orange-500/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">Sat Milestones</span>
              <div className="flex gap-2">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/25 rounded px-2.5 py-1">
                  ⚡ Coming soon
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold text-gray-300 bg-sats-black-950 border border-sats-orange-500/10 rounded px-2.5 py-1">
                  Paid Tiers
                </span>
              </div>
            </div>

            {/* milestones table header */}
            <div className="grid grid-cols-2 px-6 py-3.5 border-b border-sats-orange-500/10 bg-sats-orange-500/[0.02]">
              <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-sats-orange-500 font-bold">Score milestone</span>
              <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-sats-orange-500 font-bold text-right">Sat reward</span>
            </div>

            {/* milestones table rows */}
            {satMilestones.map((m, idx) => {
              const isHighlight = idx === 0 || idx === 9;
              return (
                <div 
                  key={m.score} 
                  className={`grid grid-cols-2 px-6 py-4 border-b border-sats-orange-500/5 last:border-b-0 hover:bg-white/[0.008] transition-colors duration-200 ${
                    isHighlight ? 'bg-sats-orange-500/[0.015]' : ''
                  }`}
                >
                  <span className="text-sm text-gray-300 font-semibold">{m.score}</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 text-right">{m.reward}</span>
                </div>
              );
            })}

            {/* footer */}
            <div className="bg-sats-black-950 px-6 py-4.5 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-sats-orange-500/5">
              Planned: one award per milestone, every 100 points up to the 1,000-point / 10-sat cap per run. Sat rewards from games are currently disabled — XP is what&apos;s active today. Figures shown are the planned structure and may change before launch.
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
