'use client';

import React from 'react';
import { Activity, CalendarDays, Mail, Sparkles, UserPlus } from 'lucide-react';
import type { UserReferral } from '@/types/user';

interface ReferralListProps {
  list: UserReferral[];
}

export default function ReferralList({ list }: ReferralListProps) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/30 shadow-lg">
      <h2 className="text-xl font-bold text-white tracking-tight mb-6 border-b border-[#1a1a1a] pb-5">My Network</h2>
      
      <div className="min-h-[200px] flex flex-col items-center justify-center">
        {list.length > 0 ? (
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
            {list.map((referral) => (
              <div
                key={referral.id}
                className="rounded-[24px] border border-[#1a1a1a] bg-[#050505] p-5 transition-all duration-300 hover:border-sats-orange-500/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {referral.fullName?.trim() || referral.email.split('@')[0]}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4 text-sky-400" />
                      <span className="truncate">{referral.email}</span>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                      referral.isActive
                        ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                        : 'border border-white/10 bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    {referral.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InfoTile
                    icon={<CalendarDays className="w-4 h-4 text-sats-orange-400" />}
                    label="Joined"
                    value={new Date(referral.joinedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  />
                  <InfoTile
                    icon={<Sparkles className="w-4 h-4 text-violet-400" />}
                    label="Total XP"
                    value={referral.totalXp.toLocaleString()}
                  />
                  <InfoTile
                    icon={<Activity className="w-4 h-4 text-emerald-400" />}
                    label="Active Days"
                    value={`${referral.daysActiveLast30}/30`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#050505] border border-[#1a1a1a] rounded-full flex items-center justify-center mb-5 mx-auto shadow-inner">
              <UserPlus className="w-7 h-7 text-gray-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Build your crew</h3>
            <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto mb-6">
              You haven&apos;t referred anyone yet. Share your link above to start earning commissions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-black/50 p-3">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
