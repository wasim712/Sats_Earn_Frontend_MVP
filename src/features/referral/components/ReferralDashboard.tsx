'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export const ReferralDashboard = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <FadeUp className="mb-10 sm:mb-14 text-center">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            Where It Lives
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            Your referral hub
          </h2>
          <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Everything in one place in your dashboard — your link, your network, and what&apos;s matured.
          </p>
        </FadeUp>

        <FadeUp>
          <div className="bg-sats-black-800 border border-sats-orange-500/20 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {/* Window Bar */}
            <div className="flex items-center gap-2 p-3.5 sm:p-4 bg-sats-black-900 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <div className="ml-3 font-mono text-[11px] sm:text-xs text-gray-400 font-bold tracking-wide">
                satsearn.app / user / referrals
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="font-mono text-xs tracking-wider uppercase text-gray-400 font-bold mb-3">
                Your referral link
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-8 relative">
                
                {/* Dummy Link Field */}
                <div 
                  className="flex-1 bg-sats-black-900 border border-white/10 rounded-xl px-4 py-3.5 font-mono text-sm text-sats-orange-500/70 flex items-center cursor-not-allowed group relative overflow-hidden"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={handleInteraction}
                >
                  <div className="truncate relative z-10 w-full blur-[0.5px]">satsearn.app/?ref=YOURCODE</div>
                  
                  {/* Internal Hover message for desktop */}
                  <div className={`absolute inset-0 bg-sats-black-800/95 backdrop-blur-sm border border-sats-orange-500/50 rounded-xl flex items-center justify-center transition-all duration-300 z-20 ${showTooltip ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <span className="text-[11px] sm:text-xs font-mono text-white text-center px-2">
                      Please login/signup to get your referral link.<br/>This one is dummy.
                    </span>
                  </div>
                </div>

                {/* Login/Signup Redirect Button instead of Copy */}
                <Link 
                  href="/signup" 
                  className="bg-sats-orange-500 text-black border border-sats-orange-500 rounded-xl px-6 py-3.5 font-bold text-sm sm:text-[15px] flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:bg-sats-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0"
                >
                  ⚡ Get Your Link
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-sats-black-900 border border-white/10 rounded-2xl p-5">
                  <div className="font-mono text-3xl font-black text-sats-orange-500 leading-none mb-2">0</div>
                  <div className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">Active referrals</div>
                </div>
                <div className="bg-sats-black-900 border border-white/10 rounded-2xl p-5">
                  <div className="font-mono text-3xl font-black text-[#ffbd2e] leading-none mb-2">0</div>
                  <div className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">Maturing sats <span className="opacity-70 normal-case font-normal text-[10px]">(in 15-day lock)</span></div>
                </div>
                <div className="bg-sats-black-900 border border-white/10 rounded-2xl p-5">
                  <div className="font-mono text-3xl font-black text-green-500 leading-none mb-2">0</div>
                  <div className="text-[11px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">Available to withdraw</div>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic mt-6 text-center">
                Illustrative preview. Commission moves from Maturing → Available as each entry clears its 15-day lock.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
