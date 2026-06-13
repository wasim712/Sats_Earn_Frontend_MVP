import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FoundersHero } from '@/features/founders/components/FoundersHero';
import { FoundersBenefits } from '@/features/founders/components/FoundersBenefits';
import { FoundersSpecs } from '@/features/founders/components/FoundersSpecs';
import { FoundersComparison } from '@/features/founders/components/FoundersComparison';
import { FoundersCohort } from '@/features/founders/components/FoundersCohort';
import { FoundersRotation } from '@/features/founders/components/FoundersRotation';
import { FoundersCloseCta } from '@/features/founders/components/FoundersCloseCta';

export const metadata: Metadata = {
  title: 'Founders Tier — Become a SatsEarn Founder | SatsEarn',
  description: 'Join the SatsEarn Founders tier — the highest paid tier, capped at 1,000 members. Permanent Founder status, the highest sat rewards, uncapped referrals, and the Founders Rotation perk.',
  alternates: {
    canonical: 'https://satsearn.app/founders',
  },
  openGraph: {
    title: 'Founders Tier — Become a SatsEarn Founder',
    description: 'The highest SatsEarn tier, capped at 1,000 members. Permanent Founder status, top sat rewards, uncapped referrals, and the Founders Rotation perk.',
    type: 'website',
    url: 'https://satsearn.app/founders',
  }
};

export default function FoundersPage() {
  return (
    <>
      <main className="min-h-screen bg-sats-black-950 overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]">
        

        {/* Modular Page Sections */}
        <FoundersHero />
        <FoundersBenefits />
        <FoundersSpecs />
        <FoundersComparison />
        <FoundersCohort />
        <FoundersRotation />
        <FoundersCloseCta />
      </main>
    </>
  );
}
