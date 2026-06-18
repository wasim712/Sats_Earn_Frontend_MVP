'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Calendar, ShieldAlert } from 'lucide-react';

export const StreakMilestonesSection = () => {
  const milestones = [
    { days: 7, title: 'Week One', reward: 70, type: 'free' },
    { days: 21, title: 'Three Week Run', reward: 210, type: 'free' },
    { days: 60, title: 'Two Month Grind', reward: 600, type: 'free' },
    { days: 90, title: 'Quarter Grind', reward: 900, type: 'premium' },
    { days: 180, title: 'Half Year Grind', reward: 1800, type: 'premium' },
    { days: 365, title: 'Year One', reward: 3650, type: 'premium' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-sats-black-950" id="streaks">
      <div className="absolute inset-0 bg-sats-black-950 bg-grid-base opacity-20 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono">
              Streak Milestones
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Stay Consistent.<br />
            <span className="text-sats-orange-500">Stack Bigger Rewards.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            One-time lifetime bonus rewards for hitting streak milestones. Your progress is always protected — sats are held securely until you're ready to claim them.
          </p>
        </FadeUp>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {milestones.map((milestone, idx) => (
            <FadeUp key={idx} delay={0.1 + (idx * 0.05)}>
              <div className={`relative p-6 rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${milestone.type === 'premium' ? 'bg-gradient-to-b from-sats-orange-500/10 to-sats-black-900 border-sats-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-sats-black-900 border-white/5 hover:border-white/20'}`}>
                
                <div className="absolute top-4 right-4">
                  {milestone.type === 'free' ? (
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold tracking-wider">FREE</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-sats-orange-500/10 text-sats-orange-500 border border-sats-orange-500/30 text-[10px] font-bold tracking-wider">PREMIUM</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-widest uppercase">{milestone.days} Days</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-6">{milestone.title}</h3>

                <div className="flex items-end gap-2">
                  <div className={`text-4xl font-black font-mono tracking-tighter ${milestone.type === 'premium' ? 'text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'text-white'}`}>
                    {milestone.reward.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">
                    Sats
                  </div>
                </div>

              </div>
            </FadeUp>
          ))}
        </div>

        {/* Protection Note */}
        <FadeUp delay={0.4} className="bg-sats-black-900/60 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex flex-shrink-0 items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-sats-orange-500" />
          </div>
          <p className="text-sm text-gray-300 leading-relaxed text-center sm:text-left">
            <strong className="text-white">Your streak progress is never lost.</strong> If you hit a premium milestone while on a free tier, those sats are held securely in your account. Upgrade any time and they release to your available balance instantly. Held sats never expire.
          </p>
        </FadeUp>

      </div>
    </section>
  );
};
