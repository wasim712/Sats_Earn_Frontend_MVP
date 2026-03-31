import React from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { Features } from '@/features/landing/components/Features';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { Advertise } from '@/features/landing/components/Advertise';
import { Testimonials } from '@/components/layout/Testimonials';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
import { Navbar } from '@/components/layout/Navbar';
export default function Home() {
  return (
    // REMOVED: gap-16 md:gap-32
    // ADDED: space-y-0 so components sit perfectly flush against each other
    <div className="flex flex-col w-full">
      <Navbar/>
      <HeroSection />
      <Features /> 
      <WaysToEarn />
      <Advertise/>
      <Testimonials/>
      <FAQ/>
      <CTASection/>
    </div>
  );
}