'use client';

import React from 'react';
import { Flame, CheckCircle2, Users, Trophy } from 'lucide-react';

interface GamificationProps {
  gamification: {
    tier: string;
    level: number;
    currentStreak: number;
    progressToNextLevel: string;
  };
  tasksCompleted: number;
  activeReferrals: number;
}

export default function GamificationStats({ gamification, tasksCompleted, activeReferrals }: GamificationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Streak Card */}
      <StatCard 
        value={gamification?.currentStreak || 0}
        title="Day Streak"
        subtitle="Complete tasks daily"
        icon={<Flame className="w-5 h-5 text-sats-orange-500" />}
        iconBg="bg-sats-orange-500/10 border border-sats-orange-500/20"
      />

      {/* Tasks Card */}
      <StatCard 
        value={tasksCompleted}
        title="Tasks Completed"
        subtitle="+0 today"
        icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
        iconBg="bg-green-500/10 border border-green-500/20"
      />

      {/* Referrals Card */}
      <StatCard 
        value={activeReferrals}
        title="Active Referrals"
        subtitle="5% commission"
        icon={<Users className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/10 border border-blue-500/20"
      />

      {/* Tier Card (Special Layout with Progress Bar) */}
      <div className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-sats-orange-500/40 hover:bg-[#050505] shadow-lg">
        <div className="flex justify-between items-start mb-5">
          <h4 className="text-3xl font-black text-white capitalize">{gamification?.tier?.toLowerCase() || 'Basic'}</h4>
          <div className="w-10 h-10 rounded-full bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-sats-orange-400" />
          </div>
        </div>
        <div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-2 overflow-hidden shadow-inner">
            <div 
              className="bg-sats-orange-500 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: gamification?.progressToNextLevel || "0%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 font-bold tracking-wide">{gamification?.progressToNextLevel || "0%"} to Next Tier</p>
        </div>
      </div>

    </div>
  );
}

// Sub-component for standard stat cards
function StatCard({ value, title, subtitle, icon, iconBg }: { value: string | number, title: string, subtitle: string, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-sats-orange-500/40 hover:bg-[#050505] shadow-lg">
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