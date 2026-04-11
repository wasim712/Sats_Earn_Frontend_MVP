'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';

export default function ReferralList({ list }: { list: any[] }) {
  return (
    <div className="bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 transition-all duration-500 hover:border-sats-orange-500/30 shadow-lg">
      <h2 className="text-xl font-bold text-white tracking-tight mb-6 border-b border-[#1a1a1a] pb-5">My Network</h2>
      
      <div className="min-h-[200px] flex flex-col items-center justify-center">
        {list.length > 0 ? (
          <div className="w-full">
            {/* Table implementation for when you have real referrals */}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#050505] border border-[#1a1a1a] rounded-full flex items-center justify-center mb-5 mx-auto shadow-inner">
              <UserPlus className="w-7 h-7 text-gray-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Build your crew</h3>
            <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto mb-6">
              You haven&apos;t referred anyone yet. Share your link above to start earning commissions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}