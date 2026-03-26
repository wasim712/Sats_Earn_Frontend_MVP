import React from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { Features } from '@/features/landing/components/Features';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { Advertise } from '@/features/landing/components/Advertise';
// import { BrandsSection } from '@/features/landing/components/BrandsSection';

export default function Home() {
  return (
    // REMOVED: gap-16 md:gap-32
    // ADDED: space-y-0 so components sit perfectly flush against each other
    <div className="flex flex-col w-full pb-20">
      
      <HeroSection />
      
      {/* Divider Line - gave it a small margin so it breathes */}
      <div className="my-8 md:my-12 h-px w-full bg-linear-to-r from-transparent via-sats-black-800 to-transparent" />
      
      <Features /> 
      
      <WaysToEarn />
      <Advertise/>
      
    </div>
  );
}