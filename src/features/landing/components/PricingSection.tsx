'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const PricingSection = () => {
  const router = useRouter();

  const tiers = [
    {
      name: 'Platinum',
      monthly: 4.99,
      yearly: 54.99,
      save: 8,
      refRate: '10%',
      withdrawMin: '20,000',
      features: [
        '2× task rewards vs Basic',
        'Unlimited referrals',
        'Premium streak milestones',
        'Exclusive games access',
        'Ad-free experience'
      ],
      color: 'text-gray-300',
      borderColor: 'border-white/10 hover:border-white/30',
      bg: 'bg-sats-black-900',
      badgeBg: 'bg-white/10'
    },
    {
      name: 'Diamond',
      monthly: 6.99,
      yearly: 76.99,
      save: 8,
      refRate: '15%',
      withdrawMin: '15,000',
      features: [
        '3× task rewards vs Basic',
        'Unlimited referrals',
        'Premium streak milestones',
        'Exclusive games access',
        'Ad-free experience'
      ],
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/50',
      bg: 'bg-gradient-to-b from-cyan-950/20 to-sats-black-900',
      badgeBg: 'bg-cyan-500/10 text-cyan-400'
    },
    {
      name: 'Crown',
      monthly: 9.99,
      yearly: 109.99,
      save: 8,
      refRate: '20%',
      withdrawMin: '15,000',
      features: [
        '4× task rewards vs Basic',
        'Unlimited referrals',
        'Premium streak milestones',
        'Exclusive games access',
        'Ad-free experience'
      ],
      color: 'text-orange-400',
      borderColor: 'border-orange-500/20 hover:border-orange-500/50',
      bg: 'bg-gradient-to-b from-orange-950/20 to-sats-black-900',
      badgeBg: 'bg-orange-500/10 text-orange-400'
    },
    {
      name: 'Elite',
      monthly: 15.99,
      yearly: 175.99,
      save: 8,
      refRate: '25%',
      withdrawMin: '15,000',
      features: [
        '5× task rewards vs Basic',
        'Unlimited referrals',
        'Premium streak milestones',
        'Exclusive games access',
        'Ad-free experience'
      ],
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20 hover:border-purple-500/50',
      bg: 'bg-gradient-to-b from-purple-950/20 to-sats-black-900',
      badgeBg: 'bg-purple-500/10 text-purple-400'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505]" id="pricing">
      <div className="absolute inset-0 bg-grid-base opacity-20 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono flex items-center justify-center gap-2">
              <Star className="w-3.5 h-3.5" /> Paid Tiers
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Stack Faster.<br />
            <span className="text-sats-orange-500">Upgrade When Ready.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Paid tiers are an amplifier — never a requirement. Upgrade with cash or use your own earned sats to pay for your subscription.
          </p>
        </FadeUp>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, idx) => (
            <FadeUp key={idx} delay={0.1 + (idx * 0.1)} className="h-full">
              <div className={`h-full flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${tier.bg} ${tier.borderColor}`}>
                
                <h3 className={`text-xl font-bold mb-4 ${tier.color}`}>{tier.name}</h3>
                
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-start text-white mb-2">
                    <span className="text-xl font-bold mt-1">$</span>
                    <span className="text-5xl font-black tracking-tighter">{tier.monthly}</span>
                    <span className="text-gray-500 ml-1 mt-auto mb-1">/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>or <strong className="text-white">${tier.yearly}/yr</strong></span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${tier.badgeBg}`}>SAVE {tier.save}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className={`text-xl font-black ${tier.color} font-mono`}>{tier.refRate}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Referral Rate</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-white font-mono">{tier.withdrawMin}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Withdraw Min</div>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.color}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => router.push('/signup')} 
                  variant="secondary"
                  className="w-full font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl py-6"
                >
                  Get {tier.name}
                </Button>
                <div className="text-center mt-3 text-xs text-gray-500">Pay with sats or card</div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Founders Card */}
        <FadeUp delay={0.5} className="max-w-4xl mx-auto mb-12">
          <div className="relative rounded-2xl bg-gradient-to-br from-yellow-500/20 via-sats-black-900 to-sats-black-950 border border-yellow-500/30 overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.15)]">
            <div className="absolute top-0 right-0 px-4 py-1 bg-yellow-500 text-black text-xs font-black tracking-widest uppercase rounded-bl-lg">
              1,000 Spots Only
            </div>
            
            <div className="p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
              <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-3xl font-black text-yellow-500 mb-2">Founders</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto md:mx-0">The ultimate tier. Maximum rewards, maximum referral rate, minimum withdrawal threshold.</p>
                
                <div className="flex items-start justify-center md:justify-start text-white mb-2">
                  <span className="text-2xl font-bold mt-1">$</span>
                  <span className="text-6xl font-black tracking-tighter">249</span>
                  <span className="text-gray-500 ml-2 mt-auto mb-2 text-xl">/yr</span>
                </div>
                <div className="text-sm text-gray-400 mb-8">One founding term · <strong className="text-white">yearly only</strong></div>
                
                <Button 
                  onClick={() => router.push('/signup')}
                  className="w-full md:w-auto px-8 py-6 font-bold bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] border-none"
                >
                  Claim Founders Spot
                </Button>
                <div className="text-center md:text-left mt-3 text-xs text-gray-500">Yearly only · Limited to 1,000 users</div>
              </div>

              <div className="flex-1 w-full flex flex-col sm:flex-row md:flex-col gap-6 md:gap-4 md:pl-8 md:border-l md:border-yellow-500/20">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-black text-yellow-500 font-mono">30%</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Referral Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-yellow-500 font-mono">10k sats</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Withdraw Min</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 shrink-0 mt-0.5 text-yellow-500" />
                      <span className="leading-snug">6× task rewards vs Basic</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 shrink-0 mt-0.5 text-yellow-500" />
                      <span className="leading-snug">Unlimited referrals + <strong className="text-white">rotation</strong></span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 shrink-0 mt-0.5 text-yellow-500" />
                      <span className="leading-snug">All premium milestones & games</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 shrink-0 mt-0.5 text-yellow-500" />
                      <span className="leading-snug">Permanent Founders badge</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.6} className="text-center text-sm text-gray-400 max-w-3xl mx-auto">
          <strong className="text-white">All paid tiers can be purchased with your earned sats</strong> from your available balance — or with standard payment methods. Monthly and yearly plans available for all tiers except Founders (yearly only).
        </FadeUp>

      </div>
    </section>
  );
};
