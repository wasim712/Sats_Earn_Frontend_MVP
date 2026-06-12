import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutCTA = () => {
  return (
    <section id="about-cta" className="relative overflow-hidden px-4 py-24 sm:py-32">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeUp>
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-4">
            Join Us
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            Start Stacking Sats.<br />
            <span className="text-sats-orange-500">No Buying Required.</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed mb-10">
            Join SatsEarn today — free forever. Complete tasks, earn real Bitcoin, and withdraw via Lightning when you're ready.
          </p>
          <Link 
            href="/signup" 
            className="inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-sats-orange-500 text-black font-extrabold text-base sm:text-lg transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
          >
            ⚡ Start Earning Free
          </Link>
        </FadeUp>
      </div>
    </section>
  );
};
