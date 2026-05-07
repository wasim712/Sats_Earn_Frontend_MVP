'use client';

import React from 'react';
import { Flame, CheckCircle2, Users, Trophy, Crown } from 'lucide-react';

interface GamificationProps {
  gamification: {
    totalXp: number;
    level: number;
    activeTier: string;
    underlyingFreeTier: string;
    isPremium: boolean;
    currentStreak: number;
    xpDisplay: string;
    progressPercent: number;
    nextTier?: string | null;
    xpToNextTier?: number;
  };
  tasksCompleted: number;
  activeReferrals: number;
  hasUnreadStreakReward?: boolean;
  latestStreakRewardText?: string | null;
}

export default function GamificationStats({ gamification, tasksCompleted, activeReferrals, hasUnreadStreakReward = false, latestStreakRewardText = null }: GamificationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Streak Card */}
      <StatCard 
        value={gamification?.currentStreak || 0}
        title="Day Streak"
        subtitle={latestStreakRewardText || 'Complete tasks daily'}
        icon={<Flame className="w-5 h-5 text-sats-orange-500" />}
        iconBg="bg-sats-orange-500/10 border border-sats-orange-500/20"
        hasAlert={hasUnreadStreakReward}
      />

      {/* Tasks Card */}
      <StatCard 
        value={tasksCompleted || 0}
        title="Tasks Completed"
        subtitle="Total approved"
        icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
        iconBg="bg-green-500/10 border border-green-500/20"
      />

      {/* Referrals Card */}
      <StatCard 
        value={activeReferrals || 0}
        title="Active Referrals"
        subtitle="Earning commissions"
        icon={<Users className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/10 border border-blue-500/20"
      />

      {/* Tier & XP Card (Special Layout with Progress Bar) */}
      <div className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#2a2a2a] hover:bg-[#050505] shadow-lg relative overflow-hidden">
        
        <div className="flex justify-between items-start mb-5">
          <div>
            <h4 className="text-3xl font-black text-white capitalize">
              {gamification?.activeTier?.toLowerCase() || 'Basic'}
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 tracking-wider uppercase">
              Level {gamification?.level || 1}
            </p>
          </div>
          
          {/* Dynamic Icon: Crown for Premium, Trophy for Free */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${gamification?.isPremium ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-sats-orange-500/10 border border-sats-orange-500/20'}`}>
            {gamification?.isPremium ? (
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : (
              <Trophy className="w-5 h-5 text-sats-orange-400" />
            )}
          </div>
        </div>
        
        <div>
          {/* Progress Bar */}
          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-2 overflow-hidden shadow-inner">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${gamification?.isPremium ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-sats-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}
              style={{ width: `${gamification?.progressPercent || 0}%` }}
            ></div>
          </div>
          
          {/* Dynamic XP Text */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 font-bold tracking-wide">
              {gamification?.xpDisplay || "0 XP"}
            </p>
            <p className={`text-xs font-black ${gamification?.isPremium ? 'text-yellow-500' : 'text-sats-orange-500'}`}>
              {Math.floor(gamification?.progressPercent || 0)}%
            </p>
          </div>
          <p className="text-[11px] text-gray-500 font-semibold mt-2">
            {gamification?.nextTier
              ? `${gamification?.xpToNextTier || 0} XP to reach ${gamification.nextTier}`
              : 'You are at the top free tier.'}
          </p>
        </div>
      </div>

    </div>
  );
}

// Sub-component for standard stat cards
function StatCard({ value, title, subtitle, icon, iconBg, hasAlert = false }: { value: string | number, title: string, subtitle: string, icon: React.ReactNode, iconBg: string, hasAlert?: boolean }) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#2a2a2a] hover:bg-[#050505] shadow-lg relative overflow-hidden">
      {hasAlert && <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />}
      <div className="flex justify-between items-start mb-5">
        <h4 className="text-3xl font-black text-white tracking-tight">{value}</h4>
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-200">{title}</p>
        <p className="text-xs text-gray-500 font-semibold mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
