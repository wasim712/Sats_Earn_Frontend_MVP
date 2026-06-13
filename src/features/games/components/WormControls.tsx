'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormControls = () => {
  const controls = [
    { key: '↑ ↓ ← →', desc: 'Arrow keys change direction' },
    { key: 'W A S D', desc: 'WASD also steers' },
    { key: 'Swipe', desc: 'Swipe the board on touch screens' },
    { key: 'D-pad', desc: 'On-screen pad shows on mobile' },
    { key: 'P / Esc', desc: 'Pause and resume anytime' },
    { key: 'Enter / Space', desc: 'Start a run; Enter also restarts after a crash' }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left Side: Media Shot */}
        <FadeUp delay={0.1}>
          <div className="relative overflow-hidden bg-sats-black-950 border border-sats-orange-500/20 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] max-w-md mx-auto group">
            <img 
              id="img-howto" 
              src="/minigames/third_image.png" 
              alt="SAT WORM In-game Guide" 
              className="w-full h-auto object-cover block"
            />
            <div className="font-mono text-[10px] sm:text-xs text-gray-400 bg-sats-black-900 border-t border-sats-orange-500/10 p-3 leading-relaxed">
              <strong className="text-sats-orange-500">Built-in guide.</strong> SAT WORM ships with an in-game How to Play panel you can reopen any time.
            </div>
          </div>
        </FadeUp>

        {/* Right Side: Copy */}
        <div className="flex flex-col">
          <FadeUp delay={0.2}>
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
              Controls
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wide mb-4">
              How to play
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              Play it however suits your device — full keyboard, swipe, or the on-screen D-pad on mobile.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {controls.map((c) => (
                <div key={c.key} className="flex flex-col gap-2 bg-sats-black-900 border border-sats-orange-500/10 rounded-xl p-4 hover:border-sats-orange-500/20 transition-all duration-200">
                  <div className="font-mono font-bold text-xs text-sats-orange-500 bg-sats-black-950 border border-sats-orange-500/20 rounded-lg py-1.5 px-3 w-fit select-none shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                    {c.key}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-normal font-medium">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

