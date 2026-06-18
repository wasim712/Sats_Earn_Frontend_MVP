'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Bitcoin, Lock, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const WithdrawalsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-sats-black-950" id="withdraw">
      
      {/* Decorative Grid & Glows */}
      <div className="absolute inset-0 bg-sats-black-950 bg-grid-base opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-sats-orange-500/5 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono flex items-center gap-2">
              <Bitcoin className="w-4 h-4" /> Withdrawals
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Your Sats.<br />
            <span className="text-sats-orange-500">Your Lightning Wallet.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Withdraw to any Lightning wallet once you hit your tier's minimum threshold. Fees are shown transparently at time of withdrawal.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Withdrawal Minimums Table */}
          <FadeUp delay={0.1} className="bg-sats-black-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-sats-orange-500/10 flex items-center justify-center shrink-0">
                  <Bitcoin className="w-5 h-5 text-sats-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Withdrawal Minimums</h3>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-sats-black-950 rounded-xl border border-white/5">
                  <span className="text-sm font-bold text-gray-300 mb-2 sm:mb-0">Basic / Copper / Bronze / Silver / Gold</span>
                  <span className="text-sm font-bold text-white font-mono bg-white/5 px-3 py-1 rounded-lg">25,000 sats</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-sats-black-950 rounded-xl border border-white/5">
                  <span className="text-sm font-bold text-gray-300 mb-2 sm:mb-0">Platinum</span>
                  <span className="text-sm font-bold text-sats-orange-500 font-mono bg-sats-orange-500/10 px-3 py-1 rounded-lg">20,000 sats</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-sats-black-950 rounded-xl border border-white/5">
                  <span className="text-sm font-bold text-gray-300 mb-2 sm:mb-0">Diamond / Crown / Elite</span>
                  <span className="text-sm font-bold text-sats-orange-500 font-mono bg-sats-orange-500/10 px-3 py-1 rounded-lg">15,000 sats</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-sats-black-950 rounded-xl border border-yellow-500/20">
                  <span className="text-sm font-bold text-yellow-500 mb-2 sm:mb-0">Founders ★</span>
                  <span className="text-sm font-bold text-yellow-500 font-mono bg-yellow-500/20 px-3 py-1 rounded-lg">10,000 sats</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 leading-relaxed border-t border-white/10 pt-4">
              Paid tier users reach withdrawal threshold faster — both from lower minimums and higher per-task earnings. A Founders user can withdraw up to 2.5x sooner than a Basic user completing the same tasks.
            </div>
          </FadeUp>

          {/* Maturity Period Explanation */}
          <FadeUp delay={0.2} className="bg-sats-black-900 border border-sats-orange-500/20 rounded-2xl p-6 sm:p-8 flex flex-col shadow-[0_0_40px_rgba(249,115,22,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-sats-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">15-Day Maturity — For Everyone</h3>
            </div>
            
            <p className="text-gray-300 mb-10 leading-relaxed">
              Every sat earned goes through a 15-day maturity period regardless of tier. This protects you, the platform, and the integrity of every reward paid out.
            </p>

            <div className="flex flex-col gap-6 relative">
              {/* Connecting Line */}
              <div className="absolute left-[23px] top-6 bottom-6 w-px bg-white/10 pointer-events-none" />

              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 rounded-full bg-sats-black-950 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="pt-2">
                  <h4 className="text-white font-bold mb-1">Pending</h4>
                  <p className="text-sm text-gray-400">AI and manual verification · up to 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 rounded-full bg-sats-black-950 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div className="pt-2">
                  <h4 className="text-white font-bold mb-1">Maturing</h4>
                  <p className="text-sm text-gray-400">Countdown shown in dashboard · exactly 15 days</p>
                </div>
              </div>

              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 rounded-full bg-sats-black-950 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="pt-2">
                  <h4 className="text-white font-bold mb-1">Available</h4>
                  <p className="text-sm text-gray-400">Sats in your balance · withdraw anytime</p>
                </div>
              </div>
            </div>

          </FadeUp>

        </div>
      </div>
    </section>
  );
};
