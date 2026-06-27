'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPremiumInterests,
  fetchUserProfile,
  submitPremiumInterest,
  upgradePremiumUsingSats,
} from '@/features/user/userProfileSlice';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleStar,
  Coins,
  Crown,
  Gem,
  Info,
  Lock,
  Medal,
  MedalIcon,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { PremiumRewardCard } from './PremiumRewardCard';
import { FadeUp } from '@/components/animations/FadeUp';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type PremiumTierName = 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER';
type BillingCycle = 'MONTHLY' | 'YEARLY';

const PREMIUM_TIER_ORDER: PremiumTierName[] = ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
const FREE_STREAK_DAYS = new Set([7, 21, 60]);

const PREMIUM_TIERS = [
  {
    name: 'PLATINUM' as const,
    label: 'Platinum',
    shortLabel: 'PLT',
    oldSatsMonthly: '6682',
    oldSatsYearly: '80187',
    oldUsdYearly: '$59.88',
    monthlyUsd: '$4.99',
    monthlyUsdOriginal: '$9.99',
    yearlyUsd: '$54.99',
    yearlyUsdOriginal: '$59.88',
    icon: <CircleStar className="w-6 h-6 text-[#e5e4e2]" />,
    color: 'text-[#e5e4e2]',
    border: 'border-[#e5e4e2]/30',
    bg: 'from-[#e5e4e2]/15 via-[#131313] to-[#080808]',
    glow: 'shadow-[0_0_36px_rgba(229,228,226,0.06)] hover:shadow-[0_0_40px_rgba(229,228,226,0.12)]',
    chip: 'bg-[#e5e4e2]/10 text-[#f3f2f1] border-[#e5e4e2]/25',
    planPerks: {
      MONTHLY: ['2× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
      YEARLY: ['2× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
    },
  },
  {
    name: 'DIAMOND' as const,
    label: 'Diamond',
    shortLabel: 'DMD',
    oldSatsMonthly: '9361',
    oldSatsYearly: '112332',
    oldUsdYearly: '$83.88',
    monthlyUsd: '$6.99',
    monthlyUsdOriginal: '$8.98',
    yearlyUsd: '$76.99',
    yearlyUsdOriginal: '$83.88',
    icon: <Gem className="w-6 h-6 text-[#b9f2ff]" />,
    color: 'text-[#b9f2ff]',
    border: 'border-[#b9f2ff]/30',
    bg: 'from-[#b9f2ff]/15 via-[#0d1117] to-[#080808]',
    glow: 'shadow-[0_0_36px_rgba(185,242,255,0.08)] hover:shadow-[0_0_40px_rgba(185,242,255,0.15)]',
    chip: 'bg-[#b9f2ff]/10 text-[#dffaff] border-[#b9f2ff]/25',
    planPerks: {
      MONTHLY: ['3× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
      YEARLY: ['3× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
    },
  },
  {
    name: 'CROWN' as const,
    label: 'Crown',
    shortLabel: 'CRN',
    oldSatsMonthly: '13378',
    oldSatsYearly: '160536',
    oldUsdYearly: '$119.88',
    monthlyUsd: '$9.99',
    monthlyUsdOriginal: '$13.98',
    yearlyUsd: '$109.99',
    yearlyUsdOriginal: '$119.88',
    icon: <Crown className="w-6 h-6 text-[#ffb347]" />,
    color: 'text-[#ffb347]',
    border: 'border-[#ffb347]/30',
    bg: 'from-[#ffb347]/15 via-[#16110c] to-[#080808]',
    glow: 'shadow-[0_0_38px_rgba(255,179,71,0.1)] hover:shadow-[0_0_45px_rgba(255,179,71,0.18)]',
    chip: 'bg-[#ffb347]/10 text-[#ffd9a0] border-[#ffb347]/30',
    planPerks: {
      MONTHLY: ['4× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
      YEARLY: ['4× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
    },
  },
  {
    name: 'ELITE' as const,
    label: 'Elite',
    shortLabel: 'ELT',
    oldSatsMonthly: '21416',
    oldSatsYearly: '257135',
    oldUsdYearly: '$191.88',
    monthlyUsd: '$15.99',
    monthlyUsdOriginal: '$21.98',
    yearlyUsd: '$175.99',
    yearlyUsdOriginal: '$191.88',
    icon: <Sparkles className="w-6 h-6 text-[#8a2be2]" />,
    color: 'text-[#b78cff]',
    border: 'border-[#8a2be2]/30',
    bg: 'from-[#8a2be2]/15 via-[#120b1d] to-[#080808]',
    glow: 'shadow-[0_0_38px_rgba(138,43,226,0.12)] hover:shadow-[0_0_45px_rgba(138,43,226,0.2)]',
    chip: 'bg-[#8a2be2]/12 text-[#d8bbff] border-[#8a2be2]/28',
    planPerks: {
      MONTHLY: ['5× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
      YEARLY: ['5× task rewards vs Basic', 'Unlimited referrals', 'Premium streak milestones', 'Exclusive games access', 'Ad-free experience'],
    },
  },
  {
    name: 'FOUNDER' as const,
    label: 'Founder',
    shortLabel: 'FDR',
    monthlyUsd: null,
    oldSatsYearly: '334816',
    monthlyUsdOriginal: null,
    yearlyUsd: '$249.99',
    yearlyUsdOriginal: null,
    icon: <Rocket className="w-6 h-6 text-[#ff6a3d]" />,
    color: 'text-[#ff8a66]',
    border: 'border-[#ff6a3d]/30',
    bg: 'from-[#ff6a3d]/15 via-[#1a0d09] to-[#080808]',
    glow: 'shadow-[0_0_40px_rgba(255,106,61,0.14)] hover:shadow-[0_0_50px_rgba(255,106,61,0.22)]',
    chip: 'bg-[#ff6a3d]/12 text-[#ffc0ad] border-[#ff6a3d]/30',
    planPerks: {
      MONTHLY: ['6× task rewards vs Basic', 'Unlimited referrals + rotation', 'All premium milestones & games', 'Permanent Founders badge', 'Ad-free experience', 'Many more coming soon'],
      YEARLY: ['6× task rewards vs Basic', 'Unlimited referrals + rotation', 'All premium milestones & games', 'Permanent Founders badge', 'Ad-free experience', 'Many more coming soon'],
    },
  },
] as const;

function formatUsd(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value)) || Number(value) <= 0) {
    return null;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

const FREE_TIERS = [
  {
    name: 'Basic',
    xp: '0 XP',
    icon: <Shield className="w-5 h-5 text-slate-300" />,
    color: 'text-slate-300',
    border: 'border-slate-500/20 hover:border-slate-500/40 hover:shadow-[0_0_20px_rgba(100,116,139,0.1)]',
    perks: ['Referral limit: 20 users'],
  },
  {
    name: 'Copper',
    xp: '10,000 XP',
    icon: <Coins className="w-5 h-5 text-orange-400" />,
    color: 'text-orange-400',
    border: 'border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]',
    perks: ['Referral limit: 40 users'],
  },
  {
    name: 'Bronze',
    xp: '50,000 XP',
    icon: <Medal className="w-5 h-5 text-amber-500" />,
    color: 'text-amber-500',
    border: 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    perks: ['Referral limit: 60 users'],
  },
  {
    name: 'Silver',
    xp: '100,000 XP',
    icon: <Star className="w-5 h-5 text-gray-300" />,
    color: 'text-gray-300',
    border: 'border-gray-400/20 hover:border-gray-400/40 hover:shadow-[0_0_20px_rgba(156,163,175,0.1)]',
    perks: ['Referral limit: 80 users'],
  },
  {
    name: 'Gold',
    xp: '150,000 XP',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    color: 'text-yellow-400',
    border: 'border-yellow-400/20 hover:border-yellow-400/40 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)]',
    perks: ['Referral limit: 100 users'],
  },
];

const STREAK_MILESTONES = [
  { days: 7, title: 'Week One', reward: 70, type: 'free' },
  { days: 21, title: 'Three Week Run', reward: 210, type: 'free' },
  { days: 60, title: 'Two Month Grind', reward: 600, type: 'free' },
  { days: 90, title: 'Quarter Grind', reward: 900, type: 'premium' },
  { days: 180, title: 'Half Year Grind', reward: 1800, type: 'premium' },
  { days: 365, title: 'Year One', reward: 3650, type: 'premium' },
] as const;

function getTierRank(tier: string | null | undefined) {
  if (!tier) return -1;
  return PREMIUM_TIER_ORDER.indexOf(tier as PremiumTierName);
}

export default function RewardsPage() {
  const dispatch = useAppDispatch();
  const { premiumRequests, premiumMessage, data: profile } = useAppSelector((state) => state.userProfile);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showSatsPricing, setShowSatsPricing] = useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [celebrationTier, setCelebrationTier] = useState<string | null>(null);
  const [pendingSatsPurchase, setPendingSatsPurchase] = useState<{ plan: PremiumTierName; billingCycle: BillingCycle } | null>(null);

  useEffect(() => {
    dispatch(fetchPremiumInterests());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (premiumMessage) {
      setFeedback({ type: 'success', message: premiumMessage });
    }
  }, [premiumMessage]);

  const requestMap = useMemo(
    () =>
      premiumRequests.reduce<Record<string, { notify: boolean; upgrade: boolean }>>((acc, request) => {
        const key = request.plan.toUpperCase();
        acc[key] = acc[key] || { notify: false, upgrade: false };
        if (request.intent === 'NOTIFY_ME') acc[key].notify = true;
        if (request.intent === 'UPGRADE') acc[key].upgrade = true;
        return acc;
      }, {}),
    [premiumRequests],
  );

  const availableBalance = profile?.balanceAvailable ?? 0;
  const monthlyPricing = profile?.premiumPricing?.monthlySatsMatrix || {};
  const yearlyPricing = profile?.premiumPricing?.yearlySatsMatrix || {};
  const monthlyUsdPricing = profile?.premiumPricing?.monthlyUsdMatrix || {};
  const yearlyUsdPricing = profile?.premiumPricing?.yearlyUsdMatrix || {};
  const currentPremiumTier = profile?.isPremium ? profile?.premiumTier?.toUpperCase() ?? null : null;
  const currentPremiumRank = getTierRank(currentPremiumTier);
  const isPremiumUser = Boolean(profile?.isPremium);
  const activeTierLabel = profile?.activeTier || currentPremiumTier || 'Basic';

  const handleNotifyOrUpgrade = async (
    plan: PremiumTierName,
    intent: 'NOTIFY_ME' | 'UPGRADE',
    source = 'rewards-page',
  ) => {
    try {
      setLoadingKey(`${plan}-${intent}-${source}`);
      setFeedback(null);
      await dispatch(submitPremiumInterest({ plan, intent, source })).unwrap();
      await dispatch(fetchPremiumInterests());
      await dispatch(fetchUserProfile());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Request failed.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoadingKey(null);
    }
  };

  const handleSatsUpgrade = async (plan: PremiumTierName, billingCycle: BillingCycle) => {
    try {
      setLoadingKey(`${plan}-${billingCycle}`);
      setFeedback(null);
      await dispatch(upgradePremiumUsingSats({ plan, billingCycle })).unwrap();
      setCelebrationTier(plan);
      await dispatch(fetchPremiumInterests());
      await dispatch(fetchUserProfile());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upgrade failed.';
      setFeedback({ type: 'error', message });
    } finally {
      setLoadingKey(null);
    }
  };

  const pendingPurchaseDetails = useMemo(() => {
    if (!pendingSatsPurchase) return null;
    const { plan, billingCycle } = pendingSatsPurchase;
    const amount = billingCycle === 'MONTHLY'
      ? Number(monthlyPricing[plan] || 0)
      : Number(yearlyPricing[plan] || 0);
    return { plan, billingCycle, amount, remaining: availableBalance - amount };
  }, [pendingSatsPurchase, monthlyPricing, yearlyPricing, availableBalance]);

  const confirmSatsPurchase = async () => {
    if (!pendingSatsPurchase) return;
    const { plan, billingCycle } = pendingSatsPurchase;
    setPendingSatsPurchase(null);
    await handleSatsUpgrade(plan, billingCycle);
  };

  return (
    <main className="relative min-h-screen bg-sats-black-950 bg-grid-base overflow-x-clip p-4 md:p-6 lg:p-10 text-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(247,147,26,0.06),transparent_60%)]"></div>
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(247,147,26,0.04),transparent_65%)]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.05),transparent_60%)]"></div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!pendingSatsPurchase}
        onClose={() => setPendingSatsPurchase(null)}
        onConfirm={confirmSatsPurchase}
        title="Confirm Premium Purchase"
        confirmText="Confirm Purchase"
      >
        {pendingPurchaseDetails && (
          <div className="space-y-6">
            <p className="text-gray-300 text-[15px] leading-relaxed">
              Do you want to purchase the <span className="font-black text-white">{pendingPurchaseDetails.plan}</span> premium tier <span className="font-bold text-gray-400">({pendingPurchaseDetails.billingCycle.toLowerCase()})</span> using your Sats balance?
            </p>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Available Balance</span>
                <span className="text-white font-mono font-bold tracking-tight">{availableBalance.toLocaleString()} sats</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Purchasing Amount</span>
                <span className="text-red-400 font-mono font-bold tracking-tight">- {pendingPurchaseDetails.amount.toLocaleString()} sats</span>
              </div>
              <div className="h-px bg-[#2a2a2a] w-full my-2" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300 font-semibold">Remaining Balance</span>
                <span className="text-sats-orange-400 font-mono font-black tracking-tight">{pendingPurchaseDetails.remaining.toLocaleString()} sats</span>
              </div>
            </div>
          </div>
        )}
      </ConfirmModal>

      {/* Celebration Modal */}
      {celebrationTier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md transition-all">
          <div className="w-full max-w-md rounded-[32px] border border-sats-orange-500/30 bg-gradient-to-b from-[#111] to-[#050505] p-8 text-center shadow-[0_0_60px_rgba(249,115,22,0.15)] animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sats-orange-500/10 text-sats-orange-400 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="mt-6 text-3xl font-black text-white tracking-tight">Congratulations!</h3>
            <p className="mt-3 text-base text-gray-400 leading-relaxed">
              You have successfully upgraded to <span className="font-black text-sats-orange-400 tracking-wide">{celebrationTier}</span>. Welcome to the elite tier.
            </p>
            <button
              onClick={() => setCelebrationTier(null)}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-sats-orange-500 to-orange-400 px-4 py-4 text-base font-black text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 relative z-10">

        {/* Header Section */}
        <header className="text-center pt-8 pb-4 px-4">
          <FadeUp delay={0.1}>
            <div className="font-mono text-xs tracking-widest uppercase text-sats-orange-500 opacity-85 mb-5 inline-flex items-center gap-2 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
              <Trophy className="w-4 h-4" /> Rewards Program
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="font-black text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight mb-5 text-white max-w-4xl mx-auto">
              Rewards & <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent relative">Tiers</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Track streak milestones, unlock stronger free tiers, and upgrade premium access with seamless cryptocurrency or fiat payments.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2.5 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/5 px-5 py-2.5 text-sm font-bold text-sats-orange-400 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                <Info className="w-4.5 h-4.5" /> Balance: {availableBalance.toLocaleString()} sats
              </div>
              <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-gray-200 backdrop-blur-sm">
                <Crown className="w-4.5 h-4.5 text-sats-orange-500" /> Active Tier: <span className="text-white">{activeTierLabel}</span>
              </div>
            </div>
          </FadeUp>
        </header>

        {feedback ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${feedback.type === 'success'
                ? 'border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                : 'border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
              }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            {feedback.message}
          </div>
        ) : null}

        <FadeUp delay={0.5}>
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white/90">Streak Milestones</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {STREAK_MILESTONES.map((milestone, idx) => {
                const unlocked = FREE_STREAK_DAYS.has(milestone.days) || isPremiumUser;
                const premiumLocked = !FREE_STREAK_DAYS.has(milestone.days) && !isPremiumUser;

                return (
                  <div key={idx} className={`relative p-6 rounded-[28px] overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${milestone.type === 'premium' ? 'bg-gradient-to-b from-sats-orange-500/10 to-sats-black-900 border-sats-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-sats-black-900 border-white/5 hover:border-white/20'}`}>
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={`flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] border ${unlocked ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-white/10 bg-black/40 text-gray-400'}`}>
                        {unlocked ? 'Unlocked' : <><Lock className="w-2.5 h-2.5 mr-1 inline-block -mt-0.5" /> Premium</>}
                      </span>
                      {milestone.type === 'free' ? (
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold tracking-wider">FREE</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-sats-orange-500/10 text-sats-orange-500 border border-sats-orange-500/30 text-[10px] font-bold tracking-wider">PREMIUM</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-[18px] h-[18px]" />
                      <span className="text-[14px] font-bold font-mono tracking-widest uppercase leading-none pt-0.5">{milestone.days} Days</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-6">{milestone.title}</h3>

                    <div className="flex items-end gap-2">
                      <div className={`text-4xl font-black font-mono tracking-tighter ${milestone.type === 'premium' ? 'text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'text-white'}`}>
                        {milestone.reward.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">
                        Sats
                      </div>
                    </div>

                    <p className="relative z-10 mt-6 text-sm text-gray-400/80 leading-relaxed font-medium">
                      {premiumLocked
                        ? 'This milestone is locked for free tiers. Upgrade to any premium membership to unlock.'
                        : FREE_STREAK_DAYS.has(milestone.days)
                          ? 'Available to all users once your daily streak reaches this milestone.'
                          : 'Unlocked because your premium tier includes extended milestone rewards.'}
                    </p>

                  </div>
                );
              })}
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.6}>
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner">
                <MedalIcon className="w-5 h-5 text-sats-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white/90 tracking-tight">Free Tiers</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-5">
              {FREE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`group relative rounded-[28px] border ${tier.border} bg-sats-black-900 p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                >
                  <div className="relative z-10 flex items-start justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-black/40 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:scale-105 transition-transform duration-300">
                        {tier.icon}
                      </div>
                      <div>
                        <div className={`text-xl font-black tracking-wide ${tier.color}`}>
                          {tier.name}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                          {tier.xp}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3 pt-4 border-t border-white/[0.06]">
                    {tier.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full shadow-sm ${tier.color.replace('text-', 'bg-')}`} />
                        <span className="leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.7}>
          <section >
            <div id="premium-tiers" className="mb-10 flex flex-col gap-6">

              {/* TOP SECTION: Title and Description */}
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 shrink-0">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white/90">Premium Memberships</h2>
                </div>
                <p className="text-base text-gray-400 leading-relaxed">
                  Unlock exclusive tasks, instant withdrawals, and huge earning multipliers. Select your preferred payment method directly on the cards below.
                </p>
              </div>

              {/* BOTTOM SECTION: 3-Column Grid for perfect centering & right-alignment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">

                {/* Left: Empty Spacer (Takes up 1/3 of space on desktop to force center alignment) */}
                <div className="hidden md:block"></div>

                {/* Center: Monthly / Annual Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-[#090909]/90 p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedBillingCycle('MONTHLY')}
                      className={`relative cursor-pointer rounded-full px-6 py-2.5 text-sm font-black tracking-wide transition-all duration-500 ${selectedBillingCycle === 'MONTHLY'
                          ? 'bg-gradient-to-r from-white to-white/85 text-black shadow-[0_6px_18px_rgba(255,255,255,0.22)]'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBillingCycle('YEARLY')}
                      className={`relative cursor-pointer rounded-full px-6 py-2.5 text-sm font-black tracking-wide transition-all duration-500 ${selectedBillingCycle === 'YEARLY'
                          ? 'bg-gradient-to-r from-sats-orange-500 to-amber-400 text-black shadow-[0_6px_18px_rgba(249,115,22,0.28)]'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Annual
                    </button>
                  </div>
                </div>

                {/* Right: Currency Toggle Button */}
                <div className="flex justify-center md:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSatsPricing(!showSatsPricing)}
                    className={`inline-flex cursor-pointer  sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-all duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:scale-[1.02] active:scale-95 ${showSatsPricing
                        ? 'bg-gradient-to-r from-sats-orange-500 to-orange-400 text-black shadow-[0_0_18px_rgba(249,115,22,0.25)]'
                        : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-[0_0_18px_rgba(34,197,94,0.25)]'
                      }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{!showSatsPricing ? 'Upgrade Using Sats' : 'Upgrade Using USD'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>



            {/* Adjusted 3x2 Grid for Desktop using Flex-Wrap */}
            <div className="flex flex-wrap justify-center gap-6 items-stretch">
              {PREMIUM_TIERS.map((tier) => {
                const state = requestMap[tier.name] || { notify: false, upgrade: false };
                const monthlySats = Number(monthlyPricing[tier.name] || 0);
                const yearlySats = Number(yearlyPricing[tier.name] || 0);
                const monthlyUsd = formatUsd(monthlyUsdPricing[tier.name]);
                const yearlyUsd = formatUsd(yearlyUsdPricing[tier.name]);
                const monthlyEligible = monthlySats > 0 && availableBalance >= monthlySats;
                const yearlyEligible = yearlySats > 0 && availableBalance >= yearlySats;
                const isCurrentTier = currentPremiumTier === tier.name;
                const tierRank = getTierRank(tier.name);
                const belowCurrentPremium = currentPremiumRank >= 0 && tierRank < currentPremiumRank;
                const canUpgradeForward = currentPremiumRank < tierRank || currentPremiumRank === -1;
                const monthlyUnavailable = tier.name === 'FOUNDER';

                return (
                  <PremiumRewardCard
                    key={tier.name}
                    tier={tier}
                    isCurrentTier={isCurrentTier}
                    monthlyUnavailable={monthlyUnavailable}
                    selectedBillingCycle={selectedBillingCycle}
                    planPerks={tier.planPerks}
                    monthlyPlan={
                      monthlyUnavailable
                        ? undefined
                        : {
                          label: 'Monthly Plan',
                          showSatsPricing,
                          oldUsdYearly: tier.monthlyUsdOriginal,
                          newUsd: monthlyUsd,
                          oldSatsMonthly: tier.oldSatsMonthly,
                          oldSatsYearly: tier.oldSatsYearly,
                          newSats: monthlySats > 0 ? monthlySats : null,
                          accentClass: tier.color,
                          eligible: monthlyEligible,
                          active: isCurrentTier,
                          loading: loadingKey === `${tier.name}-MONTHLY`,
                          disabled: loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !monthlyEligible),
                          requestSent: !showSatsPricing && state.upgrade,
                          actionLabel:
                            isCurrentTier
                              ? 'Currently Active'
                              : belowCurrentPremium
                                ? 'Higher Tier Active'
                                : showSatsPricing
                                  ? monthlyEligible
                                    ? 'Upgrade with Sats'
                                    : 'Insufficient Sats'
                                  : state.upgrade
                                    ? 'Request Sent'
                                    : 'Send Premium Request',
                          onAction: () =>
                            showSatsPricing
                              ? setPendingSatsPurchase({ plan: tier.name, billingCycle: 'MONTHLY' })
                              : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-monthly'),
                        }
                    }
                    yearlyPlan={{
                      label: tier.name === 'FOUNDER' ? 'Yearly Plan' : 'Yearly Plan (Save 20%)',
                      showSatsPricing,
                      oldUsdYearly: tier.yearlyUsdOriginal,
                      newUsd: yearlyUsd,
                      oldSatsMonthly: '',
                      oldSatsYearly: tier.oldSatsYearly,
                      newSats: yearlySats > 0 ? yearlySats : null,
                      accentClass: tier.color,
                      eligible: yearlyEligible,
                      active: isCurrentTier,
                      loading: loadingKey === `${tier.name}-YEARLY`,
                      disabled: loadingKey !== null || isCurrentTier || belowCurrentPremium || !canUpgradeForward || (!showSatsPricing && state.upgrade) || (showSatsPricing && !yearlyEligible),
                      requestSent: !showSatsPricing && state.upgrade,
                      actionLabel:
                        isCurrentTier
                          ? 'Currently Active'
                          : belowCurrentPremium
                            ? 'Higher Tier Active'
                            : showSatsPricing
                              ? yearlyEligible
                                ? 'Upgrade with Sats'
                                : 'Insufficient Sats'
                              : state.upgrade
                                ? 'Request Sent'
                                : 'Send Premium Request',
                      onAction: () =>
                        showSatsPricing
                          ? setPendingSatsPurchase({ plan: tier.name, billingCycle: 'YEARLY' })
                          : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-yearly'),
                    }}
                    statusBanners={{
                      MONTHLY: (
                        <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
                          <button
                            onClick={() => handleNotifyOrUpgrade(tier.name, 'NOTIFY_ME', 'rewards-page-notify')}
                            disabled={loadingKey !== null || state.notify || isCurrentTier || belowCurrentPremium}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {state.notify ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Info className="h-4 w-4" />}
                            <span>{state.notify ? 'We will notify you' : 'Notify me about updates'}</span>
                          </button>

                          {isCurrentTier ? (
                            <StatusBanner tone="green" message="This is your current premium tier." />
                          ) : belowCurrentPremium ? (
                            <StatusBanner tone="orange" message="Your current premium tier is already higher than this one." />
                          ) : showSatsPricing ? (
                            <StatusBanner
                              tone={monthlyEligible ? 'green' : 'orange'}
                              message={
                                monthlyEligible
                                  ? 'Enough balance for the monthly sats purchase.'
                                  : 'Switch to USD mode or add more sats to unlock the monthly purchase.'
                              }
                            />
                          ) : state.upgrade ? (
                            <StatusBanner tone="blue" message="Upgrade request sent for this monthly tier." />
                          ) : (
                            <StatusBanner tone="violet" message="Use upgrade request or notify me if you are planning the monthly tier later." />
                          )}
                        </div>
                      ),
                      YEARLY: (
                        <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
                          <button
                            onClick={() => handleNotifyOrUpgrade(tier.name, 'NOTIFY_ME', 'rewards-page-notify')}
                            disabled={loadingKey !== null || state.notify || isCurrentTier || belowCurrentPremium}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {state.notify ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Info className="h-4 w-4" />}
                            <span>{state.notify ? 'We will notify you' : 'Notify me about updates'}</span>
                          </button>

                          {isCurrentTier ? (
                            <StatusBanner tone="green" message="This is your current premium tier." />
                          ) : belowCurrentPremium ? (
                            <StatusBanner tone="orange" message="Your current premium tier is already higher than this one." />
                          ) : showSatsPricing ? (
                            <StatusBanner
                              tone={yearlyEligible ? 'green' : 'orange'}
                              message={
                                yearlyEligible
                                  ? 'Enough balance for the annual sats purchase.'
                                  : 'Switch to USD mode or add more sats to unlock the annual purchase.'
                              }
                            />
                          ) : state.upgrade ? (
                            <StatusBanner tone="blue" message="Upgrade request sent for this annual tier." />
                          ) : (
                            <StatusBanner tone="violet" message="Use upgrade request or notify me if you are planning the annual tier later." />
                          )}
                        </div>
                      ),
                    }}
                  />
                );
              })}
            </div>
          </section>
        </FadeUp>
      </div>
    </main>
  );
}

function StatusBanner({ tone, message }: { tone: 'green' | 'orange' | 'violet' | 'blue'; message: string }) {
  const styles = {
    green: 'border-green-500/20 bg-green-500/10 text-green-300',
    orange: 'border-orange-500/20 bg-orange-500/10 text-orange-300',
    violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  };

  return <div className={`rounded-xl border px-3 py-2.5 text-[11px] sm:text-xs font-bold leading-relaxed ${styles[tone]}`}>{message}</div>;
}
