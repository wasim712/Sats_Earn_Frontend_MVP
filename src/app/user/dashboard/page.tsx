'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { AlertTriangle, CheckCircle2, Clock3, LockKeyhole, XCircle } from 'lucide-react';

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
  if (isLoading || !data || !data.balances || !data.gamification){
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
      <TotalBalanceCard balances={data?.balances} />
      
      <GamificationStats 
        gamification={data.gamification} 
        tasksCompleted={data.gamification.tasksCompleted || 0} 
        activeReferrals={data.gamification.activeReferrals || 0} 
      />

      <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Submission Status</h2>
            <p className="text-sm text-gray-400 mt-1">Track approval, rejection, unlock timing, and credited dates.</p>
          </div>
        </div>

        {data.recentSubmissions && data.recentSubmissions.length > 0 ? (
          <div className="space-y-4">
            {data.recentSubmissions.map((submission) => {
              const statusUi = getSubmissionStatusUi(submission.status);

              return (
                <div key={submission.id} className="bg-sats-black-950 border border-[#1a1a1a] rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusUi.badge}`}>
                          {statusUi.icon}
                          {statusUi.label}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-base">{submission.taskTitle}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">{submission.campaignTitle}</p>
                      {submission.status === 'PENDING_24H' && (
                        <div className="mt-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs">
                          <p className="font-bold text-blue-300 mb-1">Submission accepted</p>
                          <p className="text-blue-100/80 leading-relaxed">Your proof is accepted and is now in the 24-hour review window. After 24 hours, it moves into the 15-day locked state.</p>
                        </div>
                      )}
                      {submission.status === 'LOCKED_15D' && (
                        <div className="mt-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs">
                          <p className="font-bold text-yellow-300 mb-1">Accepted and locked for 15 days</p>
                          <p className="text-yellow-100/80 leading-relaxed">The 24-hour review is complete. Your reward is now in the 15-day security lock until it becomes withdrawable.</p>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 space-y-1 sm:text-right">
                      <p>Reward: {submission.rewardSats.toLocaleString()} sats</p>
                      <p>Submitted: {formatDate(submission.submittedAt)}</p>
                      {submission.unlockAt && <p>{submission.status === 'LOCKED_15D' ? 'Available for withdrawal:' : 'Next unlock step:'} {formatDate(submission.unlockAt)}</p>}
                      {submission.status !== 'WITHDRAWABLE' && submission.remainingMs > 0 && <p>{submission.status === 'LOCKED_15D' ? 'Becomes withdrawable in:' : 'Time left:'} {formatRemainingTime(submission.remainingMs)}</p>}
                      {submission.creditedAt && <p>Credited: {formatDate(submission.creditedAt)}</p>}
                    </div>
                  </div>

                  {submission.rejectionReason && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm font-medium">
                      Rejected: {submission.rejectionReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm font-medium">
            No submissions yet. Once you submit tasks, status updates will appear here.
          </div>
        )}
      </div>
      
      <RecentActivityPanel activities={data.recentActivity || []} />

    </div>
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
}

function formatRemainingTime(remainingMs: number) {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getSubmissionStatusUi(status: string) {
  switch (status) {
    case 'WITHDRAWABLE':
      return {
        label: 'Credited',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        badge: 'bg-green-500/10 border-green-500/20 text-green-400',
      };
    case 'LOCKED_15D':
      return {
        label: 'Locked',
        icon: <LockKeyhole className="w-3.5 h-3.5" />,
        badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      };
    case 'PENDING_24H':
    case 'MANUAL_REVIEW':
      return {
        label: status === 'MANUAL_REVIEW' ? 'Manual Review' : 'Pending Review',
        icon: <Clock3 className="w-3.5 h-3.5" />,
        badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        icon: <XCircle className="w-3.5 h-3.5" />,
        badge: 'bg-red-500/10 border-red-500/20 text-red-400',
      };
    default:
      return {
        label: status,
        icon: <Clock3 className="w-3.5 h-3.5" />,
        badge: 'bg-[#111] border-[#2a2a2a] text-gray-300',
      };
  }
}
