'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllCampaigns, toggleCampaignStatus, deleteCampaign } from '@/features/admin/adminCampaignsSlice';
import { CampaignCard } from '@/components/admin/CampaignCard';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export default function AdminCampaignsPage() {
  // throw new Error("Testing!");
  const dispatch = useAppDispatch();
  const { campaigns, isLoading, error } = useAppSelector((state) => state.adminCampaigns);

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    dispatch(toggleCampaignStatus({ id, isActive: !currentStatus }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCampaign(id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
          <p className="text-gray-400 mt-2">Create, monitor, and manage user earning tasks.</p>
        </div>
        
        <Link 
          href="/admin/addcampaign"
          className="flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        >
          <Plus className="w-5 h-5" />
          Add Campaign
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && campaigns.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Loading campaigns...</p>
        </div>
      ) : (
        /* Campaigns Grid - Updated for wider, less congested cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {campaigns.length > 0 ? (
            campaigns.map((campaign,index) => (
              <CampaignCard 
                key={campaign.id || `fallback-${index}`}
                campaign={campaign} 
                onDelete={handleDelete}
                onToggleActive={handleToggleStatus}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900/50">
              <p className="text-gray-500 font-medium">No campaigns found. Create your first one!</p>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}