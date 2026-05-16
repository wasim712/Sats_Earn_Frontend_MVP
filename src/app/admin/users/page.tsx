'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUsersState, fetchAllUsers, fetchUserDetail as fetchUserDetailThunk, performUserAction } from '@/features/admin/adminUsersSlice';
import type { AdminUserDetail, AdminUserTransaction } from '@/types/admin';
import {  ArrowDownToLine,
  Ban,  Coins,
  Eye,
  Fingerprint,
  Mail,
  RefreshCcw,
  Search,
  ShieldAlert,
  Trash2,
  User as UserIcon,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

type ActionState = {
  loading: boolean;
  error: string | null;
};

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, selectedUserDetail, detailLoading, detailError, actionLoading } = useAppSelector((state) => state.adminUsers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ loading: false, error: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
    return () => {
      dispatch(clearUsersState());
    };
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.referralCode || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, users]);

  const fetchUserDetail = async (userId: string) => {
    setSelectedUserId(userId);
    setActionState({ loading: false, error: null });
    await dispatch(fetchUserDetailThunk(userId));
  };

  const refreshUsers = () => {
    dispatch(fetchAllUsers());
  };

  const handleUserAction = async (action: 'ban' | 'activate' | 'delete') => {
    if (!selectedUserDetail) return;

    const actionLabel = action === 'ban' ? 'suspend' : action === 'activate' ? 'reactivate' : 'delete';
    const confirmed = window.confirm(`Are you sure you want to ${actionLabel} this user account?`);
    if (!confirmed) return;

    setActionState({ loading: true, error: null });

    try {
      await dispatch(performUserAction({ userId: selectedUserDetail.id, action })).unwrap();

      await refreshUsers();

      if (action === 'delete') {
        setSelectedUserId(null);
      } else {
        await fetchUserDetail(selectedUserDetail.id);
      }
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'Action failed';
      setActionState({ loading: false, error: message });
      return;
    }

    setActionState({ loading: false, error: null });
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;

    const headers = ['ID', 'Email', 'Full Name', 'Role', 'Active Tier', 'Available Sats', 'Pending Sats', 'Locked Sats', 'Total XP', 'Active', 'Joined'];
    const rows = filteredUsers.map((user) => [
      user.id,
      user.email,
      `"${user.fullName || ''}"`,
      user.role,
      user.activeTier,
      user.balanceAvailable,
      user.balancePending,
      user.balanceLocked,
      user.totalXp,
      user.isActive ? 'Yes' : 'No',
      new Date(user.createdAt).toISOString(),
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (isLoading && users.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refreshUsers} />;
  }

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">User Administration</h1>
            <p className="text-sm text-gray-400 mt-1">Inspect user profiles, control account access, and audit how sats reach user accounts.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#111] border border-[#2a2a2a] hover:bg-[#171717] transition-all text-sm font-semibold"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-sats-black-950 border border-[#1a1a1a] rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-[#1a1a1a] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, or referral code"
                className="w-full bg-[#0b0b0b] border border-[#1a1a1a] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sats-orange-500/40"
              />
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
              {filteredUsers.length} account{filteredUsers.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0b0b0b] text-gray-500 uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="text-left px-6 py-4">User</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Balances</th>
                  <th className="text-left px-6 py-4">Activity</th>
                  <th className="text-left px-6 py-4">Joined</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-[#141414] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-sats-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.fullName || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <StatusPill active={user.isActive} />
                        <p className="text-xs text-gray-400">{user.role} · {user.activeTier}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <p className="text-sats-orange-500 font-bold">{user.balanceAvailable.toLocaleString()} sats</p>
                        <p className="text-xs text-yellow-500">Pending: {user.balancePending.toLocaleString()}</p>
                        <p className="text-xs text-blue-400">Locked: {user.balanceLocked.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5 text-xs text-gray-400">
                        <p>{user.totalXp.toLocaleString()} XP</p>
                        <p>{user._count?.submissions || 0} submissions</p>
                        <p>{user._count?.referrals || 0} referrals</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => fetchUserDetail(user.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111] border border-[#2a2a2a] hover:bg-[#1a1a1a] text-xs font-semibold"
                        >
                          <Eye className="w-4 h-4" /> Quick View
                        </button>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 hover:bg-sats-orange-500/15 text-xs font-semibold text-sats-orange-400"
                        >
                          Open Page
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <UserDetailModal
          detail={selectedUserDetail}
          loading={detailLoading}
          error={detailError || actionState.error}
          actionLoading={actionState.loading || actionLoading}
          onClose={() => {
            setSelectedUserId(null);
            setActionState({ loading: false, error: null });
          }}
          onBan={() => handleUserAction('ban')}
          onActivate={() => handleUserAction('activate')}
          onDelete={() => handleUserAction('delete')}
          onRefresh={() => selectedUserId && fetchUserDetail(selectedUserId)}
        />
      )}
    </div>
  );
}

function UserDetailModal({
  detail,
  loading,
  error,
  actionLoading,
  onClose,
  onBan,
  onActivate,
  onDelete,
  onRefresh,
}: {
  detail: AdminUserDetail | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onClose: () => void;
  onBan: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-sats-black-950 border border-[#1a1a1a]">
        <div className="sticky top-0 z-10 bg-sats-black-950/95 backdrop-blur border-b border-[#1a1a1a] p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">User Detail</h2>
            <p className="text-sm text-gray-400">Full account profile, sats flow, and campaign earning history.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRefresh} className="p-2 rounded-xl bg-[#111] border border-[#2a2a2a] text-gray-300 hover:text-white">
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-[#111] border border-[#2a2a2a] text-gray-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && <div className="p-8 text-gray-400">Loading user details...</div>}
        {error && <div className="mx-6 mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>}

        {detail && (
          <div className="p-6 space-y-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  {detail.isActive ? (
                    <ActionButton icon={<Ban className="w-4 h-4" />} label="Ban User" onClick={onBan} disabled={actionLoading || detail.role === 'ADMIN'} tone="danger" />
                  ) : (
                    <ActionButton icon={<RefreshCcw className="w-4 h-4" />} label="Reactivate" onClick={onActivate} disabled={actionLoading || detail.role === 'ADMIN'} tone="success" />
                  )}
                  <ActionButton icon={<Trash2 className="w-4 h-4" />} label="Delete Account" onClick={onDelete} disabled={actionLoading || detail.role === 'ADMIN'} tone="danger" />
                </div>
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
        )}
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

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${active ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
      {active ? 'Active' : 'Suspended'}
    </span>
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
