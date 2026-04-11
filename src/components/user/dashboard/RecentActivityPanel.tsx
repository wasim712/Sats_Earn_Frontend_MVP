'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';

interface RecentActivityPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities: any[]; 
}

export default function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/30 shadow-lg group">
      <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-5">
        <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-sats-orange-50 transition-colors">Recent Activity</h2>
        {activities && activities.length > 0 && (
          <Link href="/user/submissions" className="text-sm font-extrabold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
            View All
          </Link>
        )}
      </div>

      <div className="min-h-[150px]">
        {activities && activities.length > 0 ? (
          <ul className="space-y-4">
            {/* TODO: Map your actual recent activity here later! */}
          </ul>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 bg-[#050505] border border-[#1a1a1a] rounded-full flex items-center justify-center mb-4 shadow-inner">
               <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium text-sm mb-6">
              No recent activity found. Start a task to begin earning!
            </p>
            
            {/* Direct CTA to Tasks */}
            <Link 
              href="/user/tasks"
              className="inline-flex items-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold text-sm py-2.5 px-6 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] active:scale-95"
            >
              Browse Tasks
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}