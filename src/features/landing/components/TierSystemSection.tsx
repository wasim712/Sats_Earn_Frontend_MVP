'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Check, X, Lightbulb } from 'lucide-react';

export const TierSystemSection = () => {
  const freeTiers = [
    { name: 'Basic', tag: 'FREE', req: 'Starting tier', rate: '5 sats/task', ref: '5% referral', min: '25K min' },
    { name: 'Copper', tag: 'FREE', req: 'XP unlock', rate: '6 sats/task', ref: '5% referral', min: '25K min' },
    { name: 'Bronze', tag: 'FREE', req: 'XP unlock', rate: '7 sats/task', ref: '5% referral', min: '25K min' },
    { name: 'Silver', tag: 'FREE', req: 'XP unlock', rate: '8 sats/task', ref: '5% referral', min: '25K min' },
    { name: 'Gold', tag: 'FREE', req: 'XP unlock', rate: '9 sats/task', ref: '5% referral', min: '25K min' },
  ];

  const paidTiers = [
    { name: 'Platinum', tag: 'PAID', req: 'Monthly or Yearly', rate: '10 sats/task', ref: '10% referral', min: '20K min' },
    { name: 'Diamond', tag: 'PAID', req: 'Monthly or Yearly', rate: '15 sats/task', ref: '15% referral', min: '15K min' },
    { name: 'Crown', tag: 'PAID', req: 'Monthly or Yearly', rate: '20 sats/task', ref: '20% referral', min: '15K min' },
    { name: 'Elite', tag: 'PAID', req: 'Monthly or Yearly', rate: '25 sats/task', ref: '25% referral', min: '15K min' },
    { name: 'Founders', tag: 'LIMITED', req: 'Yearly only · 1,000 spots', rate: '30 sats/task', ref: '30% referral', min: '10K min', isFounders: true },
  ];

  const compareRows = [
    { feature: 'Earn real sats on tasks', free: true, paid: true },
    { feature: 'Referral commission', free: '5% (capped)', paid: '10–30% (unlimited)' },
    { feature: 'Free streak milestones', free: true, paid: true },
    { feature: 'Premium streak milestones', free: false, paid: true },
    { feature: 'Exclusive paid games (sats)', free: false, paid: true },
    { feature: 'Special locked tasks', free: false, paid: true },
    { feature: 'Lower withdrawal minimum', free: false, paid: true },
    { feature: 'Reduced withdrawal fees', free: false, paid: true },
    { feature: 'Pay subscription with earned sats', free: '—', paid: true },
    { feature: 'Ad-free experience', free: false, paid: true },
    { feature: 'Founders referral rotation', free: false, paid: 'Founders only' },
  ];

  const renderValue = (val: boolean | string) => {
    if (val === true) return <Check className="w-5 h-5 mx-auto text-green-500" />;
    if (val === false) return <X className="w-5 h-5 mx-auto text-gray-400" />;
    if (val === '—') return <span className="text-gray-400">—</span>;
    return <span className="text-sats-orange-500 font-bold font-mono text-xs">{val}</span>;
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]" id="tiers">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono">
              Tier System
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            Free Forever.<br />
            <span className="text-3xl sm:text-6xl text-sats-orange-500">Upgrade to Stack Faster.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Free tier is genuinely viable — earn real sats, maintain streaks, refer friends. Paid tiers amplify everything. We will never force you to upgrade.
          </p>
        </FadeUp>

        {/* Intro */}
        <FadeUp delay={0.1} className="bg-sats-black-900 border border-white/10 rounded-2xl p-6 md:p-8 mb-16 flex items-start gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-sats-orange-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-sats-orange-500" />
          </div>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            <strong className="text-white">How tiers work:</strong> Free tiers upgrade automatically as you earn XP through tasks and activity — no payment required. Paid tiers are optional subscriptions that unlock higher sat rewards, lower withdrawal minimums, exclusive games, and more. If a paid subscription ends, you fall back to whichever free tier matches your current XP.
          </p>
        </FadeUp>

        {/* Tier Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          
          {/* Free Tiers */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase font-mono shrink-0">Free Tiers — XP Based</span>
              <div className="h-px bg-white/10 w-full" />
            </div>
            
            <div className="flex flex-col gap-3">
              {freeTiers.map((tier, idx) => (
                <FadeUp key={idx} delay={0.2 + (idx * 0.05)} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-sats-black-900/60 border border-white/5 hover:bg-sats-black-800 hover:border-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{tier.name}</span>
                      <span className="px-2 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-500 text-[9px] font-bold tracking-wider">{tier.tag}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">{tier.req}</div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 w-full sm:w-auto">
                    <div className="text-[13px] font-bold text-sats-orange-500 font-mono">{tier.rate}</div>
                    <div className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-end">
                      <div className="text-[11px] text-gray-400 font-mono">{tier.ref}</div>
                      <div className="text-[11px] text-gray-400 font-mono hidden sm:block">{tier.min}</div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Paid Tiers */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase font-mono shrink-0">Paid Tiers — Subscriptions</span>
              <div className="h-px bg-white/10 w-full" />
            </div>
            
            <div className="flex flex-col gap-3">
              {paidTiers.map((tier, idx) => (
                <FadeUp key={idx} delay={0.2 + (idx * 0.05)} className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl transition-colors ${tier.isFounders ? 'bg-gradient-to-r from-yellow-500/10 to-sats-black-900 border-yellow-500/30 hover:border-yellow-500/50' : 'bg-sats-black-900/60 border border-white/5 hover:bg-sats-black-800 hover:border-white/10'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{tier.name}</span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider ${tier.isFounders ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500' : 'border-sats-orange-500/30 bg-sats-orange-500/10 text-sats-orange-500'}`}>{tier.tag}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">{tier.req}</div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 w-full sm:w-auto">
                    <div className="text-[13px] font-bold text-sats-orange-500 font-mono">{tier.rate}</div>
                    <div className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-end">
                      <div className="text-[11px] text-gray-400 font-mono">{tier.ref}</div>
                      <div className="text-[11px] text-gray-400 font-mono hidden sm:block">{tier.min}</div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

        </div>

        {/* Comparison Table */}
        <FadeUp delay={0.5} className="bg-sats-black-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[2fr_1fr_1fr] bg-sats-black-800/80 p-4 sm:px-6 border-b border-white/10">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase font-mono">Feature</span>
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase font-mono text-center">Free Tiers</span>
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase font-mono text-center">Paid Tiers</span>
          </div>
          
          <div className="flex flex-col">
            {compareRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[2fr_1fr_1fr] items-center p-4 sm:px-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-b-0">
                <span className="text-sm text-gray-300 font-medium">{row.feature}</span>
                <div className="text-center">{renderValue(row.free)}</div>
                <div className="text-center">{renderValue(row.paid)}</div>
              </div>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  );
};
