import React from 'react';
import Link from 'next/link';
import { CheckCheck, Clock3, Crown, UserRound } from 'lucide-react';

import type { AdminPremiumRequest } from '@/features/admin/adminPremiumRequestsSlice';
import { getPremiumRequestStatusUi, isPremiumRequestTerminal } from './premiumRequest.helpers';

export function PremiumRequestCard({
  request,
  note,
  isUpdating,
  onNoteChange,
  onStatusUpdate,
}: {
  request: AdminPremiumRequest;
  note: string;
  isUpdating: boolean;
  onNoteChange: (value: string) => void;
  onStatusUpdate: (status: 'CONTACTED' | 'COMPLETED' | 'CANCELLED') => void;
}) {
  const statusUi = getPremiumRequestStatusUi(request.status);
  const isTerminal = isPremiumRequestTerminal(request.status);
  const canMarkContacted = request.status === 'OPEN';
  const canResolve = request.status === 'OPEN' || request.status === 'CONTACTED';

  return (
    <div className={`rounded-3xl border p-5 space-y-4 transition-colors ${statusUi.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 text-[10px] font-black uppercase tracking-widest text-sats-orange-400">
              {request.intent === 'UPGRADE' ? 'Upgrade' : 'Notify me'}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-[#2a2a2a] bg-[#111] text-[10px] font-black uppercase tracking-widest text-gray-300">
              {request.plan}
            </span>
          </div>
          <h2 className="text-lg font-black text-white">{request.userFullName || 'Anonymous User'}</h2>
          <p className="text-sm text-gray-400">{request.userEmail}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusUi.badge}`}>
          {statusUi.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <InfoCard label="Current Tier" value={request.userActiveTier} icon={<Crown className="w-4 h-4 text-sats-orange-500" />} />
        <InfoCard label="Source" value={request.source || 'manual-ui'} icon={<UserRound className="w-4 h-4 text-blue-400" />} />
        <InfoCard label="Created" value={new Date(request.createdAt).toLocaleString()} icon={<Clock3 className="w-4 h-4 text-yellow-400" />} />
        <InfoCard label="User" value={request.user?.id || 'Unknown'} icon={<CheckCheck className="w-4 h-4 text-green-400" />} />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Admin Notes</label>
        <textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          disabled={isTerminal}
          className="w-full min-h-[100px] rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none disabled:opacity-75"
          placeholder="Add outreach/payment notes..."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onStatusUpdate('CONTACTED')}
          disabled={isUpdating || !canMarkContacted}
          className="px-4 py-2 cursor-pointer rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/5 transition-all duration-75 text-blue-300 font-bold text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark Contacted
        </button>
        <button
          type="button"
          onClick={() => onStatusUpdate('COMPLETED')}
          disabled={isUpdating || !canResolve}
          className="px-4 py-2 cursor-pointer rounded-xl border border-green-500/20 bg-green-500/10 hover:bg-green-500/5 transition-all duration-75 text-green-300 font-bold text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark Completed
        </button>
        <button
          type="button"
          onClick={() => onStatusUpdate('CANCELLED')}
          disabled={isUpdating || !canResolve}
          className="px-4 py-2 cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/5 transition-all duration-75 text-red-300 font-bold text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        {request.user?.id && (
          <Link href={`/admin/users/${request.user.id}`} className="px-4 cursor-pointer py-2 rounded-xl border border-[#2a2a2a] bg-[#111] text-white font-bold text-sm hover:bg-[#1a1a1a] transition-colors">
            Open User
          </Link>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{label}</p>
      </div>
      <p className="text-sm text-white font-semibold break-all">{value}</p>
    </div>
  );
}
