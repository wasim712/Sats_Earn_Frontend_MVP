'use client';

import React from 'react';
import { Users, UserCheck, UserMinus, Trophy } from 'lucide-react';
import type { UserReferralStats } from '@/types/user';

interface ReferralStatsProps {
  stats: UserReferralStats;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  unit?: string;
  isHighlight?: boolean;
}

export default function ReferralStats({ stats }: ReferralStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard 
        title="Total Invited" 
        value={stats.totalInvited} 
        icon={<Users className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />} 
      />
      <StatCard 
        title="Active" 
        value={stats.activeReferrals} 
        icon={<UserCheck className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />} 
      />
      <StatCard 
        title="Inactive" 
        value={stats.inactiveReferrals} 
        icon={<UserMinus className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />} 
      />
      <StatCard 
        title="Total Earned" 
        value={stats.lifetimeEarningsSats} 
        unit="sats" 
        icon={<Trophy className="w-5 h-5 text-sats-orange-500" />} 
        isHighlight 
      />
    </div>
  );
}

function StatCard({ title, value, icon, unit, isHighlight = false }: StatCardProps) {
  const formattedValue = Number.isInteger(value)
    ? value.toLocaleString()
    : value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');

  return (
    <div className={`group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 ease-out hover:-translate-y-1 ${
      isHighlight
        ? 'border-sats-orange-500/30 bg-gradient-to-br from-sats-orange-500/10 via-[#0a0a0a] to-[#050505] hover:border-sats-orange-500/50 hover:shadow-[0_12px_40px_rgba(249,115,22,0.15)]'
        : 'border-white/[0.04] bg-gradient-to-br from-[#111] to-[#050505] hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgba(255,255,255,0.03)]'
    }`}>
      
      {/* Ambient Glow for Highlight Card */}
      {isHighlight && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sats-orange-500/20 blur-[50px] pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />
      )}

      {/* Top Row: Title & Icon */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <p className={`text-[11px] font-black uppercase tracking-widest mt-1 ${isHighlight ? 'text-sats-orange-500/80' : 'text-gray-500'}`}>
          {title}
        </p>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border shadow-inner transition-transform duration-500 group-hover:scale-110 ${
          isHighlight 
            ? 'border-sats-orange-500/20 bg-sats-orange-500/10' 
            : 'border-white/5 bg-black/40'
        }`}>
          {icon}
        </div>
      </div>

      {/* Bottom Row: Value & Unit */}
      <div className="relative z-10 flex items-baseline gap-1.5">
        <h4 className={`text-3xl sm:text-4xl font-black tracking-tight transition-all duration-300 ${
          isHighlight 
            ? 'text-sats-orange-400 group-hover:drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]' 
            : 'text-white group-hover:text-white/90'
        }`}>
          {formattedValue}
        </h4>
        {unit && (
          <span className={`text-[11px] font-bold uppercase tracking-widest ${
            isHighlight ? 'text-sats-orange-500/50' : 'text-gray-600'
          }`}>
            {unit}
          </span>
        )}
      </div>
      
    </div>
  );
}
