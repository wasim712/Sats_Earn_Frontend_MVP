import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ScrollProgress } from '@/features/games/components/ScrollProgress';
import { WormHero } from '@/features/games/components/WormHero';
import { WormObjective } from '@/features/games/components/WormObjective';
import { WormElements } from '@/features/games/components/WormElements';
import { WormInMotion } from '@/features/games/components/WormInMotion';
import { WormTimeline } from '@/features/games/components/WormTimeline';
import { WormScoring } from '@/features/games/components/WormScoring';
import { WormRoadmap } from '@/features/games/components/WormRoadmap';
import { WormControls } from '@/features/games/components/WormControls';
import { WormCta } from '@/features/games/components/WormCta';

export const metadata: Metadata = {
  title: 'SAT WORM — Game Guide & Mechanics | SatsEarn',
  description: 'The complete guide to SAT WORM, the snake-style mini-game on SatsEarn. Learn the rules, game elements, hazard unlock order, difficulty curve, scoring, controls, and pro tips.',
  alternates: {
    canonical: 'https://satsearn.app/games/sat-worm',
  },
  openGraph: {
    title: 'SAT WORM — Game Guide & Mechanics | SatsEarn',
    description: 'Eat bolts, dodge bombs, avoid fake food. The complete SAT WORM player guide — mechanics, scoring, controls, and tips.',
    type: 'article',
    url: 'https://satsearn.app/games/sat-worm',
  }
};

export default function SatWormGuidePage() {
  return (
    <>
      <ScrollProgress />
      
      <main className="min-h-screen bg-sats-black-950 overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]">
        <WormHero />
        <WormObjective />
        <WormElements />
        <WormInMotion />
        <WormTimeline />
        <WormScoring />
        <WormRoadmap />
        <WormControls />
        <WormCta />
      </main>
    </>
  );
}
