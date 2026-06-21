'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function StepsSection() {
  const steps = [
    {
      title: 'Reach your tier minimum',
      desc: "Keep earning until your available (matured) balance meets your tier's withdrawal minimum. Only matured sats count toward this — pending and maturing sats don't."
    },
    {
      title: 'Open the withdrawal screen',
      desc: "From your dashboard, click Withdraw. You'll see your available balance and the exact fee for this withdrawal — no hidden charges."
    },
    {
      title: 'Enter your Lightning address',
      desc: "Paste a Lightning invoice or LNURL from your Lightning wallet. Don't have one yet? Set one up first — it takes a couple of minutes."
    },
    {
      title: 'Confirm and receive',
      desc: 'Confirm the withdrawal. Sats typically arrive in your wallet within seconds to a few minutes. If a withdrawal ever fails, your sats are returned to your balance automatically.'
    }
  ];

  return (
    <section className="py-8  relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          Step by Step
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-10 text-white text-center">How to Withdraw</h2>
      </FadeUp>

      <div className="flex flex-col gap-4 sm:gap-6">
        {steps.map((step, i) => (
          <FadeUp key={i} delay={0.1 + i * 0.1}>
            <div className="flex gap-4 sm:gap-6 items-start bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-5 sm:p-7 hover:border-sats-orange-500/30 transition-colors group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center font-mono font-bold text-base sm:text-lg text-sats-orange-500 shrink-0 group-hover:bg-sats-orange-500 group-hover:text-black transition-colors">
                {i + 1}
              </div>
              <div>
                <h3 className="text-[17px] sm:text-lg font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm sm:text-[15px] text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
