'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersRotation = () => {
  return (
    <section className="py-12 max-w-4xl mx-auto px-4 relative">
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-sats-orange-500/15 to-sats-orange-500/5 border border-sats-orange-500/20 rounded-[24px] p-8 sm:p-10 md:p-12 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
          {/* Subtle inner radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[250px] bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_75%)] pointer-events-none -mt-24"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
            {/* SVG Rotation Icon Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-sats-orange-500" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3.4"/>
                <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
                <circle cx="4.5" cy="10" r="2.2"/>
                <path d="M1 18a4 4 0 0 1 4.2-4"/>
                <circle cx="19.5" cy="10" r="2.2"/>
                <path d="M23 18a4 4 0 0 0-4.2-4"/>
              </svg>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                The Founders Rotation
              </h3>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                SatsEarn runs its own global marketing. When a new user signs up through one of our campaigns <strong className="text-white font-bold">without a referrer attached</strong>, they're assigned to a Founder — rotating fairly through every one of the 1,000 spots in turn.
              </p>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                You focus on the long game. <strong className="text-white font-bold">We bring the people; the rotation shares these crew members out evenly</strong> across the founding cohort, so every Founder benefits from the platform's growth.
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
};
