'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { syncUserTier, updateOnboardingState } from '@/features/auth/authSlice';
import { AlertTriangle, Flame, Star, Wallet, Zap, Clock4, TrendingUp, LockKeyhole, Shield, Coins, Medal, Trophy, CircleStar, Gem, Crown, Sparkles, Rocket } from 'lucide-react';

import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { fetchUserNotifications } from '@/features/user/userNotificationsSlice';
import { fetchUserLeaderboard } from '@/features/user/userLeaderboardSlice';
import { OnboardingTour, TourButton, useOnboarding } from '@/components/user/dashboard/onboardingFlow';
import { DashboardLowerGrid, StreakSection } from '@/components/user/dashboard/DashboardSections';

const ONBOARDING_CONGRATS_SEEN_KEY = 'satsearn_onboarding_congrats_seen';

function OnboardingCongratsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-sats-orange-500/20 bg-[#080808] shadow-[0_24px_100px_rgba(0,0,0,0.65)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.22),transparent_60%)]" />
        <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-8 text-center">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-[22px] border border-sats-orange-500/20 bg-sats-orange-500/10 text-sats-orange-400 shadow-[0_0_28px_rgba(249,115,22,0.18)]">
            <Trophy className="h-8 w-8" />
          </div>
          <div className="mb-3 inline-flex items-center rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-300">
            Onboarding Complete
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Congratulations!</h2>
          <p className="mt-4 text-base leading-8 text-gray-300 sm:text-lg">
            You have completed the onboarding flow and are ready to start earning on SatsEarn.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sats-orange-500 to-amber-400 px-6 text-sm font-black text-black shadow-[0_12px_28px_rgba(249,115,22,0.24)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Earning
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const { isOpen: isTourOpen, openTour, closeTour, hideSkip } = useOnboarding();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useAppSelector((state) => state.userDashboard);
  const { notifications } = useAppSelector((state) => state.userNotifications);
  const { data: leaderboardData } = useAppSelector((state) => state.userLeaderboard);
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasAutoOpenedOnboarding, setHasAutoOpenedOnboarding] = useState(false);

  // Sats to BTC Converter State (Only applies to Available Balance)
  const [showBtc, setShowBtc] = useState(false);
  // Fiat Currency Converter State (INR or USD)
  const [fiatCurrency, setFiatCurrency] = useState<'INR' | 'USD'>('INR');
  const isIndiaUser = user?.country?.trim().toLowerCase() === 'india';

  useEffect(() => {
    dispatch(fetchUserDashboard());
    dispatch(fetchUserNotifications());
    dispatch(fetchUserLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (!data?.gamification?.activeTier) return;
    dispatch(syncUserTier({
      activeTier: data.gamification.activeTier,
      isPremium: data.gamification.isPremium,
      premiumExpiresAt: data.gamification.premiumExpiresAt || null,
    }));
  }, [data?.gamification?.activeTier, data?.gamification?.isPremium, data?.gamification?.premiumExpiresAt, dispatch]);

  const shouldShowOnboarding = Boolean(
    user && user.hasCompletedOnboarding === false && user.hasSkippedOnboarding === false,
  );

  useEffect(() => {
    if (!shouldShowOnboarding || hasAutoOpenedOnboarding) return;
    openTour({ hideSkip: true });
    setHasAutoOpenedOnboarding(true);
  }, [shouldShowOnboarding, hasAutoOpenedOnboarding, openTour]);

  // --- HELPERS ---
  const getFirstName = () => {
    return user?.fullName ? user.fullName.split(' ')[0].charAt(0).toUpperCase() + user.fullName.split(' ')[0].slice(1) : 'Earner';
  };

  const getTierPillIcon = (tier: string) => {
    switch ((tier || 'BASIC').toUpperCase()) {
      case 'BASIC':
        return <Shield className="w-4 h-4 text-gray-400" />;
      case 'COPPER':
        return <Coins className="w-4 h-4 text-[#b87333]" />;
      case 'BRONZE':
        return <Medal className="w-4 h-4 text-[#cd7f32]" />;
      case 'SILVER':
        return <Star className="w-4 h-4 text-[#C0C0C0]" />;
      case 'GOLD':
        return <Trophy className="w-4 h-4 text-[#FFD700]" />;
      case 'PLATINUM':
        return <CircleStar className="w-4 h-4 text-[#e5e4e2]" />;
      case 'DIAMOND':
        return <Gem className="w-4 h-4 text-[#b9f2ff]" />;
      case 'CROWN':
        return <Crown className="w-4 h-4 text-[#ffb347]" />;
      case 'ELITE':
        return <Sparkles className="w-4 h-4 text-[#8a2be2]" />;
      case 'FOUNDER':
        return <Rocket className="w-4 h-4 text-[#ff4500]" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatCompactXp = (xp: number | null | undefined) => {
    const value = Number(xp || 0);

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }

    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    }

    return value.toLocaleString();
  };

  const formatPendingSats = (pendingSats?: number, pendingMsats?: number) => {
    const wholeSats = Number(pendingSats || 0);
    const msats = Number(pendingMsats || 0);
    const total = wholeSats + msats / 1000;

    if (msats > 0 && total < 1) {
      return total.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    }

    if (msats > 0) {
      return total.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    }

    return wholeSats.toLocaleString();
  };

  const getAvailableSatsValue = () => {
    return Number(data?.balances?.available || 0) + (Number(data?.balances?.availableMsats || 0) / 1000);
  };
  
  const formatAvailableBalance = (sats: number) => {
    if (showBtc) {
      return (
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl sm:text-2xl xl:text-3xl font-black tracking-tight`}>{(sats / 100000000).toFixed(8)}</span>
          <span className="text-2xl font-bold text-gray-300 mb-1">BTC</span>
        </div>
      );
    }

    const [wholePart, decimalPart = '00'] = sats
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })
      .split('.');

    return (
      <div className="flex items-baseline ">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight`}>{wholePart}</span>
        <span className={`text-2xl font-bold text-gray-400 mb-1 ${sats > 1000000 ? 'hidden' : ''}`}>.{decimalPart}</span>
        <span className="text-2xl font-bold text-white ml-1 mb-1">sats</span>
      </div>
    );
  };

  const getFiatValue = (sats: number) => {
    const btcAmount = sats / 100000000;
    const btcPriceUsd = Number(data?.balances?.btcPriceUsd);

    if (!Number.isFinite(btcPriceUsd) || btcPriceUsd <= 0) {
      return !isIndiaUser || fiatCurrency === 'USD' ? '≈ $0.00 USD' : '≈ ₹0.00 INR';
    }

    if (!isIndiaUser || fiatCurrency === 'USD') {
      const usdValue = btcAmount * btcPriceUsd;
      return `≈ $${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    } else {
      const inrValue = btcAmount * btcPriceUsd * 83.34;
      return `≈ ₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR`;
    }
  };

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // SKELETON LOADER
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  if (isLoading || !data || !data.balances || !data.gamification) {
    return (
      <div className="space-y-8 animate-pulse pb-20 w-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="h-10 w-64 rounded-xl bg-[#111] mb-3" />
            <div className="h-5 w-56 rounded-lg bg-[#0d0d0d]" />
          </div>

          <div className="md:flex flex-wrap items-center gap-3 hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-32 rounded-full border border-[#2a2a2a] bg-[#111]" />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 md:hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-25 rounded-full border border-[#2a2a2a] bg-[#111]" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-1 rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#232323] bg-[linear-gradient(180deg,#151515_0%,#101010_100%)] shadow-[0_0_20px_rgba(255,255,255,0.02)]" />
                <div className="h-4 w-28 rounded bg-[linear-gradient(90deg,#171717_0%,#1f1f1f_50%,#171717_100%)]" />
              </div>
              <div className="h-9 w-20 rounded-full border border-[#232323] bg-[linear-gradient(180deg,#101010_0%,#0a0a0a_100%)]" />
            </div>
            <div className="h-10 w-40 rounded-xl bg-[linear-gradient(90deg,#1b1b1b_0%,#252525_50%,#1b1b1b_100%)] mb-3" />
            <div className="h-4 w-28 rounded bg-[linear-gradient(90deg,#131313_0%,#1a1a1a_50%,#131313_100%)] mb-6" />
            <div className="flex gap-2">
              <div className="h-8 w-16 rounded-full bg-[linear-gradient(90deg,#121212_0%,#1a1a1a_50%,#121212_100%)]" />
              <div className="h-8 w-20 rounded-full bg-[linear-gradient(90deg,#121212_0%,#1a1a1a_50%,#121212_100%)]" />
            </div>
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[#232323] bg-[linear-gradient(180deg,#151515_0%,#101010_100%)] shadow-[0_0_20px_rgba(255,255,255,0.02)]" />
                  <div className="h-4 w-24 rounded bg-[linear-gradient(90deg,#171717_0%,#1f1f1f_50%,#171717_100%)]" />
                </div>
              </div>
              <div className="h-9 w-32 rounded-xl bg-[linear-gradient(90deg,#1b1b1b_0%,#252525_50%,#1b1b1b_100%)] mb-3" />
              <div className="h-4 w-24 rounded bg-[linear-gradient(90deg,#131313_0%,#1a1a1a_50%,#131313_100%)] mb-6" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
                <div className="h-3 w-4/5 rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="h-6 w-40 rounded bg-[linear-gradient(90deg,#171717_0%,#212121_50%,#171717_100%)] mb-2" />
              <div className="h-4 w-56 rounded bg-[linear-gradient(90deg,#121212_0%,#1a1a1a_50%,#121212_100%)]" />
            </div>
            <div className="h-10 w-28 rounded-xl border border-[#232323] bg-[linear-gradient(180deg,#121212_0%,#0c0c0c_100%)]" />
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-3 text-center">
                <div className="h-3 w-8 mx-auto rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
                <div className="w-10 h-10 mx-auto rounded-full border border-[#202020] bg-[linear-gradient(180deg,#151515_0%,#101010_100%)]" />
                <div className="h-3 w-6 mx-auto rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-6 w-44 rounded bg-[linear-gradient(90deg,#171717_0%,#212121_50%,#171717_100%)] mb-2" />
                <div className="h-4 w-64 rounded bg-[linear-gradient(90deg,#121212_0%,#1a1a1a_50%,#121212_100%)]" />
              </div>
              <div className="h-9 w-24 rounded-xl border border-[#232323] bg-[linear-gradient(180deg,#121212_0%,#0c0c0c_100%)]" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-[#151515] bg-[#080808] p-4 shadow-[0_0_18px_rgba(255,255,255,0.015)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-[#202020] bg-[linear-gradient(180deg,#151515_0%,#101010_100%)]" />
                    <div>
                      <div className="h-4 w-48 rounded bg-[linear-gradient(90deg,#171717_0%,#202020_50%,#171717_100%)] mb-2" />
                      <div className="h-3 w-28 rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
                    </div>
                  </div>
                  <div className="h-4 w-20 rounded bg-[linear-gradient(90deg,#171717_0%,#202020_50%,#171717_100%)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.015)]">
            <div className="h-6 w-36 rounded bg-[linear-gradient(90deg,#171717_0%,#212121_50%,#171717_100%)] mb-2" />
            <div className="h-4 w-44 rounded bg-[linear-gradient(90deg,#121212_0%,#1a1a1a_50%,#121212_100%)] mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#151515] bg-[#080808] p-4 shadow-[0_0_18px_rgba(255,255,255,0.015)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-24 rounded bg-[linear-gradient(90deg,#171717_0%,#202020_50%,#171717_100%)]" />
                    <div className="h-4 w-12 rounded bg-[linear-gradient(90deg,#171717_0%,#202020_50%,#171717_100%)]" />
                  </div>
                  <div className="h-3 w-full rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)] mb-2" />
                  <div className="h-3 w-3/4 rounded bg-[linear-gradient(90deg,#111111_0%,#1a1a1a_50%,#111111_100%)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // CALCULATED VALUES
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  const totalLifetimeEarned = getAvailableSatsValue() + (data.balances?.locked || 0) + Number(data.balances?.pending || 0) + (Number(data.balances?.pendingMsats || 0) / 1000);
  const currentStreak = data.gamification?.currentStreak || 0;
  const activeTier = data.gamification?.activeTier || 'Basic';
  const currentLevel = data.gamification?.level || 1;
  const userXp = data.gamification?.totalXp;
  const unreadStreakReward = notifications.find(
    (notification) => !notification.isRead && notification.title.toLowerCase().includes('streak milestone reward unlocked'),
  );
  const streakData = data.gamification?.streak;
  const streakMilestones = streakData?.milestones || [];
  const lastClaimedStreakMilestone = streakData?.lastClaimedMilestone || data.gamification?.lastClaimedStreakMilestone || 0;
  const nextStreakMilestone = streakData?.nextMilestone || null;
  const nextStreakRewardSats = streakData?.nextRewardSats || 0;
  const streakProgressPercent = streakData?.progressPercent || 0;
  const daysRemainingToNextMilestone = streakData?.daysRemaining || 0;
  const totalClaimedMilestones = streakData?.claimedMilestonesCount || 0;
  const totalStreakMilestones = streakData?.totalMilestones || streakMilestones.length;

  const monthlyTopEarners = (leaderboardData?.monthly || []).slice(0, 5);

  const handleTourFinish = async () => {
    const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/users/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Failed to complete onboarding');
    }

    dispatch(updateOnboardingState(payload));

    let shouldOpenCongrats = false;
    if (typeof window !== 'undefined') {
      const alreadySeen = localStorage.getItem(ONBOARDING_CONGRATS_SEEN_KEY) === 'true';
      if (!alreadySeen) {
        localStorage.setItem(ONBOARDING_CONGRATS_SEEN_KEY, 'true');
        shouldOpenCongrats = true;
      }
    }

    setShowCongrats(shouldOpenCongrats);
  };

  const handleTourSkip = async () => {
    const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/users/onboarding/skip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Failed to skip onboarding');
    }

    dispatch(updateOnboardingState(payload));
  };

  return (
    <>
      <OnboardingTour isOpen={isTourOpen} onClose={closeTour} referralCode={user?.referralCode || ''} hideSkip={hideSkip} onSkip={handleTourSkip} onFinish={handleTourFinish} />
      <OnboardingCongratsModal isOpen={showCongrats} onClose={() => setShowCongrats(false)} />
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      
      {/* â”€â”€â”€ 1. HEADER & TOP BADGES â”€â”€â”€ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="text-blue-400">{getFirstName()}</span>!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium flex items-center gap-2">
            Let&apos;s earn some rewards today <span className="text-lg">
🎯</span>
          </p>
        </div>

        <div className="flex  items-center gap-3">
          <div className=" inline">
            <TourButton onClick={openTour} variant="pill" />
          </div>
          <div className="relative hidden md:flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            {unreadStreakReward && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />}
            <Flame className="w-4 h-4 text-sats-orange-500" />
            <span className="text-xs text-nowrap  font-bold text-white">{currentStreak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-nowrap font-bold text-white">XP {formatCompactXp(userXp)}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            {getTierPillIcon(activeTier)}
            <span className="text-xs  text-nowrap font-bold text-white capitalize">{activeTier} <span className='hidden sm:inline'>Tier</span> </span>
          </div>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs  text-nowrap  font-bold text-white">Lvl {currentLevel}</span>
          </div>
        </div>
      </div>

      {/* â”€â”€â”€ 2. STATS GRID (4 Cards) â”€â”€â”€ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Main Balance (The Blue/Orange one from the design) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#1c2e4a] via-[#101b30] to-[#050505] border border-blue-500/20 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] transition-all duration-300">
  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-all" />
  
  {/* ROW 1: Icon and Toggle Only */}
  <div className="flex justify-between items-center mb-6 relative z-10 w-full">
    
    {/* Wallet Icon */}
    <div className="w-12 h-12 rounded-[14px] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
      <Wallet className="w-6 h-6 text-blue-400" />
    </div>

    {/* Premium BTC Toggle */}
    <button
      type="button"
      onClick={() => setShowBtc((prev) => !prev)}
      aria-label={`Switch balance display to ${showBtc ? 'sats' : 'BTC'}`}
      className="flex bg-[#050505]/50 border border-blue-500/20 rounded-full p-1 backdrop-blur-sm shrink-0"
    >
      <span
        className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${!showBtc ? 'bg-sats-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
      >
        <Zap className="w-3.5 h-3.5" />
      </span>
      <span
        className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${showBtc ? 'bg-sats-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
      >
        ₿
      </span>
    </button>
  </div>
  
  {/* ROW 2: Balance Data */}
  <div className="relative z-10 mt-auto">
    <p className="font-bold text-blue-200/80 uppercase tracking-widest text-[11px] mb-2">Available Balance</p>
    
    <div className="text-white mb-2 drop-shadow-md">
      {formatAvailableBalance(getAvailableSatsValue())}
    </div>
    
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm font-medium text-blue-200/60 truncate pr-2">
        {getFiatValue(getAvailableSatsValue())}
      </p>

      {isIndiaUser ? (
        <button
          onClick={() => setFiatCurrency(fiatCurrency === 'INR' ? 'USD' : 'INR')}
          className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-[#050505]/50 border border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-500/30 hover:border-blue-400 transition-all text-xs font-black shadow-sm backdrop-blur-sm"
          title={`Switch to ${fiatCurrency === 'INR' ? 'USD' : 'INR'}`}
        >
          {fiatCurrency === 'INR' ? '$' : '₹'}
        </button>
      ) : null}
    </div>
  </div>
</div>

        
        {/* Card 2: pending */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Clock4 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Pending sats</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{formatPendingSats(data.balances?.pending, data.balances?.pendingMsats)} <span className='text-2xl'>sats</span></h3>
            <p className="text-sm font-bold text-gray-600 mt-1">Pending amount</p>
          </div>
        </div>

        {/* Card 3: Locked Balance */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <LockKeyhole className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Locked Balance</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{(data.balances?.locked || 0).toLocaleString()} <span className='text-2xl'> sats</span></h3>
            <p className="text-sm font-bold text-gray-600 mt-1">Pending Verification</p>
          </div>
        </div>
        {/* Card 4: Total Earned */}
        <div className="bg-[#080808] overflow-hidden border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Earned</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{totalLifetimeEarned.toLocaleString()}
              <span className="text-2xl font-bold text-white ml-1 mb-1">sats</span></h3>
              
            <p className="text-sm font-bold text-gray-600 mt-1">Lifetime sats</p>
          </div>
        </div>


      </div>

      {/* 3. STREAK MILESTONES */}
      <StreakSection
        unreadStreakReward={unreadStreakReward}
        isPremium={Boolean(data.gamification?.isPremium)}
        currentStreak={currentStreak}
        nextStreakMilestone={nextStreakMilestone}
        nextStreakRewardSats={nextStreakRewardSats}
        daysRemainingToNextMilestone={daysRemainingToNextMilestone}
        totalClaimedMilestones={totalClaimedMilestones}
        totalStreakMilestones={totalStreakMilestones}
        streakProgressPercent={streakProgressPercent}
        lastClaimedStreakMilestone={lastClaimedStreakMilestone}
        streakMilestones={streakMilestones}
      />

      {/* 4. BOTTOM GRID (Submissions & Extras) */}
      <DashboardLowerGrid
        dashboard={data}
        monthlyTopEarners={monthlyTopEarners}
      />
      </div>
    </>
  );
}

