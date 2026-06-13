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
                      {submission.isStandalone && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/20 bg-purple-500/10 text-purple-400">
                          Standalone
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{submission.taskTitle}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {submission.isStandalone ? 'Standalone Task' : submission.campaignTitle}
                    </p>
                    {submission.status === 'PENDING_24H' && (
                      <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
                        <p className="font-bold text-blue-300 mb-1">Submission accepted</p>
                        <p className="text-blue-100/80 leading-relaxed">Your proof is accepted and is now in the 24-hour review window. After 24 hours, it moves into the 15-day locked state before becoming withdrawable.</p>
                      </div>
                    )}
                    {submission.status === 'LOCKED_15D' && (
                      <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm">
                        <p className="font-bold text-yellow-300 mb-1">Accepted and locked for 15 days</p>
                        <p className="text-yellow-100/80 leading-relaxed">The 24-hour review is complete. Your reward is now in the 15-day security lock and will become withdrawable when the countdown finishes.</p>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 sm:text-right">
                    <p>Reward: {formatSatsValue(submission.rewardSats)} sats</p>
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
        <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-10 text-center text-gray-500 text-sm font-medium">
          No submissions found yet.
        </div>
      )}
    </div>
  );
}

function formatSatsValue(value: number) {
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
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
