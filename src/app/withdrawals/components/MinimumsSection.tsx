'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function MinimumsSection() {
  const tiers = [
    { name: 'Free Tiers (Basic–Gold)', min: '25,000 sats', fee: 'Standard', color: 'bg-gray-500', isFounder: false },
    { name: 'Platinum', min: '20,000 sats', fee: 'Reduced', color: 'bg-[#e5e4e2]', isFounder: false },
    { name: 'Diamond', min: '15,000 sats', fee: 'Reduced', color: 'bg-[#b9f2ff]', isFounder: false },
    { name: 'Crown', min: '15,000 sats', fee: 'Reduced', color: 'bg-[#ffe4b5]', isFounder: false },
    { name: 'Elite', min: '15,000 sats', fee: 'Low', color: 'bg-[#a855f7]', isFounder: false },
    { name: 'Founders ★', min: '10,000 sats', fee: 'Lowest', color: 'bg-[#fbbf24]', isFounder: true },
  ];

  return (
    <section className="py-12 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          Withdrawal Minimums
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-10 text-white text-center">Minimums by Tier</h2>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl overflow-hidden shadow-lg mb-8">
          <div className="grid grid-cols-[2fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-4 bg-sats-black-800/40 border-b border-white/[0.04]">
            <div className="font-mono text-[11px] tracking-[1px] uppercase text-gray-400">Tier</div>
            <div className="font-mono text-[11px] tracking-[1px] uppercase text-gray-400 text-right">Minimum</div>
            <div className="font-mono text-[11px] tracking-[1px] uppercase text-gray-400 text-right hidden sm:block">Fees</div>
          </div>
          
          <div className="flex flex-col">
            {tiers.map((tier, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-[2fr_1fr] sm:grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-4 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors ${tier.isFounder ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.06]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${tier.color} shadow-[0_0_8px_currentColor]`} style={{ color: tier.color.replace('bg-', '') }}></div>
                  <span className={`font-bold text-[15px] ${tier.isFounder ? 'text-amber-400' : 'text-gray-200'}`}>{tier.name}</span>
                </div>
                <div className={`font-mono font-bold text-[15px] text-right ${tier.isFounder ? 'text-amber-400' : 'text-sats-orange-500'}`}>
                  {tier.min}
                </div>
                <div className={`font-mono text-[13px] text-right hidden sm:flex items-center justify-end ${tier.isFounder ? 'text-amber-400/80' : 'text-gray-400'}`}>
                  {tier.fee}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.3}>
        <div className="bg-sats-orange-500/[0.06] border border-sats-orange-500/20 rounded-xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(247,147,26,0.05)]">
          <p className="text-sm sm:text-[15px] text-gray-300 leading-relaxed m-0">
            <strong className="text-white">Reach your threshold faster on paid tiers.</strong> Paid tier users benefit twice — lower withdrawal minimums and higher per-task earnings. A Founders user can withdraw up to 2.5× sooner than a Basic user completing the same tasks. Exact fees are always shown transparently before you confirm any withdrawal.
          </p>
        </div>
      </FadeUp>
    </section>
  );
}
