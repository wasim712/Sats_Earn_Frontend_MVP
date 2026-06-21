'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const ReferralPreviewSection = () => {
  const router = useRouter();

  const freeTiers = [
    { name: 'Basic', rate: '5%', max: '20', cap: '2,000 sats', color: 'bg-gray-500' },
    { name: 'Copper', rate: '5%', max: '40', cap: '4,000 sats', color: 'bg-orange-700' },
    { name: 'Bronze', rate: '5%', max: '60', cap: '6,000 sats', color: 'bg-orange-500' },
    { name: 'Silver', rate: '5%', max: '80', cap: '8,000 sats', color: 'bg-gray-400' },
    { name: 'Gold', rate: '5%', max: '100', cap: '10,000 sats', color: 'bg-yellow-500' },
  ];

  const paidTiers = [
    { name: 'Platinum', rate: '10%', max: '∞', cap: 'None', color: 'bg-gray-200' },
    { name: 'Diamond', rate: '15%', max: '∞', cap: 'None', color: 'bg-cyan-200' },
    { name: 'Crown', rate: '20%', max: '∞', cap: 'None', color: 'bg-orange-200' },
    { name: 'Elite', rate: '25%', max: '∞', cap: 'None', color: 'bg-purple-500' },
    { name: 'Founders', rate: '30%', max: '∞', cap: 'None', color: 'bg-yellow-400' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]" id="referral">
      <div className="absolute inset-0 bg-radial-gradient from-sats-orange-500/5 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Referral Programme
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            Refer Friends.<br />
            <span className="text-sats-orange-500">Stack Together.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Earn a percentage of the admin base reward every time your active referrals complete tasks. Commission is based on the base rate — never on what your referral earns.
          </p>
        </FadeUp>

        {/* How Commission Works Box */}
        <FadeUp delay={0.1} className="max-w-3xl mx-auto bg-sats-black-900 border border-white/10 rounded-2xl p-6 md:p-8 mb-16 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-sats-orange-500" /> How Commission is Calculated
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your commission is always a % of the admin-set base reward — not your referral&apos;s tier earnings. Same base for everyone. Only your tier % changes.
              </p>
            </div>
            
            <div className="flex-1 w-full bg-sats-black-950 rounded-xl p-4 border border-white/5 relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-yellow-500 font-mono">Founders · 30%</span>
                <span className="text-xs text-gray-300">Base 10 sats × 30% = <strong className="text-sats-orange-500 font-mono">3 sats</strong></span>
              </div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-sats-black-950 px-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">vs</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-bold text-gray-400 font-mono">Basic · 5%</span>
                <span className="text-xs text-gray-500">Base 10 sats × 5% = <strong className="text-gray-400 font-mono">0.5 sats</strong></span>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Referral Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Free Tier Referrals */}
          <FadeUp delay={0.2} className="bg-sats-black-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 bg-sats-black-800/80 border-b border-white/10 relative">
              <div className="absolute top-4 left-4 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 mt-3">Free Tier Referrals</h4>
              <p className="text-xs font-bold font-mono tracking-widest text-gray-400 uppercase">Fixed 5% · Lifetime caps apply</p>
            </div>
            
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-sats-black-950 p-4 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
              <span>Tier</span>
              <span>Rate</span>
              <span>Max Refs</span>
              <span>Lifetime Cap</span>
            </div>

            <div className="flex flex-col">
              {freeTiers.map((tier, idx) => (
                <div key={idx} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tier.color}`} />
                    <span className="text-sm font-bold text-white">{tier.name}</span>
                  </div>
                  <span className="text-sm text-gray-400 font-mono">{tier.rate}</span>
                  <span className="text-sm text-gray-400 font-mono">{tier.max}</span>
                  <span className="text-sm text-gray-400 font-mono">{tier.cap}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-sats-black-950/50 text-[11px] text-gray-500 border-t border-white/5 text-center leading-relaxed">
              Caps are cumulative across all free tiers. Commission only paid on active referrals. Caps lift completely on any paid tier.
            </div>
          </FadeUp>

          {/* Paid Tier Referrals */}
          <FadeUp delay={0.3} className="bg-gradient-to-b from-sats-orange-500/5 to-sats-black-900 border border-sats-orange-500/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.05)]">
            <div className="p-6 bg-sats-black-800/50 border-b border-sats-orange-500/20 relative">
              <div className="absolute top-4 left-4 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <h4 className="text-lg font-bold text-white mb-1 mt-3">Paid Tier Referrals</h4>
              <p className="text-xs font-bold font-mono tracking-widest text-sats-orange-500 uppercase">Higher rates · Zero caps · Unlimited</p>
            </div>
            
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-sats-black-950 p-4 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
              <span>Tier</span>
              <span>Rate</span>
              <span>Refs</span>
              <span>Cap</span>
            </div>

            <div className="flex flex-col">
              {paidTiers.map((tier, idx) => {
                const isFounders = tier.name === 'Founders';
                return (
                  <div key={idx} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center p-4 border-b border-white/5 transition-colors last:border-b-0 ${isFounders ? 'bg-sats-orange-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${tier.color}`} />
                      <span className={`text-sm font-bold ${isFounders ? 'text-sats-orange-500' : 'text-white'}`}>
                        {tier.name}{isFounders && ' ★'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-sats-orange-500 font-mono">{tier.rate}</span>
                    <span className={`text-md font-bold font-mono ${isFounders ? 'text-sats-orange-500' : 'text-green-500'}`}>{tier.max}</span>
                    <span className={`text-sm font-bold font-mono ${isFounders ? 'text-sats-orange-500' : 'text-green-500'}`}>
                      {isFounders ? '∞ + Rotation' : tier.cap}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-sats-black-950/50 text-[11px] text-gray-400 border-t border-white/5 text-left leading-relaxed">
              <span className="text-sats-orange-500">★ Founders Rotation:</span> When a new user joins without a referral code, they are auto-assigned to the next Founder in a round-robin queue — earning that Founder commission for life.
            </div>
          </FadeUp>

        </div>

        <FadeUp delay={0.5} className="text-center">
          <Button variant="outline" onClick={() => router.push('/referral')} className="border-white/20 text-white hover:text-sats-orange-500 hover:border-sats-orange-500">
            View Full Referral Rules
          </Button>
        </FadeUp>

      </div>
    </section>
  );
};
