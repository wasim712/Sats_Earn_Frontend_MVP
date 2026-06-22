'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export function HeroSection() {
  const essentials = [
    {
      key: 'Total Supply',
      val: '21,000,000 BTC',
      desc: 'A fixed hard cap, written into the code. There will never be more than 21 million bitcoin.'
    },
    {
      key: '1 BTC Equals',
      val: '100,000,000 sats',
      desc: 'Each bitcoin divides into 100 million satoshis. One sat = 0.00000001 BTC — the unit you stack.'
    },
    {
      key: 'Block Time',
      val: '~10 minutes',
      desc: 'A new block of transactions is added to the chain roughly every ten minutes, around the clock.'
    },
    {
      key: 'Block Reward',
      val: '3.125 BTC',
      desc: "After the April 2024 halving — Bitcoin's 4th — miners earn 3.125 BTC per block. It halves again around 2028."
    },
    {
      key: 'Already Mined',
      val: '~95% of supply',
      desc: 'Over 19.8 million BTC are already in circulation. The remaining ~5% trickles out slowly until ~2140.'
    },
    {
      key: 'Genesis Block',
      val: '3 Jan 2009',
      desc: 'Day zero. The very first block was mined, and the Bitcoin network went live to the world.'
    }
  ];

  return (
    <>
      {/* HERO */}
      <header className="text-center pt-16 pb-10  px-4">
        <FadeUp delay={0.1}>
          <div className="font-mono text-xs tracking-widest uppercase text-sats-orange-500 opacity-85 mb-5 inline-flex items-center gap-2 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            Learn · Bitcoin Basics
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <h1 className="font-black text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-5 text-white max-w-4xl mx-auto">
            Bitcoin, from <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent relative">first principles</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.3}>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything a new Bitcoiner needs to know. <b className="text-white font-bold">No jargon, no hype</b> — just the facts, the history, and the context that will change how you see money.
          </p>
        </FadeUp>
      </header>

      {/* ESSENTIALS */}
      <section className="py-16 sm:py-24 relative px-4 max-w-6xl mx-auto">
        <FadeUp delay={0.1}>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-sats-orange-500 opacity-50"></span>
            The Essentials
          </div>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white">Six facts worth memorising</h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-12">Get these into your head and most of Bitcoin starts to make sense.</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {essentials.map((ess, idx) => (
            <FadeUp key={idx} delay={0.1 + idx * 0.1}>
              <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/30 hover:shadow-[0_14px_34px_rgba(0,0,0,0.4)] relative overflow-hidden group h-full">
                {/* Top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sats-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="font-mono text-[11px] tracking-[1.5px] uppercase text-gray-500 mb-3">{ess.key}</div>
                <div className="font-mono font-bold text-xl sm:text-2xl text-sats-orange-500 leading-[1.05] mb-3">{ess.val}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{ess.desc}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
}
