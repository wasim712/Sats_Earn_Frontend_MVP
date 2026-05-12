'use client';

import React from 'react';
import { Award, BadgeCheck, Crown, Gem, Rocket, Shield, Sparkles, Star, Trophy } from 'lucide-react';

interface ReferralTierCommissionProps {
  activeTier: string;
}

type TierCard = {
  name: string;
  commission: string;
  subtitle: string;
  isFree: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const tierCards: TierCard[] = [
  { name: 'BASIC', commission: '5%', subtitle: 'Up to 20 referrals', isFree: true, icon: Shield, tone: 'from-zinc-500/10 to-zinc-400/5 border-zinc-500/20' },
  { name: 'COPPER', commission: '5%', subtitle: 'Up to 20 referrals', isFree: true, icon: Award, tone: 'from-amber-700/10 to-orange-500/5 border-amber-600/20' },
  { name: 'BRONZE', commission: '5%', subtitle: 'Up to 20 referrals', isFree: true, icon: Trophy, tone: 'from-orange-700/10 to-orange-500/5 border-orange-600/20' },
  { name: 'SILVER', commission: '5%', subtitle: 'Up to 20 referrals', isFree: true, icon: Star, tone: 'from-slate-400/10 to-slate-200/5 border-slate-400/20' },
  { name: 'GOLD', commission: '5%', subtitle: 'Up to 20 referrals', isFree: true, icon: BadgeCheck, tone: 'from-yellow-500/10 to-amber-300/5 border-yellow-500/20' },
  { name: 'PLATINUM', commission: '10%', subtitle: 'Unlimited referrals', isFree: false, icon: Gem, tone: 'from-emerald-500/12 to-teal-400/5 border-emerald-500/22' },
  { name: 'DIAMOND', commission: '15%', subtitle: 'Unlimited referrals', isFree: false, icon: Gem, tone: 'from-sky-500/12 to-blue-400/5 border-sky-500/22' },
  { name: 'CROWN', commission: '20%', subtitle: 'Unlimited referrals', isFree: false, icon: Crown, tone: 'from-violet-500/12 to-purple-400/5 border-violet-500/22' },
  { name: 'ELITE', commission: '25%', subtitle: 'Unlimited referrals', isFree: false, icon: Sparkles, tone: 'from-fuchsia-500/12 to-pink-400/5 border-fuchsia-500/22' },
  { name: 'FOUNDER', commission: '30%', subtitle: 'Unlimited referrals', isFree: false, icon: Rocket, tone: 'from-rose-500/12 to-red-400/5 border-rose-500/22' },
];

export default function ReferralTierCommission({ activeTier }: ReferralTierCommissionProps) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/20 shadow-lg">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 text-sats-orange-400 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Commission by Tier</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Free tiers keep the base referral reward, while paid tiers unlock higher commissions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Free Tiers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {tierCards.filter((item) => item.isFree).map((item) => {
              const isActive = activeTier === item.name;
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className={`rounded-[22px] border bg-gradient-to-br p-4 transition-all duration-300 ${item.tone} ${isActive ? 'opacity-100 shadow-[0_18px_40px_rgba(0,0,0,0.22)] scale-[1.01]' : 'opacity-45'}`}
                >
                  <div className="flex items-center gap-2 text-gray-300 mb-5">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">{item.name.charAt(0) + item.name.slice(1).toLowerCase()}</span>
                  </div>
                  <p className="text-3xl font-black text-sats-orange-400 tracking-tight">{item.commission}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Base referral reward</p>
                  <p className="text-xs text-gray-500 font-bold mt-4">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Paid / Premium Tiers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            {tierCards.filter((item) => !item.isFree).map((item) => {
              const isActive = activeTier === item.name;
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className={`rounded-[22px] border bg-gradient-to-br p-4 transition-all duration-300 ${item.tone} ${isActive ? 'opacity-100 shadow-[0_18px_40px_rgba(0,0,0,0.22)] scale-[1.01]' : 'opacity-45'}`}
                >
                  <div className="flex items-center gap-2 text-gray-300 mb-5">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wide">{item.name.charAt(0) + item.name.slice(1).toLowerCase()}</span>
                  </div>
                  <p className="text-3xl font-black text-sats-orange-400 tracking-tight">{item.commission}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Premium referral reward</p>
                  <p className="text-xs text-gray-500 font-bold mt-4">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
