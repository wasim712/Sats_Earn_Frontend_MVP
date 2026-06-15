'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { Bitcoin } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-4xl mx-auto text-center mb-16">
      <FadeUp delay={0.1}>
        <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 mb-6 flex justify-center items-center gap-2 font-bold">
            <Bitcoin className="w-4 h-4" /> Put it to use
          </div>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 text-white">Learn it, then earn it</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Take what you just read and stack real sats with SatsEarn&apos;s Bitcoin quizzes — answer questions, prove you know your stuff, and get paid in Bitcoin.
          </p>
          <Link
            href="/#ways-to-earn"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 shadow-[0_5px_15px_rgba(238,139,18,0.3)] hover:shadow-[0_12px_25px_rgba(238,139,18,0.45)]"
          >
            Start a Bitcoin Quiz
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}
