import React from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { Features } from '@/features/landing/components/Features';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { Advertise } from '@/features/landing/components/Advertise';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
export default function Home() {
  return (
    // REMOVED: gap-16 md:gap-32
    // ADDED: space-y-0 so components sit perfectly flush against each other
    <div className="flex flex-col w-full">
      <HeroSection />
      <Features /> 
      <WaysToEarn />
      <Advertise/>
      <FAQ/>
      <CTASection/>
    </div>
  );
}