'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { Play } from 'lucide-react';

export const WormCta = () => {
  const tips = [
    {
      title: 'Build room early',
      body: 'The first nine bolts have no hazards — use them to grow and learn the speed before anything dangerous spawns.'
    },
    {
      title: 'Watch the food ring',
      body: "The arc drains clockwise. Orange is safe, yellow means hurry, red means it's about to teleport — commit to your route before it resets."
    },
    {
      title: 'Real food is always orange',
      body: 'Once fake food unlocks at #25, check the ring: a purple dashed ring and a mushroom means instant death. Steer away.'
    },
    {
      title: 'Timed bombs kill at range',
      body: 'When one blinks red it can take you out on an adjacent tile, not just a direct hit. Clear the area early.'
    },
    {
      title: 'Mind the growing walls',
      body: "Walls get bigger past food 30 and 40. Keep a mental map of the open lanes so a new formation doesn't trap you."
    },
    {
      title: 'Use the revive wisely',
      body: 'After a crash you may get one continue (it costs points). Bank it for a deep run rather than an early stumble.'
    }
  ];

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 relative flex flex-col gap-16">
      
      {/* Pro Tips Section */}
      <div>
        <div className="mb-8">
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
              <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
              Pro Tips
            </div>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wide mb-3">
              Survive longer, score more
            </h2>
          </FadeUp>
          
          <FadeUp delay={0.3}>
            <p className="text-sm sm:text-base text-gray-300">
              A handful of habits separate a short run from a deep one.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((t, idx) => (
            <FadeUp key={t.title} delay={0.1 + idx * 0.05}>
              <div className="bg-gradient-to-r from-sats-orange-500/5 to-transparent border border-sats-orange-500/10 border-l-3 border-l-sats-orange-500 rounded-r-xl p-5 hover:bg-sats-orange-500/[0.03] transition-all duration-200 h-full">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-sats-orange-500 font-bold">{t.title}. </strong>
                  {t.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Note Block */}
      <FadeUp delay={0.2}>
        <div className="bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <h4 className="font-mono text-xs sm:text-sm tracking-wider uppercase text-sats-orange-500 font-bold mb-4">
            About game rewards
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
            SAT WORM rewards XP for everyone today. Sat rewards from games are a planned paid-tier feature and are currently switched off in the game — once live, any sats credited will follow the platform's standard verification and 15-day maturity process before they're available to withdraw.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Scores, streaks, and rewards are validated server-side when you're signed in. Runs are checked for fair play, and only genuine sessions count toward your totals and the leaderboard.
          </p>
        </div>
      </FadeUp>

      {/* CTA Section */}
      <div className="text-center py-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-[radial-gradient(circle,rgba(249,115,22,0.06),transparent_70%)] pointer-events-none -z-10"></div>

        <div className="mb-10">
          <FadeUp delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono leading-tight mb-4 tracking-tight uppercase">
              Ready to stack?
            </h2>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto leading-relaxed">
              Jump into SAT WORM from your SatsEarn dashboard and start climbing the score.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.3}>
          <div className="flex justify-center">
            <Link 
              href="/user/minigames" 
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-sats-orange-500 text-black font-extrabold text-sm sm:text-base transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)] tracking-wider uppercase font-mono flex items-center justify-center gap-2"
            >
              <Play className='text-black fill-black'> </Play> Play SAT WORM
            </Link>
          </div>
        </FadeUp>
      </div>

    </section>
  );
};
