'use client';

import React from 'react';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';
import { HeroSection } from './components/HeroSection';
import { MinimumsSection } from './components/MinimumsSection';
import { StepsSection } from './components/StepsSection';
import { MaturitySection } from './components/MaturitySection';
import { WalletsSection } from './components/WalletsSection';
import { SetupGuideSection } from './components/SetupGuideSection';
import { MarqueeSection } from './components/MarqueeSection';
import { SpeedStatsSection } from './components/SpeedStatsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';

export default function WithdrawalsPage() {
  return (
    <main className="relative min-h-screen bg-sats-black-950 bg-grid-base overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(238,139,18,0.06),transparent_60%)]"></div>
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(238,139,18,0.04),transparent_65%)]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.05),transparent_60%)]"></div>
      </div>

      <div className="relative z-10 w-full pb-8">
        <HeroSection />
        <MinimumsSection />
        <StepsSection />
        <MaturitySection />
        <WalletsSection />
        <SetupGuideSection />
        <MarqueeSection />
        <SpeedStatsSection />
        <FaqSection />
        <CtaSection />
      </div>

      <FloatingSupportButton />
    </main>
  );
}
