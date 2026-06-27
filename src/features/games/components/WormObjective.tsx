'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormObjective = () => {
  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left Side: Media Shot */}
        <FadeUp delay={0.1}>
          <div className="relative overflow-hidden bg-sats-black-950 border border-sats-orange-500/20 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] max-w-md mx-auto group">
            <img 
              id="img-start" 
              src="/minigames/first_image.png" 
              alt="SAT WORM Start Screen" 
              className="w-full h-auto object-cover block"
            />
            <div className="font-mono text-[10px] sm:text-xs text-gray-400 bg-sats-black-900 border-t border-sats-orange-500/10 p-3 leading-relaxed">
              <strong className="text-sats-orange-500">Start Screen.</strong> Choose your speed level (1 to 4) and view the game legend.
            </div>
          </div>
        </FadeUp>

        {/* Right Side: Copy */}
        <div className="flex flex-col">
          <FadeUp delay={0.2}>
            <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
              The Game
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wide mb-6">
              Grow long, survive longer
            </h2>
          </FadeUp>

          <FadeUp delay={0.4}>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
              SAT-WORM starts slow and empty. You spawn as a 3-segment worm on a clean 24×24 grid. Your only goal is to seek out the flashing orange sat food.
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8">
              Every bolt you consume adds one segment to your tail. The score rises by 10 points. For the first nine feeds, the board is yours to explore. Use this window to map your space before the system activates the defense grids.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="relative overflow-hidden bg-gradient-to-r from-sats-orange-500/10 to-transparent border border-sats-orange-500/20 border-l-4 border-l-sats-orange-500 rounded-r-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-sats-orange-500 font-bold mb-2 block">
                🎯 MISSION OBJECTIVE
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Eat <strong className="text-sats-orange-500">⚡ Sat food</strong>. Grow your worm. Dodge the bombs, fake food, and wall block structures. <strong className="text-white">Reach a score of 100</strong> to lock in your 5 XP reward, or push all the way to 1,000 points to claim maximum bragging rights.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

