'use client';

import React from 'react';
import { Users, Crown } from 'lucide-react';
import Link from 'next/link';

interface ReferralLimitsProps {
  currentReferrals: number;
  isFreeTier: boolean;
  activeTier: string;
  rewardCapSats?: number | null;
}

export default function ReferralLimits({ currentReferrals, isFreeTier, activeTier, rewardCapSats }: ReferralLimitsProps) {
  return (
    <div className="relative bg-[#050505] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-8 overflow-hidden group transition-all duration-300 hover:border-[#2a2a2a]">
      <div className="absolute right-0 top-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none bg-sats-orange-500/5" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner bg-[#111] border-[#2a2a2a] text-gray-400 group-hover:text-sats-orange-500 transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight mb-1.5 flex items-center gap-2">
              {isFreeTier ? 'Free Tier Referral Rewards' : 'Premium Referral Access'}
              <span className="px-2.5 py-0.5 rounded-md bg-[#111] border border-[#2a2a2a] text-[10px] font-bold text-gray-500 tracking-widest">
                {isFreeTier ? `${currentReferrals} INVITES` : `${activeTier} · NO CAP`}
              </span>
            </h3>
            <p className="text-sm text-gray-400 font-medium max-w-lg leading-relaxed">
              {isFreeTier ? (
                <>
                  Free-tier accounts on <strong className="text-gray-200">{activeTier}</strong> can invite <strong className="text-gray-200">as many users as they want</strong>, but referral earnings are capped at <strong className="text-gray-200">{(rewardCapSats || 0).toLocaleString()} sats</strong>. Upgrade to premium for uncapped referral earnings.
                </>
              ) : (
                <>
                  Your <strong className="text-gray-200">{activeTier}</strong> tier has <strong className="text-gray-200">no referral cap</strong>, so you can grow your network and earnings without limits.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 lg:min-w-[380px] shrink-0">
          <div className="w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {isFreeTier ? `Earnings capped at ${(rewardCapSats || 0).toLocaleString()} sats` : 'Unlimited Referrals'}
              </span>
              <span className="text-xs font-bold text-gray-300">{isFreeTier ? 'CAP' : '∞'}</span>
            </div>
            <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden border border-[#1a1a1a]">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  !isFreeTier
                    ? 'bg-gradient-to-r from-emerald-500 to-sky-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-sats-orange-600 to-yellow-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                }`}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {isFreeTier ? (
            <Link
              href="/user/rewards"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sats-orange-500 to-yellow-500 hover:from-sats-orange-400 hover:to-yellow-400 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </Link>
          ) : (
            <div className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-black text-sm">
              <Crown className="w-4 h-4" />
              Unlimited Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
