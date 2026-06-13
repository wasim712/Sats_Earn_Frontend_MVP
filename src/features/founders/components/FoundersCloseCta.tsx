'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersCloseCta = () => {
  const [spotsCount, setSpotsCount] = useState(0);
  const targetSpots = 3;
  const totalSpots = 1000;

  useEffect(() => {
    const duration = 1200;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentVal = Math.round(targetSpots * (1 - Math.pow(1 - progress, 2)));
      
      if (frame >= totalFrames) {
        setSpotsCount(targetSpots);
        clearInterval(timer);
      } else {
        setSpotsCount(currentVal);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  const progressPercentage = (spotsCount / totalSpots) * 100;

  return (
    <section className="py-20 text-center max-w-4xl mx-auto px-4 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-[radial-gradient(circle,rgba(249,115,22,0.06),transparent_70%)] pointer-events-none -z-10"></div>

      <div className="mb-12">
        <FadeUp delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Founders shape what SatsEarn becomes
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto">
            1,000 spots, then the tier closes for good. Claim yours while it's open.
          </p>
        </FadeUp>
      </div>

      {/* Sync Spots Counter */}
      <FadeUp delay={0.3}>
        <div className="max-w-xl mx-auto bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.4)] mb-10 relative overflow-hidden group hover:border-sats-orange-500/20 transition-colors duration-300">
          <div className="flex justify-between items-baseline mb-3">
            <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-gray-300">Founding Members</span>
            <span className="font-mono text-sm sm:text-base font-bold text-sats-orange-500">
              {spotsCount} / {totalSpots}
            </span>
          </div>

          <div className="h-3 bg-sats-black-950 rounded-full overflow-hidden border border-sats-orange-500/10 p-[1px]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-sats-orange-500 to-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.5)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse flex-shrink-0"></span>
            <span>Live count loads from the SatsEarn dashboard</span>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.4}>
        <div className="flex justify-center">
          <Link 
            href="/rewards#premium-tiers" 
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-sats-orange-500 text-black font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)] tracking-wider uppercase font-mono"
          >
            🛡 Claim Your Spot · $249/yr
          </Link>
        </div>
      </FadeUp>
    </section>
  );
};
