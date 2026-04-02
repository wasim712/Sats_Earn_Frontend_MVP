'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminMetrics } from '@/features/admin/adminSlice';
import { Users, Activity, FileWarning, Loader2, UserPlus, CheckCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { metrics, isLoading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminMetrics());
  }, [dispatch]);

  if (isLoading && !metrics) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-sats-orange-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Syncing live platform metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center font-medium">
        Error loading metrics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold text-white">Metrics Dashboard</h1>
        <p className="text-gray-400 mt-2">Real-time data fetched from PostgreSQL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <MetricCard 
          title="Total Registered Users" 
          value={metrics?.users?.total || 0}
          subtitle="All-time accounts"
          icon={<Users className="w-6 h-6 text-blue-400" />} 
          bg="bg-blue-500/10" 
          borderColor="border-blue-500/20"
        />
        
        <MetricCard 
          title="Active Campaigns" 
          value={metrics?.campaigns?.active || 0}
          subtitle="Currently live and paying"
          icon={<Activity className="w-6 h-6 text-sats-orange-500" />} 
          bg="bg-sats-orange-500/10" 
          borderColor="border-sats-orange-500/30"
          textColor="text-white"
        />

        <MetricCard 
          title="Pending Manual Reviews" 
          value={metrics?.submissions?.pendingManualReview || 0}
          subtitle="Awaiting admin approval"
          icon={<FileWarning className="w-6 h-6 text-sats-orange-400" />} 
          bg="bg-sats-orange-500/10" 
          borderColor={metrics?.submissions?.pendingManualReview ? 'border-sats-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-sats-orange-500/20'}
          textColor={metrics?.submissions?.pendingManualReview ? 'text-sats-orange-400' : 'text-white'}
        />

      </div>

      <h2 className="text-xl font-bold text-white pt-4 border-t border-sats-black-800">24-Hour Velocity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <MetricCard 
          title="New Users (Last 24h)" 
          value={metrics?.users?.newLast24h || 0}
          subtitle="Accounts created today"
          icon={<UserPlus className="w-6 h-6 text-purple-400" />} 
          bg="bg-purple-500/10" 
          borderColor="border-purple-500/20"
        />

        <MetricCard 
          title="Completed Tasks (Last 24h)" 
          value={metrics?.submissions?.completedLast24h || 0}
          subtitle="Successfully processed submissions"
          icon={<CheckCircle className="w-6 h-6 text-green-400" />} 
          bg="bg-green-500/10" 
          borderColor="border-green-500/20"
        />

      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetricCard({ title, value, subtitle, icon, bg, borderColor, textColor = "text-white" }: any) {
  return (
    <div className={`bg-sats-black-950 border ${borderColor} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden`}>
      {/* Subtle background glow inside the card */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] ${bg} opacity-50`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${bg}`}>
            {icon}
          </div>
        </div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className={`text-4xl font-extrabold mt-1 tracking-tight ${textColor}`}>{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-3 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}