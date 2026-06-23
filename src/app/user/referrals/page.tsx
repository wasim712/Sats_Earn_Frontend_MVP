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
        <div className="pl-2">
          <div className="h-[36px] sm:h-[40px] w-48 bg-[#1a1a1a] rounded-xl mb-[6px]"></div>
          <div className="h-5 sm:h-6 w-72 bg-[#1a1a1a] rounded-lg mt-1.5"></div>
        </div>

        {/* ReferralHero Skeleton */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-[#1a1a1a] rounded-lg"></div>
              <div className="h-4 w-[280px] sm:w-[350px] bg-[#1a1a1a] rounded-md"></div>
              <div className="h-7 w-40 bg-[#1a1a1a] rounded-full mt-2"></div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-3 w-16 bg-[#1a1a1a] rounded mr-2"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
            <div className="flex-1 h-[56px] bg-[#050505] border border-[#1a1a1a] rounded-2xl"></div>
            <div className="h-[56px] w-full lg:w-[260px] bg-[#050505] border border-[#1a1a1a] rounded-2xl shrink-0"></div>
          </div>
          <div className="flex items-center gap-3 lg:hidden mt-4">
            <div className="h-3 w-16 bg-[#1a1a1a] rounded mr-2"></div>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
          </div>
        </div>

        {/* ReferralStats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-[156px] rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="h-3 w-20 bg-[#1a1a1a] rounded mt-1"></div>
                <div className="h-11 w-11 rounded-[14px] bg-[#1a1a1a] shrink-0"></div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-auto">
                <div className="h-[40px] w-16 sm:w-20 bg-[#1a1a1a] rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ReferralLimits Skeleton */}
        <div className="bg-[#050505] rounded-3xl p-6 sm:p-8 border border-[#1a1a1a] min-h-[140px]">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 xl:gap-12">
            <div className="flex flex-row sm:flex-row items-start gap-5 w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#111] shrink-0 border border-[#1a1a1a]"></div>
              <div className="pt-1 w-full max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[28px] w-64 bg-[#1a1a1a] rounded-lg"></div>
                  <div className="h-5 w-24 bg-[#111] rounded-full border border-[#1a1a1a]"></div>
                </div>
                <div className="h-[20px] w-full bg-[#111] rounded mb-2"></div>
                <div className="h-[20px] w-4/5 bg-[#111] rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-6 xl:min-w-[400px] shrink-0 w-full xl:w-auto mt-2 xl:mt-0">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-end">
                  <div className="h-[16px] w-32 bg-[#1a1a1a] rounded"></div>
                  <div className="h-[20px] w-16 bg-[#1a1a1a] rounded"></div>
                </div>
                <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ReferralTierCommission Skeleton */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-[32px] p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#1a1a1a] shrink-0"></div>
            <div>
              <div className="h-7 w-56 bg-[#1a1a1a] rounded-lg mb-2.5"></div>
              <div className="h-4 w-[280px] sm:w-96 max-w-full bg-[#111] rounded"></div>
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-20 bg-[#1a1a1a] rounded"></div>
                <div className="h-px flex-1 bg-white/[0.05]"></div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`free-${i}`} className="rounded-[24px] border border-white/5 bg-[#111] p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="h-4.5 w-4.5 rounded bg-[#222]"></div>
                      <div className="h-4 w-16 rounded bg-[#222]"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-8 w-12 bg-[#222] rounded mb-1.5"></div>
                      <div className="h-3 w-20 bg-[#1a1a1a] rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-24 bg-[#1a1a1a] rounded"></div>
                <div className="h-px flex-1 bg-white/[0.05]"></div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`prem-${i}`} className="rounded-[24px] border border-white/5 bg-[#111] p-5">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="h-4.5 w-4.5 rounded bg-[#222]"></div>
                      <div className="h-4 w-20 rounded bg-[#222]"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-8 w-16 bg-[#222] rounded mb-1.5"></div>
                      <div className="h-3 w-24 bg-[#1a1a1a] rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box Skeleton */}
        <div className="rounded-[24px] border border-[#1a1a1a] bg-[#050505] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 shrink-0 rounded-2xl border border-[#1a1a1a] bg-[#111]"></div>
            <div className="w-full">
              <div className="h-3 w-32 bg-[#1a1a1a] rounded mt-1 mb-2"></div>
              <div className="h-6 w-56 sm:w-64 bg-[#1a1a1a] rounded mb-3"></div>
              <div className="h-4 w-full max-w-2xl bg-[#111] rounded mb-1.5"></div>
              <div className="h-4 w-3/4 max-w-xl bg-[#111] rounded"></div>
            </div>
          </div>
        </div>

        {/* ReferralList Skeleton */}
        <div className="bg-black border border-[#1a1a1a] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
            <div className="h-7 w-40 bg-[#1a1a1a] rounded-lg"></div>
            <div className="h-8 w-24 bg-[#1a1a1a] rounded-lg"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={`list-${i}`} className="h-[72px] bg-[#0a0a0a] rounded-2xl border border-white/5"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const referralUrl = `https://satsearn.app/?ref=${data.referralCode}`;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-2 md:p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
      <div className='pl-2'>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight ">Referrals</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">Invite friends and earn 5% of their lifetime rewards.</p>
      </div>

      <ReferralHero code={data.referralCode} url={referralUrl} activeTier={activeTier} tierCommission={activeCommission}/>


      <ReferralStats stats={data.stats} />

      <ReferralLimits
        currentReferrals={data.stats?.totalInvited || 0}
        isFreeTier={isFreeTier}
        activeTier={activeTier}
      />
      <ReferralTierCommission activeTier={activeTier} />

      <div className="rounded-[24px] border border-sky-500/20 bg-sky-500/10 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-[#0b1220] text-sky-300">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-200/90">Referral Activity Status</p>
            <h2 className="mt-1 text-lg font-black text-white">Active status tracks engagement</h2>
            <p className="mt-2 text-sm leading-7 text-sky-100/80">
              A referred user must be active on at least <strong className="text-white">10 different days in the last 30 days</strong>
              {' '}to count as active. This active or inactive label is shown for engagement tracking only and does not block referral rewards.
            </p>
          </div>
        </div>
      </div>
      <ReferralList list={data.referralsList} />
    </div>
  );
}
