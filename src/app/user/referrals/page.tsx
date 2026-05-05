'use client';

import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ReferralHero from '@/components/user/referrals/ReferralHero';
import ReferralStats from '@/components/user/referrals/ReferralStats';
import ReferralList from '@/components/user/referrals/ReferralList';
import { fetchUserReferrals } from '@/features/user/userReferralsSlice';

export default function ReferralsPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.userReferrals);

  useEffect(() => {
    dispatch(fetchUserReferrals());
  }, [dispatch]);

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
      <div className="space-y-8 animate-pulse pb-20 p-2 md:p-4 lg:p-6">
        <div>
          <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl mb-3"></div>
          <div className="h-5 w-72 bg-[#1a1a1a] rounded-lg"></div>
        </div>
        <div className="h-48 w-full bg-sats-black-950 border border-[#1a1a1a] rounded-[28px]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 bg-sats-black-950 border border-[#1a1a1a] rounded-3xl"></div>
          ))}
        </div>
        <div className="h-64 w-full bg-sats-black-950 border border-[#1a1a1a] rounded-[28px]"></div>
      </div>
    );
  }

  const referralUrl = `https://sats-earn-frontend.vercel.app/signup?ref=${data.referralCode}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-2 md:p-4 lg:p-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Referrals</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">Invite friends and earn 5% of their lifetime rewards.</p>
      </div>

      <ReferralHero code={data.referralCode} url={referralUrl} />
      <ReferralStats stats={data.stats} />
      <ReferralList list={data.referralsList} />
    </div>
  );
}
