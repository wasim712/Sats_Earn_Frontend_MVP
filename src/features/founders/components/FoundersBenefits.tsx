'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

export const FoundersBenefits = () => {
  const benefits = [
    {
      name: 'Permanent Founder Badge',
      desc: 'A Founder medallion on your profile and a place in the founding cohort. It marks you as one of the first 1,000, for as long as you hold the tier.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-sats-orange-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    {
      name: 'Highest Sat Rewards',
      desc: 'Founders earn at the top base rate on the platform — the largest sat reward per completed task of any tier.',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-sats-orange-500" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/>
        </svg>
      )
    },
    {
      name: 'Uncapped Referrals',
      desc: 'No lifetime referral caps and the highest commission rate. Every person you bring in keeps paying out, with no ceiling.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-sats-orange-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/>
          <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>
        </svg>
      )
    },
    {
      name: 'Founders Rotation',
      desc: 'New users who join through our own marketing — with no referrer attached — are rotated fairly across all Founder spots as crew members. The platform brings the people; you share the upside.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-sats-orange-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="3.2"/>
          <path d="M22 19v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 4.13A4 4 0 0 1 16 11.5"/>
        </svg>
      )
    },
    {
      name: 'Lowest Withdrawal Minimum',
      desc: 'A 10,000-sat withdrawal minimum — the lowest threshold of any tier, so your earned sats reach your wallet sooner.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-sats-orange-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2"/>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/>
          <path d="M21 11h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
        </svg>
      )
    },
    {
      name: 'Early Access',
      desc: 'Founders get first access to new earning methods, mini-games, and features as they roll out — and a direct line to shape what comes next.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-sats-orange-500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z"/>
          <path d="M9 14c-1-2 0-5 2.5-7.5C14 4 18 3.5 20.5 3.5c0 2.5-.5 6.5-3 9C15 15 12 16 10 15z"/>
          <circle cx="15" cy="9" r="1.6"/>
        </svg>
      )
    }
  ];

  return (
    <section id="whats-included" className="py-16 max-w-5xl mx-auto px-4 relative">
      <div className="mb-12">
        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 font-mono text-[12px] sm:text-xs tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            <span className="w-6 h-px bg-sats-orange-500/50 inline-block"></span>
            what&apos;s Included
          </div>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none mb-4">
            Everything a Founder gets
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.3}>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
            The Founders tier is the most rewarding way to use SatsEarn — built for the people who back the platform earliest.
          </p>
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {benefits.map((ben, idx) => (
          <FadeUp key={ben.name} delay={0.1 + idx * 0.05}>
            <div className="relative h-full overflow-hidden bg-sats-black-900 border border-sats-orange-500/10 rounded-2xl p-6 transition-all duration-300 hover:border-sats-orange-500/30 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] group">
              {/* glowing border top effect */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sats-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="w-11 h-11 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/25 flex items-center justify-center mb-5 group-hover:bg-sats-orange-500/20 group-hover:border-sats-orange-500/45 transition-colors duration-300">
                {ben.icon}
              </div>
              
              <h3 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-sats-orange-500 uppercase mb-3">
                {ben.name}
              </h3>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                {ben.desc}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};
