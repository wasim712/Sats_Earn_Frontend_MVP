'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReferralHero from '@/components/user/referrals/ReferralHero';
import ReferralStats from '@/components/user/referrals/ReferralStats';
import ReferralList from '@/components/user/referrals/ReferralList';
import ReferralLimits from '@/components/user/referrals/ReferralLimits';
import ReferralTierCommission from '@/components/user/referrals/ReferralTierCommission';
import { fetchUserReferrals } from '@/features/user/userReferralsSlice';

export default function ReferralsPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.userReferrals);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserReferrals());
  }, [dispatch]);

  // Determine if the user is on a free tier 
  // (Basic, Copper, Bronze, Silver, Gold are the free tiers based on your previous config)
  const freeTiers = ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD'];
  const activeTier = (data?.activeTier || user?.activeTier || 'BASIC').toUpperCase();
  const TIER_COMMISSION: Record<string, number> = {
  BASIC: 5, COPPER: 5, BRONZE: 5, SILVER: 5, GOLD: 5,
  PLATINUM: 10, DIAMOND: 15, CROWN: 20, ELITE: 25, FOUNDER: 30,
  };
  const activeCommission = TIER_COMMISSION[activeTier] ?? 5;
  const isFreeTier = freeTiers.includes(activeTier);

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-pulse pb-20 p-2 md:p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
        {/* Header Skeleton */}
        <div>
          <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl mb-3"></div>
          <div className="h-5 w-72 bg-[#1a1a1a] rounded-lg"></div>
        </div>

        {/* ReferralHero Skeleton (Perfectly matches ReferralHero layout) */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 space-y-8">
          {/* Top Row: Title & Quick Shares */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-[#1a1a1a] rounded-lg"></div>
              <div className="h-4 w-64 bg-[#1a1a1a] rounded-md"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-16 bg-[#1a1a1a] rounded mr-2"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
            </div>
          </div>
          {/* Bottom Row: Link Box & Code Box */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
            <div className="flex-1 h-[56px] bg-[#050505] border border-[#1a1a1a] rounded-2xl"></div>
            <div className="h-[56px] w-full lg:w-[220px] bg-[#1a1a1a] rounded-2xl"></div>
          </div>
        </div>

        {/* ReferralStats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-[120px] bg-black border border-[#1a1a1a] rounded-3xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="h-8 w-12 bg-[#1a1a1a] rounded-lg"></div>
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              </div>
              <div className="h-3 w-28 bg-[#1a1a1a] rounded-md mt-auto"></div>
            </div>
          ))}
        </div>

        {/* ReferralLimits Skeleton (Matches the visual weight of the limit box) */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[100px]">
          <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] shrink-0"></div>
            <div className="space-y-2 w-full">
              <div className="flex gap-3 items-center">
                <div className="h-5 w-32 bg-[#1a1a1a] rounded-md"></div>
                <div className="h-5 w-14 bg-[#1a1a1a] rounded-full"></div>
              </div>
              <div className="h-3 w-full max-w-[300px] bg-[#1a1a1a] rounded-md"></div>
              <div className="h-3 w-[200px] bg-[#1a1a1a] rounded-md md:hidden"></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-2 w-full md:w-48">
               <div className="h-2 w-full bg-[#1a1a1a] rounded-full"></div>
            </div>
            <div className="w-full md:w-28 h-10 bg-[#1a1a1a] rounded-xl shrink-0"></div>
          </div>
        </div>

        {/* ReferralList Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-7 w-40 bg-[#1a1a1a] rounded-lg"></div>
          <div className="h-64 w-full bg-black border border-[#1a1a1a] rounded-[28px]"></div>
        </div>
      </div>
    );
  }

  const referralUrl = `https://sats-earn-frontend.vercel.app/signup?ref=${data.referralCode}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-2 md:p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Referrals</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">Invite friends and earn 5% of their lifetime rewards.</p>
      </div>

      <ReferralHero code={data.referralCode} url={referralUrl} activeTier={activeTier} tierCommission={activeCommission}/>

      <div className="rounded-[24px] border border-sky-500/20 bg-sky-500/10 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-[#0b1220] text-sky-300">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-200/90">Active Referral Rule</p>
            <h2 className="mt-1 text-lg font-black text-white">Referral income unlocks after 10 active days</h2>
            <p className="mt-2 text-sm leading-7 text-sky-100/80">
              A referred user must be active on at least <strong className="text-white">10 different days in the last 30 days</strong>
              {' '}to count as active. Only active referrals generate referral income based on your current tier.
            </p>
          </div>
        </div>
      </div>

      <ReferralStats stats={data.stats} />

      <ReferralLimits
        currentReferrals={data.stats?.totalInvited || 0}
        isFreeTier={isFreeTier}
        activeTier={activeTier}
      />
      <ReferralTierCommission activeTier={activeTier} />

      <ReferralList list={data.referralsList} />
    </div>
  );
}
