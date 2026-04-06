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
        const token = sessionStorage.getItem('sats_token'); // Or however you store your token
        
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      
      {/* PAGE HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Available Tasks</h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Complete these campaigns to stack Sats. New tasks are added daily.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-sats-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sats-black-900 border border-sats-black-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-sats-orange-500/50 focus:ring-1 focus:ring-sats-orange-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-sats-black-900/50 border border-sats-black-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        /* TASKS GRID */
        <>
          {!error && filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignUserCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : !error && (
            <div className="flex flex-col items-center justify-center py-20 bg-sats-black-900/50 border border-dashed border-sats-black-800 rounded-3xl text-center px-4">
              <CheckCircle2 className="w-16 h-16 text-sats-orange-500/50 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">You are all caught up!</h3>
              <p className="text-gray-400">There are no new tasks available right now. Check back later to stack more Sats.</p>
            </div>
          )}
        </>
      )}

    </div>
  );
}