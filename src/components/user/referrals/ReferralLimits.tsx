'use client';

import React from 'react';
import { Users, Crown, Info } from 'lucide-react';
import Link from 'next/link';

const FREE_TIER_USER_LIMITS: Record<string, number> = {
  BASIC: 20,
  COPPER: 40,
  BRONZE: 60,
  SILVER: 80,
  GOLD: 100,
};

interface ReferralLimitsProps {
  currentReferrals: number;
  limit?: number;
  isFreeTier: boolean;
  activeTier: string;
}

export default function ReferralLimits({ currentReferrals, limit = 20, isFreeTier, activeTier }: ReferralLimitsProps) {
  const normalizedTier = (activeTier || 'BASIC').toUpperCase();
  const resolvedLimit = isFreeTier ? (FREE_TIER_USER_LIMITS[normalizedTier] || limit) : limit;
  const safeCurrentReferrals = Math.max(0, Number(currentReferrals || 0));
  const progress = isFreeTier ? Math.min((safeCurrentReferrals / resolvedLimit) * 100, 100) : 100;
  const isAtLimit = isFreeTier && safeCurrentReferrals >= resolvedLimit;
  const remainingReferrals = Math.max(resolvedLimit - safeCurrentReferrals, 0);

  const progressTitle = isFreeTier
    ? (isAtLimit ? 'Limit Reached' : 'Referral Capacity')
    : 'Unlimited Referrals';

  const progressMessage = isFreeTier
    ? (isAtLimit
        ? `You have used all ${resolvedLimit} referral slots.`
        : `${remainingReferrals} referral ${remainingReferrals === 1 ? 'slot' : 'slots'} remaining on ${normalizedTier}.`)
    : 'Grow your network without limits';

  const cardBorderColor = isFreeTier ? (isAtLimit ? 'border-[#ff3333]/30' : 'border-[#ff3333]/20') : 'border-[#00e676]/20';
  const glowColor = isFreeTier ? 'bg-[#ff3333]/5' : 'bg-[#00e676]/5';
  const iconBg = isFreeTier ? 'bg-[#ff3333]/5 border-[#ff3333]/20 text-[#ff3333]' : 'bg-[#00e676]/5 border-[#00e676]/20 text-[#00e676]';
  const progressColor = isFreeTier ? 'bg-[#ff3333] shadow-[0_0_10px_rgba(255,51,51,0.5)]' : 'bg-[#00e676] shadow-[0_0_10px_rgba(0,230,118,0.3)]';
  const tagColor = isFreeTier ? 'text-[#ff3333] border-[#ff3333]/20' : 'text-[#00e676] border-[#00e676]/20';
  const labelColor = isFreeTier ? 'text-[#ff3333]' : 'text-[#00e676]';

  return (
    <div className={`relative bg-[#050505] rounded-3xl p-6 sm:p-8 overflow-hidden group transition-all duration-300 border ${cardBorderColor}`}>
      <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-500 ${glowColor}`} />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 xl:gap-12">
        <div className="flex flex-row sm:flex-row items-start gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${iconBg}`}>
            {isFreeTier ? <Info className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>

          <div className="pt-1">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-2 flex items-center gap-3 flex-wrap">
              {isFreeTier ? 'Free Tier Limit' : 'Premium Referral Access'}
              <span className={`px-3 py-0.5 rounded-full border text-[11px] font-bold tracking-widest ${tagColor}`}>
                {isFreeTier ? `${safeCurrentReferrals} / ${resolvedLimit}` : `${activeTier} · NO CAP`}
              </span>
            </h3>
            <p className="text-[14px] md:text-[15px] text-gray-400 font-medium max-w-xl leading-relaxed">
              {isFreeTier ? (
                <>
                  Free-tier accounts can invite up to {resolvedLimit} friends on the <strong className="text-white font-bold font-normal">{normalizedTier}</strong> tier. Upgrade to a premium tier to unlock <strong className="text-[#ff3333] font-bold font-normal">unlimited referrals</strong> and maximize your passive earning potential.
                </>
              ) : (
                <>
                  Your <strong className="text-[#00e676] font-bold font-normal">{activeTier}</strong> tier has <strong className="font-bold text-white font-normal">no referral limit</strong>, so you can grow your network without a cap.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:min-w-[400px] shrink-0 w-full xl:w-auto mt-2 xl:mt-0">
          <div className="w-full space-y-3">
            <div className="flex justify-between items-end">
              <span className={`text-xs font-bold uppercase tracking-widest ${labelColor}`}>
                {progressTitle}
              </span>
              <span className="text-sm font-bold text-white">
                {isFreeTier ? `${progress.toFixed(0)}%` : '∞'}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className={`w-2 h-2 rounded-full ${isFreeTier ? 'bg-[#ff3333]' : 'bg-[#00e676]'}`} />
              <span className="text-sm text-gray-400 font-medium">
                {progressMessage}
              </span>
            </div>
          </div>

          {isFreeTier ? (
            <Link
              href="/user/rewards"
              className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-base transition-all shadow-[0_0_20px_rgba(249,115,22,0.15)] active:scale-[0.98]"
            >
              <Crown className="w-5 h-5" />
              Upgrade
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[#00e676]/30 bg-[#00e676]/10 text-[#00e676] font-bold text-base">
              <Crown className="w-5 h-5" />
              Unlimited Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
