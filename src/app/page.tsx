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
import { BlogPreviewSection } from '@/features/landing/components/BlogPreviewSection';
import { FAQ } from '@/components/layout/Faq';
import { CTASection } from '@/components/layout/CtaSection';
import { ReferralParamStorage } from '@/components/referral/ReferralParamStorage';

export default function Home() {
  return (
    <div className="flex w-full flex-col overflow-hidden bg-[#050505]">
      <Suspense fallback={null}>
        <ReferralParamStorage />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['WebSite', 'SoftwareApplication'],
            name: 'SatsEarn',
            url: 'https://satsearn.app',
            description: 'Learn Bitcoin and earn real sats without buying. Complete tasks, answer quizzes, and stack sats daily.',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />

      <HeroSection />
      <TickerSection />
      <HowItWorksSection />
      <WaysToEarn />
      <TierSystemSection />
      <StreakMilestonesSection />
      <ReferralPreviewSection />
      <WithdrawalsSection />
      <PricingSection />
      <BlogPreviewSection />
      <FAQ />
      <CTASection />
    </div>
  );
}
