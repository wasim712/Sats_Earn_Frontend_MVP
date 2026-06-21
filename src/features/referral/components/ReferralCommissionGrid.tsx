'use client';
import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralCommissionGrid = () => {
  const tiers = [
    { name: 'Platinum', rate: '10%', sub: 'of base reward', cap: 'Uncapped' },
    { name: 'Diamond', rate: '15%', sub: 'of base reward', cap: 'Uncapped' },
    { name: 'Crown', rate: '20%', sub: 'of base reward', cap: 'Uncapped' },
    { name: 'Elite', rate: '25%', sub: 'of base reward', cap: 'Uncapped' },
    { name: 'Founders', rate: '30%', sub: 'of base reward', cap: 'Uncapped', isFounder: true },
  ];

  return (
    <section id="tiers" className="px-4 pt-8 sm:pt-12 pb-16 sm:pb-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="mb-10 sm:mb-14 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <div className="w-6 h-px bg-sats-orange-500/50 hidden sm:block"></div>
            Commission by Tier
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            The higher your tier, the more you earn
          </h2>
          <p className="text-base text-gray-300 max-w-2xl leading-relaxed mx-auto sm:mx-0">
            Your referral commission rate is set by your SatsEarn tier. Paid tiers earn a higher rate with no lifetime referral cap — Founders sit at the top.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tiers.map((tier, i) => (
            <FadeUp key={tier.name} delay={i * 0.1}>
              <div 
                className={`flex flex-col h-full bg-sats-black-800 border ${tier.isFounder ? 'border-sats-orange-500/50 bg-gradient-to-b from-sats-orange-500/10 to-transparent' : 'border-white/10'} hover:border-sats-orange-500/30 hover:-translate-y-1 transition-all rounded-2xl p-6 text-center cursor-pointer group`}
                onClick={() => {
                  const el = document.getElementById('calculator');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
              >
                <div className="font-bold text-white text-lg mb-2">{tier.name}</div>
                <div className={`font-mono text-4xl sm:text-5xl font-black ${tier.isFounder ? 'text-sats-orange-500' : 'text-gray-300 group-hover:text-sats-orange-500 transition-colors'} leading-none mb-2`}>
                  {tier.rate}
                </div>
                <div className="text-xs text-gray-400 mb-6">{tier.sub}</div>
                
                <div className="mt-auto">
                  <div className="inline-block bg-sats-black-900 border border-white/10 text-xs font-mono font-bold text-green-500 uppercase px-3 py-1.5 rounded-md mb-4">
                    {tier.cap}
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono tracking-wider uppercase group-hover:text-sats-orange-500 transition-colors">
                    tap to preview →
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5} className="mt-8">
          <p className="text-sm text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
            Free tiers (Basic–Gold) earn a flat 5% commission with a lifetime referral cap. Upgrading to any paid tier raises your rate and removes the cap.
          </p>
          <div className="mt-6 text-center">
            <a 
              href="#calculator" 
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('calculator');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors"
            >
              Estimate your earnings in the calculator <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
