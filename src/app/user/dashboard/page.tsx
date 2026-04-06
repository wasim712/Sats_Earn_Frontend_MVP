'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks'; // Adjust path to your Redux hooks
import { 
  Wallet, Clock, Lock, Trophy, Flame, Activity, 
  ArrowRight, Sparkles, ChevronRight, Pickaxe, AlertTriangle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function UserDashboardPage() {
  // Grab the actual user from Redux for the personalized greeting
  const { user } = useAppSelector((state) => state.auth);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Grab the token
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        
        // 2. Fetch the real data from the backend
        const response = await fetch(`${API_URL}/users/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data. Please try again.');
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Show Error State if fetch fails
  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // Show Loading State
  if (isLoading || !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 border-4 border-sats-orange-500/30 border-t-sats-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Syncing nodes...</p>
      </div>
    );
  }

  // Destructure the freshly fetched data
  const { balances, gamification, recentActivity } = data;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      
      {/* 1. GAMIFICATION HERO BANNER */}
      <div className="relative overflow-hidden bg-sats-black-900 border border-sats-black-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sats-orange-500/5 rounded-full blur-[80px] -mr-20 -mt-20 transition-all duration-700 group-hover:bg-sats-orange-500/10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          {/* User Welcome & Badges */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sats-black-800 to-sats-black-950 border border-sats-black-700 flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8 text-sats-orange-500" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.fullName ? user.fullName.split(' ')[0] : 'Earner'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-3">
                <div className="flex items-center gap-1.5 bg-sats-orange-500/10 border border-sats-orange-500/30 px-3 py-1 rounded-lg">
                  <Trophy className="w-3.5 h-3.5 text-sats-orange-500" />
                  <span className="text-xs font-black tracking-widest text-sats-orange-400 uppercase">{gamification?.tier || 'BASIC'} TIER</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${gamification?.currentStreak > 0 ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-sats-black-800 border-sats-black-700 text-gray-400'}`}>
                  <Flame className={`w-3.5 h-3.5 ${gamification?.currentStreak > 0 ? 'fill-current' : ''}`} />
                  <span className="text-xs font-bold">{gamification?.currentStreak || 0} Day Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="w-full md:w-72 bg-sats-black-950/50 p-4 rounded-2xl border border-sats-black-800">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Level</span>
              <span className="text-xl font-black text-white">{gamification?.level || 0}</span>
            </div>
            <div className="w-full bg-sats-black-800 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sats-orange-600 to-sats-orange-400 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: gamification?.progressToNextLevel || "0%" }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-medium text-gray-500">
              <span>{gamification?.xp || 0} XP</span>
              <span>Next Level: {gamification?.progressToNextLevel || "0%"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. BALANCES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <BalanceCard 
          title="Available to Withdraw" 
          amount={balances?.available || 0} 
          icon={<Wallet className="w-5 h-5 text-green-400" />}
          glowColor="group-hover:bg-green-500/5"
        />
        <BalanceCard 
          title="Pending Verification" 
          amount={balances?.pending || 0} 
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          glowColor="group-hover:bg-yellow-500/5"
        />
        <BalanceCard 
          title="Locked (Tier Required)" 
          amount={balances?.locked || 0} 
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          glowColor="group-hover:bg-gray-500/5"
        />
        <BalanceCard 
          title="Total Lifetime Earned" 
          amount={balances?.totalLifetime || 0} 
          icon={<Trophy className="w-5 h-5 text-sats-orange-500" />}
          glowColor="group-hover:bg-sats-orange-500/5"
          isHighlight
        />
      </div>

      {/* 3. RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Activity List */}
        <div className="lg:col-span-2 bg-sats-black-900 border border-sats-black-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sats-black-800 rounded-lg"><Activity className="w-5 h-5 text-gray-300" /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
            </div>
            {recentActivity && recentActivity.length > 0 && (
              <Link href="/user/submissions" className="text-sm font-medium text-sats-orange-500 hover:text-sats-orange-400 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="min-h-[200px]">
            {recentActivity && recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {/* Map your actual recent activity here once populated */}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-sats-black-950/50 rounded-2xl border border-dashed border-sats-black-800">
                <div className="w-16 h-16 bg-sats-black-900 rounded-full flex items-center justify-center mb-4 border border-sats-black-800 shadow-inner">
                  <Pickaxe className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No activity yet</h3>
                <p className="text-gray-400 text-sm max-w-[250px] mb-6">Your task completions and payouts will appear here.</p>
                <Link 
                  href="/user/tasks"
                  className="bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold py-2.5 px-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] active:scale-95"
                >
                  Find First Task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Action/Promo */}
        <div className="bg-gradient-to-br from-sats-orange-600 to-sats-orange-500 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_15px_40px_rgba(249,115,22,0.2)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Ready to stack more?</h3>
            <p className="text-orange-950 font-medium mb-8 leading-relaxed">New high-reward campaigns have just been posted to the board. Jump in before they max out.</p>
          </div>
          
          <Link 
            href="/user/tasks"
            className="relative z-10 flex items-center justify-between w-full bg-black hover:bg-sats-black-900 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] group"
          >
            <span>Browse Tasks</span>
            <ArrowRight className="w-5 h-5 text-sats-orange-500 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}

// Mini Component for Balances
function BalanceCard({ title, amount, icon, glowColor, isHighlight = false }: { title: string, amount: number, icon: React.ReactNode, glowColor: string, isHighlight?: boolean }) {
  return (
    <div className={`relative group bg-sats-black-900 border ${isHighlight ? 'border-sats-orange-500/30' : 'border-sats-black-800'} rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-sats-black-700 overflow-hidden`}>
      <div className={`absolute inset-0 transition-colors duration-500 ${glowColor} pointer-events-none`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-sats-black-950 rounded-xl border border-sats-black-800 shadow-inner">
            {icon}
          </div>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <h4 className={`text-2xl sm:text-3xl font-black tracking-tighter ${isHighlight ? 'text-sats-orange-500' : 'text-white'}`}>
            {amount?.toLocaleString() || 0}
          </h4>
          <span className="text-sm font-bold text-gray-500">Sats</span>
        </div>
      </div>
    </div>
  );
}