import type { Metadata } from 'next';
import { getSiteUrl, SITE_NAME } from '@/lib/site';

import { AboutHero } from '@/features/about/components/AboutHero';
import { AboutMarquee } from '@/features/about/components/AboutMarquee';
import { AboutStats } from '@/features/about/components/AboutStats';
import { AboutStory } from '@/features/about/components/AboutStory';
import { AboutProblemSolution } from '@/features/about/components/AboutProblemSolution';
import { AboutWhyBitcoin } from '@/features/about/components/AboutWhyBitcoin';
import { AboutSides } from '@/features/about/components/AboutSides';
import { AboutEcosystem } from '@/features/about/components/AboutEcosystem';
import { AboutBitcoinLoop } from '@/features/about/components/AboutBitcoinLoop';
import { AboutValues } from '@/features/about/components/AboutValues';
import { AboutTeam } from '@/features/about/components/AboutTeam';
import { AboutRoadmap } from '@/features/about/components/AboutRoadmap';
import { AboutMission } from '@/features/about/components/AboutMission';
import { AboutCTA } from '@/features/about/components/AboutCTA';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn what SatsEarn is, who it is for, how users earn Bitcoin rewards, and how to reach support.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col overflow-x-clip bg-sats-black-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SatsEarn",
            "url": "https://satsearn.app",
            "logo": "https://satsearn.app/android-chrome-512x512.png",
            "sameAs": [
              "https://twitter.com/satsearn",
              "https://discord.gg/VX4cB2xTnZ"
            ]
          }),
        }}
      />
      <AboutHero />
      
      <AboutMarquee 
        words={["STACK SATS", "EARN BITCOIN", "NO BUYING"]} 
      />
      
      <AboutStats />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutStory />
      
      <AboutMarquee 
        words={["FOLLOW", "QUIZ", "PLAY", "REFER", "EARN"]} 
        reverse={true} 
      />
      
      <AboutProblemSolution />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutWhyBitcoin />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutSides />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutEcosystem />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutBitcoinLoop />

      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutValues />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutTeam />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutRoadmap />
      
      <div className="h-px bg-gradient-to-r from-transparent via-sats-orange-500/20 to-transparent w-full" />
      
      <AboutMission />
      
      <AboutMarquee 
        words={["STACK SATS", "EARN BITCOIN", "NO BUYING"]} 
      />
      
      <AboutCTA />
    </main>
  );
}
