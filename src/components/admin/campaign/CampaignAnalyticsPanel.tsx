'use client';

import React from 'react';
import { Activity, BarChart3, Check, CheckCircle2, Clock, Medal, Target, Users, XCircle, Zap } from 'lucide-react';
import { AnalyticStatCard } from './CampaignDetailShared';

type CampaignAnalytics = {
  totalSubmissions?: number;
  statusCounts?: { verified?: number; pending?: number; rejected?: number };
  tierDistribution?: Record<string, number>;
  satsByTierDistribution?: Record<string, number>;
};

export function CampaignAnalyticsPanel({
  analytics,
  totalSpent,
  averageReward,
  totalRewardedUsers,
  campaignTaskCount,
}: {
  analytics: CampaignAnalytics;
  totalSpent: number;
  averageReward: number;
  totalRewardedUsers: number;
  campaignTaskCount: number;
}) {
  return (
    <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
      <div className="bg-[#050505] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 h-full">
        <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-6">
          <div className="p-2.5 bg-[#111] rounded-xl border border-[#2a2a2a] shadow-inner">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Real-Time Traffic</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <AnalyticStatCard title="Total Traffic" value={analytics.totalSubmissions || 0} icon={<Activity className="w-4 h-4 text-gray-400" />} color="bg-[#0a0a0a] border-[#1a1a1a] text-white" />
            <AnalyticStatCard title="Verified" value={analytics.statusCounts?.verified || 0} icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} color="bg-green-500/5 border-green-500/20 text-green-400" />
            <AnalyticStatCard title="Pending Review" value={analytics.statusCounts?.pending || 0} icon={<Clock className="w-4 h-4 text-yellow-500" />} color="bg-yellow-500/5 border-yellow-500/20 text-yellow-400" />
            <AnalyticStatCard title="Rejected" value={analytics.statusCounts?.rejected || 0} icon={<XCircle className="w-4 h-4 text-red-500" />} color="bg-red-500/5 border-red-500/20 text-red-400" />
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Zap className="w-4 h-4 text-sats-orange-500" />
              <h3 className="font-bold text-sm">Sats Distribution</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <AnalyticStatCard title="Total Spent" value={totalSpent} icon={<Zap className="w-4 h-4 text-sats-orange-500" />} color="bg-sats-orange-500/5 border-sats-orange-500/20 text-sats-orange-400" suffix="sats" />
              <AnalyticStatCard title="Avg Reward" value={averageReward} icon={<Target className="w-4 h-4 text-blue-400" />} color="bg-blue-500/5 border-blue-500/20 text-blue-400" suffix="sats" />
              <AnalyticStatCard title="Paid Users" value={totalRewardedUsers} icon={<Users className="w-4 h-4 text-emerald-400" />} color="bg-emerald-500/5 border-emerald-500/20 text-emerald-400" />
              <AnalyticStatCard title="Campaign Tasks" value={campaignTaskCount} icon={<Check className="w-4 h-4 text-purple-400" />} color="bg-purple-500/5 border-purple-500/20 text-purple-400" />
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sats By Tier</span>
                <span className="text-[10px] font-bold text-sats-orange-400 uppercase tracking-widest">Historical Paid Value</span>
              </div>

              {Object.keys(analytics.satsByTierDistribution || {}).length > 0 ? (
                <ul className="space-y-3">
                  {Object.entries(analytics.satsByTierDistribution || {})
                    .sort(([, firstValue], [, secondValue]) => Number(secondValue) - Number(firstValue))
                    .map(([tier, sats]) => (
                      <li key={tier} className="flex justify-between items-center gap-3 text-sm">
                        <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{tier}</span>
                        <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{Number(sats || 0).toLocaleString()} sats</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-600 font-medium italic text-center py-2">No rewarded sats have been distributed for this campaign yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <Medal className="w-4 h-4 text-yellow-500" />
              <h3 className="font-bold text-sm">Tier Distribution</h3>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4">
              {Object.keys(analytics.tierDistribution || {}).length > 0 ? (
                <ul className="space-y-3">
                  {Object.entries(analytics.tierDistribution || {}).map(([tier, count]) => (
                    <li key={tier} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{tier}</span>
                      <span className="font-bold text-white px-2 py-0.5 bg-[#111] border border-[#2a2a2a] rounded-md">{String(count)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-600 font-medium italic text-center py-2">No tier data collected yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
