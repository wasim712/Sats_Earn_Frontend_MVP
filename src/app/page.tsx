import React from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { Features } from '@/features/landing/components/Features';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { Advertise } from '@/features/landing/components/Advertise';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
export default function Home() {
  return (
    // REMOVED: gap-16 md:gap-32
    // ADDED: space-y-0 so components sit perfectly flush against each other
    <div className="flex flex-col w-full">
      <HeroSection />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">How SatsEarn works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">A public rewards platform built for real users</h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-gray-300 md:grid-cols-3">
            <p>Create an account, browse available tasks and offers, and complete the required actions from your dashboard.</p>
            <p>Rewards are reviewed before approval when needed, which helps protect the platform, users, and advertiser campaigns.</p>
            <p>Support, privacy information, and platform terms are available publicly so visitors can understand how the service works before signing up.</p>
          </div>
          <div className="mt-5">
            <PublicTrustNav />
          </div>
        </div>
      </section>
      <Features /> 
      <WaysToEarn />
      <Advertise/>
      <FAQ/>
      <CTASection/>
    </div>
  );
}
