import React, { Suspense } from 'react';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { TickerSection } from '@/features/landing/components/TickerSection';
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection';
import { WaysToEarn } from '@/features/landing/components/WaysToEarn';
import { TierSystemSection } from '@/features/landing/components/TierSystemSection';
import { StreakMilestonesSection } from '@/features/landing/components/StreakMilestonesSection';
import { ReferralPreviewSection } from '@/features/landing/components/ReferralPreviewSection';
import { WithdrawalsSection } from '@/features/landing/components/WithdrawalsSection';
import { PricingSection } from '@/features/landing/components/PricingSection';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
import { ReferralParamStorage } from '@/components/referral/ReferralParamStorage';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#050505]">
      <Suspense fallback={null}>
        <ReferralParamStorage />
      </Suspense>
      
      <HeroSection />
      <TickerSection />
      <HowItWorksSection />
      <WaysToEarn />
      <TierSystemSection />
      <StreakMilestonesSection />
      <ReferralPreviewSection />
      <WithdrawalsSection />
      <PricingSection />
      <FAQ />
      <CTASection />
      
    </div>
  );
}