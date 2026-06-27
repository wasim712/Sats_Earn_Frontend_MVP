'use client';

import React from 'react';
import {
  Ban,
  Coins,
  Fingerprint,
  Mail,
  RefreshCcw,
  ShieldAlert,
  Trash2,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import type { AdminUserDetail, AdminUserTransaction } from '@/types/admin';

interface UserDetailModalProps {
  detail: AdminUserDetail | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onClose: () => void;
  onBan: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export function UserDetailModal({
  detail,
  loading,
  error,
  actionLoading,
  onClose,
  onBan,
  onActivate,
  onDelete,
  onRefresh,
}: UserDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[#1a1a1a] bg-sats-black-950">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1a1a1a] bg-sats-black-950/95 p-5 backdrop-blur">
          <div>
            <h2 className="text-xl font-black text-white">User Detail</h2>
            <p className="text-sm text-gray-400">Full account profile, sats flow, and campaign earning history.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRefresh} className="rounded-xl border border-[#2a2a2a] bg-[#111] p-2 text-gray-300 hover:text-white">
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded-xl border border-[#2a2a2a] bg-[#111] p-2 text-gray-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading && <div className="p-8 text-gray-400">Loading user details...</div>}
        {error && <div className="mx-6 mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>}

        {detail && (
          <div className="space-y-6 p-6">
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
                <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3">
                  {detail.isActive ? (
                    <ActionButton icon={<Ban className="h-4 w-4" />} label="Ban User" onClick={onBan} disabled={actionLoading || detail.role === 'ADMIN'} tone="danger" />
                  ) : (
                    <ActionButton icon={<RefreshCcw className="h-4 w-4" />} label="Activate" onClick={onActivate} disabled={actionLoading || detail.role === 'ADMIN'} tone="success" />
                  )}
                  <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Delete" onClick={onDelete} disabled={actionLoading || detail.role === 'ADMIN'} tone="danger" />
                </div>
              </Panel>

              <Panel title="Security & Social" icon={<ShieldAlert className="h-4 w-4" />}>
                <InfoRow label="User ID" value={detail.id} mono />
                <InfoRow label="Registration IP" value={detail.registrationIp || '—'} mono />
                <InfoRow label="Last IP" value={detail.lastIpAddress || '—'} mono />
                <InfoRow label="Created" value={detail.createdAt ? new Date(detail.createdAt).toLocaleString() : '—'} />
                <InfoRow label="Updated" value={detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : '—'} />
                <InfoRow label="Last Activity" value={detail.lastActivityAt ? new Date(detail.lastActivityAt).toLocaleString() : '—'} />
                <InfoRow label="Twitter" value={detail.twitterHandle || '—'} />
                <InfoRow label="Instagram" value={detail.instagramHandle || '—'} />
                <InfoRow label="Telegram" value={detail.telegramHandle || '—'} />
                <InfoRow label="Discord" value={detail.discordHandle || '—'} />
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Panel title="Balances Ledger" icon={<Coins className="h-4 w-4" />}>
                <TransactionTable transactions={detail.transactions || []} />
              </Panel>

              <Panel title="Recent Notifications" icon={<Mail className="h-4 w-4" />}>
                <MiniList
                  items={(detail.notifications || []).map((item) => ({
                    id: item.id,
                    title: item.title,
                    subtitle: `${item.type} • ${new Date(item.createdAt).toLocaleString()}`,
                  }))}
                  empty="No notifications yet."
                />
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Panel title="Submissions" icon={<Zap className="h-4 w-4" />}>
                <SubmissionTable detail={detail} />
              </Panel>

              <div className="space-y-6">
                <Panel title="Withdrawals" icon={<Wallet className="h-4 w-4" />}>
                  <MiniList
                    items={(detail.withdrawals || []).map((item) => ({
                      id: item.id,
                      title: `${item.amountSats.toLocaleString()} sats • ${item.status}`,
                      subtitle: new Date(item.createdAt).toLocaleString(),
                    }))}
                    empty="No withdrawals yet."
                  />
                </Panel>

                <Panel title="Referrals" icon={<Mail className="h-4 w-4" />}>
                  <MiniList
                    items={[]}
                    empty="No direct referrals yet."
                  />
                </Panel>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionTable({ transactions }: { transactions: AdminUserTransaction[] }) {
  if (transactions.length === 0) return <EmptyBlock message="No balance transactions available." />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-400">
          <tr>
            <th className="py-3 pr-4 text-left">Date</th>
            <th className="py-3 pr-4 text-left">Type</th>
            <th className="py-3 pr-4 text-left">Description</th>
            <th className="py-3 pr-0 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-[#141414]">
              <td className="py-3 pr-4 text-gray-400">{new Date(tx.createdAt).toLocaleString()}</td>
              <td className="py-3 pr-4 text-white">{tx.type}</td>
              <td className="py-3 pr-4 text-gray-300">{tx.description || '—'}</td>
              <td className={`py-3 pr-0 text-right font-bold ${tx.amountSats >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amountSats >= 0 ? '+' : ''}{tx.amountSats.toLocaleString()} sats
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubmissionTable({ detail }: { detail: AdminUserDetail }) {
  if (!detail.submissions?.length) return <EmptyBlock message="No submissions for this user yet." />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-400">
          <tr>
            <th className="py-3 pr-4 text-left">Submitted</th>
            <th className="py-3 pr-4 text-left">Campaign</th>
            <th className="py-3 pr-4 text-left">Task</th>
            <th className="py-3 pr-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {detail.submissions.map((submission) => (
            <tr key={submission.id} className="align-top border-t border-[#141414]">
              <td className="py-3 pr-4 text-gray-400">{new Date(submission.submittedAt).toLocaleString()}</td>
              <td className="py-3 pr-4 text-white">{submission.task?.campaign?.title || '—'}</td>
              <td className="py-3 pr-4 text-gray-300">{submission.task?.title || 'Untitled Task'}</td>
              <td className="py-3 pr-4">
                <p className="text-white">{submission.status}</p>
                {submission.rejectionReason && <p className="mt-1 text-xs text-red-400">{submission.rejectionReason}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MiniList({ items, empty }: { items: Array<{ id: string; title: string; subtitle: string }>; empty: string }) {
  if (items.length === 0) return <EmptyBlock message={empty} />;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-4">
          <p className="font-semibold text-white">{item.title}</p>
          <p className="mt-1 text-sm text-gray-400">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-5">
      <div className="mb-4 flex items-center gap-2 font-black text-white">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function InfoRow({ label, value, mono = false, accent = 'text-white' }: { label: string; value: string; mono?: boolean; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`${accent} ${mono ? 'break-all font-mono text-xs' : 'text-sm font-semibold'}`}>{value}</p>
    </div>
  );
}

export function EmptyBlock({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-[#1a1a1a] p-6 text-center text-sm text-gray-400">{message}</div>;
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${active ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
      {active ? 'Active' : 'Suspended'}
    </span>
  );
}

export function ActionButton({ icon, label, onClick, disabled, tone }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; tone: 'danger' | 'success' }) {
  const toneClass = tone === 'danger'
    ? 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15'
    : 'border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/15';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

export function LoadingState() {
  return (
    <div className="min-h-screen animate-pulse bg-[#020202] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-56 rounded-xl bg-[#151515]" />
        <div className="space-y-4 rounded-3xl border border-[#1a1a1a] bg-[#090909] p-6">
          <div className="h-12 rounded-2xl bg-[#121212]" />
          <div className="h-96 rounded-2xl bg-[#121212]" />
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] p-4">
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

