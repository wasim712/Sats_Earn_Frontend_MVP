'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Share2, ClipboardList, Video, Smartphone, 
  Gift, GraduationCap, Users, Flame 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FadeUp } from '@/components/animations/FadeUp';

// --- DATA CONFIGURATION ---
const STEPS = [
  {
    num: '1',
    title: 'Sign Up Free',
    desc: 'Create your account in under 2 minutes. Connect your social accounts to unlock tasks.',
  },
  {
    num: '2',
    title: 'Complete Tasks',
    desc: 'Choose from hundreds of tasks. Follow accounts, watch videos, or play games.',
  },
  {
    num: '3',
    title: 'Withdraw Bitcoin',
    desc: "Reach 25,000 sats minimum and withdraw to your Bitcoin wallet. It's that simple!",
  },
];

const EARN_METHODS = [
  { icon: Share2, title: 'Social Tasks', desc: 'Follow, like, retweet on Twitter, Instagram, Facebook & more', reward: '10-100 sats' },
  { icon: ClipboardList, title: 'Surveys', desc: 'Share your opinion on products and services', reward: '100-1000 sats' },
  { icon: Video, title: 'Watch Videos', desc: 'Watch ads and educational content', reward: '5-50 sats' },
  { icon: Smartphone, title: 'App Installs', desc: 'Try new apps and games', reward: '200-2000 sats' },
  { icon: Gift, title: 'Offerwalls', desc: 'Complete special offers and trials', reward: '50-10,000 sats' },
  { icon: GraduationCap, title: 'Learn & Earn', desc: 'Complete Bitcoin education modules', reward: '50-200 sats' },
  { icon: Users, title: 'Refer & Earn', desc: 'Lifetime commission on referrals', reward: '10-30% forever' },
  { icon: Flame, title: 'Daily Streaks', desc: 'Bonus sats for consistency', reward: '50-10,000 sats' },
];

export const WaysToEarn = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full overflow-hidden" id="how-it-works">
      {/* =========================================
          SECTION 1: SIMPLE PROCESS (3 Steps)
          ========================================= */}
      {/* Tightened top padding to blend with the section above it */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20" >
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-75 h-75 bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <span className="text-sats-orange-500 text-xs font-bold tracking-wide uppercase">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Start Earning in <span className="bg-linear-to-r from-sats-orange-400 to-sats-orange-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
          </FadeUp>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 max-w-5xl mx-auto mb-16">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.num}>
                <FadeUp delay={index * 0.15} className="flex flex-col items-center text-center max-w-70">
                  
                  {/* Glowing Number Circle */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-sats-orange-500 to-sats-orange-600 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] z-10 relative">
                      {step.num}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-sats-orange-500/30 blur-xl z-0" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                </FadeUp>

                {/* Connecting Arrow (Hidden on Mobile) */}
                {index < STEPS.length - 1 && (
                  <FadeUp delay={index * 0.15 + 0.1} className="hidden md:block mb-12">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </FadeUp>
                )}
              </React.Fragment>
            ))}
          </div>

          <FadeUp delay={0.5} className="text-center">
            <Button size="lg" onClick={() => router.push('/signup')} className="gap-2 group shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              Get Started Now - It is Free!
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* Divider */}
      {/* <div className="my-2 md:my-4 h-px w-full max-w-7xl mx-auto bg-linear-to-r from-transparent via-sats-black-800 to-transparent" /> */}

      {/* =========================================
          SECTION 2: MULTIPLE WAYS TO EARN (Grid)
          ========================================= */}
      <section className="relative pt-8 pb-8 sm:pt-8 sm:pb-10" id="ways-to-earn">
        
        {/* Background Glow */}
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-sats-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <span className="text-sats-orange-500 text-xs font-bold tracking-wide uppercase">Earn Your Way</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Multiple Ways to Earn <span className="text-sats-orange-500">Bitcoin</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {EARN_METHODS.map((method, index) => {
              const Icon = method.icon;
              return (
                <FadeUp key={index} delay={index * 0.1}>
                  <Card 
                    // Sharp Black Theme restored here
                    className="h-full flex flex-col items-start text-left p-6! group transition-all duration-300 border-sats-black-700 bg-sats-black-900 hover:bg-sats-black-800 hover:-translate-y-1 hover:border-sats-orange-500/60 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.2)] cursor-default"
                  >
                    {/* Vibrant Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-sats-black-950 border border-sats-black-700 flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-sats-orange-500 group-hover:bg-sats-orange-500/10 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <Icon className="w-6 h-6 text-sats-orange-500/80 transition-colors duration-300 group-hover:text-sats-orange-500" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{method.title}</h3>
                    
                    <p className="text-sm text-gray-300 mb-6 grow font-medium leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {method.desc}
                    </p>
                    
                    {/* Reward Badge */}
                    <div className="mt-auto w-full inline-flex items-center justify-center px-3 py-2 bg-sats-black-950 rounded-lg border border-sats-black-700 group-hover:border-sats-orange-500/30 transition-all duration-300">
                      <span className="text-xs text-sats-orange-500 font-bold tracking-wider uppercase">
                        {method.reward}
                      </span>
                    </div>
                  </Card>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};