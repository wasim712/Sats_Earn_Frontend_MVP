'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="text-center pt-24 pb-12 sm:pt-32 sm:pb-16 px-4">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-widest uppercase text-sats-orange-500 opacity-85 mb-5 inline-flex items-center gap-2 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
          <Zap className="w-4 h-4" /> Lightning Withdrawals
        </div>
      </FadeUp>
      <FadeUp delay={0.2}>
        <h1 className="font-black text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-5 text-white max-w-4xl mx-auto">
          Withdraw Real <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent relative">Bitcoin Sats</span>
        </h1>
      </FadeUp>
      <FadeUp delay={0.3}>
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Your earned sats are real Bitcoin — withdraw them to any Lightning wallet, anywhere in the world. Here's everything you need to know about getting your sats out.
        </p>
      </FadeUp>
    </header>
  );
}
