'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowRight, X, Target, Users,
  ArrowUpRight, AlertTriangle, Gift, Clock,
  AwardIcon
} from 'lucide-react';
import type { UserDashboard } from '@/types/user';

type Transaction = NonNullable<UserDashboard['recentActivity']>[number];

interface RecentActivityPanelProps {
  activities: Transaction[];
}

export default function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getActivityCategory = (activity: Transaction) => {
    const type = String(activity.type || '').toUpperCase();
    const description = String(activity.description || '').toLowerCase();

    if (type === 'WITHDRAWAL' || description.includes('withdrawal')) {
      return 'WITHDRAWAL';
    }

    if (
      type === 'PURCHASED' ||
      description.includes('premium') ||
      description.includes('membership') ||
      description.includes('upgrade using sats') ||
      description.includes('upgraded to') ||
      description.includes('purchase')
    ) {
      return 'PURCHASED';
    }

    return type;
  };

  const getDisplayAmount = (activity: Transaction) => {
    let absoluteTotal = 0;

    if (activity.type === 'REFERRAL_BONUS' && activity.amountMsats !== null && activity.amountMsats !== undefined) {
      absoluteTotal = Math.abs(Number(activity.amountMsats)) / 1000;
    } else {
      const wholeSats = Number(activity.amountSats || 0);
      const msats = Number(activity.amountMsats || 0);
      absoluteTotal = Math.abs(wholeSats) + Math.abs(msats) / 1000;
    }

    if (Number.isInteger(absoluteTotal)) {
      return absoluteTotal.toLocaleString();
    }

    return absoluteTotal.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  };

  const getDisplayDescription = (activity: Transaction) => {
    let desc = activity.description || 'System Transaction';
    if (activity.type === 'REFERRAL_BONUS') {
      desc = desc.replace(/Commission from/i, 'Referral from').replace(/\(admin approved\)/i, '').trim();
    }
    return desc;
  };

  const isNegativeActivity = (activity: Transaction) => {
    return Number(activity.amountSats || 0) < 0 || Number(activity.amountMsats || 0) < 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityUI = (activity: Transaction) => {
    switch (getActivityCategory(activity)) {
      case 'TASK_REWARD':
        return { icon: <Target className="w-4 h-4 text-green-400" />, bg: "bg-green-500/10 border-green-500/20", sign: "+" };
      case 'REFERRAL_BONUS':
        return { icon: <Users className="w-4 h-4 text-blue-400" />, bg: "bg-blue-500/10 border-blue-500/20", sign: "+" };
      case 'WELCOME_BONUS':
      case 'STREAK_BONUS':
      case 'DAILY_QUIZ_REWARD':
        return { icon: <Gift className="w-4 h-4 text-purple-400" />, bg: "bg-purple-500/10 border-purple-500/20", sign: "+" };
      case 'WITHDRAWAL':
        return { icon: <ArrowUpRight className="w-4 h-4 text-sats-orange-500" />, bg: "bg-sats-orange-500/10 border-sats-orange-500/20", sign: "-" };
      case 'PENALTY':
        return { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, bg: "bg-red-500/10 border-red-500/20", sign: "-" };
      case 'PURCHASED':
        return { icon: <AwardIcon className="w-4 h-4 text-fuchsia-400" />, bg: "bg-fuchsia-500/10 border-fuchsia-500/20", sign: "-" };
      default:
        return { icon: <Activity className="w-4 h-4 text-gray-400" />, bg: "bg-[#1a1a1a] border-[#2a2a2a]", sign: "" };
    }
  };

  const getActivityTypeLabel = (activity: Transaction) => {
    switch (getActivityCategory(activity)) {
      case 'PURCHASED':
        return 'Premium Purchase';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'REFERRAL_BONUS':
        return 'Referral';
      default:
        return String(activity.type || 'SYSTEM').replace(/_/g, ' ');
    }
  };

  return (
    <>
      <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/30 shadow-lg group relative z-10">
        <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-5">
          <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-sats-orange-50 transition-colors">Recent Activity</h2>
          {activities && activities.length > 0 && (
            <button onClick={() => setIsModalOpen(true)} className="cursor-pointer text-sm font-extrabold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
              View More
            </button>
          )}
        </div>

        <div className="min-h-37.5">
          {activities && activities.length > 0 ? (
              <ul className="space-y-3">
                {activities.slice(0, 3).map((activity, idx) => {
                const ui = getActivityUI(activity);
                return (
                  <li key={idx} className="flex items-center justify-between p-3 bg-sats-black-950 border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${ui.bg}`}>
                        {ui.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{getDisplayDescription(activity)}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-black font-mono tracking-tight whitespace-nowrap ${
                      getDisplayDescription(activity).toLowerCase().includes('sat-worm xp') || getDisplayDescription(activity).toLowerCase().includes('xp reward')
                        ? 'text-purple-400'
                        : isNegativeActivity(activity)
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}>
                      {getDisplayDescription(activity).toLowerCase().includes('sat-worm xp') || getDisplayDescription(activity).toLowerCase().includes('xp reward') ? (
                        <>+5 <span className="text-xs">XP</span></>
                      ) : (
                        <>{ui.sign}{getDisplayAmount(activity)} sats</>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 bg-sats-black-950 border border-[#1a1a1a] rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <Activity className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium text-sm mb-6">
                No recent activity found. Start a task to begin earning!
              </p>
              <Link href="/user/tasks" className="inline-flex items-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-sm py-2.5 px-6 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] active:scale-95">
                Browse Tasks
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-sats-black-900 border border-[#2a2a2a] rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a] bg-sats-black-950">
              <div>
                <h3 className="text-xl font-black text-white">Transaction History</h3>
                <p className="text-xs text-gray-500 mt-1">Your recent earnings and payouts.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {activities.map((activity, idx) => {
                const ui = getActivityUI(activity);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#111] border border-[#1a1a1a] rounded-2xl hover:border-[#2a2a2a] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${ui.bg}`}>
                        {ui.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{getDisplayDescription(activity)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-sats-black-950 px-2 py-0.5 rounded border border-[#2a2a2a]">
                            {getActivityTypeLabel(activity)}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">{formatDate(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-base font-black font-mono tracking-tight whitespace-nowrap pl-4 ${
                      getDisplayDescription(activity).toLowerCase().includes('sat-worm xp') || getDisplayDescription(activity).toLowerCase().includes('xp reward')
                        ? 'text-purple-400'
                        : isNegativeActivity(activity)
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}>
                      {getDisplayDescription(activity).toLowerCase().includes('sat-worm xp') || getDisplayDescription(activity).toLowerCase().includes('xp reward') ? (
                        <>+5 <span className="text-sm">XP</span></>
                      ) : (
                        <>{ui.sign}{getDisplayAmount(activity)} sats</>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#1a1a1a] bg-sats-black-950 text-center">
              <p className="text-xs text-gray-500 font-medium">Showing your {activities.length} most recent transactions.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
