import React from 'react';
import type { Metadata } from 'next';
import { ReferralHero } from '@/features/referral/components/ReferralHero';
import { ReferralHistory } from '@/features/referral/components/ReferralHistory';
import { ReferralChallenge } from '@/features/referral/components/ReferralChallenge';
import { ReferralCalculator } from '@/features/referral/components/ReferralCalculator';
import { ReferralDashboard } from '@/features/referral/components/ReferralDashboard';
import { ReferralTiers } from '@/features/referral/components/ReferralTiers';
import { ReferralShare } from '@/features/referral/components/ReferralShare';
import { ReferralFAQ } from '@/features/referral/components/ReferralFAQ';
import { ReferralSecNav } from '@/features/referral/components/ReferralSecNav';
import { ReferralContactFab } from '@/features/referral/components/ReferralContactFab';
import { ReferralMechanics } from '@/features/referral/components/ReferralMechanics';

export const metadata: Metadata = {
  title: 'Referral Programme | SatsEarn',
  description: 'Earn real Bitcoin by inviting friends to SatsEarn. Stack sats for every commissionable action they complete. Free to join, uncapped on paid tiers.',
};

export default function ReferralPage() {
  return (
    <>
      <main className="min-h-screen bg-sats-black-950 overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]">
        <ReferralSecNav />
        <ReferralHero />
        <ReferralHistory />
        <ReferralChallenge />
        <ReferralMechanics />
        <ReferralCalculator />
        <ReferralDashboard />
        <ReferralTiers />
        <ReferralShare />
        <ReferralFAQ />
        <ReferralContactFab />
      </main>
    </>
  );
}
