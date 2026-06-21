'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Lock, Clock, CheckCircle } from 'lucide-react';

export function MaturitySection() {
  return (
    <section className="py-8 relative px-4 max-w-4xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="bg-gradient-to-br from-blue-500/[0.08] to-sats-black-900 border border-blue-500/20 rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(59,130,246,0.05)]">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">The 15-Day Maturity Period</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8">
            Before any sats can be withdrawn, they pass through a maturity period. This applies to every user on every tier — it's the backbone of our fraud protection.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-4 bg-black/20 border border-white/[0.04] rounded-xl p-4 sm:p-5">
              <div className="mt-0.5 text-blue-400"><Clock className="w-5 h-5" /></div>
              <div>
                <strong className="block text-[15px] sm:text-base text-white mb-1">Pending</strong>
                <span className="text-[13px] sm:text-sm text-gray-400">Task verified by AI and manual review · up to 24 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-black/20 border border-white/[0.04] rounded-xl p-4 sm:p-5">
              <div className="mt-0.5 text-blue-400"><Lock className="w-5 h-5" /></div>
              <div>
                <strong className="block text-[15px] sm:text-base text-white mb-1">Maturing</strong>
                <span className="text-[13px] sm:text-sm text-gray-400">15-day countdown shown in your dashboard</span>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-black/20 border border-white/[0.04] rounded-xl p-4 sm:p-5">
              <div className="mt-0.5 text-sats-orange-500"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <strong className="block text-[15px] sm:text-base text-white mb-1">Available</strong>
                <span className="text-[13px] sm:text-sm text-gray-400">Counts toward your withdrawal minimum · withdraw anytime</span>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
