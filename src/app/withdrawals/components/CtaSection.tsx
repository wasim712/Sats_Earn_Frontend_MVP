'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { Play } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="pt-16 relative px-4 max-w-4xl mx-auto text-center mb-16">
      <FadeUp delay={0.1}>
        <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 text-white max-w-2xl mx-auto">
            Start Stacking Toward Your First Withdrawal
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Every task brings you closer to your tier minimum. Create a free account and start earning real sats today.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 shadow-[0_5px_15px_rgba(238,139,18,0.3)] hover:shadow-[0_12px_25px_rgba(238,139,18,0.45)]"
          >
            <Play className="w-5 h-5 fill-current" /> Start Earning Free
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}
