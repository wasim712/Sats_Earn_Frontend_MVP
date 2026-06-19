'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { CheckSquare, Clock, Lock, Zap, ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      
      {/* Decorative Grid & Glows */}
      <div className="absolute inset-0 bg-sats-black-950 bg-grid-base opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-sats-orange-500/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono">
              How It Works
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            From Task to Sats<br />
            in <span className="text-sats-orange-500">4 Simple Steps</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every sat you earn goes through a verified, transparent process designed to protect you and the platform from fraud.
          </p>
        </FadeUp>

        {/* 4 Steps Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent pointer-events-none z-0" />

          {/* Step 1 */}
          <FadeUp delay={0.1} className="relative z-10 text-center px-4">
            <div className="w-[88px] h-[88px] mx-auto rounded-full bg-sats-black-900 border border-sats-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.08)] flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-sats-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CheckSquare className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete a Task</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Follow accounts, answer quizzes, watch content, refer friends — pick what suits you.
            </p>
          </FadeUp>

          {/* Step 2 */}
          <FadeUp delay={0.2} className="relative z-10 text-center px-4">
            <div className="w-[88px] h-[88px] mx-auto rounded-full bg-sats-black-900 border border-sats-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.08)] flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-sats-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Clock className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verification (24hrs)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI and manual review confirms the task was completed genuinely. Protects everyone.
            </p>
          </FadeUp>

          {/* Step 3 */}
          <FadeUp delay={0.3} className="relative z-10 text-center px-4">
            <div className="w-[88px] h-[88px] mx-auto rounded-full bg-sats-black-900 border border-sats-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.08)] flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-sats-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Lock className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Maturing (15 Days)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Earned sats mature in your account. Anti-fraud protection that keeps the platform honest.
            </p>
          </FadeUp>

          {/* Step 4 */}
          <FadeUp delay={0.4} className="relative z-10 text-center px-4">
            <div className="w-[88px] h-[88px] mx-auto rounded-full bg-sats-black-900 border border-sats-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.08)] flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 rounded-full bg-sats-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Withdraw via Lightning</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sats hit your available balance. Withdraw to any Lightning wallet when you hit your tier minimum.
            </p>
          </FadeUp>

        </div>

        {/* Status Flow Indicators */}
        <FadeUp delay={0.5} className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 bg-sats-black-900/60 backdrop-blur-sm border border-white/5 rounded-full px-5 py-2.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <span className="text-xs font-bold tracking-wide text-gray-300 uppercase">Pending — Being Verified</span>
          </div>
          <ArrowRight className="w-5 h-5 text-sats-orange-500 rotate-90 md:rotate-0" />
          <div className="flex items-center gap-3 bg-sats-black-900/60 backdrop-blur-sm border border-white/5 rounded-full px-5 py-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-bold tracking-wide text-gray-300 uppercase">Maturing — X Days Remaining</span>
          </div>
          <ArrowRight className="w-5 h-5 text-sats-orange-500 rotate-90 md:rotate-0" />
          <div className="flex items-center gap-3 bg-sats-black-900/60 backdrop-blur-sm border border-white/5 rounded-full px-5 py-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-xs font-bold tracking-wide text-gray-300 uppercase">Available — Ready to Withdraw</span>
          </div>
        </FadeUp>

      </div>
    </section>
  );
};
