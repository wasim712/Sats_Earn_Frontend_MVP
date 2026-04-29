'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CampaignUserCard } from '@/components/user/CampaignUserCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function TasksPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-2 md:p-4 lg:p-6">
      
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

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 shadow-lg">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* LOADING STATE - The Perfect Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-puls ">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 flex flex-col h-full min-h-70 shadow-lg">
              
              {/* Header Skeleton: Logo & Reward Pill */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a]"></div>
                <div className="w-24 h-8 rounded-xl bg-[#1a1a1a]"></div>
              </div>
              
              {/* Body Skeleton: Title & Description */}
              <div className="grow mb-8 space-y-4">
                <div className="h-6 w-3/4 bg-[#1a1a1a] rounded-lg"></div>
                <div className="space-y-2.5">
                  <div className="h-3 w-full bg-[#1a1a1a] rounded-md"></div>
                  <div className="h-3 w-5/6 bg-[#1a1a1a] rounded-md"></div>
                </div>
              </div>
              
              {/* Footer Skeleton: Progress Bar & Button */}
              <div className="mt-auto space-y-6">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <div className="h-3 w-20 bg-[#1a1a1a] rounded-md"></div>
                    <div className="h-3 w-12 bg-[#1a1a1a] rounded-md"></div>
                  </div>
                  <div className="w-full h-2 bg-[#1a1a1a] rounded-full"></div>
                </div>
                <div className="w-full h-13 bg-[#1a1a1a] rounded-xl"></div>
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