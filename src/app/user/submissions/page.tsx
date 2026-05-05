'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, LockKeyhole, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserSubmissions } from '@/features/user/userSubmissionsSlice';

export default function UserSubmissionsPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.userSubmissions);

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-20 p-2 md:p-4 lg:p-6">
        <div>
          <div className="h-10 w-56 bg-[#1a1a1a] rounded-xl mb-3"></div>
          <div className="h-5 w-80 bg-[#1a1a1a] rounded-lg"></div>
        </div>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 bg-sats-black-950 border border-[#1a1a1a] rounded-[28px]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-2 md:p-4 lg:p-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Submission History</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-medium">See all submissions, unlock timing, credited dates, and rejection reasons.</p>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((submission) => {
            const statusUi = getSubmissionStatusUi(submission.status);

            return (
              <div key={submission.id} className="bg-black border border-[#1a1a1a] rounded-[28px] p-5 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusUi.badge}`}>
                        {statusUi.icon}
                        {statusUi.label}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{submission.taskTitle}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{submission.campaignTitle}</p>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 sm:text-right">
                    <p>Reward: {submission.rewardSats.toLocaleString()} sats</p>
                    <p>Submitted: {formatDate(submission.submittedAt)}</p>
                    {submission.unlockAt && <p>Unlocks: {formatDate(submission.unlockAt)}</p>}
                    {submission.status !== 'WITHDRAWABLE' && submission.remainingMs > 0 && <p>Time left: {formatRemainingTime(submission.remainingMs)}</p>}
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
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-10 text-center text-gray-500 text-sm font-medium">
          No submissions found yet.
        </div>
      )}
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
