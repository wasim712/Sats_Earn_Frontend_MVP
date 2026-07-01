'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormInMotion = () => {
  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left Side: Copy */}
        <div className="flex flex-col">
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
              In Motion
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wide mb-6">
              Read the board, plan the route
            </h3>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
              The worm's head glows brightest and carries the direction it&apos;s travelling. Behind it, the body fades from bright orange to deep amber so you can always trace your tail.
            </p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              The sat food pulses with a countdown ring that drains clockwise — <span className="text-sats-orange-500 font-semibold">orange</span> means you have time, <span className="text-amber-400 font-semibold">yellow</span> means hurry, and <span className="text-red-500 font-semibold">red</span> means it&apos;s about to teleport. Good players don't chase; they cut the food off.
            </p>
          </FadeUp>
        </div>

        {/* Right Side: Media Shot */}
        <FadeUp delay={0.4}>
          <div className="relative overflow-hidden bg-sats-black-950 border border-sats-orange-500/20 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] max-w-md mx-auto group">
            <img 
              id="img-gameplay" 
              src="/minigames/second_image.png" 
              alt="SAT WORM Active Gameplay" 
              className="w-full h-auto object-cover block"
            />
            <div className="font-mono text-[10px] sm:text-xs text-gray-400 bg-sats-black-900 border-t border-sats-orange-500/10 p-3 leading-relaxed">
              <strong className="text-sats-orange-500">Active gameplay.</strong> Spot fake food 🍄 (purple ring) and timed bombs ⏰.
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
