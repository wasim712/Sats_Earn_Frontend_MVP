'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { AlertTriangle } from 'lucide-react';

import TotalBalanceCard from '@/components/user/dashboard/TotalBalanceCard';
import GamificationStats from '@/components/user/dashboard/GamificationStats';
import RecentActivityPanel from '@/components/user/dashboard/RecentActivityPanel';
import { fetchUserDashboard } from '@/features/user/userDashboardSlice';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useAppSelector((state) => state.userDashboard);

  useEffect(() => {
    dispatch(fetchUserDashboard());
  }, [dispatch]);

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // --- THE SKELETON LOADER ---
  if (isLoading || !data) {
    return (
      <div className="space-y-8 animate-pulse pb-20 w-full p-2 md:p-4 lg:p-6">
        
        {/* Header Skeleton */}
        <div>
          <div className="h-10 w-48 bg-[#1a1a1a] rounded-xl mb-3"></div>
          <div className="h-5 w-72 bg-[#1a1a1a] rounded-lg"></div>
        </div>

        {/* Total Balance Card Skeleton */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 shadow-2xl">
          <div className="h-4 w-32 bg-[#1a1a1a] rounded-md mb-6"></div>
          <div className="h-16 w-64 sm:w-80 bg-[#1a1a1a] rounded-2xl mb-10"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 h-28 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="h-3 w-16 bg-[#1a1a1a] rounded"></div>
                  <div className="h-6 w-6 bg-[#1a1a1a] rounded-lg"></div>
                </div>
                <div className="h-6 w-20 bg-[#1a1a1a] rounded-lg"></div>
              </div>
            ))}
          </div>
          
          <div className="h-14 w-full bg-[#1a1a1a] rounded-2xl"></div>
        </div>

        {/* Gamification Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-black border border-[#1a1a1a] rounded-[24px] p-6 h-40 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-5">
                <div className="h-8 w-12 bg-[#1a1a1a] rounded-lg"></div>
                <div className="h-10 w-10 bg-[#1a1a1a] rounded-full"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-[#1a1a1a] rounded-md mb-2"></div>
                <div className="h-3 w-16 bg-[#1a1a1a] rounded-md"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-[#1a1a1a] pb-5">
            <div className="h-6 w-40 bg-[#1a1a1a] rounded-lg"></div>
            <div className="h-4 w-16 bg-[#1a1a1a] rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-[#050505] border border-[#1a1a1a] rounded-xl"></div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-4 lg:p-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">
          Welcome back, {user?.fullName ? user.fullName.split(' ')[0].charAt(0).toUpperCase() + user.fullName.split(' ')[0].slice(1) : 'Earner'}! Let&apos;s stack some sats 🚀
        </p>
      </div>

      {/* MODULAR SECTIONS */}
      <TotalBalanceCard balances={data.balances} />
      
      <GamificationStats 
        gamification={data.gamification} 
        tasksCompleted={data.gamification.tasksCompleted} 
        activeReferrals={data.gamification.activeReferrals} 
      />
      
      <RecentActivityPanel activities={data.recentActivity} />

    </div>
  );
}
