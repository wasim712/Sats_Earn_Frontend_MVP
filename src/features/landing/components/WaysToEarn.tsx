'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Share2, ClipboardList, Video, Smartphone, 
  Gift, GraduationCap, Users, Flame, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24">
        
        {/* Background Glow */}
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-72 bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" /> */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 shadow-[0_0_20px_rgba(238,139,18,0.15)] border border-sats-orange-500/20">
              <span className="text-sats-orange-500 text-xs font-black tracking-widest uppercase">Simple Process</span>
            </div>
            
            {/* Responsive Heading with Line Break */}
            <h2 className="text-[32px] sm:text-5xl font-black text-white mb-4 tracking-tight leading-[1.15]">
              Start Earning in <br className="block sm:hidden" />
              <span className="bg-linear-to-r from-sats-orange-400 to-sats-orange-600 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
          </FadeUp>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-4 max-w-5xl mx-auto mb-16 sm:mb-20">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.num}>
                <FadeUp delay={index * 0.15} className="flex flex-col items-center text-center max-w-[280px]">
                  
                  {/* Glowing Number Circle with Verified Tick */}
                  <div className="relative mb-8">
                    {/* The Number */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-sats-orange-400 to-sats-orange-600 flex items-center justify-center text-2xl sm:text-3xl font-black text-black  z-10 relative">
                      {step.num}
                    </div>
                    {/* The Checkmark Badge */}
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 border-[3px] border-[#020202] rounded-full flex items-center justify-center z-20 shadow-lg">
                      <Check className="w-4 h-4 text-black stroke-[4]" />
                    </div>
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 rounded-full bg-sats-orange-500/40 blur-2xl z-0" />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                </FadeUp>

                {/* Connecting Arrow (Hidden on Mobile) */}
                {index < STEPS.length - 1 && (
                  <FadeUp delay={index * 0.15 + 0.1} className="hidden md:block mb-12 px-4">
                    <ArrowRight className="w-8 h-8 text-sats-orange-500/50" />
                  </FadeUp>
                )}
              </React.Fragment>
            ))}
          </div>

          <FadeUp delay={0.5} className="text-center flex justify-center">
            <Button size="lg" onClick={() => router.push('/signup')} className="gap-2 group shadow-[0_10px_30px_rgba(238,139,18,0.25)] w-full sm:w-auto py-4 px-8 rounded-2xl">
              Get Started Now - It&apos;s Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* =========================================
          SECTION 2: MULTIPLE WAYS TO EARN (Grid)
          ========================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24" id="ways-to-earn">
        
        {/* Background Glow */}
        <div className="absolute bottom-0 right-0 w-full max-w-3xl h-96 bg-sats-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(238,139,18,0.1)]">
              <span className="text-sats-orange-500 text-xs font-black tracking-widest uppercase">Earn Your Way</span>
            </div>
            <h2 className="text-[32px] sm:text-5xl font-black text-white mb-4 tracking-tight leading-[1.15]">
              Multiple Ways to Earn <span className="text-sats-orange-500">Bitcoin</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {EARN_METHODS.map((method, index) => {
              const Icon = method.icon;
              return (
                <FadeUp key={index} delay={index * 0.1} className="h-full">
                  {/* WRAPPER: Holds both the background glow and the foreground card */}
                  <div className="relative h-full group">
                    
                    {/* BACKLIT HALO GLOW (Mobile Only - Behind the card) */}
                    <div className="absolute inset-3 bg-sats-orange-500/30 rounded-[24px] blur-[30px] animate-pulse block sm:hidden -z-10" />

                    {/* FOREGROUND CARD */}
                    <div className="relative h-full p-6 sm:p-8 rounded-[24px] overflow-hidden transition-all duration-500 border border-[#1a1a1a] bg-black hover:border-sats-orange-500/40 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(238,139,18,0.2)] flex flex-col cursor-default z-10">
                      
                      <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-[#1a1a1a] flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-sats-orange-500/50 group-hover:bg-sats-orange-500/10 group-hover:shadow-[0_0_20px_rgba(238,139,18,0.2)] shrink-0">
                        <Icon className="w-7 h-7 text-sats-orange-500/80 transition-colors duration-500 group-hover:text-sats-orange-500" />
                      </div>
                      
                      <h3 className="text-xl font-black text-white mb-2 tracking-tight shrink-0">{method.title}</h3>
                      
                      <p className="text-sm text-gray-400 mb-8 flex-grow font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {method.desc}
                      </p>
                      
                      <div className="mt-auto shrink-0 w-full inline-flex items-center justify-center px-4 py-3 bg-[#050505] rounded-xl border border-[#1a1a1a] group-hover:border-sats-orange-500/30 transition-all duration-500">
                        <span className="text-xs sm:text-[13px] text-sats-orange-500 font-bold tracking-widest uppercase">
                          {method.reward}
                        </span>
                      </div>
                    </div>

                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};