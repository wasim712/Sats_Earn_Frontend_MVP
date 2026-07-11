import React from 'react';
import { createPageMetadata } from '@/lib/seo';
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

export const metadata = createPageMetadata({
  title: 'SAT WORM — Game Guide',
  description: 'The complete guide to SAT WORM, the snake-style mini-game on SatsEarn. Learn the rules, mechanics, and tips.',
  path: '/games/sat-worm',
});

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
