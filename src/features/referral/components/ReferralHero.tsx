import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralHero = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section className="px-4 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <FadeUp delay={0.1}>
            <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-5">
              Referral Programme
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-white">
              Earn sats for every<br />
              friend you invite
            </h1>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Share your link, and when the people you invite are active on SatsEarn, <strong className="text-white">you earn a sat commission</strong> on the platform's base reward for their activity. Paid tiers earn a higher rate — and Founders earn the most.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sats-orange-500 text-black font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)]"
              >
                Get Your Referral Link
              </Link>
              <Link 
                href="#calculator" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent text-sats-orange-500 border border-sats-orange-500/30 font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-500/10 hover:border-sats-orange-500/50"
              >
                Estimate Earnings
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SATS ON SATS HOOK */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="relative overflow-hidden bg-gradient-to-br from-sats-orange-500/15 to-sats-orange-500/5 border border-sats-orange-500/30 rounded-[20px] p-8 sm:p-10 text-center">
              {/* Subtle inner glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[200px] bg-[radial-gradient(circle,rgba(249,115,22,0.15),transparent_70%)] pointer-events-none -mt-20"></div>
              
              <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white mb-4">
                Sharing earns you <span className="text-sats-orange-500">sats on sats</span>
              </h2>
              <p className="relative z-10 text-[15px] sm:text-[17px] text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Share your link with anyone — no Bitcoin experience needed.<br className="hidden sm:block" />
                When people join and get active, you earn <strong className="text-white">commission sats on their activity</strong>, on top of what you stack yourself.<br className="hidden sm:block" />
                On paid tiers it keeps paying, with no cap.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
};
