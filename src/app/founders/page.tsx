'use client';

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
