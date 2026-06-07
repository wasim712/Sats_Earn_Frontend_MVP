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
<section className="px-4 py-8 sm:px-6 lg:px-8 mt-4 sm:mt-12 relative">
  <div className="mx-auto max-w-5xl rounded-3xl border border-[#1a1a1a] bg-[#080808]/90 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group">
    
    {/* Subtle Decorative Ambient Glow */}
    <div className="absolute -top-32 -right-32 w-72 h-72 bg-sats-orange-400/5 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 group-hover:opacity-70" />
    <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000 group-hover:opacity-70" />
    
    <div className="relative z-10">
      <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-sats-orange-400">
        How SatsEarn works
      </p>
      <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white max-w-3xl leading-tight">
        A public rewards platform built for real users
      </h2>
      
      <div className="mt-8 sm:mt-10 flex flex-col gap-6 sm:gap-8">
        {/* Item 1 */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-100">
            Create Account & Browse Tasks
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-400">
            Create an account, browse available tasks and offers, and complete the required actions from your dashboard.
          </p>
        </div>
        
        {/* Item 2 */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-100">
            Verification & Review
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-400">
            Rewards are reviewed before approval when needed, which helps protect the platform, users, and advertiser campaigns.
          </p>
        </div>
        
        {/* Item 3 */}
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-100">
            Transparency & Support
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-gray-400">
            Support, privacy information, and platform terms are available publicly so visitors can understand how the service works before signing up.
          </p>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-[#1a1a1a]">
        <PublicTrustNav />
      </div>
    </div>
  </div>
</section>
      
      <Features /> 
      <WaysToEarn />
      <Advertise />
      <FAQ />
      <CTASection />
    </div>
  );
}