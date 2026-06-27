'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { Building2, ArrowRight, Bitcoin, Repeat, CheckCircle2 } from 'lucide-react';

export const AboutBitcoinLoop = () => {
  return (
    <section id="bitcoin-loop" className="px-4 py-16 sm:py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sats-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeUp className="text-center mb-8">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            The Whole Loop
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            It All Runs on <span className="text-sats-orange-500">Bitcoin</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="max-w-2xl mx-auto text-center text-base sm:text-lg text-gray-400 leading-relaxed mb-12 sm:mb-16">
            Most rewards platforms pay you in points or gift cards. SatsEarn is different: whatever currency a brand pays us in, <strong className="text-white">what reaches you is always real Bitcoin</strong> — earned for genuine activity and settled over the Lightning Network. One simple loop, ending in sats you fully control.
          </p>
        </FadeUp>

        {/* 3-Step Flow */}
        <FadeUp delay={0.2}>
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4 md:gap-0 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 w-full bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/40">
              <div className="font-mono text-xs tracking-widest text-sats-orange-500/70 mb-4">01</div>
              <div className="w-16 h-16 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center mx-auto mb-5 text-sats-orange-500">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Brands fund campaigns</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Advertisers fund campaigns in <strong className="text-sats-orange-500">USD, USDT, or INR</strong> to reach a Bitcoin-native audience. We're based in India and work with brands worldwide.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="flex items-center justify-center p-2 md:px-4 text-sats-orange-500/50 md:rotate-0 rotate-90">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 w-full bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/40">
              <div className="font-mono text-xs tracking-widest text-sats-orange-500/70 mb-4">02</div>
              <div className="w-16 h-16 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center mx-auto mb-5 text-sats-orange-500">
                <svg viewBox="0 0 56 72" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">You complete tasks</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Learn about Bitcoin, play games, answer quizzes, and complete offers. Every verified action earns you <strong className="text-sats-orange-500">real satoshis</strong>.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="flex items-center justify-center p-2 md:px-4 text-sats-orange-500/50 md:rotate-0 rotate-90">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 w-full bg-sats-black-800 border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/40">
              <div className="font-mono text-xs tracking-widest text-sats-orange-500/70 mb-4">03</div>
              <div className="w-16 h-16 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center mx-auto mb-5 text-sats-orange-500">
                <Bitcoin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Sats reach your wallet</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                After maturity, withdraw <strong className="text-sats-orange-500">straight to any Lightning wallet</strong>. Not points. Not gift cards. Bitcoin you fully control.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Rail Banner */}
        <FadeUp delay={0.3}>
          <div className="max-w-5xl mx-auto mt-8 sm:mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gradient-to-r from-sats-orange-500/10 to-transparent border border-sats-orange-500/20 rounded-xl p-5 sm:p-6">
            <div className="text-sats-orange-500 shrink-0">
              <Repeat className="w-6 h-6" />
            </div>
            <p className="text-[14px] sm:text-[15px] text-gray-400 leading-relaxed text-center sm:text-left">
              <strong className="text-white">However a brand pays, you get Bitcoin.</strong> Campaign budgets fund the reward pool, and your rewards are paid out as real sats — settled on the Lightning Network, straight to your wallet.
            </p>
          </div>
        </FadeUp>

        {/* Bullet Points */}
        <FadeUp delay={0.4}>
          <div className="max-w-5xl mx-auto mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4">
            {[
              "You always earn and withdraw real Bitcoin",
              "Instant Lightning Network settlement",
              "Real Bitcoin rewards — never internal coins",
              "Global reach without currency barriers",
              "Lower fees than traditional ad rails",
              "Aligned incentives — brands, you, and us"
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sats-orange-500 shrink-0 mt-0.5" />
                <span className="text-[14px] sm:text-[15px] text-gray-400">{point}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Disclaimer */}
        <FadeUp delay={0.5}>
          <p className="max-w-2xl mx-auto mt-10 text-center text-xs text-gray-400 italic leading-relaxed">
            This describes how the platform works, not a promise of specific earnings or advertiser results{' '}
            <br />
            <Link href="/brands" className="text-sats-orange-500 hover:text-sats-orange-400 not-italic font-semibold transition-colors">
              Are you a brand? See how advertising works →
            </Link>
          </p>
        </FadeUp>

      </div>
    </section>
  );
};
