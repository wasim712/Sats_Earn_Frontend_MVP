'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';
import Image from 'next/image';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-visible  px-4  flex flex-col items-center  w-full min-h-[calc(100vh-200px)] ">
      
      <div className="w-full max-w-325 mx-auto flex flex-col">
        
        {/* 1. Global Top Headline */}
        <FadeUp className="text-center mb-12 ">
          <h2 className="text-[32px] sm:text-5xl md:text-[54px] lg:text-[58px] font-bold text-white tracking-tight leading-[1.15]">
            The #1 Gamified Platform to Earn <span className="text-sats-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">Bitcoin</span>
          </h2>
        </FadeUp>

        {/* 2. Split Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Copy & CTA */}
          <FadeUp className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start" delay={0.1}>
            
            {/* Pill */}
            <div className="inline-flex items-center px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 sm:mb-8 border border-sats-orange-500/20 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]">
              <span className="text-sats-orange-500 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                Stack Sats, Not Excuses
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 sm:mb-6 leading-[1.1] tracking-tighter">
              Earn <span className="text-sats-orange-500">Bitcoin</span> by <br className="hidden lg:block" />
              Doing Simple Tasks
            </h1>
            
            <p className="text-[16px] sm:text-lg text-gray-300 font-medium mb-8 max-w-lg lg:mx-0 leading-relaxed">
              Complete surveys, watch videos, engage on social media, and earn <span className="text-sats-orange-500 font-bold">Bitcoin</span> (sats) instantly.
            </p>

            {/* Call to Action Button */}
            <div className="w-full sm:w-auto mb-8">
              <Button 
                size="lg" 
                onClick={() => router.push('/signup')} 
                className="group w-full sm:w-auto text-base sm:text-lg font-bold py-4 px-8 rounded-xl bg-sats-orange-500 text-white hover:bg-orange-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] border-none"
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
                <CheckCircle2 className="w-4.5 h-4.5 text-green-500" /> Withdraw Bitcoin
              </span>
            </div>
          </FadeUp>

          {/* Right Column: High-Res Hero Image */}
          <FadeUp className="relative w-full flex justify-center lg:justify-end items-center mt-6 lg:mt-0" delay={0.2}>
            {/* Outer glowing border container */}
            <div className="relative w-full max-w-[700px] rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/5 bg-[#050505] p-2 sm:p-3 shadow-[0_0_80px_rgba(249,115,22,0.12)] group hover:shadow-[0_0_100px_rgba(249,115,22,0.18)] transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-sats-orange-500/10 via-transparent to-transparent opacity-60" />
              
              <Image 
                src="/hero_screen.png" 
                alt='SatsEarn Platform Interface'
                width={1400}     // Realistically high base width for crispness
                height={900}     // Realistically high base height
                quality={100}    // Tell Next.js not to compress heavily
                priority         // Extremely important: loads image immediately without blur placeholders
                className="w-full h-auto rounded-[24px] sm:rounded-[32px] object-cover relative z-10"
                sizes="(max-width: 768px) 100vw, 50vw" 
              />
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};