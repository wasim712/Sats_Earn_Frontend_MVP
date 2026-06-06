import React, { Suspense } from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { Features } from '@/features/landing/components/Features';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { Advertise } from '@/features/landing/components/Advertise';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
import { ReferralParamStorage } from '@/components/referral/ReferralParamStorage';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={null}>
        <ReferralParamStorage />
      </Suspense>
      <HeroSection />
      
      {/* ─── TRUST & TRANSPARENCY SECTION ─── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 mt-4 sm:mt-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md p-6 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">How SatsEarn works</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">A public rewards platform built for real users</h2>
          
          <div className="mt-6 grid gap-6 text-sm sm:text-base leading-relaxed text-gray-300 md:grid-cols-3">
            <p>Create an account, browse available tasks and offers, and complete the required actions from your dashboard.</p>
            <p>Rewards are reviewed before approval when needed, which helps protect the platform, users, and advertiser campaigns.</p>
            <p>Support, privacy information, and platform terms are available publicly so visitors can understand how the service works before signing up.</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
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
