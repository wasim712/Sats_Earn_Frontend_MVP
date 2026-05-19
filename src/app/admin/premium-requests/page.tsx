'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BellRing, CheckCheck, Clock3, Crown, Loader2, RefreshCw, UserRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminPremiumRequests, updateAdminPremiumRequest } from '@/features/admin/adminPremiumRequestsSlice';

export default function AdminPremiumRequestsPage() {
  const dispatch = useAppDispatch();
  const { requests, isLoading, isUpdating, error } = useAppSelector((state) => state.adminPremiumRequests);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchAdminPremiumRequests());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, status: 'OPEN' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED') => {
    await dispatch(updateAdminPremiumRequest({ id, status, adminNotes: notesById[id] || '' }));
  };

  return (
    <div className="min-h-screen bg-[#020202] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-inner">
                <Crown className="w-5 h-5 text-sats-orange-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Premium Requests</h1>
            </div>
            <p className="text-gray-400 text-sm">Dedicated queue for notify-me and upgrade requests from users.</p>
          </div>

          <button
            onClick={() => dispatch(fetchAdminPremiumRequests())}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-white font-bold hover:bg-[#1a1a1a] transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-12 text-center">
            <BellRing className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-white">No premium requests yet</p>
            <p className="text-sm text-gray-500 mt-1">Notify-me and upgrade requests will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {requests.map((request) => (
              <div key={request.id} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-5 space-y-4">
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
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{request.status}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <InfoCard label="Current Tier" value={request.userActiveTier} icon={<Crown className="w-4 h-4 text-sats-orange-500" />} />
                  <InfoCard label="Source" value={request.source || 'manual-ui'} icon={<UserRound className="w-4 h-4 text-blue-400" />} />
                  <InfoCard label="Created" value={new Date(request.createdAt).toLocaleString()} icon={<Clock3 className="w-4 h-4 text-yellow-400" />} />
                  <InfoCard label="User" value={request.user?.id || 'Unknown'} icon={<CheckCheck className="w-4 h-4 text-green-400" />} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Admin Notes</label>
                  <textarea
                    value={notesById[request.id] ?? request.adminNotes ?? ''}
                    onChange={(e) => setNotesById((prev) => ({ ...prev, [request.id]: e.target.value }))}
                    className="w-full min-h-[100px] rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none"
                    placeholder="Add outreach/payment notes..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleStatusUpdate(request.id, 'CONTACTED')} disabled={isUpdating} className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 font-bold text-sm disabled:opacity-60">Mark Contacted</button>
                  <button onClick={() => handleStatusUpdate(request.id, 'COMPLETED')} disabled={isUpdating} className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 font-bold text-sm disabled:opacity-60">Mark Completed</button>
                  <button onClick={() => handleStatusUpdate(request.id, 'CANCELLED')} disabled={isUpdating} className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 font-bold text-sm disabled:opacity-60">Cancel</button>
                  {request.user?.id && (
                    <Link href={`/admin/users/${request.user.id}`} className="px-4 py-2 rounded-xl border border-[#2a2a2a] bg-[#111] text-white font-bold text-sm hover:bg-[#1a1a1a]">
                      Open User
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
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
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
      </div>
      <p className="text-sm text-white font-semibold break-all">{value}</p>
    </div>
  );
}
