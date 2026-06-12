import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutEcosystem = () => {
  return (
    <section id="ecosystem" className="px-4 py-16 sm:py-24 bg-sats-black-900 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <FadeUp className="relative w-full max-w-[380px] aspect-square mx-auto lg:mx-0">
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M190 190 L88 46 M190 190 L292 46 M190 190 L28 190 M190 190 L352 190 M190 190 L88 334 M190 190 L292 334" stroke="rgba(249,115,22,0.35)" strokeWidth="2" strokeDasharray="4 5"/>
            </svg>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88px] h-[88px] rounded-2xl bg-[#0d0d16] border border-sats-orange-500/30 flex items-center justify-center text-[40px] text-sats-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] z-10">
              ₿
            </div>
            
            {/* Surrounding Nodes */}
            <div className="absolute top-[6%] left-[18%] w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">📱</div>
            <div className="absolute top-[6%] right-[18%] w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">🧠</div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">🎮</div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">👥</div>
            <div className="absolute bottom-[6%] left-[18%] w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">🔥</div>
            <div className="absolute bottom-[6%] right-[18%] w-[56px] h-[56px] rounded-xl bg-sats-black-800 border border-white/10 flex items-center justify-center text-[22px] z-10">⚡</div>
          </FadeUp>

          <FadeUp>
            <div className="text-[13px] font-mono tracking-[0.1em] uppercase text-sats-orange-500 font-bold mb-3.5">
              TASKS // QUIZZES // STREAKS // REFERRALS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black leading-tight tracking-tight text-white mb-5">
              One Platform.<br />
              Every Way to <span className="text-sats-orange-500">Stack.</span>
            </h2>
            <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed">
              SatsEarn connects every earning method into one Lightning-native wallet. Follow accounts, answer Bitcoin quizzes, play mini-games, keep daily streaks, and refer friends — all stacking real sats into a single balance. When you're ready, it all flows out over Lightning to the wallet of your choice. No internal coins. No conversion. Just Bitcoin.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
