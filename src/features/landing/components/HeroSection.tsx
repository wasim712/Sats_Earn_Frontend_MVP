'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FadeUp } from '@/components/animations/FadeUp';

export const HeroSection = () => {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-visible px-4 flex flex-col items-center w-full justify-center pt-8 sm:pt-10 pb-12" id="hero">
      
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] rounded-full bg-sats-orange-500/10 blur-[100px] pointer-events-none z-0" />
      
      <div className="w-full max-w-[1200px] mx-auto flex flex-col relative z-10">

        {/* Split Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full mb-16">
          
          {/* Left Column: Copy & CTA */}
          <FadeUp className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start" delay={0.1}>
            
            {/* Pill */}
            <div className="inline-flex items-center px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 sm:mb-8 border border-sats-orange-500/20 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(249,115,22,0.05)]">
              <span className="text-gray-300 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                The <span className="text-sats-orange-500">Bitcoin</span> Earn Platform
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 sm:mb-6 leading-[1.05] tracking-tighter">
              Stack <span className="text-sats-orange-500 relative">
                Sats 
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sats-orange-500 to-transparent rounded-full" />
              </span> Daily,
              <span className="text-4xl sm:text-5xl lg:text-6xl inline-block mt-2"> <span className="text-sats-orange-500 relative">Bit
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sats-orange-500 to-transparent rounded-full" />
              </span> by 
              <span className="text-sats-orange-500 relative"> Bit
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sats-orange-500 to-transparent rounded-full" />
              </span>
              </span>
            </h1>
            
            <p className="text-[17px] sm:text-[19px] text-gray-300 font-medium mb-6 max-w-lg lg:mx-0 leading-relaxed">
              Complete tasks, answer quizzes, maintain streaks — every action stacks <strong className="text-white">real <span className="text-sats-orange-500">Bitcoin</span> sats</strong> paid directly to your Lightning wallet. No exchange. No credit card. Just earn.
            </p>

            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4 mb-8 max-w-[500px] text-left">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,1)]" />
              <p className="text-sm text-gray-300 leading-relaxed">
                Real people. Real sats. Zero bots. Every action on SatsEarn is performed by a verified human — never automated.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full sm:w-auto">
              <Button 
                size="lg" 
                onClick={() => router.push('/signup')} 
                className="group w-full sm:w-auto text-[15px] font-extrabold tracking-wide rounded-xl bg-sats-orange-500 text-black hover:bg-sats-orange-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_8px_32px_rgba(249,115,22,0.3)] border-none"
              >
                Start Stacking Sats
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="ghost"
                onClick={() => scrollToSection('how-it-works')} 
                className="w-full sm:w-auto text-[15px] font-extrabold tracking-wide rounded-xl border-white/15 text-white hover:border-sats-orange-500 hover:text-sats-orange-500 hover:bg-sats-orange-500/10 transition-all bg-transparent"
              >
                See How It Works
              </Button>
            </div>

            {/* Product Hunt Badge */}
            <FadeUp delay={0.15} className="mb-8 w-full flex justify-center lg:justify-start">
              <a 
                href="https://www.producthunt.com/products/satsearn-stack-sats-not-excuses?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-satsearn-stack-sats-not-excuses" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-lg"
              >
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1163776&theme=dark" 
                  alt="SatsEarn - Stack Sats, Not Excuses | Product Hunt" 
                  style={{ width: '250px', height: '54px' }}
                  width="250" 
                  height="54" 
                />
              </a>
            </FadeUp>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-[13px] text-gray-400 font-medium mb-6">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 font-bold" /> No credit card
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 font-bold" /> No KYC required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 font-bold" /> Free forever tier
              </span>
            </div>

            <div className="text-xs text-gray-500 tracking-wide leading-relaxed text-center lg:text-left max-w-md">
              Earnings depend on task availability and tier. All sats go through a 15-day maturity period before withdrawal.
            </div>
          </FadeUp>

          {/* Right Column: Interactive Orbit Animation */}
          <FadeUp className="relative w-full flex justify-center lg:justify-end items-center mt-4 lg:-mt-12 xl:-mt-16" delay={0.2}>
            <div className="relative flex justify-center items-center w-full h-[280px] min-[375px]:h-[340px] min-[425px]:h-[400px] sm:h-[500px] lg:min-h-[560px] z-10 overflow-hidden lg:overflow-visible">
              <div className="shrink-0 w-[560px] h-[560px] flex items-center justify-center origin-center scale-[0.5] min-[375px]:scale-[0.6] min-[425px]:scale-[0.7] sm:scale-[0.9] lg:scale-110 xl:scale-[1.15] transition-transform duration-300">
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

        {/* Hero Stats */}
        <FadeUp delay={0.3} className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-white/10 rounded-2xl overflow-hidden bg-sats-black-900/40 backdrop-blur-md">
          
          <div className="flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sats-orange-500/10 text-sats-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
            </div>
            <div className="text-2xl font-black text-sats-orange-500 font-mono tracking-tight">Real</div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-bold text-center">
              <span className="text-sats-orange-500">Bitcoin</span> Sats
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sats-orange-500/10 text-sats-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <Zap className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
            </div>
            <div className="text-2xl font-black text-sats-orange-500 font-mono tracking-tight">Fast</div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-bold text-center">
              Lightning Network
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-b border-r md:border-b-0 border-white/10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sats-orange-500/10 text-sats-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
            </div>
            <div className="text-2xl font-black text-sats-orange-500 font-mono tracking-tight">Zero</div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-bold text-center">
              Bots. Ever.
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-b border-r md:border-b-0 border-white/10 md:border-r">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sats-orange-500/10 text-sats-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <Globe className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
            </div>
            <div className="text-2xl font-black text-sats-orange-500 font-mono tracking-tight">180+</div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-bold text-center">
              Countries
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 col-span-2 md:col-span-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sats-orange-500/10 text-sats-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <Ticket className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.35)]" />
            </div>
            <div className="text-2xl font-black text-sats-orange-500 font-mono tracking-tight">Free</div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-bold text-center">
              Forever Tier
            </div>
          </div>

        </FadeUp>

      </div>
    </section>
  );
};