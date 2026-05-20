'use client';

import React from 'react';
import type { AdminUserDetail, AdminUserTransaction } from '@/types/admin';

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
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className={`${accent} ${mono ? 'break-all font-mono text-xs' : 'text-sm font-semibold'}`}>{value}</p>
    </div>
  );
}

export function EmptyBlock({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-[#1a1a1a] p-6 text-center text-sm text-gray-500">{message}</div>;
}

export function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-4 space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</p>
        {subtitle ? <p className="mt-1 text-xs text-gray-400">{subtitle}</p> : null}
      </div>
      {children}
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

export function TransactionTable({ transactions }: { transactions: AdminUserTransaction[] }) {
  if (transactions.length === 0) {
    return <EmptyBlock message="No sats transactions found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-500">
          <tr>
            <th className="py-3 pr-4 text-left">Date</th>
            <th className="py-3 pr-4 text-left">Amount</th>
            <th className="py-3 pr-4 text-left">Type</th>
            <th className="py-3 pr-4 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-[#141414] align-top">
              <td className="py-3 pr-4 text-gray-400">{new Date(transaction.createdAt).toLocaleString()}</td>
              <td className={`py-3 pr-4 font-bold ${transaction.amountSats >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amountSats >= 0 ? '+' : '-'}{Math.abs(transaction.amountSats).toLocaleString()} sats
              </td>
              <td className="py-3 pr-4 text-white">{transaction.type}</td>
              <td className="py-3 pr-4 text-gray-300">{transaction.description || 'System transaction'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubmissionTable({ detail }: { detail: AdminUserDetail }) {
  if (detail.submissions.length === 0) {
    return <EmptyBlock message="No submission history found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-gray-500">
          <tr>
            <th className="py-3 pr-4 text-left">Submitted</th>
            <th className="py-3 pr-4 text-left">Campaign</th>
            <th className="py-3 pr-4 text-left">Task</th>
            <th className="py-3 pr-4 text-left">Status</th>
            <th className="py-3 pr-4 text-left">Reward</th>
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
                {submission.rejectionReason ? <p className="mt-1 text-xs text-red-400">{submission.rejectionReason}</p> : null}
              </td>
              <td className="py-3 pr-4 text-sats-orange-400">{submission.task?.campaign?.baseRewardSats?.toLocaleString?.() || 0} sats</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
