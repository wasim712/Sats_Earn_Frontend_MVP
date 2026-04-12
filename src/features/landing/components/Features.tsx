import React from 'react';
import { Zap, ListTodo, Trophy, Users, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { FadeUp } from '@/components/animations/FadeUp';

// Data perfectly mapped to your image
const FEATURES = [
  { 
    icon: Zap, 
    title: 'Instant Earnings', 
    desc: 'Complete tasks and see your sats balance update in real-time. No waiting weeks for payouts.' 
  },
  { 
    icon: ListTodo, 
    title: 'Multiple Ways to Earn', 
    desc: 'Surveys, social tasks, app installs, videos, offerwalls, learn-to-earn, and more options daily.' 
  },
  { 
    icon: Trophy, 
    title: 'Gamified Experience', 
    desc: 'Level up tiers, maintain streaks, climb leaderboards, and earn bonus sats for milestones.' 
  },
  { 
    icon: Users, 
    title: 'Referral Rewards', 
    desc: 'Earn 10-30% lifetime commission on every task your referrals complete. Forever.' 
  },
  { 
    icon: Shield, 
    title: 'Secure & Transparent', 
    desc: 'AI-powered verification, 15-day security hold, fraud protection, and transparent earnings.' 
  },
  { 
    icon: Zap, 
    title: 'Lightning Withdrawals', 
    desc: 'Withdraw earned sats instantly to any Lightning wallet. Zero fees, no minimum amount.' 
  },
];

export const Features = () => {
  return (
    // Tighter padding on mobile (py-16), expansive on desktop (sm:py-24)
    <section id="features" className="py-8 sm:py-10 relative overflow-hidden">
      
      {/* Subtle Background Glow behind the cards to match the image depth */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-150 h-75 sm:h-150 bg-sats-orange-500/5 rounded-full blur-[100px] sm:blur-[120px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <span className="text-sats-orange-500 text-xs sm:text-sm font-bold tracking-wider uppercase">
              Why SatsEarn?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
            The Easiest Way to <span className="text-sats-orange-500">Stack Sats</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            No complicated setups. No expensive mining rigs. Just complete tasks and earn <span className="text-sats-orange-500 font-bold">Bitcoin</span>.
          </p>
        </FadeUp>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeUp key={index} delay={index * 0.1}>
                {/* Premium Dark Theme Card with smooth hover lift and border glow */}
                <Card className="h-full flex flex-col text-left p-8! group transition-all duration-300 hover:-translate-y-1 hover:border-sats-orange-500/40 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.15)] cursor-default bg-sats-black-900 border-sats-black-800">
                  
                  {/* Icon Container: Solid Orange to match your image */}
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-sats-orange-400 to-sats-orange-600 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                    {feature.desc}
                  </p>
                  
                </Card>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};