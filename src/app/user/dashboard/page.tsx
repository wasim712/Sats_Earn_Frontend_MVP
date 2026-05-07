'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { 
  AlertTriangle, CheckCircle2, Clock3, LockKeyhole, XCircle, 
  Flame, Medal, Star, Wallet, Activity, ArrowRight, Zap, Trophy
} from 'lucide-react';
import Link from 'next/link';

import { fetchUserDashboard } from '@/features/user/userDashboardSlice';
import { fetchUserNotifications } from '@/features/user/userNotificationsSlice';
import RecentActivityPanel from '@/components/user/dashboard/RecentActivityPanel';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useAppSelector((state) => state.userDashboard);
  const { notifications } = useAppSelector((state) => state.userNotifications);

  // Sats to BTC Converter State (Only applies to Available Balance)
  const [showBtc, setShowBtc] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDashboard());
    dispatch(fetchUserNotifications());
  }, [dispatch]);

  // --- HELPERS ---
  const getFirstName = () => {
    return user?.fullName ? user.fullName.split(' ')[0].charAt(0).toUpperCase() + user.fullName.split(' ')[0].slice(1) : 'Earner';
  };

  const getTierColor = (tier: string) => {
    const t = tier?.toUpperCase() || 'BASIC';
    if (t.includes('GOLD')) return 'text-[#FFD700]';
    if (t.includes('SILVER')) return 'text-[#C0C0C0]';
    if (t.includes('BRONZE')) return 'text-[#cd7f32]';
    if (t.includes('DIAMOND') || t.includes('PLATINUM')) return 'text-[#b9f2ff]';
    return 'text-zinc-400';
  };

  const formatAvailableBalance = (sats: number) => {
    if (showBtc) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-black tracking-tight">{(sats / 100000000).toFixed(8)}</span>
          <span className="text-2xl font-bold text-gray-300 mb-1">BTC</span>
        </div>
      );
    }
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-black tracking-tight">{sats.toLocaleString()}</span>
        <span className="text-2xl font-bold text-gray-400 mb-1">.00</span>
        <span className="text-2xl font-bold text-white ml-1 mb-1">sats</span>
      </div>
    );
  };

  // Assuming 1 BTC = ~₹5,500,000 INR for estimated conversion
  const getFiatValue = (sats: number) => {
    const inrValue = (sats / 100000000) * 5500000;
    return `≈ ₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR at current rate`;
  };

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SKELETON LOADER
  // ══════════════════════════════════════════════════════════════════════════════
  if (isLoading || !data || !data.balances || !data.gamification) {
    return (
      <div className="space-y-8 animate-pulse pb-20 w-full p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="h-10 w-64 bg-white/5 rounded-xl mb-2" />
            <div className="h-5 w-48 bg-white/[0.03] rounded-lg" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => <div key={i} className="h-10 w-28 bg-white/5 rounded-full" />)}
          </div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="h-[160px] bg-sats-orange-500/10 rounded-[24px] p-6" />
          {[1, 2, 3].map(i => <div key={i} className="h-[160px] bg-[#0a0a0a] rounded-[24px] border border-[#1a1a1a]" />)}
        </div>

        {/* Weekly Streak Skeleton */}
        <div className="h-[120px] bg-[#0a0a0a] rounded-[24px] border border-[#1a1a1a]" />

        {/* Bottom Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-[400px] bg-[#0a0a0a] rounded-[24px] border border-[#1a1a1a]" />
          <div className="xl:col-span-1 h-[400px] bg-[#0a0a0a] rounded-[24px] border border-[#1a1a1a]" />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // CALCULATED VALUES
  // ══════════════════════════════════════════════════════════════════════════════
  const totalLifetimeEarned = (data.balances?.available || 0) + (data.balances?.locked || 0) + (data.balances?.pending || 0); // Mocking total earned
  const currentStreak = data.gamification?.currentStreak || 0;
  const activeTier = data.gamification?.activeTier || 'Basic';
  const currentLevel = data.gamification?.level || 1;
  const unreadStreakReward = notifications.find(
    (notification) => !notification.isRead && notification.title.toLowerCase().includes('streak milestone reward unlocked'),
  );
  const streakMilestones = [
    { days: 7, sats: 70 },
    { days: 21, sats: 210 },
    { days: 60, sats: 600 },
    { days: 90, sats: 900 },
    { days: 180, sats: 1800 },
    { days: 365, sats: 3650 },
  ];
  const nextStreakMilestone = streakMilestones.find((milestone) => currentStreak < milestone.days) || null;
  const streakProgressMax = nextStreakMilestone?.days || 365;
  const streakProgressPercent = Math.min((currentStreak / streakProgressMax) * 100, 100);

  // Dummy Leaderboard Data
  const dummyLeaderboard = [
    { rank: 1, name: 'beckham2yyy', handle: 'BSC4To...hy1b', amount: '$18.81' },
    { rank: 2, name: 'yobrosol', handle: 'ENTn1j...jkjh', amount: '$17.06' },
    { rank: 3, name: 'Vic_Xavy', handle: 'H6moJj...VpJo', amount: '$16.56' },
    { rank: 4, name: 'katerinaram...', handle: '9cEUXn...vzFU', amount: '$16.17' },
    { rank: 5, name: 'LadyZeefi', handle: '4uPSfK...f4FD', amount: '$14.36' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      
      {/* ─── 1. HEADER & TOP BADGES ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="text-blue-400">{getFirstName()}</span>!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium flex items-center gap-2">
            Let&apos;s earn some rewards today <span className="text-lg">🎯</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            {unreadStreakReward && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />}
            <Flame className="w-4 h-4 text-sats-orange-500" />
            <span className="text-xs font-bold text-white">{currentStreak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            <Medal className={`w-4 h-4 ${getTierColor(activeTier)}`} />
            <span className="text-xs font-bold text-white capitalize">{activeTier} Tier</span>
          </div>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] px-4 py-2 rounded-full shadow-sm hover:bg-[#1a1a1a] transition-colors cursor-default">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-white">Lvl {currentLevel}</span>
          </div>
        </div>
      </div>

      {/* ─── 2. STATS GRID (4 Cards) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Main Balance (The Blue/Orange one from the design) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#1c2e4a] via-[#101b30] to-[#050505] border border-blue-500/20 rounded-[24px] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs font-black text-blue-200 uppercase tracking-widest">Available Balance</p>
            </div>

            {/* Premium BTC Toggle */}
            <div className="flex bg-[#050505]/50 border border-blue-500/20 rounded-full p-1 backdrop-blur-sm">
              <button 
                onClick={() => setShowBtc(false)} 
                className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${!showBtc ? 'bg-sats-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setShowBtc(true)} 
                className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all ${showBtc ? 'bg-sats-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                ₿
              </button>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="text-white mb-2 drop-shadow-md ">
              {formatAvailableBalance(data.balances?.available || 0)}
            </div>
            <p className="text-sm font-medium text-blue-200/60">
              {getFiatValue(data.balances?.available || 0)}
            </p>
          </div>
        </div>

        {/* Card 2: Total Earned */}
        {/* <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Earned</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{totalLifetimeEarned.toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-600 mt-1">Lifetime Sats</p>
          </div>
        </div> */}

        {/* Card 3: Total XP */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total XP</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{(data.gamification?.totalXp || 0).toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-600 mt-1">Experience Points</p>
          </div>
        </div>

        {/* Card 4: Locked Balance */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <LockKeyhole className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Locked Balance</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{(data.balances?.locked || 0).toLocaleString()}</h3>
            <p className="text-sm font-bold text-gray-600 mt-1">Pending Verification</p>
          </div>
        </div>

      </div>

      {/* ─── 3. WEEKLY STREAK PROGRESS ─── */}
      {unreadStreakReward && (
        <div className="mb-6 rounded-[24px] border border-red-500/20 bg-red-500/10 px-5 py-4 flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
          <div className="mt-0.5 w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div>
            <p className="text-sm font-black text-white">Streak Milestone Reward Received</p>
            <p className="text-sm text-red-100/90 mt-1">{unreadStreakReward.message}</p>
            <Link href="/user/notifications" className="inline-flex mt-3 text-xs font-bold text-red-300 hover:text-white transition-colors">
              View notification
            </Link>
          </div>
        </div>
      )}
      <div className="mb-6 rounded-[24px] border border-[#1a1a1a] bg-[#080808] px-5 py-5 sm:px-6 sm:py-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Streak Milestones</p>
            <h3 className="text-xl font-black text-white mt-1">{currentStreak} day streak</h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Next Reward</p>
            <p className="text-sm font-black text-sats-orange-400 mt-1">
              {nextStreakMilestone
                ? `${nextStreakMilestone.days} days • +${nextStreakMilestone.sats.toLocaleString()} sats`
                : 'All milestone rewards unlocked'}
            </p>
          </div>
        </div>

        <div className="relative pt-8 pb-4">
          <div className="h-2 rounded-full bg-[#141414] border border-[#222] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sats-orange-500 via-yellow-500 to-red-500 transition-all duration-1000"
              style={{ width: `${streakProgressPercent}%` }}
            />
          </div>

          {streakMilestones.map((milestone) => {
            const position = (milestone.days / 365) * 100;
            const achieved = currentStreak >= milestone.days;
            const isNext = nextStreakMilestone?.days === milestone.days;

            return (
              <div
                key={milestone.days}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      achieved
                        ? 'bg-green-400 border-green-300 shadow-[0_0_12px_rgba(74,222,128,0.8)]'
                        : isNext
                          ? 'bg-red-500 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
                          : 'bg-[#111] border-[#333]'
                    }`}
                  />
                  <div className="text-center min-w-[52px]">
                    <p className={`text-[10px] font-black ${achieved ? 'text-green-400' : isNext ? 'text-red-400' : 'text-gray-500'}`}>
                      {milestone.days}d
                    </p>
                    <p className="text-[10px] text-gray-600 font-bold">+{milestone.sats}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-gray-400 font-medium">
          Complete at least 1 valid task or quiz each day to keep your streak alive.
        </p>
      </div>
      

      {/* ─── 4. BOTTOM GRID (Submissions & Extras) ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Recent Submissions */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#080808] border border-[#1a1a1a] rounded-[24px] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Submissions</h2>
              <Link href="/user/submissions" className="text-sm font-bold text-sats-orange-500 hover:text-sats-orange-400 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {data.recentSubmissions && data.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {data.recentSubmissions.slice(0, 4).map((submission) => {
                  const statusUi = getSubmissionStatusUi(submission.status);
                  
                  return (
                    <div key={submission.id} className="bg-[#050505] border border-transparent hover:border-[#2a2a2a] hover:bg-[#0a0a0a] rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group">
                      <div className="flex items-center gap-4">
                        {/* Minimal Status Icon */}
                        <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${statusUi.badge.replace('text-', 'border-').replace('/10', '/20')} bg-[#111] group-hover:scale-105 transition-transform`}>
                          {statusUi.icon}
                        </div>
                        
                        <div>
                          <h3 className="text-white font-bold text-[15px] leading-snug">{submission.taskTitle}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[11px] text-gray-500 font-medium">by {submission.campaignTitle.substring(0, 20)}...</span>
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${statusUi.badge}`}>
                              {statusUi.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-base font-black text-green-500">
                          +{submission.rewardSats.toLocaleString()} Sats
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#050505] rounded-[16px] border border-[#111]">
                <p className="text-gray-500 text-sm font-medium">No submissions yet. Complete tasks to see them here.</p>
              </div>
            )}
          </div>
          
          {/* Using your existing Recent Activity panel here so it's not lost */}
          <RecentActivityPanel activities={data.recentActivity || []} />
        </div>

        {/* RIGHT COLUMN: Account Stats & Leaderboard */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Dummy Leaderboard */}
          <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-sats-orange-500/20 rounded-[24px] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sats-orange-500/10 blur-[40px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Leaderboard</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Top 5 Earners</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              {dummyLeaderboard.map((user) => {
                let rankColor = "text-gray-500 bg-[#111] border-[#2a2a2a]";
                if (user.rank === 1) rankColor = "text-black bg-yellow-500 border-yellow-400";
                if (user.rank === 2) rankColor = "text-black bg-gray-300 border-gray-200";
                if (user.rank === 3) rankColor = "text-black bg-[#cd7f32] border-[#b87333]";

                return (
                  <div key={user.rank} className="flex items-center justify-between p-3 bg-[#080808] border border-transparent rounded-[16px] hover:border-[#2a2a2a] hover:bg-[#111] transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border ${rankColor}`}>
                        {user.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sats-orange-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{user.handle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-green-500">{user.amount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Link href="/user/leaderboard" className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111] text-sm font-bold text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors relative z-10 border border-[#2a2a2a]">
              View Full Leaderboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── HELPER FUNCTIONS ───

function getSubmissionStatusUi(status: string) {
  switch (status) {
    case 'WITHDRAWABLE':
      return {
        label: 'Credited',
        icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
        badge: 'bg-green-500/10 text-green-400 border-green-500/20',
      };
    case 'LOCKED_15D':
      return {
        label: 'Locked',
        icon: <LockKeyhole className="w-5 h-5 text-yellow-400" />,
        badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      };
    case 'PENDING_24H':
    case 'MANUAL_REVIEW':
      return {
        label: status === 'MANUAL_REVIEW' ? 'Manual Review' : 'Pending',
        icon: <Clock3 className="w-5 h-5 text-blue-400" />,
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      };
    default:
      return {
        label: status,
        icon: <Clock3 className="w-5 h-5 text-gray-400" />,
        badge: 'bg-[#111] text-gray-400 border-[#2a2a2a]',
      };
  }
}

function formatRemainingTime(remainingMs: number) {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
