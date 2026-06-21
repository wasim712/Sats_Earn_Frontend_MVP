'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Zap, Globe, RefreshCcw } from 'lucide-react';

export function SpeedStatsSection() {
  return (
    <section className="py-12 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          Lightning Fast
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-10 text-white text-center">Built for Speed</h2>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <FadeUp delay={0.2}>
          <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 text-center h-full hover:border-sats-orange-500/30 transition-colors">
            <div className="text-sats-orange-500 flex justify-center mb-4">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sats-orange-500 mb-2">Seconds</div>
            <div className="text-sm sm:text-[15px] text-gray-400 leading-relaxed">Typical Lightning settlement time once you confirm</div>
          </div>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 text-center h-full hover:border-sats-orange-500/30 transition-colors">
            <div className="text-sats-orange-500 flex justify-center mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sats-orange-500 mb-2">180+</div>
            <div className="text-sm sm:text-[15px] text-gray-400 leading-relaxed">Countries where you can receive sats</div>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 text-center h-full hover:border-sats-orange-500/30 transition-colors">
            <div className="text-sats-orange-500 flex justify-center mb-4">
              <RefreshCcw className="w-8 h-8" />
            </div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sats-orange-500 mb-2">Auto-refund</div>
            <div className="text-sm sm:text-[15px] text-gray-400 leading-relaxed">Failed withdrawals return to your balance instantly</div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
