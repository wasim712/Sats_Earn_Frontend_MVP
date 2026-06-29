'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { ArrowRight, BookText, SplitSquareHorizontal } from 'lucide-react';

export const BlogPreviewSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" id="resources">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <FadeUp className="mb-16 text-center flex flex-col items-center">
          <div className="mb-6 text-[12px] font-black uppercase tracking-[0.25em] text-sats-orange-500">
            RESOURCES
          </div>

          <h2 className="mb-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-5xl">
            Read, Learn & Stay <span className="text-sats-orange-500">Updated Anytime.</span>
          </h2>

          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-gray-400">
            Bitcoin doesn&apos;t have to be confusing. Get up to speed with clear, beginner-friendly
            guides — then see exactly how SatsEarn measures up against every other rewards
            platform, with no spin.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Blog Card */}
          <Link href="/blogs?view=blogs" className="block outline-none">
            <FadeUp delay={0.1} className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-[#0a0a0a] p-7 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/10 hover:border-t-sats-orange-500/50 hover:border-l-sats-orange-500/50 hover:shadow-[0_24px_80px_rgba(0,0,0,0.6),-8px_-8px_30px_rgba(249,115,22,0.12)]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-sats-orange-500/10 bg-[#1f1309] text-sats-orange-500 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-15">
                  <BookText className="h-7 w-7" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sats-orange-500/20 bg-[#1f1309] px-3 py-1 text-[12px] font-bold text-sats-orange-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sats-orange-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sats-orange-500"></span>
                  </span>
                  Live
                </div>
              </div>

              <div className="mb-2 text-[12px] font-mono tracking-widest text-gray-500 uppercase">
                THE BLOG
              </div>
              <h3 className="mb-3 text-[22px] font-black text-white leading-tight">
                Learn Bitcoin from the ground up
              </h3>
              
              <p className="mb-8 text-[14px] leading-relaxed text-gray-400">
                No jargon, no hype — just clear guides that take you from
                &quot;what&apos;s a satoshi?&quot; to confidently stacking, withdrawing, and
                keeping your sats safe.
              </p>

              <div className="mt-auto border-t border-white/5 pt-6 pb-2 space-y-3.5">
                {[
                  "What Is Bitcoin? A beginner's guide",
                  "How to set up a Lightning wallet",
                  "How to spot and avoid Bitcoin scams"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[13px] text-gray-300">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sats-orange-500 shrink-0"></span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-2 text-[14px] font-bold text-sats-orange-500 transition-colors group-hover:text-sats-orange-400">
                  Browse all guides
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </FadeUp>
          </Link>

          {/* Compare Card */}
          <Link href="/blogs?view=comparisons" className="block outline-none">
            <FadeUp delay={0.2} className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-[#0a0a0a] p-7 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.32)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/10 hover:border-t-sats-orange-500/50 hover:border-l-sats-orange-500/50 hover:shadow-[0_24px_80px_rgba(0,0,0,0.6),-8px_-8px_30px_rgba(249,115,22,0.12)]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-sats-orange-500/10 bg-[#1f1309] text-sats-orange-500 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-15">
                  <SplitSquareHorizontal className="h-7 w-7" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sats-orange-500/20 bg-[#1f1309] px-3 py-1 text-[12px] font-bold text-sats-orange-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sats-orange-400 opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sats-orange-500"></span>
                  </span>
                  Live
                </div>
              </div>

              <div className="mb-2 text-[12px] font-mono tracking-widest text-gray-500 uppercase">
                COMPARE
              </div>
              <h3 className="mb-3 text-[22px] font-black text-white leading-tight">
                See how SatsEarn really stacks up
              </h3>
              
              <p className="mb-8 text-[14px] leading-relaxed text-gray-400">
                Honest, side-by-side breakdowns of payouts, fees, and what
                you actually earn — versus the platforms people ask about
                most. We show where others win too.
              </p>

              <div className="mt-auto border-t border-white/5 pt-6 pb-2">
                <div className="flex flex-wrap gap-2.5">
                  {['Freecash', 'JumpTask', 'ZBD', 'Fold', 'SatsFaucet'].map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-lg border border-white/5 bg-[#141414] px-3 py-1.5 text-[12px] font-medium text-gray-300">
                      {tag}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-lg bg-[#1f1309] px-3 py-1.5 text-[12px] font-medium text-sats-orange-500">
                    +12 more
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-flex items-center gap-2 text-[14px] font-bold text-sats-orange-500 transition-colors group-hover:text-sats-orange-400">
                  See all comparisons
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </FadeUp>
          </Link>
        </div>
      </div>
    </section>
  );
};

