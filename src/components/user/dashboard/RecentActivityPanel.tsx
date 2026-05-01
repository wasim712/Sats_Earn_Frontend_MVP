'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowRight, X, Target, Users,
  ArrowUpRight, AlertTriangle, Gift, Clock
} from 'lucide-react';
import type { UserDashboard } from '@/types/user';

type Transaction = UserDashboard['recentActivity'][number];

interface RecentActivityPanelProps {
  activities: Transaction[];
}

export default function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityUI = (type: string) => {
    switch (type) {
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
      default:
        return { icon: <Activity className="w-4 h-4 text-gray-400" />, bg: "bg-[#1a1a1a] border-[#2a2a2a]", sign: "" };
    }
  };

  return (
    <>
      <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/30 shadow-lg group relative z-10">
        <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-5">
          <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-sats-orange-50 transition-colors">Recent Activity</h2>
          {activities && activities.length > 0 && (
            <button onClick={() => setIsModalOpen(true)} className="text-sm font-extrabold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
              View All
            </button>
          )}
        </div>

        <div className="min-h-37.5">
          {activities && activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.slice(0, 3).map((activity, idx) => {
                const ui = getActivityUI(activity.type);
                return (
                  <li key={idx} className="flex items-center justify-between p-3 bg-sats-black-950 border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${ui.bg}`}>
                        {ui.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{activity.description || 'System Transaction'}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-black whitespace-nowrap ${activity.amountSats < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {ui.sign}{Math.abs(activity.amountSats).toLocaleString()} Sats
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
                const ui = getActivityUI(activity.type);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#111] border border-[#1a1a1a] rounded-2xl hover:border-[#2a2a2a] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${ui.bg}`}>
                        {ui.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{activity.description || 'System Transaction'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-sats-black-950 px-2 py-0.5 rounded border border-[#2a2a2a]">
                            {activity.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">{formatDate(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-base font-black whitespace-nowrap pl-4 ${activity.amountSats < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {ui.sign}{Math.abs(activity.amountSats).toLocaleString()}
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
