import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutHero = () => {
  return (
    <section className="px-4 py-24 sm:py-32 text-center flex flex-col items-center justify-center">
      <FadeUp delay={0.1}>
        <div className="inline-flex items-center gap-2 bg-sats-orange-500/15 border border-sats-orange-500/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.1em] text-sats-orange-500 uppercase mb-7">
          ⚡ Our Story
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-5">
          Bitcoin Isn't Bought.<br />
          It's <span className="inline-block bg-sats-orange-500 text-black px-4 rounded-xl leading-tight">Earned.</span>
        </h1>
      </FadeUp>

      <FadeUp delay={0.3}>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-9">
          SatsEarn is the platform where the things you already do online pay you in real Bitcoin sats. No buying. No exchange. No catch. This is why we built it.
        </p>
      </FadeUp>

      <FadeUp delay={0.4}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sats-orange-500 text-black font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
          >
            ⚡ Start Stacking Free
          </Link>
          <Link 
            href="#story" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent text-white border border-white/15 font-extrabold text-sm sm:text-base transition-all hover:border-sats-orange-500 hover:text-sats-orange-500"
          >
            Read Our Story
          </Link>
        </div>
      </FadeUp>
    </section>
  );
};
