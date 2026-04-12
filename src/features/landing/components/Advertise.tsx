'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, Eye, BarChart3, TrendingUp, Megaphone, ArrowRight,
  AtSign, Smartphone, ClipboardList, Video, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FadeUp } from '@/components/animations/FadeUp';

// --- DATA CONFIGURATION ---
const BRAND_BENEFITS = [
  { icon: Target, title: 'Targeted Reach', desc: 'Access 12K+ verified crypto-enthusiast users across 168+ countries' },
  { icon: Eye, title: 'Verified Engagement', desc: 'AI-powered verification ensures real engagement, not bots' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track campaign performance with detailed dashboards and ROI metrics' },
  { icon: TrendingUp, title: 'Cost Effective', desc: 'Pay per verified action. No upfront costs, no wasted budget' },
];

const CAMPAIGN_TYPES = [
  { icon: AtSign, title: 'Social Media Campaigns', desc: 'Followers, likes, retweets, comments', color: 'bg-blue-600' },
  { icon: Smartphone, title: 'App Install Campaigns', desc: 'Drive real installs and signups', color: 'bg-green-600' },
  { icon: ClipboardList, title: 'Survey & Feedback', desc: 'Get real opinions from crypto users', color: 'bg-purple-600' },
  { icon: Video, title: 'Brand Awareness', desc: 'Video views, content engagement', color: 'bg-red-600' },
  { icon: GraduationCap, title: 'Education Campaigns', desc: 'Teach users about your product', color: 'bg-cyan-600' },
];

export const Advertise = () => {
  const router = useRouter();

  return (
    // Tightened pt-16 to blend smoothly with the section above
    <section id="brands" className="relative pt-16 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      
      {/* Subtle Background Glow behind the right-side card */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-100 sm:w-150 h-100 sm:h-150 bg-sats-orange-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* =========================================
              LEFT COLUMN: Copy & Benefits
              ========================================= */}
          <FadeUp className="text-left">
            <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <span className="text-sats-orange-500 text-xs font-bold tracking-wide uppercase">
                For Brands & Advertisers
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl  font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Grow Your Brand with <br className="hidden md:block" />
              <span className="text-sats-orange-500 text-nowrap">Real Users</span>
            </h2>
            
            <p className="text-base sm:text-lg text-gray-300 font-medium mb-12 leading-relaxed max-w-xl">
              Connect with highly engaged crypto users who are ready to interact with your brand. Pay only for verified actions.
            </p>

            {/* Benefits List */}
            <div className="space-y-8 mb-12">
              {BRAND_BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-full border border-sats-orange-500/30 bg-sats-orange-500/5 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-sats-orange-500 group-hover:bg-sats-orange-500/10 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <Icon className="w-5 h-5 text-sats-orange-500 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1.5 text-base sm:text-lg">{benefit.title}</h4>
                      <p className="text-gray-300 font-medium text-sm leading-relaxed max-w-md transition-colors duration-300 group-hover:text-gray-300">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <Button size="lg" onClick={() => router.push('/for-brands')} className="gap-2 group shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              <Megaphone className="w-5 h-5" />
              Advertise With Us
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </FadeUp>

          {/* =========================================
              RIGHT COLUMN: Campaign Types Card
              ========================================= */}
          <FadeUp delay={0.2} className="relative w-full">
            <Card className="p-6! sm:p-8! bg-sats-black-950 border border-sats-black-800 shadow-[0_0_50px_rgba(249,115,22,0.1)] rounded-3xl relative overflow-hidden">
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Campaign Types</h3>
              
              <div className="space-y-3">
                {CAMPAIGN_TYPES.map((campaign, index) => {
                  const Icon = campaign.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-4 rounded-xl border border-sats-black-800 bg-sats-black-900 hover:bg-sats-black-800 hover:border-sats-orange-500/40 transition-all duration-300 cursor-default group"
                    >
                      {/* Vibrant Colored Icon Container */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${campaign.color} transition-transform duration-300 group-hover:scale-105`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <div className="grow transition-transform duration-300 group-hover:translate-x-1">
                        <h4 className="font-bold text-white text-sm sm:text-base mb-0.5 tracking-wide">
                          {campaign.title}
                        </h4>
                        <p className="text-gray-300 text-xs sm:text-sm font-medium">
                          {campaign.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};