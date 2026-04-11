'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export default function ReferralHero({ code, url }: { code: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black border border-[#1a1a1a] rounded-[28px] p-6 sm:p-8 overflow-hidden group hover:border-sats-orange-500/30 transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sats-orange-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Share your link</h2>
          <p className="text-gray-400 text-sm font-medium">Your friends get a headstart, and you get rewarded.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Link Box */}
          <div className="flex items-center bg-[#050505] border border-[#1a1a1a] rounded-2xl px-4 py-3.5 w-full sm:w-[320px] justify-between group-hover:border-[#2a2a2a] transition-all">
            <span className="text-gray-300 font-bold text-sm truncate mr-4">{url}</span>
            <button onClick={copyToClipboard} className="text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Referral Code Box */}
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 px-6 py-3.5 rounded-2xl flex items-center gap-3 w-full sm:w-auto justify-center">
            <span className="text-xs font-black text-sats-orange-500/60 uppercase tracking-widest">Code</span>
            <span className="text-lg font-black text-sats-orange-500 tracking-tighter">{code}</span>
          </div>
        </div>
      </div>
    </div>
  );
}