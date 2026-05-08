'use client';

import React from 'react';
import { 
  Flame, Calendar, Shield, Crown, Gem, Zap, 
  TrendingUp, Star, CheckCircle2, Lock,
  Medal
} from 'lucide-react';

export default function RewardsPage() {
  // ─── STREAK MILESTONES DATA ───
  const streakMilestones = [
    { days: 7, sats: 70, title: 'Week Warrior', color: 'from-orange-500/10', border: 'border-orange-500/30', iconColor: 'text-orange-500', badge: 'bg-orange-500/10 text-orange-500' },
    { days: 21, sats: 210, title: 'Three Week Hero', color: 'from-purple-500/10', border: 'border-purple-500/30', iconColor: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-500' },
    { days: 60, sats: 600, title: 'Two Month Master', color: 'from-blue-500/10', border: 'border-blue-500/30', iconColor: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-500' },
    { days: 90, sats: 900, title: 'Quarter Legend', color: 'from-emerald-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-500' },
    { days: 180, sats: 1800, title: 'Half Year Champion', color: 'from-pink-500/10', border: 'border-pink-500/30', iconColor: 'text-pink-500', badge: 'bg-pink-500/10 text-pink-500', isPro: true },
    { days: 365, sats: 3650, title: 'Annual Legend', color: 'from-red-500/10', border: 'border-red-500/30', iconColor: 'text-red-500', badge: 'bg-red-500/10 text-red-500', isProMax: true },
  ];

  // ─── FREE TIERS DATA ───
  const freeTiers = [
    { name: 'Basic', xp: '0 XP', icon: <Star className="w-5 h-5 text-gray-400" />, color: 'text-gray-400', border: 'border-gray-500/30', perks: ['Standard payouts', 'Basic tasks access'] },
    { name: 'Copper', xp: '1,000 XP', icon: <Shield className="w-5 h-5 text-[#b87333]" />, color: 'text-[#b87333]', border: 'border-[#b87333]/30', perks: ['+2% Bonus Earnings', 'Daily Quiz Access'] },
    { name: 'Bronze', xp: '5,000 XP', icon: <Medal className="w-5 h-5 text-[#cd7f32]" />, color: 'text-[#cd7f32]', border: 'border-[#cd7f32]/30', perks: ['+5% Bonus Earnings', 'Priority Tasks'] },
    { name: 'Silver', xp: '15,000 XP', icon: <Shield className="w-5 h-5 text-[#C0C0C0]" />, color: 'text-[#C0C0C0]', border: 'border-[#C0C0C0]/30', perks: ['+10% Bonus Earnings', 'Faster Withdrawals'] },
    { name: 'Gold', xp: '50,000 XP', icon: <Crown className="w-5 h-5 text-[#FFD700]" />, color: 'text-[#FFD700]', border: 'border-[#FFD700]/30', perks: ['+15% Bonus Earnings', 'VIP Support'] },
  ];

  // ─── PAID TIERS DATA ───
  const paidTiers = [
    { name: 'Platinum', price: '$9.99/mo', icon: <Gem className="w-6 h-6 text-[#e5e4e2]" />, color: 'text-[#e5e4e2]', border: 'border-[#e5e4e2]/50', bg: 'bg-[#e5e4e2]/5', perks: ['+25% Bonus Earnings', 'Zero Withdrawal Fees', 'Exclusive High-Yield Tasks'] },
    { name: 'Diamond', price: '$19.99/mo', icon: <Gem className="w-6 h-6 text-[#b9f2ff]" />, color: 'text-[#b9f2ff]', border: 'border-[#b9f2ff]/50', bg: 'bg-[#b9f2ff]/5', perks: ['+50% Bonus Earnings', 'Instant Withdrawals', 'Beta Feature Access'] },
    { name: 'Crown', price: '$49.99/mo', icon: <Crown className="w-6 h-6 text-[#ffb347]" />, color: 'text-[#ffb347]', border: 'border-[#ffb347]/50', bg: 'bg-[#ffb347]/5', perks: ['+75% Bonus Earnings', 'Personal Account Manager', 'Custom Profile Badge'] },
    { name: 'Elite', price: '$99.99/mo', icon: <Zap className="w-6 h-6 text-[#8a2be2]" />, color: 'text-[#8a2be2]', border: 'border-[#8a2be2]/50', bg: 'bg-[#8a2be2]/5', perks: ['+100% Bonus Earnings', 'Private Discord Access', 'Priority Event Invites'] },
    { name: 'Founder', price: '$249.99/mo', icon: <TrendingUp className="w-6 h-6 text-[#ff4500]" />, color: 'text-[#ff4500]', border: 'border-[#ff4500]/50', bg: 'bg-[#ff4500]/5', perks: ['+150% Bonus Earnings', 'Revenue Share Pool', 'Legendary Status'] },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      
      {/* ─── PAGE HEADER ─── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Rewards <span className="text-sats-orange-500">& Tiers</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium max-w-2xl">
          Level up your account to unlock massive earning multipliers, or maintain your daily streak to earn free bonus sats!
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════════
          1. STREAK BONUSES SECTION
      ══════════════════════════════════════════════════════════════════════════════ */}
      <div className="relative bg-[#050505] border border-[#1a1a1a] rounded-[32px] p-6 sm:p-10 overflow-hidden shadow-2xl">
        
        {/* CSS Dot Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Streak Bonuses</h2>
            <p className="text-sm text-gray-400 font-medium">Earn bonus sats for consistency!</p>
          </div>
        </div>

        {/* 3x2 Grid for Streaks */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {streakMilestones.map((streak) => (
            <div 
              key={streak.days} 
              className={`bg-gradient-to-br ${streak.color} bg-[#0a0a0a] border ${streak.border} rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-lg`}
            >
              <div className="flex justify-between items-start mb-6">
                <Calendar className={`w-7 h-7 ${streak.iconColor}`} />
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${streak.badge}`}>
                    {streak.days} Days
                  </span>
                  {streak.isPro && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> PRO
                    </span>
                  )}
                  {streak.isProMax && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> PRO MAX
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-300 mb-1">{streak.title}</p>
                <h3 className="text-3xl font-black text-sats-orange-500 tracking-tight">
                  {streak.sats.toLocaleString()} <span className="text-xl text-sats-orange-500/70">sats</span>
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-8 text-center border-t border-[#1a1a1a] pt-6">
          <p className="text-[11px] text-gray-500 font-medium max-w-3xl mx-auto">
            Streak milestone bonuses are one-time lifetime awards — earned once per milestone, just like achievement systems in Duolingo or Headspace. Streak Shields protect your progress so you never miss out.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════════
          2. FREE PROGRESSION TIERS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Free Progression Path</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Earn XP by completing tasks to climb the ranks and permanently unlock better earnings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {freeTiers.map((tier) => (
            <div key={tier.name} className={`bg-[#0a0a0a] border ${tier.border} rounded-[24px] p-6 hover:bg-[#111] transition-colors relative overflow-hidden group`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#050505] border ${tier.border} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {tier.icon}
                </div>
                <h3 className={`text-lg font-black uppercase tracking-wider ${tier.color}`}>{tier.name}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-5">{tier.xp} to unlock</p>
                
                <div className="w-full space-y-2 text-left">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-300 font-medium">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════════
          3. PREMIUM MEMBERSHIP TIERS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Crown className="w-6 h-6 text-sats-orange-500" /> Premium Memberships
            </h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Supercharge your account instantly. Skip the grind and maximize your ROI.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {paidTiers.map((tier) => (
            <div key={tier.name} className={`relative bg-[#050505] border ${tier.border} rounded-[24px] p-6 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 group`}>
              {/* Glowing Background Effect */}
              <div className={`absolute inset-0 ${tier.bg} blur-xl rounded-[24px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  {tier.icon}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tier.border} ${tier.color}`}>
                    Premium
                  </span>
                </div>
                
                <h3 className={`text-2xl font-black uppercase tracking-wider mb-1 ${tier.color}`}>{tier.name}</h3>
                <p className="text-white font-bold mb-6">{tier.price} <span className="text-xs text-gray-500 font-medium">/ month</span></p>
                
                <div className="space-y-3 mb-8">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.color}`} />
                      <span className="text-sm text-gray-300 font-medium leading-tight">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={`relative z-10 w-full py-3 rounded-xl border ${tier.border} ${tier.color} font-bold text-sm hover:bg-white/5 transition-colors`}>
                Upgrade to {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}