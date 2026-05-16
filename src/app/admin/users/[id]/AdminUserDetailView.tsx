'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminUserDetail, AdminUserTransaction } from '@/types/admin';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserDetail, performUserAction } from '@/features/admin/adminUsersSlice';
import {
  ArrowLeft,
  ArrowDownToLine,
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

  const fetchDetail = useCallback(async () => {
    await dispatch(fetchUserDetail(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDetail} />;
  if (!detail) return <ErrorState error="User not found." onRetry={fetchDetail} />;

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to users
            </Link>
            <h1 className="text-3xl font-black">{detail.fullName || 'Anonymous User'}</h1>
            <p className="text-sm text-gray-400 mt-1">{detail.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {detail.isActive ? (
              <ActionButton icon={<Ban className="w-4 h-4" />} label="Ban User" onClick={() => handleAction('ban')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="danger" />
            ) : (
              <ActionButton icon={<RefreshCcw className="w-4 h-4" />} label="Reactivate" onClick={() => handleAction('activate')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="success" />
            )}
            <ActionButton icon={<Trash2 className="w-4 h-4" />} label="Delete Account" onClick={() => handleAction('delete')} disabled={actionState.loading || actionLoading || detail.role === 'SUPER_ADMIN'} tone="danger" />
            <button onClick={fetchDetail} className="inline-flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm font-semibold hover:bg-[#1a1a1a]">
              <RefreshCcw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {actionState.error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{actionState.error}</div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Panel title="Profile" icon={<Fingerprint className="w-4 h-4" />}>
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

          <Panel title="Balances & Access" icon={<Wallet className="w-4 h-4" />}>
            <InfoRow label="Available" value={`${detail.balanceAvailable.toLocaleString()} sats`} accent="text-sats-orange-500" />
            <InfoRow label="Pending" value={`${detail.balancePending.toLocaleString()} sats`} accent="text-yellow-500" />
            <InfoRow label="Locked" value={`${detail.balanceLocked.toLocaleString()} sats`} accent="text-blue-400" />
            <InfoRow label="Total XP" value={detail.totalXp.toLocaleString()} accent="text-green-400" />
            <InfoRow label="Current Streak" value={String(detail.currentStreak || 0)} />
            <InfoRow label="Tier" value={`${detail.activeTier} ${detail.isPremium ? '(Premium)' : ''}`} />
            <InfoRow label="Premium Expiry" value={detail.premiumExpiresAt ? new Date(detail.premiumExpiresAt).toLocaleString() : '—'} />
            <InfoRow label="Account Active" value={detail.isActive ? 'Yes' : 'No'} />
          </Panel>

          <Panel title="Security & Social" icon={<ShieldAlert className="w-4 h-4" />}>
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Panel title="Sats Transaction History" icon={<Coins className="w-4 h-4" />}>
            <TransactionTable transactions={detail.transactions} />
          </Panel>
          <Panel title="Submission & Campaign History" icon={<Zap className="w-4 h-4" />}>
            <SubmissionTable detail={detail} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Panel title="Withdrawals" icon={<ArrowDownToLine className="w-4 h-4" />}>
            <MiniList
              items={detail.withdrawals.map((withdrawal) => ({
                id: withdrawal.id,
                title: `${withdrawal.amountSats.toLocaleString()} sats`,
                subtitle: `${withdrawal.status} · ${new Date(withdrawal.createdAt).toLocaleString()}`,
              }))}
              empty="No withdrawals yet."
            />
          </Panel>
          <Panel title="Notifications" icon={<Mail className="w-4 h-4" />}>
            <MiniList
              items={detail.notifications.map((notification) => ({
                id: notification.id,
                title: notification.title,
                subtitle: `${notification.type} · ${new Date(notification.createdAt).toLocaleString()}`,
              }))}
              empty="No notifications found."
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function TransactionTable({ transactions }: { transactions: AdminUserTransaction[] }) {
  if (transactions.length === 0) {
    return <EmptyBlock message="No sats transactions found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-500">
          <tr>
            <th className="text-left py-3 pr-4">When</th>
            <th className="text-left py-3 pr-4">Amount</th>
            <th className="text-left py-3 pr-4">Type</th>
            <th className="text-left py-3 pr-4">Source</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-[#141414] align-top">
              <td className="py-3 pr-4 text-gray-400">{new Date(transaction.createdAt).toLocaleString()}</td>
              <td className={`py-3 pr-4 font-bold ${transaction.amountSats >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amountSats >= 0 ? '+' : ''}{transaction.amountSats.toLocaleString()}
              </td>
              <td className="py-3 pr-4 text-white">{transaction.type}</td>
              <td className="py-3 pr-4 text-gray-400">
                <p>{transaction.description || '—'}</p>
                {transaction.source?.kind === 'submission' && (
                  <p className="text-xs text-sats-orange-500 mt-1">{transaction.source.campaignTitle || 'Campaign'} · {transaction.source.taskTitle || 'Task'} · {transaction.source.status}</p>
                )}
                {transaction.source?.kind === 'withdrawal' && (
                  <p className="text-xs text-blue-400 mt-1">Withdrawal · {transaction.source.status}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionTable({ detail }: { detail: AdminUserDetail }) {
  if (detail.submissions.length === 0) {
    return <EmptyBlock message="No submission history found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-500">
          <tr>
            <th className="text-left py-3 pr-4">Submitted</th>
            <th className="text-left py-3 pr-4">Campaign</th>
            <th className="text-left py-3 pr-4">Task</th>
            <th className="text-left py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {detail.submissions.map((submission) => (
            <tr key={submission.id} className="border-t border-[#141414] align-top">
              <td className="py-3 pr-4 text-gray-400">{new Date(submission.submittedAt).toLocaleString()}</td>
              <td className="py-3 pr-4 text-white">{submission.task?.campaign?.title || '—'}</td>
              <td className="py-3 pr-4 text-gray-300">{submission.task?.title || 'Untitled Task'}</td>
              <td className="py-3 pr-4">
                <p className="text-white">{submission.status}</p>
                {submission.rejectionReason && <p className="text-xs text-red-400 mt-1">{submission.rejectionReason}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniList({ items, empty }: { items: Array<{ id: string; title: string; subtitle: string }>; empty: string }) {
  if (items.length === 0) return <EmptyBlock message={empty} />;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-4">
          <p className="font-semibold text-white">{item.title}</p>
          <p className="text-sm text-gray-400 mt-1">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-5">
      <div className="flex items-center gap-2 mb-4 text-white font-black">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono = false, accent = 'text-white' }: { label: string; value: string; mono?: boolean; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
      <p className={`${accent} ${mono ? 'font-mono text-xs break-all' : 'font-semibold text-sm'}`}>{value}</p>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-[#1a1a1a] p-6 text-sm text-gray-500 text-center">{message}</div>;
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
      <div className="max-w-7xl mx-auto space-y-6">
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
      <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-sats-black-950 p-8 text-center">
        <ShieldAlert className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <p className="text-red-300 font-semibold">{error}</p>
        <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:bg-[#191919]">
          <RefreshCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );
}
