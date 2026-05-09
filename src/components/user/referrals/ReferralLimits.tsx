'use client';

import React from 'react';
import { Users, Crown, Info } from 'lucide-react';
import Link from 'next/link';

interface ReferralLimitsProps {
  currentReferrals: number;
  limit?: number;
}

export default function ReferralLimits({ currentReferrals, limit = 20 }: ReferralLimitsProps) {
  const progress = Math.min((currentReferrals / limit) * 100, 100);
  const isAtLimit = currentReferrals >= limit;

  return (
    <div className={`relative bg-[#050505] border rounded-[24px] p-6 sm:p-8 overflow-hidden group transition-all duration-300 ${
      isAtLimit ? 'border-red-500/20' : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
    }`}>
      {/* Background Ambient Glow */}
      <div className={`absolute right-0 top-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
        isAtLimit ? 'bg-red-500/5' : 'bg-sats-orange-500/5'
      }`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left Side: Info & Messaging */}
        <div className="flex items-start gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
            isAtLimit 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-[#111] border-[#2a2a2a] text-gray-400 group-hover:text-sats-orange-500 transition-colors'
          }`}>
            {isAtLimit ? <Info className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight mb-1.5 flex items-center gap-2">
              Free Tier Limit
              <span className="px-2.5 py-0.5 rounded-md bg-[#111] border border-[#2a2a2a] text-[10px] font-bold text-gray-500 tracking-widest">
                {currentReferrals} / {limit}
              </span>
            </h3>
            <p className="text-sm text-gray-400 font-medium max-w-lg leading-relaxed">
              Basic accounts can invite up to {limit} friends. Upgrade to a premium tier to unlock <strong className="text-gray-200">unlimited referrals</strong> and maximize your passive earning potential.
            </p>
          </div>
        </div>

        {/* Right Side: Progress Bar & Upgrade Button */}
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:min-w-[380px] shrink-0">
          <div className="w-full">
            <div className="flex justify-between items-end mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isAtLimit ? 'text-red-400' : 'text-gray-500'}`}>
                {isAtLimit ? 'Limit Reached' : `${limit - currentReferrals} Spots Left`}
              </span>
              <span className="text-xs font-bold text-gray-300">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden border border-[#1a1a1a]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isAtLimit 
                    ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                    : 'bg-gradient-to-r from-sats-orange-600 to-yellow-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            href="/user/rewards"
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sats-orange-500 to-yellow-500 hover:from-sats-orange-400 hover:to-yellow-400 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
          >
            <Crown className="w-4 h-4" />
            Upgrade
          </Link>
        </div>

      </div>
    </div>
  );
}