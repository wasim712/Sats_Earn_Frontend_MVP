'use client';

import React from 'react';
import { Bitcoin } from 'lucide-react';

export const TickerSection = () => {
  const items = [
    "Stack Sats Daily",
    "Social Tasks",
    "Bitcoin Quizzes",
    "Streak Bonuses",
    "Lightning Withdrawals",
    "Referral Rewards",
    "Mini Games",
    "No Buying Required",
  ];

  // We repeat the items to ensure a seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full bg-sats-black-900 border-y border-white/5 py-4 overflow-hidden relative z-10 flex items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: ticker-marquee 30s linear infinite;
          will-change: transform;
        }
      `}} />
      <div className="animate-ticker">
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-6 text-sm font-bold tracking-widest text-gray-400 uppercase font-mono whitespace-nowrap">
            <span className="text-sats-orange-500">
              <Bitcoin className="w-4 h-4" />
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
