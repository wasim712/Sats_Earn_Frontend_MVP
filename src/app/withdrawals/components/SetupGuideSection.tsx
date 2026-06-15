'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function SetupGuideSection() {
  const steps = [
    {
      title: 'Download a wallet',
      desc: (
        <>
          Pick one of the Lightning wallets above and install it from your app store. <b className="text-white font-bold">Wallet of Satoshi</b> or <b className="text-white font-bold">Blink</b> are the easiest to start with — just open the app, no setup forms.
        </>
      )
    },
    {
      title: 'Find your receive address',
      desc: (
        <>
          Tap <b className="text-white font-bold">Receive</b> in your wallet. You'll get either a <b className="text-white font-bold">Lightning address</b> (looks like an email) or you can generate a <b className="text-white font-bold">Lightning invoice</b>. Either one works for SatsEarn.
        </>
      )
    },
    {
      title: 'Withdraw from SatsEarn',
      desc: 'Once your sats are matured and meet your tier minimum, paste your Lightning address or invoice into the withdrawal screen and confirm. Sats usually arrive in seconds.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-5xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          New to Lightning?
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 text-white text-center">Set Up a Wallet in 2 Minutes</h2>
        <p className="text-center text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Never used a Bitcoin wallet before? No problem. You only need one when you're ready to withdraw — and the simplest options take about two minutes to set up.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {steps.map((step, i) => (
          <FadeUp key={i} delay={0.1 + i * 0.1}>
            <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 h-full relative">
              <div className="w-9 h-9 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/30 flex items-center justify-center font-mono font-bold text-[15px] text-sats-orange-500 mb-5">
                {i + 1}
              </div>
              <h3 className="text-[17px] font-bold text-white mb-2">{step.title}</h3>
              <p className="text-[14px] sm:text-[15px] text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.4}>
        <div className="bg-sats-orange-500/[0.06] border border-sats-orange-500/20 rounded-xl p-5 sm:p-6 text-[13px] sm:text-[14px] text-gray-300 leading-relaxed shadow-[0_8px_30px_rgba(247,147,26,0.05)] text-center max-w-3xl mx-auto mb-4">
          <strong className="text-sats-orange-500">Tip for total beginners:</strong> custodial wallets like Wallet of Satoshi and Blink are the quickest to start with. Self-custodial wallets (Phoenix, Muun, Breez) give you full control of your keys — a good step once you're comfortable. Both receive sats from SatsEarn the same way.
        </div>
      </FadeUp>
      
      <FadeUp delay={0.5}>
        <p className="text-[11px] sm:text-xs text-gray-500 italic text-center max-w-3xl mx-auto leading-relaxed">
          SatsEarn is not affiliated with any wallet provider. Wallet names are listed for convenience — always download wallets from official sources and keep your recovery phrase private.
        </p>
      </FadeUp>
    </section>
  );
}
