'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  LockKeyhole,
  Medal,
  Trophy,
  XCircle,
} from 'lucide-react';
import type { LeaderboardEntry, UserDashboard } from '@/types/user';
import type { UserNotification } from '@/features/user/userNotificationsSlice';
import RecentActivityPanel from '@/components/user/dashboard/RecentActivityPanel';

interface StreakMilestoneItem {
  days: number;
  rewardSats: number;
  claimed: boolean;
  reachedInCurrentRun: boolean;
  isNext: boolean;
}

interface StreakSectionProps {
  unreadStreakReward?: UserNotification;
  isPremium: boolean;
  currentStreak: number;
  nextStreakMilestone: number | null;
  nextStreakRewardSats: number;
  daysRemainingToNextMilestone: number;
  totalClaimedMilestones: number;
  totalStreakMilestones: number;
  streakProgressPercent: number;
  lastClaimedStreakMilestone: number;
  streakMilestones: StreakMilestoneItem[];
}

interface DashboardLowerGridProps {
  dashboard: UserDashboard;
  monthlyTopEarners: LeaderboardEntry[];
}

export function StreakSection({
  unreadStreakReward,
  isPremium,
  currentStreak,
  nextStreakMilestone,
  nextStreakRewardSats,
  daysRemainingToNextMilestone,
  totalClaimedMilestones,
  totalStreakMilestones,
  streakProgressPercent,
  lastClaimedStreakMilestone,
  streakMilestones,
}: StreakSectionProps) {
  const premiumLockedMilestones = new Set([90, 180, 365]);
  const lockHint = 'To claim these rewards, you need Premium.';

  return (
    <>
      {unreadStreakReward && (
        <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-green-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_55%)] p-4 shadow-[0_10px_35px_rgba(34,197,94,0.08)] backdrop-blur-sm transition-all">
          <div className="mt-1 h-3 w-3 shrink-0 animate-pulse rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          <div>
            <p className="text-sm font-black tracking-tight text-white">Milestone Unlocked!</p>
            <p className="mt-0.5 text-sm font-medium text-green-100/80">{unreadStreakReward.message}</p>
            <Link href="/user/notifications" className="mt-2 inline-flex text-xs font-bold text-green-400 transition-colors hover:text-green-300">
              View notification &rarr;
            </Link>
          </div>
        </div>
      )}

      <div className=" relative mb-6 overflow-hidden rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 bg-sats-orange-500/5 blur-[80px]" />

        <div className="relative z-10 mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sats-orange-500/20 bg-sats-orange-500/10">
              <Flame className="h-5 w-5 text-sats-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Current Streak</p>
              <h3 className="mt-0.5 text-2xl font-black tracking-tight text-white">
                {currentStreak} <span className="text-lg text-gray-400">Days</span>
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {nextStreakMilestone
                  ? `${daysRemainingToNextMilestone} day${daysRemainingToNextMilestone === 1 ? '' : 's'} to next streak reward`
                  : 'All streak rewards already unlocked'}
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[420px]">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Next Milestone</p>
              <p className="mt-1 text-sm font-black text-sats-orange-500">
                {nextStreakMilestone ? `${nextStreakMilestone} Days • +${nextStreakRewardSats.toLocaleString()} sats` : 'All Rewards Unlocked'}
              </p>
            </div>
            <div className="rounded-xl border border-[#1a1a1a] bg-sats-black-950 px-4 py-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Claimed Rewards</p>
              <p className="mt-1 text-sm font-black text-emerald-400">{totalClaimedMilestones}/{totalStreakMilestones}</p>
            </div>
            <div className="rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Current Run</p>
              <p className="mt-1 text-sm font-black text-blue-400">{currentStreak} Day{currentStreak === 1 ? '' : 's'}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mb-6">
          <div className="mb-3 flex items-center justify-between gap-4 text-[11px] font-semibold text-gray-500">
            <span>Progress to next unclaimed reward</span>
            <span className="text-sats-orange-400">{Math.round(streakProgressPercent)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#1f1f1f] bg-[#121212]">
            <div className="h-full rounded-full bg-gradient-to-r from-sats-orange-500 via-amber-400 to-yellow-300 transition-all duration-700" style={{ width: `${streakProgressPercent}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>{lastClaimedStreakMilestone > 0 ? `${lastClaimedStreakMilestone} days last claimed` : 'Start'}</span>
            <span>{nextStreakMilestone ? `${nextStreakMilestone} days target` : 'Completed'}</span>
          </div>
        </div>

        <div className="custom-scrollbar relative overflow-x-auto pt-2 pb-2">
          <div className="relative min-w-[640px] px-2 sm:min-w-full">
            <div className="absolute left-5 right-4 top-[23px] h-1.5 rounded-full border border-[#1a1a1a] bg-[#141414]" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              {streakMilestones.map((milestone) => {
                const achieved = milestone.claimed;
                const reachedInCurrentRun = milestone.reachedInCurrentRun;
                const isNext = milestone.isNext;
                const isPremiumLocked = !isPremium && premiumLockedMilestones.has(milestone.days);
                const cardTone = achieved
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : isPremiumLocked
                    ? 'border-[#2b2416] bg-[#0a0906]'
                  : reachedInCurrentRun
                    ? 'border-blue-500/30 bg-blue-500/10'
                    : isNext
                      ? 'border-yellow-400/30 bg-yellow-400/10'
                      : 'border-[#1a1a1a] bg-[#070707]';

                return (
                  <div key={milestone.days} className={`group relative flex w-[120px] cursor-default flex-col items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${cardTone}`}>
                    {isPremiumLocked ? (
                      <div className="absolute top-2 right-2 z-20">
                        <Link
                          href="/user/rewards"
                          aria-label={lockHint}
                          title={lockHint}
                          className="relative flex h-6 w-6 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 transition-colors hover:bg-yellow-500/15"
                        >
                          <LockKeyhole className="h-3.5 w-3.5" />
                          <span className="pointer-events-none absolute right-0 top-8 z-30 hidden w-40 rounded-lg border border-[#2a2a2a] bg-[#111] px-2.5 py-2 text-left text-[10px] font-semibold leading-relaxed text-gray-200 shadow-xl group-hover:block sm:group-hover:block">
                            {lockHint}
                          </span>
                        </Link>
                      </div>
                    ) : null}

                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] transition-all duration-500 ${achieved ? 'border-emerald-400 bg-[#111] text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.28)]' : isPremiumLocked ? 'border-yellow-500/40 bg-[#111] text-yellow-400' : reachedInCurrentRun ? 'border-blue-400 bg-[#111] text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.28)]' : isNext ? 'scale-110 border-yellow-400 bg-[#111] text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-[#2a2a2a] bg-[#0a0a0a] text-gray-600'}`}>
                      {achieved ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : isPremiumLocked ? (
                        <LockKeyhole className="h-4 w-4" />
                      ) : reachedInCurrentRun ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <span className="text-[10px] font-black">{milestone.days}</span>
                      )}
                    </div>

                    <div className="text-center">
                      <p className={`text-xs font-black transition-colors ${achieved ? 'text-emerald-400' : isPremiumLocked ? 'text-yellow-300' : reachedInCurrentRun ? 'text-blue-400' : isNext ? 'text-white' : 'text-gray-500'}`}>
                        {milestone.days} Days
                      </p>
                      <p className={`mt-0.5 text-[10px] font-bold ${achieved || reachedInCurrentRun || isNext || isPremiumLocked ? 'text-gray-400' : 'text-[#333]'}`}>
                        +{milestone.rewardSats} sats
                      </p>
                      <p className={`mt-1 text-[9px] font-bold uppercase tracking-[0.18em] ${achieved ? 'text-emerald-400/90' : isPremiumLocked ? 'text-yellow-300/90' : reachedInCurrentRun ? 'text-blue-400/90' : isNext ? 'text-yellow-300/90' : 'text-gray-600'}`}>
                        {achieved ? 'Claimed' : isPremiumLocked ? 'Premium' : reachedInCurrentRun ? 'Reached' : isNext ? 'Next' : 'Locked'}
                      </p>
                      {isPremiumLocked && reachedInCurrentRun ? (
                        <Link href="/user/rewards" className="mt-1 text-[9px] font-bold text-yellow-400 transition-colors hover:text-yellow-300 sm:hidden">
                          Need Premium
                        </Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#1a1a1a] pt-4 md:grid-cols-2">
          <div className="flex items-start gap-2">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sats-orange-500/50" />
            <p className="text-xs font-medium text-gray-500">
              Complete at least <strong className="text-gray-300">1 valid task or quiz</strong> each day to keep your streak moving.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/50" />
            <p className="text-xs font-medium text-gray-500">
              Streak milestone rewards are <strong className="text-gray-300">awarded automatically once</strong>, so already claimed rewards never become claimable again.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function DashboardLowerGrid({ dashboard, monthlyTopEarners }: DashboardLowerGridProps) {
  const topEarners = monthlyTopEarners.slice(0, 10);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <div className="rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-white">Recent Submissions</h2>
            <Link href="/user/submissions" className="flex items-center gap-1 text-sm font-bold text-sats-orange-500 transition-colors hover:text-sats-orange-400">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {dashboard.recentSubmissions && dashboard.recentSubmissions.length > 0 ? (
              dashboard.recentSubmissions.slice(0, 4).map((submission) => {
                const statusUi = getSubmissionStatusUi(submission.status);

                return (
                  <div key={submission.id} className="group grow rounded-[16px] border border-transparent bg-[#050505] p-4 transition-all duration-300 hover:border-[#2a2a2a] hover:bg-[#0a0a0a] sm:flex-row sm:items-center">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {statusUi.icon}
                          <p className="truncate text-sm font-bold text-white sm:hidden">
                            {submission.taskTitle.substring(0, 20)}{submission.taskTitle.length > 20 ? '...' : ''}
                          </p>
                          <p className="hidden truncate text-sm font-bold text-white sm:block">
                            {submission.taskTitle.substring(0, 10)}{submission.taskTitle.length > 10 ? '...' : ''}
                          </p>
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-gray-500">by {submission.campaignTitle.substring(0, 15)}...</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${statusUi.badge}`}>
                          {statusUi.label}
                        </span>
                        <p className="mt-2 text-sm font-black text-green-400">+{submission.rewardSats.toLocaleString()} sats</p>
                        {submission.status === 'LOCKED_15D' && submission.remainingMs > 0 && (
                          <p className="mt-1 text-[11px] text-yellow-400">Unlocks in {formatRemainingTime(submission.remainingMs)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#2a2a2a] bg-[#050505] px-4 py-10 text-center">
                <p className="text-sm font-medium text-gray-500">No submissions yet. Complete tasks to see them here.</p>
              </div>
            )}
          </div>
        </div>

        <RecentActivityPanel activities={dashboard.recentActivity || []} />
      </div>

      <div className="space-y-6 xl:col-span-1">
        <div className="rounded-[24px] border border-[#1a1a1a] bg-[#0a0a0a] p-6 sm:p-7">

          <div className="relative z-10 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sats-orange-500/20 bg-sats-orange-500/10">
                <Trophy className="h-4 w-4 text-sats-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">Leaderboard</h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Monthly Top Earners</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-2.5">
            {topEarners.length > 0 ? topEarners.map((entry) => {
              const isTopThree = entry.rank <= 3;
              const medalTone = entry.rank === 1
                ? 'text-yellow-400'
                : entry.rank === 2
                  ? 'text-slate-300'
                  : entry.rank === 3
                    ? 'text-amber-600'
                    : 'text-gray-500';

              const displayName = entry.fullName?.trim() || entry.username || 'Anonymous';
              const initials = displayName.substring(0, 2).toUpperCase();

              return (
                <div key={entry.userId} className="flex cursor-default items-center justify-between rounded-[16px] border border-[#151515] bg-[#080808] px-3 py-3 transition-colors hover:border-[#222] hover:bg-[#0d0d0d]">
                  <div className="flex items-center gap-3">
                    <div className="flex w-6 shrink-0 items-center justify-center text-[12px] font-black">
                      {isTopThree ? <Medal className={`h-4 w-4 ${medalTone}`} /> : <span className="text-gray-500">{entry.rank}</span>}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1d1d1d] bg-[#111] text-[10px] font-bold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[140px] truncate text-sm font-semibold leading-tight text-white">{displayName}</p>
                      <p className="max-w-[140px] truncate font-mono text-[10px] text-gray-500">@{entry.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-sats-orange-400">{entry.value.toLocaleString()} sats</span>
                  </div>
                </div>
              );
            }) : (
              <div className="rounded-[16px] border border-dashed border-[#2a2a2a] bg-[#080808] px-4 py-8 text-center text-sm text-gray-500">
                No monthly leaderboard data yet.
              </div>
            )}
          </div>

          <Link href="/user/leaderboard" className="relative z-10 mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-[#1a1a1a] hover:text-white">
            View Full Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function getSubmissionStatusUi(status: string) {
  switch (status) {
    case 'WITHDRAWABLE':
      return {
        label: 'Credited',
        icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
        badge: 'border-green-500/20 bg-green-500/10 text-green-400',
      };
    case 'LOCKED_15D':
      return {
        label: 'Locked',
        icon: <LockKeyhole className="h-5 w-5 text-yellow-400" />,
        badge: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
      };
    case 'PENDING_24H':
    case 'MANUAL_REVIEW':
      return {
        label: status === 'MANUAL_REVIEW' ? 'Manual Review' : 'Pending',
        icon: <Clock3 className="h-5 w-5 text-blue-400" />,
        badge: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        icon: <XCircle className="h-5 w-5 text-red-400" />,
        badge: 'border-red-500/20 bg-red-500/10 text-red-400',
      };
    default:
      return {
        label: status,
        icon: <Clock3 className="h-5 w-5 text-gray-400" />,
        badge: 'border-[#2a2a2a] bg-[#111] text-gray-400',
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
