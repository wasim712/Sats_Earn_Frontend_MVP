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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Invited" value={stats.totalInvited} icon={<Users className="text-sats-orange-500" />} />
      <StatCard title="Active" value={stats.activeReferrals} icon={<UserCheck className="text-green-500" />} />
      <StatCard title="Inactive" value={stats.inactiveReferrals} icon={<UserMinus className="text-red-500" />} />
      <StatCard title="Total Earned" value={stats.lifetimeEarningsSats} unit="sats" icon={<Trophy className="text-yellow-500" />} isHighlight />
    </div>
  );
}

function StatCard({ title, value, icon, unit, isHighlight = false }: StatCardProps) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 transition-all duration-300 hover:border-sats-orange-500/40 hover:bg-[#050505] shadow-lg">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-baseline gap-1.5">
          <h4 className={`text-3xl font-black ${isHighlight ? 'text-sats-orange-500' : 'text-white'}`}>{value.toLocaleString()}</h4>
          {unit ? <span className="text-xs font-bold text-gray-500">{unit}</span> : null}
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-inner">
          {icon}
        </div>
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    </div>
  );
}
