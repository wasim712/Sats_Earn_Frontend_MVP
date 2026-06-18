'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';

export const CTASection = () => {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-32 overflow-hidden border-t border-white/[0.05] bg-[#050505]" id="cta-final">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp>
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-sats-orange-500/30 bg-sats-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <span className="text-sats-orange-500 text-xs font-black tracking-widest uppercase">
              Ready to Stack?
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
            Start Stacking Sats<br />
            <span className="text-sats-orange-500">Today. For Free.</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            No credit card. No buying. No exchange account. Just complete tasks and stack real Bitcoin sats.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              size="lg" 
              onClick={() => router.push('/signup')} 
              className="w-full sm:w-auto gap-2 group text-base font-bold bg-sats-orange-500 text-black hover:bg-sats-orange-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] border-none rounded-xl px-8 py-6"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToSection('tiers')}
              className="w-full sm:w-auto gap-2 text-base font-bold border-white/20 text-white hover:text-sats-orange-500 hover:border-sats-orange-500 hover:bg-sats-orange-500/10 transition-all rounded-xl px-8 py-6"
            >
              View All Tiers
            </Button>
          </div>

          <p className="mt-10 text-xs sm:text-sm text-gray-500 tracking-wide">
            Earnings depend on task availability and tier. All sats subject to 15-day maturity period.
          </p>
        </FadeUp>
      </div>
    </section>
  );
};