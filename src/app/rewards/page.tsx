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
      MONTHLY: ['Priority withdrawals', '10% bonus earnings', 'Exclusive task access'],
      YEARLY: ['Priority withdrawals', '10% bonus earnings', 'Exclusive task access'],
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
      MONTHLY: ['Instant withdrawals', '15% bonus earnings', 'Beta feature access'],
      YEARLY: ['Instant withdrawals', '15% bonus earnings', 'Beta feature access'],
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
      MONTHLY: ['Account manager access', '20% bonus earnings', 'Premium support queue'],
      YEARLY: ['Account manager access', '20% bonus earnings', 'Premium support queue'],
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
      MONTHLY: ['Private feature channel', '25% bonus earnings', 'Event priority invites'],
      YEARLY: ['Private feature channel', '25% bonus earnings', 'Event priority invites'],
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
      MONTHLY: ['Founding member status', '30% bonus earnings', 'Revenue-share priority access'],
      YEARLY: ['Founding member status', '30% bonus earnings', 'Revenue-share priority access'],
    },
  },
];

const FREE_TIERS = [
  {
    name: 'Basic',
    xp: '0 XP',
    icon: <Shield className="w-5 h-5 text-slate-300" />,
    color: 'text-slate-200',
    border: 'border-slate-400/20',
    bg: 'from-slate-500/10 via-[#0a0a0a] to-[#050505]',
    badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(100,116,139,0.15)] group-hover:border-slate-400/40',
    perks: ['Referral limit: 20 users'],
  },
  {
    name: 'Copper',
    xp: '1,000 XP',
    icon: <Coins className="w-5 h-5 text-[#b87333]" />,
    color: 'text-[#d7a06b]',
    border: 'border-[#b87333]/20',
    bg: 'from-[#b87333]/10 via-[#0d0906] to-[#050505]',
    badge: 'bg-[#b87333]/10 text-[#e6bb92] border-[#b87333]/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(184,115,51,0.15)] group-hover:border-[#b87333]/40',
    perks: ['Referral limit: 40 users'],
  },
  {
    name: 'Bronze',
    xp: '5,000 XP',
    icon: <Medal className="w-5 h-5 text-[#cd7f32]" />,
    color: 'text-[#d99962]',
    border: 'border-[#cd7f32]/20',
    bg: 'from-[#cd7f32]/10 via-[#0e0906] to-[#050505]',
    badge: 'bg-[#cd7f32]/10 text-[#efbf96] border-[#cd7f32]/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(205,127,50,0.15)] group-hover:border-[#cd7f32]/40',
    perks: ['Referral limit: 60 users'],
  },
  {
    name: 'Silver',
    xp: '15,000 XP',
    icon: <Star className="w-5 h-5 text-[#C0C0C0]" />,
    color: 'text-[#d8dde5]',
    border: 'border-[#C0C0C0]/20',
    bg: 'from-[#C0C0C0]/10 via-[#0b0d0e] to-[#050505]',
    badge: 'bg-[#C0C0C0]/10 text-[#eef2f5] border-[#C0C0C0]/20',
    glow: 'group-hover:shadow-[0_0_30px_rgba(192,192,192,0.15)] group-hover:border-[#C0C0C0]/40',
    perks: ['Referral limit: 80 users'],
  },
  {
    name: 'Gold',
    xp: '50,000 XP',
    icon: <Trophy className="w-5 h-5 text-[#FFD700]" />,
    color: 'text-[#FFD700]',
    border: 'border-[#FFD700]/25',
    bg: 'from-[#FFD700]/15 via-[#110e05] to-[#050505]',
    badge: 'bg-[#FFD700]/10 text-[#ffe985] border-[#FFD700]/25',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] group-hover:border-[#FFD700]/50',
    perks: ['Referral limit: 100 users'],
  },
];

const STREAK_MILESTONES = [
  { days: 7, sats: 70, title: 'Pulse Start', accent: 'from-orange-500/10 via-[#0a0604] to-[#050505]', iconColor: 'text-orange-400', border: 'border-orange-500/20' },
  { days: 21, sats: 210, title: 'Momentum Run', accent: 'from-rose-500/10 via-[#0a0406] to-[#050505]', iconColor: 'text-rose-400', border: 'border-rose-500/20' },
  { days: 60, sats: 600, title: 'Golden Run', accent: 'from-amber-500/10 via-[#0a0804] to-[#050505]', iconColor: 'text-amber-400', border: 'border-amber-500/20' },
  { days: 90, sats: 900, title: 'Prime Chain', accent: 'from-violet-500/10 via-[#07040a] to-[#050505]', iconColor: 'text-violet-400', border: 'border-violet-500/20' },
  { days: 180, sats: 1800, title: 'Titan Loop', accent: 'from-fuchsia-500/10 via-[#0a040a] to-[#050505]', iconColor: 'text-fuchsia-400', border: 'border-fuchsia-500/20' },
  { days: 365, sats: 3650, title: 'Legacy Orbit', accent: 'from-cyan-500/10 via-[#04080a] to-[#050505]', iconColor: 'text-cyan-400', border: 'border-cyan-500/20' },
] as const;

export default function RewardsPage() {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>('MONTHLY');

  return (
    <div className="min-h-fit bg-[#050505] text-white overflow-x-hidden px-4 py-8 md:px-8 lg:px-10 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.10),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.10),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_24%)]" />

      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Rewards & Tiers
            </h1>
            <p className="text-gray-400 mt-3 text-base md:text-lg leading-relaxed">
              Track streak milestones, unlock stronger free tiers, and explore premium access with the same polished experience across every screen.
            </p>
          </div>
        </header>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white/90">Streak Milestones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {STREAK_MILESTONES.map((item) => {
              const unlocked = FREE_STREAK_DAYS.has(item.days);
              const premiumLocked = !FREE_STREAK_DAYS.has(item.days);

              return (
                <div
                  key={item.days}
                  className={`group relative rounded-[28px] border p-6 bg-gradient-to-br ${item.accent} ${unlocked ? 'border-white/10' : 'border-white/5'} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-black/40 shadow-inner ${item.border}`}>
                        <Calendar className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.days} Days</div>
                        <div className="mt-1 text-lg font-black text-white tracking-wide">{item.title}</div>
                      </div>
                    </div>
                    {premiumLocked ? (
                      <div className="rounded-full border border-violet-500/20 bg-violet-500/10 p-2 text-violet-300">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
                        <Trophy className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-400">Reward</div>
                      <div className="mt-1 text-3xl font-black tracking-tight text-white">{item.sats.toLocaleString()} <span className="text-lg text-gray-400">sats</span></div>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${premiumLocked ? 'border-violet-500/20 bg-violet-500/10 text-violet-300' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'}`}>
                      {premiumLocked ? 'Premium' : 'Open'}
                    </span>
                  </div>

                  <p className="relative z-10 mt-5 text-sm leading-relaxed text-gray-400">
                    {FREE_STREAK_DAYS.has(item.days)
                      ? 'Available to all users once your daily streak reaches this milestone.'
                      : 'This milestone reward is reserved for premium members in the full rewards flow.'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

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
                className={`group relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${tier.bg} p-5 transition-all duration-300 ${tier.glow} ${tier.border}`}
              >
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)]" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-black/30 ${tier.border}`}>
                    {tier.icon}
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tier.badge}`}>
                    {tier.xp}
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className={`text-xl font-black tracking-tight ${tier.color}`}>{tier.name}</h3>
                  <div className="mt-4 space-y-2.5">
                    {tier.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-sats-orange-400" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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

            <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
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
                  onAction: () => {},
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
                  onAction: () => {},
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
      </div>
    </div>
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
