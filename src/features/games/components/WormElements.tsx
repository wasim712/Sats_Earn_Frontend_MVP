'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const WormElements = () => {
  const elements = [
    {
      icon: '⚡',
      name: 'Sat Food',
      desc: "The bolt you're chasing. Eat it to score and grow. It carries a countdown ring — if the ring empties before you reach it, the food teleports to a new spot.",
      tag: '+10 points',
      accentClass: 'hover:border-sats-orange-500/30 group-hover:from-sats-orange-500/5',
      accentText: 'text-sats-orange-500',
      glowLine: 'bg-sats-orange-500'
    },
    {
      icon: '🍄',
      name: 'Fake Food',
      desc: 'A decoy that looks edible. Marked by a purple dashed ring and a mushroom icon. Touching it is instant death — real food is always orange.',
      tag: 'Unlocks at food #25',
      accentClass: 'hover:border-purple-500/30 group-hover:from-purple-500/5',
      accentText: 'text-purple-400',
      glowLine: 'bg-purple-500'
    },
    {
      icon: '💣',
      name: 'Bomb',
      desc: 'A static obstacle that sits on the grid. Run into it and the run is over. Only one can be active at a time.',
      tag: 'Unlocks at food #10',
      accentClass: 'hover:border-red-500/30 group-hover:from-red-500/5',
      accentText: 'text-red-500',
      glowLine: 'bg-red-500'
    },
    {
      icon: '⏰',
      name: 'Timed Bomb',
      desc: 'Counts down and detonates after 6 seconds. It blinks red as it nears explosion and can kill you on an adjacent tile, not just a direct hit.',
      tag: 'Unlocks at food #15',
      accentClass: 'hover:border-red-500/30 group-hover:from-red-500/5',
      accentText: 'text-red-500',
      glowLine: 'bg-red-500'
    },
    {
      icon: '🧱',
      name: 'Wall Block',
      desc: 'A solid barrier formation. Starts as a single tile and grows to 2, then 3 connected tiles deeper into a run. Only one formation exists at a time.',
      tag: 'Unlocks at food #20',
      accentClass: 'hover:border-indigo-400/30 group-hover:from-indigo-400/5',
      accentText: 'text-indigo-400',
      glowLine: 'bg-indigo-400'
    },
    {
      icon: '🐍',
      name: 'Your Own Tail',
      desc: 'As you grow, you become your own biggest hazard. Double back into any segment of your body and you die instantly.',
      tag: 'Always active',
      accentClass: 'hover:border-sats-orange-500/30 group-hover:from-sats-orange-500/5',
      accentText: 'text-sats-orange-500',
      glowLine: 'bg-sats-orange-500'
    }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="mb-12">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            Game Elements
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono leading-none mb-4 uppercase">
            What's on the board
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            Six things share the grid with you. Hazards aren't there from the start — they unlock as you eat more food.
          </p>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {elements.map((el, idx) => (
          <FadeUp key={el.name} delay={0.1 + idx * 0.05}>
            <div className={`group relative h-full bg-sats-black-900 border border-sats-orange-500/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] ${el.accentClass}`}>
              {/* glowing border top effect */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${el.glowLine}`}></div>
              
              <div className="text-3xl mb-4 select-none">{el.icon}</div>
              
              <h3 className={`font-mono text-sm font-bold tracking-wider uppercase mb-2 ${el.accentText}`}>
                {el.name}
              </h3>
              
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                {el.desc}
              </p>
              
              <span className="inline-block font-mono text-[10px] tracking-wider uppercase text-gray-400 border border-sats-orange-500/10 bg-sats-black-950 rounded px-2.5 py-1">
                {el.tag}
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};
