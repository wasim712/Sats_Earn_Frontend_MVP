'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersHero = () => {
  const [spotsCount, setSpotsCount] = useState(0);
  const targetSpots = 3;
  const totalSpots = 1000;

  useEffect(() => {
    // Animate spots number from 0 to target
    const duration = 1200; // ms
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Easy out quad curve
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

  const handleScrollToIncluded = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById('whats-included');
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="py-16 sm:py-24 text-center max-w-4xl mx-auto px-4 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[radial-gradient(circle,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none -z-10"></div>

      <FadeUp delay={0.1}>
        <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/30 rounded-full px-5 py-2 mb-6 backdrop-blur-xs">
          🛡 The Founders Tier
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
          Become a <span className="text-sats-orange-500 relative">SatsEarn Founder</span>
        </h1>
      </FadeUp>

      <FadeUp delay={0.3}>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          The highest tier on SatsEarn, capped at <strong className="text-white font-bold">1,000 members for life</strong>. Top sat rewards, uncapped referrals, a permanent Founder badge, and a share of every unattributed signup we bring in. <strong className="text-sats-orange-500 font-bold">Once the spots are gone, they're gone.</strong>
        </p>
      </FadeUp>

      <FadeUp delay={0.4}>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-sats-orange-500">$249</span>
          <span className="font-mono text-sm sm:text-base text-gray-400">/ year</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mb-8">
          Cancel anytime · Your Founder status is permanent for as long as you hold the tier
        </p>
      </FadeUp>

      <FadeUp delay={0.5}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/rewards#premium-tiers" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sats-orange-500 text-black font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)] tracking-wider uppercase font-mono"
          >
            🛡 Claim Your Spot
          </Link>
          <a 
            href="#whats-included"
            onClick={handleScrollToIncluded}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent text-sats-orange-500 border border-sats-orange-500/30 font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-500/10 hover:border-sats-orange-500/50 tracking-wider uppercase font-mono"
          >
            See What&apos;s Included
          </a>
        </div>
      </FadeUp>

      {/* SPOTS COUNTER */}
      <FadeUp delay={0.5}>
        <div className="max-w-xl mx-auto bg-sats-black-900 border border-sats-orange-500/15 rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-sats-orange-500/30 transition-colors duration-300">
          {/* subtle shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="flex justify-between items-baseline mb-3">
            <span className="font-mono text-[12px] sm:text-xs tracking-wider uppercase text-gray-300">Founding Members</span>
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
    </header>
  );
};
