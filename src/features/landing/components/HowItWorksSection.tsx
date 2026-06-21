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
              <div className="fi-task flex items-center justify-center"><svg className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3.5V2.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 2.5v1"/><path className="fi-check" d="m8.5 12 2.2 2.2L15 9.5"/></svg></div>
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
              <div className="fi-hourglass flex items-center justify-center"><svg className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12M6 22h12M7 2v3.2a3 3 0 0 0 1 2.2l4 3.6 4-3.6a3 3 0 0 0 1-2.2V2M7 22v-3.2a3 3 0 0 1 1-2.2l4-3.6 4 3.6a3 3 0 0 1 1 2.2V22"/><path d="M9.5 19.5h5" strokeWidth="2.2"/></svg></div>
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
              <div className="fi-lock flex items-center justify-center"><svg className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path className="fi-shackle" d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3"/><path d="M12 16.8v1.7"/></svg></div>
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
              <div className="fi-bolt flex items-center justify-center"><svg className="w-9 h-9 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" viewBox="0 0 56 72" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z"/></svg></div>
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
