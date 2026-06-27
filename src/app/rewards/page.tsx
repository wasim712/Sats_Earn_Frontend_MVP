'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  CircleStar,
  Coins,
  Crown,
  Gem,
  Info,
  Lock,
  Medal,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { PremiumRewardCard } from './PremiumRewardsCard';
import { FadeUp } from '@/components/animations/FadeUp';

type PremiumTierName = 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER';
type BillingCycle = 'MONTHLY' | 'YEARLY';

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
];

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

export default function RewardsPage() {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>('MONTHLY');

  return (
    <main className="relative min-h-screen bg-sats-black-950 bg-grid-base overflow-x-clip px-4 py-8 md:px-8 lg:px-10 text-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(247,147,26,0.06),transparent_60%)]"></div>
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(247,147,26,0.04),transparent_65%)]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.05),transparent_60%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 relative z-10">
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
              Track streak milestones, unlock stronger free tiers, and explore premium access with the same polished experience across every screen.
            </p>
          </FadeUp>
        </header>

        <FadeUp delay={0.4}>
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white/90">Streak Milestones</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {STREAK_MILESTONES.map((milestone, idx) => {
                const unlocked = FREE_STREAK_DAYS.has(milestone.days);
                const premiumLocked = !FREE_STREAK_DAYS.has(milestone.days);

                return (
                  <div key={idx} className={`relative p-6 rounded-[28px] overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${milestone.type === 'premium' ? 'bg-gradient-to-b from-sats-orange-500/10 to-sats-black-900 border-sats-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-sats-black-900 border-white/5 hover:border-white/20'}`}>
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      
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

                    <p className="relative z-10 mt-6 text-sm leading-relaxed text-gray-400/80 font-medium">
                      {FREE_STREAK_DAYS.has(milestone.days)
                        ? 'Available to all users once your daily streak reaches this milestone.'
                        : 'This milestone reward is reserved for premium members in the full rewards flow.'}
                    </p>

                  </div>
                );
              })}
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.5}>
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white/90">Free Tiers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {FREE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`group relative overflow-hidden rounded-[28px] border bg-sats-black-900 p-5 transition-all duration-300 hover:-translate-y-1 ${tier.border}`}
                >
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-black/40 border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
                      {tier.icon}
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 border-white/10 bg-white/5`}>
                      {tier.xp}
                    </span>
                  </div>
                  <div className="mt-5">
                    <h3 className={`text-xl font-black tracking-tight ${tier.color}`}>{tier.name}</h3>
                    <div className="mt-4 space-y-2.5">
                      {tier.perks.map((perk) => (
                        <div key={perk} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tier.color.replace('text-', 'bg-')}`} />
                          <span className="leading-snug">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>

        <FadeUp delay={0.6}>
          <section>
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-violet-300">
                  <Sparkles className="h-4 w-4" /> Premium Access
                </div>
                <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-white">Premium Membership</h2>
                <p className="mt-3 text-base leading-relaxed text-gray-400">
                  Explore the exact premium visuals from the user rewards experience with frontend-only pricing and disabled upgrade actions.
                </p>
              </div>

              <div className="inline-flex items-center rounded-2xl w-fit border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                {(['MONTHLY', 'YEARLY'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setSelectedBillingCycle(cycle)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-black transition-all ${selectedBillingCycle === cycle ? 'bg-sats-orange-500 text-black shadow-[0_8px_18px_rgba(249,115,22,0.25)]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {cycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-stretch justify-center gap-6">
              {PREMIUM_TIERS.map((tier) => (
                <PremiumRewardCard
                  key={tier.name}
                  tier={tier}
                  isCurrentTier={false}
                  monthlyUnavailable={!tier.monthlyUsd}
                  selectedBillingCycle={selectedBillingCycle}
                  planPerks={tier.planPerks}
                  monthlyPlan={tier.monthlyUsd ? {
                    label: 'Monthly plan',
                    showSatsPricing: false,
                    oldUsdYearly: tier.monthlyUsdOriginal,
                    newUsd: tier.monthlyUsd,
                    oldSatsMonthly: tier.oldSatsMonthly ?? null,
                    oldSatsYearly: tier.oldSatsYearly ?? null,
                    newSats: null,
                    accentClass: tier.color,
                    eligible: false,
                    active: false,
                    loading: false,
                    disabled: true,
                    requestSent: false,
                    actionLabel: 'Upgrade',
                    onAction: () => { },
                  } : undefined}
                  yearlyPlan={{
                    label: 'Yearly plan',
                    showSatsPricing: false,
                    oldUsdYearly: tier.yearlyUsdOriginal,
                    newUsd: tier.yearlyUsd,
                    oldSatsMonthly: tier.oldSatsMonthly ?? null,
                    oldSatsYearly: tier.oldSatsYearly ?? null,
                    newSats: null,
                    accentClass: tier.color,
                    eligible: false,
                    active: false,
                    loading: false,
                    disabled: true,
                    requestSent: false,
                    actionLabel: 'Upgrade',
                    onAction: () => { },
                  }}
                  statusBanners={{
                    MONTHLY: (
                      <StatusBanner tone="violet" message="Upgrade is available in the signed-in rewards experience." />
                    ),
                    YEARLY: (
                      <StatusBanner tone="violet" message="Upgrade is available in the signed-in rewards experience." />
                    ),
                  }}
                />
              ))}
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
