'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function WalletsSection() {
  const wallets = [
    { name: 'Wallet of Satoshi', tag: 'Beginner-friendly' },
    { name: 'Phoenix', tag: 'Self-custodial' },
    { name: 'Muun', tag: 'Self-custodial' },
    { name: 'Breez', tag: 'Self-custodial' },
    { name: 'Blink', tag: 'Easy setup' },
    { name: 'Zeus', tag: 'Advanced' }
  ];

  return (
    <section className="py-8  relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          Compatible Wallets
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-10 text-white text-center">Where to Receive Sats</h2>
      </FadeUp>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {wallets.map((wallet, i) => (
          <FadeUp key={i} delay={0.1 + i * 0.05}>
            <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-xl p-4 sm:p-5 text-center transition-all hover:border-sats-orange-500/30 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(247,147,26,0.05)] group">
              <div className="font-bold text-sm sm:text-base text-white mb-1.5 group-hover:text-sats-orange-400 transition-colors">{wallet.name}</div>
              <div className="font-mono text-[11px] sm:text-xs text-gray-500 tracking-wide uppercase">{wallet.tag}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.4}>
        <div className="bg-sats-orange-500/[0.06] border border-sats-orange-500/20 rounded-xl p-5 sm:p-6 text-sm sm:text-[15px] text-gray-300 leading-relaxed shadow-[0_8px_30px_rgba(247,147,26,0.05)]">
          <strong className="text-white">Any Lightning-compatible wallet works.</strong> Just make sure it supports LNURL-pay or Lightning invoices. Withdrawals are Lightning-only at this time — we don&apos;t currently support on-chain Bitcoin withdrawals, though many wallets let you swap Lightning sats to on-chain if needed.
        </div>
      </FadeUp>
    </section>
  );
}
