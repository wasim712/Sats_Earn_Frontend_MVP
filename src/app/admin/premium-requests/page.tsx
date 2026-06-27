'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BellRing, Crown, Loader2, RefreshCw } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminPremiumRequests, updateAdminPremiumRequest } from '@/features/admin/adminPremiumRequestsSlice';
import { PremiumRequestCard } from '@/components/admin/premium-requests/PremiumRequestCard';
import { PremiumRequestFilterTabs } from '@/components/admin/premium-requests/PremiumRequestFilterTabs';
import {
  filterPremiumRequests,
  getPremiumRequestCounts,
  sortPremiumRequests,
  type PremiumRequestFilter,
} from '@/components/admin/premium-requests/premiumRequest.helpers';

export default function AdminPremiumRequestsPage() {
  const dispatch = useAppDispatch();
  const { requests, isLoading, isUpdating, error } = useAppSelector((state) => state.adminPremiumRequests);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<PremiumRequestFilter>('ALL');

  useEffect(() => {
    dispatch(fetchAdminPremiumRequests());
  }, [dispatch]);

  const orderedRequests = useMemo(() => sortPremiumRequests(requests), [requests]);
  const counts = useMemo(() => getPremiumRequestCounts(orderedRequests), [orderedRequests]);
  const filteredRequests = useMemo(() => filterPremiumRequests(orderedRequests, activeFilter), [orderedRequests, activeFilter]);

  const handleStatusUpdate = async (id: string, status: 'CONTACTED' | 'COMPLETED' | 'CANCELLED') => {
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
            type="button"
            onClick={() => dispatch(fetchAdminPremiumRequests())}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-white font-bold hover:bg-[#1a1a1a] transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <PremiumRequestFilterTabs activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />

        {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
          </div>
        ) : orderedRequests.length === 0 ? (
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-12 text-center">
            <BellRing className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-white">No premium requests yet</p>
            <p className="text-sm text-gray-400 mt-1">Notify-me and upgrade requests will appear here.</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-12 text-center">
            <BellRing className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-bold text-white">No requests in this section</p>
            <p className="text-sm text-gray-400 mt-1">Try another premium request filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredRequests.map((request) => (
              <PremiumRequestCard
                key={request.id}
                request={request}
                note={notesById[request.id] ?? request.adminNotes ?? ''}
                isUpdating={isUpdating}
                onNoteChange={(value) => setNotesById((prev) => ({ ...prev, [request.id]: value }))}
                onStatusUpdate={(status) => handleStatusUpdate(request.id, status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
