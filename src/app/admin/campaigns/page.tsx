// *********************************************************
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllCampaigns, toggleCampaignStatus, deleteCampaign } from '@/features/admin/adminCampaignsSlice';
import type { Campaign } from '@/features/admin/adminCampaignsSlice';
import { 
  Plus, ShieldAlert, 
  Zap, Calendar, Crown, Target, Trash2, Shield,
  ArrowUpRight
} from 'lucide-react';

export default function AdminCampaignsPage() {
  const dispatch = useAppDispatch();
  const { campaigns, isLoading, error } = useAppSelector((state) => state.adminCampaigns);

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    dispatch(toggleCampaignStatus({ id, isActive: !currentStatus }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign? All associated tasks will also be deleted.")) {
      dispatch(deleteCampaign(id));
    }
  };

  // ─── Loading Skeleton Array ────────────────────────────────────────────────
  if (isLoading && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-sats-black-950 p-4 md:p-6 lg:p-8 pb-32">
        <div className="max-w-[1600px] mx-auto w-full animate-pulse">
          <div className="flex justify-between items-end mb-8 mt-4">
            <div>
              <div className="h-8 w-64 bg-sats-black-800 rounded-lg mb-3" />
              <div className="h-4 w-48 bg-sats-black-800 rounded-md" />
            </div>
            <div className="h-12 w-40 bg-sats-black-800 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <CampaignCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-sats-black-950 flex items-center justify-center p-4">
        <div className="bg-sats-black-900 border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-red-500/80" />
          <p className="font-semibold text-lg">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllCampaigns())} 
            className="px-6 py-2.5 bg-sats-black-800 border border-sats-black-700 rounded-xl text-sm text-white hover:bg-white/5 transition-all mt-2"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sats-black-950 p-4 md:p-6 lg:p-8 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* ─── Page Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Campaign Directory</h1>
            <p className="text-gray-400 text-sm mt-1">Deploy tasks, manage economics, and monitor completion rates.</p>
          </div>
          
          <Link 
            href="/admin/addcampaign"
            className="flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(238,139,18,0.2)] active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </Link>
        </div>

        {/* ─── Campaigns Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id}
                campaign={campaign} 
                onDelete={handleDelete}
                onToggleActive={handleToggleStatus}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-sats-black-800 rounded-3xl bg-sats-black-900">
              <Target className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Active Campaigns</h3>
              <p className="text-gray-500 text-sm max-w-md">You haven&apos;t created any earning campaigns yet. Click the button above to deploy your first set of tasks.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── Micro-Components (Card & Skeleton) ──────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

interface CampaignCardProps {
  campaign: Campaign;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

function CampaignCard({ campaign, onToggleActive, onDelete }: CampaignCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const visibleRewardTiers = campaign.isPremiumOnly
    ? ['PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER']
    : ['BASIC', 'COPPER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CROWN', 'ELITE', 'FOUNDER'];
  const topTierReward = visibleRewardTiers.reduce(
    (max, tier) => Math.max(max, Number(campaign.tierRewardMatrix?.[tier] || 0)),
    0,
  );

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops the click from bubbling up to the Link
    setIsToggling(true);
    await onToggleActive(campaign.id, campaign.isActive);
    setIsToggling(false);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops the click from bubbling up to the Link
    setIsDeleting(true);
    await onDelete(campaign.id);
    setIsDeleting(false); 
  };

  const formattedDate = new Date(campaign.createdAt).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const progressPercent = campaign.maxCompletions > 0 
    ? Math.min((campaign.totalCompletions / campaign.maxCompletions) * 100, 100) 
    : 0;

  return (
    <div className={`group relative bg-sats-black-900 border border-sats-black-800 rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:border-sats-orange-500/30 hover:bg-[#0c0c0c] hover:shadow-2xl hover:shadow-sats-orange-500/5 ${isDeleting ? 'opacity-50 pointer-events-none scale-[0.98]' : ''}`}>
      
      {/* 1. BOTTOM LAYER: Subtle Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sats-orange-500/0 via-transparent to-transparent group-hover:from-sats-orange-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

      {/* 2. MIDDLE LAYER: Clickable Overlay (z-10) covers the whole card */}
      <Link 
        href={`/admin/campaigns/${campaign.id}`} 
        className="absolute inset-0 z-10 rounded-2xl" 
        aria-label={`View ${campaign.title}`} 
      />

      {/* 3. CONTENT LAYER: Left relative but without z-index so clicks pass through to the link layer */}
      <div className="flex flex-col h-full">
        
        {/* Header: Category & Status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {campaign.category.replace('_', ' ')}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-sats-orange-400 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
            campaign.isActive ? 'bg-green-500/10 text-green-400' : 'bg-sats-black-800 text-gray-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${campaign.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            {campaign.isActive ? 'Live' : 'Draft'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-snug mb-6 line-clamp-2 group-hover:text-sats-orange-400 transition-colors">
          {campaign.title}
        </h3>

        {/* Economics & Access (Minimal Grid without borders) */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-sats-black-950 rounded-xl p-3.5 flex flex-col gap-1 transition-colors group-hover:bg-sats-black-950/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sats-orange-500" /> Reward
            </span>
            <span className="text-sm font-black text-sats-orange-400 truncate mt-0.5">
              Up to {topTierReward.toLocaleString()} <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Sats</span>
            </span>
          </div>

          <div className="bg-sats-black-950 rounded-xl p-3.5 flex flex-col gap-1 transition-colors group-hover:bg-sats-black-950/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gray-400" /> Access
            </span>
            <div className="mt-0.5">
              {campaign.isPremiumOnly ? (
                <span className="text-xs font-black text-yellow-500 uppercase tracking-wider flex items-center gap-1 truncate">
                  <Crown className="w-3.5 h-3.5" /> Premium
                </span>
              ) : (
                <span className="text-xs font-black text-gray-300 uppercase tracking-wider truncate">
                  Tier: {campaign.requiredFreeTier}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sleek Progress Bar */}
        <div className="mb-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Limit</span>
            <span className="text-xs font-bold text-gray-300">
              <span className="text-white">{(campaign.totalCompletions || 0).toLocaleString()}</span> / {(campaign.maxCompletions || 0).toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1 bg-sats-black-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressPercent >= 100 ? 'bg-green-500' : 'bg-sats-orange-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 4. TOP LAYER: Footer Actions (z-20) - Placed above the Link so buttons remain clickable */}
        <div className="relative z-20 flex items-center justify-between mt-8 pt-4 border-t border-sats-black-800/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Calendar className="w-3.5 h-3.5 shrink-0 opacity-70" /> {formattedDate}
          </div>
          
          <div className="flex items-center gap-3">
            {/* iOS Toggle */}
            <button
              type="button"
              onClick={handleToggle}
              disabled={isToggling}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${
                campaign.isActive ? 'bg-green-500' : 'bg-sats-black-700'
              } ${isToggling ? 'opacity-50 pointer-events-none' : 'hover:ring-2 ring-sats-black-700 ring-offset-2 ring-offset-sats-black-900'}`}
              title={campaign.isActive ? "Pause Campaign" : "Activate Campaign"}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  campaign.isActive ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete Campaign"
              className="p-1.5 rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function CampaignCardSkeleton() {
  return (
    <div className="bg-sats-black-900 border border-sats-black-800 rounded-2xl p-6 h-[320px] flex flex-col animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="h-4 w-20 bg-sats-black-800 rounded-md" />
        <div className="h-5 w-14 bg-sats-black-800 rounded-full" />
      </div>
      <div className="h-6 w-full bg-sats-black-800 rounded-md mb-2" />
      <div className="h-6 w-2/3 bg-sats-black-800 rounded-md mb-8" />
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="h-[68px] bg-sats-black-800/50 rounded-xl" />
        <div className="h-[68px] bg-sats-black-800/50 rounded-xl" />
      </div>

      <div className="mb-auto">
        <div className="flex justify-between mb-2">
          <div className="h-3 w-16 bg-sats-black-800 rounded" />
          <div className="h-3 w-12 bg-sats-black-800 rounded" />
        </div>
        <div className="h-1 w-full bg-sats-black-800 rounded-full" />
      </div>

      <div className="flex items-center justify-between mt-8 pt-4 border-t border-sats-black-800/50">
        <div className="h-4 w-24 bg-sats-black-800 rounded" />
        <div className="flex gap-3 items-center">
          <div className="h-5 w-9 bg-sats-black-800 rounded-full" />
          <div className="h-7 w-7 bg-sats-black-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
//***************************************************************
