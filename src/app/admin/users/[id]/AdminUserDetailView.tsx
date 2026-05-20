'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { adjustUserSubmissionReward, fetchUserDetail, performUserAction, updateUserPremium } from '@/features/admin/adminUsersSlice';
import { EmptyBlock, InfoRow, MiniList, Panel, SectionCard, SubmissionTable, TransactionTable } from '@/components/admin/users/AdminUserDetailSections';
import {
  ArrowLeft,
  Ban,
  Coins,
  Fingerprint,
  Mail,
  RefreshCcw,
  ShieldAlert,
  Trash2,
  Wallet,
  Zap,
} from 'lucide-react';

type ActionState = {
  loading: boolean;
  error: string | null;
};

export function AdminUserDetailView({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { selectedUserDetail: detail, detailLoading: loading, detailError: error, actionLoading } = useAppSelector((state) => state.adminUsers);

  const [actionState, setActionState] = useState<ActionState>({ loading: false, error: null });
  const [premiumTier, setPremiumTier] = useState<'' | 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER'>('');
  const [premiumExpiresAt, setPremiumExpiresAt] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [adjustmentMode, setAdjustmentMode] = useState<'DEDUCT' | 'ADD'>('DEDUCT');

  const fetchDetail = useCallback(async () => {
    await dispatch(fetchUserDetail(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!detail) return;
    setPremiumTier((detail.premiumTier as '' | 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER' | null) || '');
    setPremiumExpiresAt(detail.premiumExpiresAt ? new Date(detail.premiumExpiresAt).toISOString().slice(0, 16) : '');
  }, [detail]);

  const adjustableSubmissions = useMemo(
    () => detail?.submissions.filter((submission) => submission.status !== 'REJECTED') || [],
    [detail],
  );

  const handleAction = async (action: 'ban' | 'activate' | 'delete') => {
    if (!detail) return;

    const actionLabel = action === 'ban' ? 'suspend' : action === 'activate' ? 'reactivate' : 'delete';
    const confirmed = window.confirm(`Are you sure you want to ${actionLabel} this user account?`);
    if (!confirmed) return;

    setActionState({ loading: true, error: null });

    try {
      await dispatch(performUserAction({ userId: detail.id, action })).unwrap();

      if (action === 'delete') {
        window.location.href = '/admin/users';
        return;
      }

      await fetchDetail();
      setActionState({ loading: false, error: null });
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Action failed';
      setActionState({ loading: false, error: message });
    }
  };

  const handlePremiumSave = async () => {
    if (!detail) return;

    setActionState({ loading: true, error: null });
    try {
      await dispatch(updateUserPremium({
        userId: detail.id,
        premiumTier: premiumTier || null,
        premiumExpiresAt: premiumExpiresAt ? new Date(premiumExpiresAt).toISOString() : null,
      })).unwrap();
      setActionState({ loading: false, error: null });
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Failed to update premium tier';
      setActionState({ loading: false, error: message });
    }
  };

  const handleAdjustmentSave = async () => {
    if (!detail || !selectedSubmissionId) return;

    const parsedAmount = Number(adjustmentAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setActionState({ loading: false, error: 'Enter a valid sats adjustment amount.' });
      return;
    }

    const amountSats = adjustmentMode === 'DEDUCT' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    setActionState({ loading: true, error: null });
    try {
      await dispatch(adjustUserSubmissionReward({
        userId: detail.id,
        submissionId: selectedSubmissionId,
        amountSats,
        note: adjustmentNote,
      })).unwrap();
      setAdjustmentAmount('');
      setAdjustmentNote('');
      setActionState({ loading: false, error: null });
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Failed to adjust submission reward';
      setActionState({ loading: false, error: message });
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDetail} />;
  if (!detail) return <ErrorState error="User not found." onRetry={fetchDetail} />;

  return (
    <div className="min-h-screen bg-[#020202] p-4 text-white md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/admin/users" className="mb-3 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to users
            </Link>
            <h1 className="text-3xl font-black">{detail.fullName || 'Anonymous User'}</h1>
            <p className="mt-1 text-sm text-gray-400">{detail.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {detail.isActive ? (
              <ActionButton icon={<Ban className="h-4 w-4" />} label="Ban User" onClick={() => handleAction('ban')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="danger" />
            ) : (
              <ActionButton icon={<RefreshCcw className="h-4 w-4" />} label="Reactivate" onClick={() => handleAction('activate')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="success" />
            )}
            <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Delete Account" onClick={() => handleAction('delete')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="danger" />
            <button onClick={fetchDetail} className="inline-flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm font-semibold hover:bg-[#1a1a1a]">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {actionState.error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {actionState.error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Panel title="Profile" icon={<Fingerprint className="h-4 w-4" />}>
            <InfoRow label="Full Name" value={detail.fullName || 'Anonymous User'} />
            <InfoRow label="Email" value={detail.email} mono />
            <InfoRow label="Username" value={detail.username || '—'} />
            <InfoRow label="Phone" value={detail.phone || '—'} />
            <InfoRow label="Country" value={detail.country || '—'} />
            <InfoRow label="Date of Birth" value={detail.dateOfBirth ? new Date(detail.dateOfBirth).toLocaleDateString() : '—'} />
            <InfoRow label="Role" value={detail.role} />
            <InfoRow label="Verified" value={detail.isVerified ? 'Yes' : 'No'} />
            <InfoRow label="Auth Provider" value={detail.authProvider || 'EMAIL'} />
            <InfoRow label="Referral Code" value={detail.referralCode || '—'} mono />
          </Panel>

          <Panel title="Balances & Access" icon={<Wallet className="h-4 w-4" />}>
            <InfoRow label="Available" value={`${detail.balanceAvailable.toLocaleString()} sats`} accent="text-sats-orange-500" />
            <InfoRow label="Pending" value={`${detail.balancePending.toLocaleString()} sats`} accent="text-yellow-500" />
            <InfoRow label="Locked" value={`${detail.balanceLocked.toLocaleString()} sats`} accent="text-blue-400" />
            <InfoRow label="Total XP" value={detail.totalXp.toLocaleString()} accent="text-green-400" />
            <InfoRow label="Current Streak" value={String(detail.currentStreak || 0)} />
            <InfoRow label="Tier" value={`${detail.activeTier} ${detail.isPremium ? '(Premium)' : ''}`} />
            <InfoRow label="Premium Expiry" value={detail.premiumExpiresAt ? new Date(detail.premiumExpiresAt).toLocaleString() : '—'} />
            <InfoRow label="Account Active" value={detail.isActive ? 'Yes' : 'No'} />

            <SectionCard title="Manual Premium Upgrade" subtitle="Structured tier override with expiry control.">
              <select
                value={premiumTier}
                onChange={(e) => setPremiumTier(e.target.value as '' | 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER')}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              >
                <option value="">No Premium</option>
                <option value="PLATINUM">Platinum</option>
                <option value="DIAMOND">Diamond</option>
                <option value="CROWN">Crown</option>
                <option value="ELITE">Elite</option>
                <option value="FOUNDER">Founder</option>
              </select>
              <input
                type="datetime-local"
                value={premiumExpiresAt}
                onChange={(e) => setPremiumExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              />
              <button
                onClick={handlePremiumSave}
                disabled={actionState.loading || actionLoading}
                className="w-full rounded-xl border border-sats-orange-500/30 bg-sats-orange-500/10 px-4 py-3 text-sm font-bold text-sats-orange-400 hover:bg-sats-orange-500/15 disabled:opacity-60"
              >
                Save Premium Tier
              </button>
            </SectionCard>

            <SectionCard title="Submission Sats Adjustment" subtitle="Select the task, see the earned sats basis, then add or deduct cleanly.">
              <select
                value={selectedSubmissionId}
                onChange={(e) => setSelectedSubmissionId(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              >
                <option value="">Select submission</option>
                {adjustableSubmissions.map((submission) => (
                  <option key={submission.id} value={submission.id}>
                    {(submission.task?.campaign?.title || 'Campaign')} - {(submission.task?.title || 'Task')} - {submission.task?.campaign?.baseRewardSats?.toLocaleString?.() || 0} sats ({submission.status})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="Enter sats amount"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              />
              <select
                value={adjustmentMode}
                onChange={(e) => setAdjustmentMode(e.target.value as 'DEDUCT' | 'ADD')}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              >
                <option value="DEDUCT">Deduct sats</option>
                <option value="ADD">Add sats</option>
              </select>
              <input
                type="text"
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder="Reason for partial completion or adjustment"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#050505] px-3 py-2 text-sm text-white"
              />
              <button
                onClick={handleAdjustmentSave}
                disabled={actionState.loading || actionLoading || !selectedSubmissionId}
                className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/15 disabled:opacity-60"
              >
                Apply Submission Adjustment
              </button>
            </SectionCard>
          </Panel>

          <Panel title="Security & Social" icon={<ShieldAlert className="h-4 w-4" />}>
            <InfoRow label="User ID" value={detail.id} mono />
            <InfoRow label="Registration IP" value={detail.registrationIp || '—'} mono />
            <InfoRow label="Last IP" value={detail.lastIpAddress || '—'} mono />
            <InfoRow label="Created" value={new Date(detail.createdAt).toLocaleString()} />
            <InfoRow label="Updated" value={detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : '?'} />
            <InfoRow label="Last Activity" value={new Date(detail.lastActivityAt).toLocaleString()} />
            <InfoRow label="Twitter" value={detail.twitterHandle || '—'} />
            <InfoRow label="Instagram" value={detail.instagramHandle || '—'} />
            <InfoRow label="Telegram" value={detail.telegramHandle || '—'} />
            <InfoRow label="Discord" value={detail.discordHandle || '—'} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel title="Sats Transaction History" icon={<Coins className="h-4 w-4" />}>
            <TransactionTable transactions={detail.transactions} />
          </Panel>
          <Panel title="Submission & Campaign History" icon={<Zap className="h-4 w-4" />}>
            <SubmissionTable detail={detail} />
          </Panel>
          <Panel title="Recent Notifications" icon={<Mail className="h-4 w-4" />}>
            <MiniList
              items={detail.notifications.map((notification) => ({
                id: notification.id,
                title: notification.title,
                subtitle: `${notification.type} · ${new Date(notification.createdAt).toLocaleString()}`,
              }))}
              empty="No notifications found."
            />
          </Panel>
          <Panel title="Withdrawals" icon={<Wallet className="h-4 w-4" />}>
            {detail.withdrawals.length === 0 ? (
              <EmptyBlock message="No withdrawals found." />
            ) : (
              <MiniList
                items={detail.withdrawals.map((withdrawal) => ({
                  id: withdrawal.id,
                  title: `${withdrawal.amountSats.toLocaleString()} sats · ${withdrawal.status}`,
                  subtitle: new Date(withdrawal.createdAt).toLocaleString(),
                }))}
                empty="No withdrawals found."
              />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, disabled, tone }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; tone: 'danger' | 'success' }) {
  const toneClass = tone === 'danger'
    ? 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15'
    : 'border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/15';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold border transition-all disabled:opacity-50 ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#020202] p-6 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-56 rounded-xl bg-[#151515]" />
        <div className="rounded-3xl border border-[#1a1a1a] bg-[#090909] p-6 space-y-4">
          <div className="h-12 rounded-2xl bg-[#121212]" />
          <div className="h-96 rounded-2xl bg-[#121212]" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-sats-black-950 p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <p className="font-semibold text-red-300">{error}</p>
        <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111] px-4 py-3 hover:bg-[#191919]">
          <RefreshCcw className="h-4 w-4" /> Retry
        </button>
      </div>
    </div>
  );
}
