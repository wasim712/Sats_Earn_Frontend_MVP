import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const AboutProblemSolution = () => {
  return (
    <section id="problem" className="px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            The Gap We&apos;re Closing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            Bitcoin is Hard to Get.<br />
            <span className="text-sats-orange-500">We Fixed That.</span>
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Problem Card */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8">
              <div className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-red-500 mb-2">
                The Problem
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mb-6">
                Bitcoin Feels Out of Reach
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  "Buying requires money you may not have or want to risk",
                  "Exchanges demand ID verification and bank accounts",
                  "Price volatility makes buying feel like gambling",
                  "Mining needs expensive hardware most people can't afford",
                  "Millions create online value daily and earn nothing for it"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm sm:text-base text-gray-300 leading-relaxed">
                    <div className="shrink-0 mt-0.5 text-sm">❌</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Card */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 sm:p-8">
              <div className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-green-500 mb-2">
                The Solution
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mb-6">
                Earn Bitcoin by Doing Simple Tasks
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  "No money needed — ever. Zero investment to start",
                  "No ID, no bank account, no exchange required",
                  "Earn from tasks, quizzes, streaks, and referrals",
                  "Real sats paid via Lightning Network to your wallet",
                  "Works in 180+ countries with just email and internet"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start text-sm sm:text-base text-gray-300 leading-relaxed">
                    <div className="shrink-0 mt-0.5 text-sm">✅</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
