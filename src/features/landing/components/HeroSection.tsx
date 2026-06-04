'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-visible px-4 flex flex-col items-center w-full justify-center pt-8 pb-8  sm:pb-20" id="how-it-works">
      
      <div className="w-full max-w-[1300px] mx-auto flex flex-col">

        {/* Split Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Copy & CTA */}
          <FadeUp className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start" delay={0.1}>
            
            {/* Pill */}
            <div className="inline-flex items-center px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 sm:mb-8 border border-sats-orange-500/20 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]">
              <span className="text-sats-orange-500 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                Stack Sats, Not Excuses
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6 leading-[1.1] tracking-tighter">
              Earn <span className="text-sats-orange-500">Bitcoin</span> by <br className="hidden lg:block" />
              Doing Simple Tasks
            </h1>
            
            <p className="text-[16px] sm:text-lg text-gray-300 font-medium mb-8 max-w-lg lg:mx-0 leading-relaxed">
              SatsEarn helps users discover available surveys, offer-based tasks, referrals, and promotions that can pay out Bitcoin rewards after successful completion and review.
            </p>

            {/* Call to Action Button */}
            <div className="w-full sm:w-auto mb-8">
              <Button 
                size="lg" 
                onClick={() => router.push('/signup')} 
                className="group w-full sm:w-auto text-base sm:text-lg font-bold py-6 px-8 rounded-xl bg-sats-orange-500 text-white hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] border-none"
              >
                Start Earning Free
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[12px] sm:text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" /> No credit card
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" /> Complete tasks
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" /> Public support pages
              </span>
            </div>
          </FadeUp>
{/* Right Column: Interactive Orbit Animation */}
          <FadeUp className="relative w-full flex justify-center lg:justify-end items-center mt-4 lg:mt-0" delay={0.2}>
            
            {/* MOBILE CLIPPING FIX: 
              Tuned the heights and scale factors for distinct mobile breakpoints 
              so it perfectly hugs the animation without clipping the sides.
            */}
            <div className="relative flex justify-center items-center w-full h-[280px] min-[375px]:h-[340px] min-[425px]:h-[400px] sm:h-[500px] lg:min-h-[560px] z-10 overflow-hidden lg:overflow-visible">
              
              {/* Iframe Scaler */}
              <div className="w-[560px] h-[560px] flex items-center justify-center origin-center scale-[0.5] min-[375px]:scale-[0.6] min-[425px]:scale-[0.7] sm:scale-[0.9] lg:scale-100 transition-transform duration-300">
                <iframe 
                  src="/home_orbit/satsearn-orbit.html" 
                  title="SatsEarn Earning Methods Orbit"
                  className="w-full h-full border-none pointer-events-auto bg-transparent"
                  scrolling="no"
                />
              </div>
              
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};