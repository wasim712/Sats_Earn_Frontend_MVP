'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersComparison = () => {
  const tiers = ['Platinum', 'Diamond', 'Crown', 'Elite', 'Founders'];
  
  const rows = [
    {
      feature: 'Reward level (per task)',
      values: ['Base', 'Higher', 'Higher', 'Higher', 'Highest tier']
    },
    {
      feature: 'Referral commission',
      values: ['10%', '15%', '20%', '25%', '30% — highest']
    },
    {
      feature: 'Referral cap',
      values: ['Uncapped', 'Uncapped', 'Uncapped', 'Uncapped', 'Uncapped']
    },
    {
      feature: 'Withdrawal minimum',
      values: ['20,000', '15,000', '15,000', '15,000', '10,000 — lowest']
    },
    {
      feature: 'Permanent Founder badge',
      values: ['—', '—', '—', '—', '✓']
    },
    {
      feature: 'Founders Rotation share',
      values: ['—', '—', '—', '—', '✓']
    },
    {
      feature: 'New features first',
      values: ['—', '—', '—', '—', '✓']
    },
    {
      feature: 'Spots available',
      values: ['Open', 'Open', 'Open', 'Open', '1,000 only']
    }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="mb-10">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            How Founders Compare
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none mb-4">
            Founders vs the other paid tiers
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            Every paid tier earns more than the free tiers. Founders sits at the very top — the highest reward rate, the highest referral share, the lowest withdrawal minimum, and perks no other tier gets.
          </p>
        </FadeUp>
      </div>

      {/* Responsive Table Wrapper */}
      <FadeUp delay={0.4}>
        <div className="overflow-x-auto rounded-2xl border border-sats-orange-500/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          <table className="w-full border-collapse min-w-[680px] bg-sats-black-900 text-sm">
            <thead>
              <tr className="border-b border-sats-orange-500/10 text-gray-400">
                <th className="py-5 px-6 text-left font-mono text-xs font-bold uppercase tracking-wider bg-sats-black-900 sticky left-0 z-10 border-r border-sats-orange-500/5">Feature</th>
                {tiers.map((tier) => {
                  const isFounder = tier === 'Founders';
                  return (
                    <th 
                      key={tier} 
                      className={`py-5 px-4 text-center font-mono text-xs font-bold uppercase tracking-wider ${
                        isFounder 
                          ? 'text-sats-orange-500 bg-sats-orange-500/5 border-x border-sats-orange-500/15 relative' 
                          : ''
                      }`}
                    >
                      {tier}
                      {isFounder && (
                        <span className="block text-[8px] text-amber-400 font-bold tracking-widest mt-1">
                          ★ TOP TIER
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-sats-orange-500/5 last:border-b-0 hover:bg-white/[0.008] transition-colors duration-150">
                  <td className="py-4 px-6 text-left font-mono text-xs text-gray-300 font-medium bg-sats-black-900 sticky left-0 z-10 border-r border-sats-orange-500/5">
                    {row.feature}
                  </td>
                  {row.values.map((val, idx) => {
                    const isFounder = idx === 4;
                    const hasCheck = val === '✓';
                    return (
                      <td 
                        key={idx} 
                        className={`py-4 px-4 text-center font-mono text-sm font-semibold ${
                          isFounder 
                            ? 'text-sats-orange-500 bg-sats-orange-500/5 border-x border-sats-orange-500/15' 
                            : 'text-gray-300'
                        } ${hasCheck ? 'text-emerald-400 font-bold' : ''}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>

      {/* Comparison Note */}
      <FadeUp delay={0.5}>
        <p className="text-xs text-gray-400 mt-5 leading-relaxed italic">
          Actual sats per task vary by campaign and brand — they aren't fixed. What's fixed is your <strong className="text-gray-300 font-bold not-italic">tier standing</strong>: higher tiers always earn a higher share of each task's reward, and Founders sit at the top. Referral commission percentages are fixed and apply to the admin base reward. Free tiers (Basic–Gold) earn at lower levels with lifetime caps and a 25,000-sat withdrawal minimum.
        </p>
      </FadeUp>
    </section>
  );
};
