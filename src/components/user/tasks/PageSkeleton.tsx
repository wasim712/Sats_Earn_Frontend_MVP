'use client';

import React from 'react';
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Ambient glows matching the main page */}
      <div className="fixed top-0 right-1/4 w-[400px] h-[400px] bg-sats-orange-500/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-sats-orange-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-6 md:py-10 pb-24 animate-pulse">
        
        {/* Back button */}
        <div className="w-32 h-5 bg-[#1a1a1a] rounded-md mb-7"></div>

        {/* Campaign Hero */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 mb-5 overflow-hidden">
          {/* Reward pill */}
          <div className="w-28 h-8 bg-[#1a1a1a] rounded-xl mb-5"></div>
          
          {/* Title */}
          <div className="w-3/4 h-8 md:h-10 bg-[#1a1a1a] rounded-lg mb-4"></div>
          
          {/* Description */}
          <div className="space-y-2 mb-8">
            <div className="w-full h-4 bg-[#1a1a1a] rounded-md"></div>
            <div className="w-5/6 h-4 bg-[#1a1a1a] rounded-md"></div>
            <div className="w-4/6 h-4 bg-[#1a1a1a] rounded-md"></div>
          </div>
          
          {/* Open Link Button */}
          <div className="w-48 h-[42px] bg-[#1a1a1a] rounded-xl"></div>
        </div>

        {/* Progress tracker */}
        <div className="bg-[#080808] border border-[#1a1a1a] rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-24 h-3 bg-[#1a1a1a] rounded-md"></div>
            <div className="w-16 h-3 bg-[#1a1a1a] rounded-md"></div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#111] rounded-full"></div>
        </div>

        {/* Tasks section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-36 h-4 bg-[#1a1a1a] rounded-md"></div>
            <div className="w-12 h-3 bg-[#1a1a1a] rounded-md"></div>
          </div>

          {/* Task Cards Skeleton (Shows 2 dummy cards) */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-gradient-to-b from-[#0f0f0f] to-[#080808] border border-[#1a1a1a] rounded-3xl p-6 md:p-8 pl-8 md:pl-10">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
                <div className="flex items-start gap-4 md:gap-5 w-full">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#1a1a1a]"></div>
                  <div className="space-y-3 w-full pt-1">
                    <div className="w-1/2 h-5 bg-[#1a1a1a] rounded-md"></div>
                    <div className="w-3/4 h-4 bg-[#1a1a1a] rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2.5 mb-8 md:pl-16">
                <div className="w-20 h-[30px] bg-[#1a1a1a] rounded-lg"></div>
                <div className="w-32 h-[30px] bg-[#1a1a1a] rounded-lg"></div>
              </div>

              {/* Proof Input Zone */}
              <div className="md:pl-16 space-y-4">
                <div className="w-full h-12 bg-[#111] border border-[#1a1a1a] rounded-2xl"></div>
                <div className="w-full h-14 bg-[#1a1a1a] rounded-2xl"></div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
