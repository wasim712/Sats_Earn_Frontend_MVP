'use client';

import React from 'react';

export function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-white/5 rounded-lg" />
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
        <div className="h-5 w-28 bg-sats-orange-500/10 rounded-full mb-5" />
        <div className="h-8 w-3/4 bg-white/5 rounded-xl mb-3" />
        <div className="h-4 w-full bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-2/3 bg-white/5 rounded-lg mb-6" />
        <div className="h-10 w-40 bg-white/5 rounded-xl" />
      </div>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-24 bg-white/5 rounded" />
          <div className="h-3 w-10 bg-white/5 rounded" />
        </div>
        <div className="h-1.5 bg-[#1a1a1a] rounded-full" />
      </div>
      {[1, 2].map((item) => (
        <div key={item} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-8 h-8 rounded-xl bg-[#111] border border-[#1a1a1a] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-white/5 rounded-lg w-2/3" />
              <div className="h-4 bg-white/5 rounded-lg w-full" />
              <div className="h-4 bg-white/5 rounded-lg w-4/5" />
            </div>
          </div>
          <div className="h-28 bg-[#111] border border-[#1a1a1a] rounded-xl" />
          <div className="h-11 bg-white/5 rounded-xl mt-3" />
        </div>
      ))}
    </div>
  );
}
