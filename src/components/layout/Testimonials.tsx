'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { FadeUp } from '@/components/animations/FadeUp';

// --- DATA CONFIGURATION ---
const TESTIMONIALS = [
  {
    quote: "I've earned over 500,000 sats in just 3 months. The tasks are easy and payouts are instant via Lightning. Best platform!",
    name: "Alex M.",
    tier: "Gold Tier",
  },
  {
    quote: "Love the referral program! I shared my link with friends and now earn passive sats every day. The streak bonuses are amazing too.",
    name: "Sarah K.",
    tier: "Silver Tier",
  },
  {
    quote: "As someone new to Bitcoin, SatsEarn made it easy to start stacking. No confusing setup, just complete tasks and earn real BTC.",
    name: "Mike R.",
    tier: "Platinum Tier",
  }
];

export const Testimonials = () => {
  return (
    // Tightened padding and subtle top border to separate it cleanly from the Brands section
    <section id="testimonials" className="relative pt-16 pb-16 sm:pt-20 sm:pb-24 border-t border-sats-black-800/50 overflow-hidden">
      
      {/* Subtle Background Glow behind the center of the grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-150 h-75 sm:h-150 bg-sats-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <span className="text-sats-orange-500 text-xs font-bold tracking-wide uppercase">
              Testimonials
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            What Our Users <span className="text-sats-orange-500">Say</span>
          </h2>
        </FadeUp>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <FadeUp key={index} delay={index * 0.15}>
              <Card 
                className="h-full flex flex-col justify-between text-left p-8! group transition-all duration-300 border-sats-black-800 bg-sats-black-900/80 hover:bg-sats-black-900 hover:-translate-y-1 hover:border-sats-orange-500/40 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.15)] cursor-default backdrop-blur-sm"
              >
                <div>
                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 text-sats-orange-500 fill-sats-orange-500 transition-transform duration-300 group-hover:scale-110" 
                        style={{ transitionDelay: `${i * 50}ms` }} // Cute staggered star hover effect
                      />
                    ))}
                  </div>
                  
                  {/* Review Quote */}
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium mb-8">
                    “{testimonial.quote}”
                  </p>
                </div>
                
                {/* User Info */}
                <div className="mt-auto">
                  <h4 className="text-lg font-bold text-white mb-1 tracking-wide">
                    {testimonial.name}
                  </h4>
                  <span className="text-sm font-semibold text-sats-orange-500/80 group-hover:text-sats-orange-500 transition-colors">
                    {testimonial.tier}
                  </span>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
        
      </div>
    </section>
  );
};