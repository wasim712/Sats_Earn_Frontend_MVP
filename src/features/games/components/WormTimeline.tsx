'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormTimeline = () => {
  const phases = [
    {
      milestone: 'FOOD 1–9 · WARM-UP',
      desc: 'A slow start with no hazards at all. Use this window to learn the controls and build some length and room to manoeuvre.'
    },
    {
      milestone: 'FOOD 10+ · BOMBS APPEAR',
      desc: 'The first static bomb unlocks. From here, speed steps up as you cross major food milestones rather than after every bite.'
    },
    {
      milestone: 'FOOD 15+ · TIMED BOMBS',
      desc: 'Timed bombs join the board. They detonate after 6 seconds and can catch you on an adjacent tile — move clear the moment they blink red.'
    },
    {
      milestone: 'FOOD 20+ · WALLS',
      desc: 'Walls unlock as a single-tile formation. Only one formation exists at once, but it reshapes the safe space you have to work with.'
    },
    {
      milestone: 'FOOD 25+ · FAKE FOOD',
      desc: 'Fake food unlocks — a purple-ringed decoy that kills on contact. Now every bolt you approach needs a second look.'
    },
    {
      milestone: 'FOOD 30 / 40 / 50+ · MAX DANGER',
      desc: 'Walls grow to 2 tiles at 30+ and 3 tiles at 40+. From 50+, every unlocked hazard can reappear at random, one active instance per type. This is the deep end.'
    }
  ];

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 relative">
      <div className="mb-12">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            Difficulty Curve
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-4 uppercase">
            How the threat escalates
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            SAT WORM eases you in, then unlocks hazards in stages tied to how many bolts you've eaten. Speed steps up at the same milestones.
          </p>
        </FadeUp>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-sats-orange-500/20 ml-3 md:ml-4 flex flex-col gap-8">
        {phases.map((phase, idx) => (
          <FadeUp key={phase.milestone} delay={0.1 + idx * 0.05}>
            <div className="relative pl-8 group">
              {/* Timeline dot node */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sats-black-950 border-2 border-sats-orange-500 shadow-[0_0_0_4px_rgba(6,6,8,1),0_0_12px_rgba(247,147,26,0.3)] transition-transform duration-300 group-hover:scale-110"></div>
              
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-sats-orange-500 uppercase mb-2">
                  {phase.milestone}
                </span>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
                  {phase.desc}
                </p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};
