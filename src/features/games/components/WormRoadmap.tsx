'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormRoadmap = () => {
  const cards = [
    {
      icon: '🔥',
      title: 'Daily Streaks',
      desc: 'Play every day to build a streak. The Top Streaks board shows the longest active runs, and your own streak appears in the panel header.',
      tabs: []
    },
    {
      icon: '🏆',
      title: 'Weekly Leaderboard',
      desc: "Compete for the top weekly score. If you're outside the top five, the panel still shows your exact rank so you know how far you have to climb.",
      tabs: ['Weekly', 'Your Rank']
    },
    {
      icon: '📊',
      title: 'All-Time Leaderboard',
      desc: "An all-time board ranking total scores. Switch tabs in the in-game panel to see where you stand across every run you've played.",
      tabs: ['All-Time', 'Your Rank']
    }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="mb-12">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            On the Roadmap
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-4 uppercase">
            Compete &amp; keep streaks
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            SAT WORM has a streak and leaderboard panel built in. When connected to your SatsEarn dashboard, these track your runs against everyone else.
          </p>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c, idx) => (
          <FadeUp key={c.title} delay={0.1 + idx * 0.05}>
            <div className="relative h-full bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-sats-orange-500/20 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] flex flex-col justify-between group">
              {/* status badge */}
              <div className="absolute top-6 right-6 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded px-2.5 py-1">
                Dashboard
              </div>

              <div>
                <div className="text-3xl mb-4 select-none">{c.icon}</div>
                <h3 className="font-mono text-base font-bold text-white mb-3 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              {c.tabs.length > 0 && (
                <div className="flex gap-2 border-t border-sats-orange-500/10 pt-4">
                  {c.tabs.map((tab) => (
                    <span key={tab} className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase text-gray-300 bg-sats-black-950 border border-sats-orange-500/10 rounded px-2.5 py-1">
                      {tab}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};
