'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertTriangle, Monitor, Smartphone } from 'lucide-react';
import { CampaignUserCard } from '@/components/user/CampaignUserCard';
import type { Campaign } from '@/types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type FilterMode = 'ALL' | 'AVAILABLE' | 'COMPLETED';
type DeviceFilter = 'ALL' | 'DESKTOP' | 'ANDROID' | 'IOS';

export default function TasksPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('ALL');

  // --- THE REAL API CALL ---
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token'); 
        
        const response = await fetch(`${API_URL}/users/campaigns`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch available tasks');
        }

        const data = await response.json();
        setCampaigns(data);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter functionality for the search bar
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

    const campaignDevice = typeof (campaign as any).requiredPlatform === 'string'
      ? (campaign as any).requiredPlatform.toUpperCase()
      : 'NONE';

    const matchesDevice =
      deviceFilter === 'ALL'
        ? true
        : campaignDevice === deviceFilter;

    const matchesFilter =
      filterMode === 'ALL'
        ? true
        : filterMode === 'COMPLETED'
          ? Boolean(campaign.isCompleted)
          : !campaign.isCompleted;

    return matchesSearch && matchesFilter && matchesDevice;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 md:p-4 lg:p-6">
      
      {/* PAGE HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Available Tasks</h1>
          <p className="text-gray-400 mt-1.5 text-sm sm:text-base font-medium">Complete these campaigns to stack Sats. New tasks are added daily.</p>
        </div>

        {/* Search Bar - Updated to premium dark theme */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-sats-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-[#1a1a1a] text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-sats-orange-500/40 hover:border-[#2a2a2a] transition-all shadow-lg placeholder-gray-600 font-medium"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {(['ALL', 'AVAILABLE', 'COMPLETED'] as FilterMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setFilterMode(mode)}
            className={`rounded-2xl border px-4 py-2 text-sm font-bold transition-all ${filterMode === mode ? 'border-sats-orange-500/40 bg-sats-orange-500/10 text-sats-orange-400' : 'border-[#1a1a1a] bg-black text-gray-400 hover:border-[#2a2a2a] hover:text-white'}`}
          >
            {mode === 'ALL' ? 'All' : mode === 'AVAILABLE' ? 'Available' : 'Completed'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {([
          { key: 'ALL', label: 'All Devices', icon: Monitor },
          { key: 'DESKTOP', label: 'Desktop', icon: Monitor },
          { key: 'ANDROID', label: 'Android', icon: Smartphone },
          { key: 'IOS', label: 'iOS', icon: Smartphone },
        ] as { key: DeviceFilter; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setDeviceFilter(key)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition-all ${deviceFilter === key ? 'border-sats-orange-500/40 bg-sats-orange-500/10 text-sats-orange-400' : 'border-[#1a1a1a] bg-black text-gray-400 hover:border-[#2a2a2a] hover:text-white'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 shadow-lg">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}
{/* LOADING STATE - The Perfect Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-[#080808] border border-[#1a1a1a] rounded-[32px] flex flex-col h-full min-h-[440px] overflow-hidden shadow-lg">
              
              {/* TALL Header Image Skeleton */}
              <div className="relative h-[200px] w-full bg-[#111] shrink-0">
                {/* Top Left Glass Badge Skeleton */}
                <div className="absolute top-5 left-5 w-11 h-11 rounded-xl bg-[#1a1a1a]" />
                {/* Top Right Reward Badge Skeleton */}
                <div className="absolute top-5 right-5 w-28 h-8 rounded-xl bg-[#1a1a1a]" />
              </div>
              
              {/* Spacious Body Skeleton */}
              <div className="p-6 md:p-8 flex flex-col grow">
                {/* Title */}
                <div className="h-7 w-3/4 bg-[#1a1a1a] rounded-lg mb-4" />
                
                {/* Description */}
                <div className="space-y-2.5 mb-8 grow">
                  <div className="h-4 w-full bg-[#141414] rounded-md" />
                  <div className="h-4 w-5/6 bg-[#141414] rounded-md" />
                </div>
                
                {/* Progress Skeleton */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-end">
                    <div className="h-3 w-24 bg-[#141414] rounded-md" />
                    <div className="h-3 w-12 bg-[#141414] rounded-md" />
                  </div>
                  <div className="w-full h-2 bg-[#141414] rounded-full" />
                </div>
                
                {/* Thick Button Skeleton */}
                <div className="w-full h-[52px] bg-[#111] rounded-xl border border-[#1a1a1a]" />
              </div>

            </div>
          ))}
        </div>
      ) : (
        // **task grid
        <>
          {!error && filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignUserCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : !error && (
            <div className="flex flex-col items-center justify-center py-24 bg-black border border-[#1a1a1a] rounded-[28px] text-center px-4 shadow-lg">
              <div className="w-16 h-16 bg-sats-black-950 border border-[#1a1a1a] rounded-full flex items-center justify-center mb-5 shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">You are all caught up!</h3>
              <p className="text-gray-400 font-medium">There are no new tasks matching your criteria right now.</p>
            </div>
          )}
        </>
      )}

    </div>
  );
}
