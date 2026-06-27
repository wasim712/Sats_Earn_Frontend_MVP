'use client';

import React from 'react';
import { Award, BadgeCheck, Crown, Gem, Rocket, Shield, Sparkles, Star, Trophy, CircleStar, Medal, Coins, Info } from 'lucide-react';

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
  { name: 'BASIC', commission: '5%', subtitle: '1-20 *', isFree: true, icon: Shield, tone: 'from-zinc-500/10 to-zinc-300/10 border-zinc-500/40 ' },
  { name: 'COPPER', commission: '5%', subtitle: '21-40 *', isFree: true, icon: Coins, tone: 'from-amber-700/10 to-orange-300/10 border-amber-600/40' },
  { name: 'BRONZE', commission: '5%', subtitle: '41-60 *', isFree: true, icon: Medal, tone: 'from-orange-700/10 to-orange-500/5 border-orange-600/20' },
  { name: 'SILVER', commission: '5%', subtitle: '61-80 *', isFree: true, icon: Star, tone: 'from-slate-400/10 to-slate-200/5 border-slate-400/20' },
  { name: 'GOLD', commission: '5%', subtitle: '81-100(Max) *', isFree: true, icon: Trophy, tone: 'from-yellow-500/10 to-amber-300/5 border-yellow-500/20' },
  { name: 'PLATINUM', commission: '10%', subtitle: 'Unlimited referrals', isFree: false, icon: CircleStar, tone: 'from-emerald-500/12 to-teal-400/5 border-emerald-500/20' },
  { name: 'DIAMOND', commission: '15%', subtitle: 'Unlimited referrals', isFree: false, icon: Gem, tone: 'from-sky-500/12 to-blue-400/5 border-sky-500/22' },
  { name: 'CROWN', commission: '20%', subtitle: 'Unlimited referrals', isFree: false, icon: Crown, tone: 'from-violet-500/12 to-purple-400/5 border-violet-500/22' },
  { name: 'ELITE', commission: '25%', subtitle: 'Unlimited referrals', isFree: false, icon: Sparkles, tone: 'from-fuchsia-500/12 to-pink-400/5 border-fuchsia-500/22' },
  { name: 'FOUNDER', commission: '30%', subtitle: 'Unlimited referrals', isFree: false, icon: Rocket, tone: 'from-rose-500/12 to-red-400/5 border-rose-500/22' },
];

export default function ReferralTierCommission({ activeTier }: ReferralTierCommissionProps) {
  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/[0.04] rounded-[32px] p-6 sm:p-8 transition-all duration-500 shadow-xl relative overflow-hidden">
      
      <div className="flex items-start gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10 text-sats-orange-400 flex items-center justify-center shrink-0 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Commission by Tier</h2>
          <p className="text-sm text-gray-400 font-medium mt-1 max-w-2xl">
            Free tiers keep the base referral reward, while paid tiers unlock significantly higher commissions.
          </p>
        </div>
      </div>

      <div className="space-y-10 relative z-10">
        
        {/* FREE TIERS SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Free Tiers</p>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.05] to-transparent" />
          </div>
          
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            {tierCards.filter((item) => item.isFree).map((item) => {
              const isActive = activeTier === item.name;
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className={`relative rounded-[24px] border bg-gradient-to-br p-5 transition-all duration-500 ${item.tone} ${
                    isActive 
                      ? 'opacity-100 shadow-[0_10px_40px_rgba(255,255,255,0.06)] scale-105 ring-1 ring-white/20 z-10' 
                      : 'opacity-40 saturate-50 hover:opacity-70 hover:saturate-100 hover:scale-[1.02]'
                  }`}
                >
                  {/* {isActive && (
                    <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-sats-orange-400 to-sats-orange-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] border border-[#111]">
                      Active
                    </div>
                  )} */}
                  
                  <div className={`flex items-center gap-2.5 mb-5 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-sm font-bold tracking-wide">{item.name.charAt(0) + item.name.slice(1).toLowerCase()}</span>
                  </div>
                  
                  <p className={`text-3xl font-black tracking-tight transition-all duration-300 ${isActive ? 'text-sats-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]' : 'text-sats-orange-500/70'}`}>
                    {item.commission}
                  </p>
                  
                  <p className={`text-[11px] font-medium mt-1 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                    Base referral reward
                  </p>
                  
                  <p className={`text-[11px] font-bold mt-4 ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
            <Info className="w-4 h-4 text-sats-orange-500 shrink-0 mt-0.5" />
            <p className='text-xs text-gray-400 leading-relaxed'>
              These are the max referrals for each Free Tier. Your referral commission is earned on the base task reward only - not on any premium bonus your referral receives.
            </p>
          </div>
        </div>

        {/* PAID TIERS SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Paid / Premium Tiers</p>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.05] to-transparent" />
          </div>
          
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            {tierCards.filter((item) => !item.isFree).map((item) => {
              const isActive = activeTier === item.name;
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className={`relative rounded-[24px] border bg-gradient-to-br p-5 transition-all duration-500 ${item.tone} ${
                    isActive 
                      ? 'opacity-100 shadow-[0_10px_40px_rgba(255,255,255,0.06)] scale-105 ring-1 ring-white/20 z-10' 
                      : 'opacity-40 saturate-50 hover:opacity-70 hover:saturate-100 hover:scale-[1.02]'
                  }`}
                >
                  {/* {isActive && (
                    <div className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-sats-orange-400 to-sats-orange-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] border border-[#111]">
                      Active
                    </div>
                  )}
                   */}
                  <div className={`flex items-center gap-2.5 mb-5 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-sm font-bold tracking-wide">{item.name.charAt(0) + item.name.slice(1).toLowerCase()}</span>
                  </div>
                  
                  <p className={`text-3xl font-black tracking-tight transition-all duration-300 ${isActive ? 'text-sats-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]' : 'text-sats-orange-500/70'}`}>
                    {item.commission}
                  </p>
                  
                  <p className={`text-[11px] font-medium mt-1 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                    Premium referral reward
                  </p>
                  
                  <p className={`text-[11px] font-bold mt-4 ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
            <Info className="w-4 h-4 text-sats-orange-500 shrink-0 mt-0.5" />
            <p className='text-xs text-gray-400 leading-relaxed'>
              No referral cap for Paid Tiers. Your referral commission is earned on the base task reward only - not on any premium bonus your referral receives.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}