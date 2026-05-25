'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPremiumInterests, fetchUserProfile, submitPremiumInterest, upgradePremiumUsingSats } from '@/features/user/userProfileSlice';
import { Calendar, CheckCircle2, Crown, Gem, Info, Medal, Shield, Star, TrendingUp, Zap } from 'lucide-react';

const PREMIUM_TIERS = [
  { name: 'PLATINUM', label: 'Platinum', monthlyUsd: '$9.99', yearlyUsd: '$99.99', icon: <Gem className="w-6 h-6 text-[#e5e4e2]" />, color: 'text-[#e5e4e2]', border: 'border-[#e5e4e2]/50', bg: 'bg-[#e5e4e2]/5', perks: ['+25% Bonus Earnings', 'Zero Withdrawal Fees', 'Exclusive High-Yield Tasks'] },
  { name: 'DIAMOND', label: 'Diamond', monthlyUsd: '$19.99', yearlyUsd: '$199.99', icon: <Gem className="w-6 h-6 text-[#b9f2ff]" />, color: 'text-[#b9f2ff]', border: 'border-[#b9f2ff]/50', bg: 'bg-[#b9f2ff]/5', perks: ['+50% Bonus Earnings', 'Instant Withdrawals', 'Beta Feature Access'] },
  { name: 'CROWN', label: 'Crown', monthlyUsd: '$49.99', yearlyUsd: '$499.99', icon: <Crown className="w-6 h-6 text-[#ffb347]" />, color: 'text-[#ffb347]', border: 'border-[#ffb347]/50', bg: 'bg-[#ffb347]/5', perks: ['+75% Bonus Earnings', 'Personal Account Manager', 'Custom Profile Badge'] },
  { name: 'ELITE', label: 'Elite', monthlyUsd: '$99.99', yearlyUsd: '$999.99', icon: <Zap className="w-6 h-6 text-[#8a2be2]" />, color: 'text-[#8a2be2]', border: 'border-[#8a2be2]/50', bg: 'bg-[#8a2be2]/5', perks: ['+100% Bonus Earnings', 'Private Discord Access', 'Priority Event Invites'] },
  { name: 'FOUNDER', label: 'Founder', monthlyUsd: '$249.99', yearlyUsd: '$2499.99', icon: <TrendingUp className="w-6 h-6 text-[#ff4500]" />, color: 'text-[#ff4500]', border: 'border-[#ff4500]/50', bg: 'bg-[#ff4500]/5', perks: ['+150% Bonus Earnings', 'Revenue Share Pool', 'Legendary Status'] },
] as const;

const FREE_TIERS = [
  { name: 'Basic', xp: '0 XP', icon: <Star className="w-5 h-5 text-gray-400" />, color: 'text-gray-400', border: 'border-gray-500/30', perks: ['Standard payouts', 'Basic tasks access'] },
  { name: 'Copper', xp: '1,000 XP', icon: <Shield className="w-5 h-5 text-[#b87333]" />, color: 'text-[#b87333]', border: 'border-[#b87333]/30', perks: ['+2% Bonus Earnings', 'Daily Quiz Access'] },
  { name: 'Bronze', xp: '5,000 XP', icon: <Medal className="w-5 h-5 text-[#cd7f32]" />, color: 'text-[#cd7f32]', border: 'border-[#cd7f32]/30', perks: ['+5% Bonus Earnings', 'Priority Tasks'] },
  { name: 'Silver', xp: '15,000 XP', icon: <Shield className="w-5 h-5 text-[#C0C0C0]" />, color: 'text-[#C0C0C0]', border: 'border-[#C0C0C0]/30', perks: ['+10% Bonus Earnings', 'Faster Withdrawals'] },
  { name: 'Gold', xp: '50,000 XP', icon: <Crown className="w-5 h-5 text-[#FFD700]" />, color: 'text-[#FFD700]', border: 'border-[#FFD700]/30', perks: ['+15% Bonus Earnings', 'VIP Support'] },
];

const STREAK_MILESTONES = [
  { days: 7, sats: 70, title: 'Week Warrior' },
  { days: 21, sats: 210, title: 'Three Week Hero' },
  { days: 60, sats: 600, title: 'Two Month Master' },
  { days: 90, sats: 900, title: 'Quarter Legend' },
  { days: 180, sats: 1800, title: 'Half Year Champion' },
  { days: 365, sats: 3650, title: 'Annual Legend' },
];

export default function RewardsPage() {
  const dispatch = useAppDispatch();
  const { premiumRequests, premiumMessage, data: profile } = useAppSelector((state) => state.userProfile);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    dispatch(fetchPremiumInterests());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (premiumMessage) {
      setFeedback({ type: 'success', message: premiumMessage });
    }
  }, [premiumMessage]);

  const requestMap = useMemo(() => premiumRequests.reduce<Record<string, { notify: boolean; upgrade: boolean }>>((acc, request) => {
    const key = request.plan.toUpperCase();
    acc[key] = acc[key] || { notify: false, upgrade: false };
    if (request.intent === 'NOTIFY_ME') acc[key].notify = true;
    if (request.intent === 'UPGRADE') acc[key].upgrade = true;
    return acc;
  }, {}), [premiumRequests]);

  const availableBalance = profile?.balanceAvailable ?? 0;
  const monthlyPricing = profile?.premiumPricing?.monthlySatsMatrix || {};
  const yearlyPricing = profile?.premiumPricing?.yearlySatsMatrix || {};
  const currentPremiumTier = profile?.isPremium ? profile?.premiumTier?.toUpperCase() ?? null : null;

  const handleNotifyOrUpgrade = async (plan: 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER', intent: 'NOTIFY_ME' | 'UPGRADE', source = 'rewards-page') => {
    try {
      setLoadingKey(`${plan}-${intent}-${source}`);
      setFeedback(null);
      await dispatch(submitPremiumInterest({ plan, intent, source })).unwrap();
      await dispatch(fetchPremiumInterests());
    } catch (error: any) {
      setFeedback({ type: 'error', message: error?.message || 'Request failed.' });
    } finally {
      setLoadingKey(null);
    }
  };

  const handleSatsUpgrade = async (plan: 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER', billingCycle: 'MONTHLY' | 'YEARLY') => {
    try {
      setLoadingKey(`${plan}-${billingCycle}`);
      setFeedback(null);
      await dispatch(upgradePremiumUsingSats({ plan, billingCycle })).unwrap();
      await dispatch(fetchPremiumInterests());
      await dispatch(fetchUserProfile());
    } catch (error: any) {
      setFeedback({ type: 'error', message: error?.message || 'Upgrade failed.' });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Rewards & Tiers</h1>
          <p className="text-gray-400 mt-2">Track streak perks, unlock tiers, and upgrade using sats when your balance is enough.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-2 text-sm text-sats-orange-300">
            <Info className="w-4 h-4" /> Available balance: {availableBalance.toLocaleString()} sats
          </div>
        </div>

        {feedback ? (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
            {feedback.message}
          </div>
        ) : null}

        <section>
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-sats-orange-500" /> Streak Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {STREAK_MILESTONES.map((item) => (
              <div key={item.days} className="rounded-2xl border border-[#1f1f1f] bg-[#050505] p-5">
                <div className="text-sm text-gray-400">{item.days} Days</div>
                <div className="mt-2 text-xl font-black">{item.title}</div>
                <div className="mt-2 text-sats-orange-400 font-bold">{item.sats.toLocaleString()} sats</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-sats-orange-500" /> Free Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {FREE_TIERS.map((tier) => (
              <div key={tier.name} className={`rounded-2xl border ${tier.border} bg-[#050505] p-5`}>
                <div className="flex items-center gap-3 mb-4">{tier.icon}<div><div className={`font-black ${tier.color}`}>{tier.name}</div><div className="text-xs text-gray-500">{tier.xp}</div></div></div>
                <div className="space-y-2">{tier.perks.map((perk) => <div key={perk} className="text-sm text-gray-300">? {perk}</div>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2"><Crown className="w-6 h-6 text-sats-orange-500" /> Premium Memberships</h2>
            <p className="text-sm text-gray-400 mt-1">Choose between monthly and yearly plans. If your balance is high enough, you can upgrade instantly using sats.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
            {PREMIUM_TIERS.map((tier) => {
              const state = requestMap[tier.name] || { notify: false, upgrade: false };
              const monthlySats = Number(monthlyPricing[tier.name] || 0);
              const yearlySats = Number(yearlyPricing[tier.name] || 0);
              const monthlyEligible = monthlySats > 0 && availableBalance >= monthlySats;
              const yearlyEligible = yearlySats > 0 && availableBalance >= yearlySats;
              const isCurrentTier = currentPremiumTier === tier.name;

              return (
                <div key={tier.name} className={`relative rounded-[24px] border ${isCurrentTier ? 'border-green-500/50' : tier.border} bg-[#050505] p-6 flex flex-col ${isCurrentTier ? 'ring-1 ring-green-500/20' : ''}`}>
                  <div className={`absolute inset-0 ${tier.bg} blur-xl rounded-[24px] opacity-40 pointer-events-none`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      {tier.icon}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tier.border} ${tier.color}`}>{isCurrentTier ? 'Active' : 'Premium'}</span>
                    </div>
                    <h3 className={`text-2xl font-black uppercase tracking-wider mb-1 ${tier.color}`}>{tier.label}</h3>
                    <div className="mt-5 space-y-3">{tier.perks.map((perk) => <div key={perk} className="flex items-start gap-2"><CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.color}`} /><span className="text-sm text-gray-300">{perk}</span></div>)}</div>
                  </div>

                  <div className="relative z-10 mt-6 space-y-4">
                    <PlanCard
                      label="Monthly"
                      usd={tier.monthlyUsd}
                      sats={monthlySats}
                      accentClass={tier.color}
                      eligible={monthlyEligible}
                      active={isCurrentTier}
                      loading={loadingKey === `${tier.name}-MONTHLY`}
                      disabled={loadingKey !== null || isCurrentTier || (!monthlyEligible && state.upgrade)}
                      actionLabel={isCurrentTier ? 'Current tier' : monthlyEligible ? 'Upgrade using sats' : state.upgrade ? 'Upgrade Requested' : 'Upgrade monthly'}
                      onAction={() => monthlyEligible ? handleSatsUpgrade(tier.name, 'MONTHLY') : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-monthly')}
                    />

                    <PlanCard
                      label="Yearly"
                      usd={tier.yearlyUsd}
                      sats={yearlySats}
                      accentClass={tier.color}
                      eligible={yearlyEligible}
                      active={isCurrentTier}
                      loading={loadingKey === `${tier.name}-YEARLY`}
                      disabled={loadingKey !== null || isCurrentTier || (!yearlyEligible && state.upgrade)}
                      actionLabel={isCurrentTier ? 'Current tier' : yearlyEligible ? 'Upgrade using sats' : state.upgrade ? 'Upgrade Requested' : 'Upgrade yearly'}
                      onAction={() => yearlyEligible ? handleSatsUpgrade(tier.name, 'YEARLY') : handleNotifyOrUpgrade(tier.name, 'UPGRADE', 'rewards-page-yearly')}
                    />

                    <button
                      onClick={() => handleNotifyOrUpgrade(tier.name, 'NOTIFY_ME', 'rewards-page-notify')}
                      disabled={loadingKey !== null || state.notify || monthlyEligible || yearlyEligible || isCurrentTier}
                      className="w-full py-3 rounded-xl border border-[#2a2a2a] text-gray-200 font-bold text-sm hover:bg-white/5 transition-colors disabled:opacity-60"
                    >
                      {state.notify ? 'Already on Notify List' : 'Notify me'}
                    </button>

                    {isCurrentTier ? (
                      <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-300">
                        This is your current premium tier.
                      </div>
                    ) : monthlyEligible || yearlyEligible ? (
                      <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-300">
                        You have enough sats for {monthlyEligible && yearlyEligible ? 'monthly or yearly' : monthlyEligible ? 'monthly' : 'yearly'} upgrade.
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanCard({
  label,
  usd,
  sats,
  accentClass,
  eligible,
  active,
  loading,
  disabled,
  actionLabel,
  onAction,
}: {
  label: string;
  usd: string;
  sats: number;
  accentClass: string;
  eligible: boolean;
  active: boolean;
  loading: boolean;
  disabled: boolean;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className={`rounded-2xl border ${active ? 'border-green-500/30 bg-green-500/5' : 'border-[#1d1d1d] bg-[#0a0a0a]'} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-500">{label}</div>
          <div className="mt-2 text-lg font-black text-white">{usd}<span className="ml-1 text-xs font-medium text-gray-500">/{label.toLowerCase()}</span></div>
          <div className={`mt-1 text-sm font-semibold ${eligible ? 'text-green-300' : 'text-sats-orange-300'}`}>{sats > 0 ? `${sats.toLocaleString()} sats` : 'Unavailable'}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${eligible ? 'border border-green-500/20 bg-green-500/10 text-green-300' : 'border border-[#2a2a2a] bg-[#111] text-gray-400'}`}>
          {eligible ? 'Eligible' : 'Locked'}
        </span>
      </div>

      <button
        onClick={onAction}
        disabled={disabled}
        className={`mt-4 w-full rounded-xl border border-[#2b2b2b] px-4 py-3 text-sm font-bold transition-colors disabled:opacity-60 ${accentClass} hover:bg-white/5`}
      >
        {loading ? 'Processing...' : actionLabel}
      </button>
    </div>
  );
}
