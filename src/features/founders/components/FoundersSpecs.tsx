'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersSpecs = () => {
  const specs = [
    { label: 'Price', value: '$249 / year' },
    { label: 'Total spots', value: '1,000 (capped)' },
    { label: 'Tier level', value: 'Highest paid tier' },
    { label: 'Sat reward rate', value: 'Top base rate' },
    { label: 'Referral commission', value: 'Highest · uncapped' },
    { label: 'Withdrawal minimum', value: '10,000 sats' },
    { label: 'Founder badge', value: 'Permanent' },
    { label: 'Billing', value: 'Annual · cancel anytime' }
  ];

  return (
    <section className="py-12 max-w-3xl mx-auto px-4 relative">
      <div className="mb-8">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            The Numbers
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-none mb-4">
            Founders tier at a glance
          </h2>
        </FadeUp>
      </div>

      {/* Table Container */}
      <FadeUp delay={0.3}>
        <div className="bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          {specs.map((spec, idx) => (
            <div 
              key={spec.label} 
              className={`flex justify-between items-center px-6 py-4.5 border-b border-sats-orange-500/5 last:border-b-0 hover:bg-white/[0.01] transition-colors duration-200`}
            >
              <span className="text-sm text-gray-300 font-medium">{spec.label}</span>
              <span className="font-mono text-sm font-bold text-sats-orange-500 text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Spec Note */}
      <FadeUp delay={0.4}>
        <div className="mt-6 bg-gradient-to-r from-sats-orange-500/10 to-transparent border border-sats-orange-500/10 border-l-4 border-l-sats-orange-500 rounded-r-xl p-5 text-sm text-gray-300 leading-relaxed">
          🚀 Whatever comes next on SatsEarn — new earning methods, mini-games, and features — lands for <strong className="text-sats-orange-500">Founders first.</strong>
        </div>
      </FadeUp>
    </section>
  );
};
