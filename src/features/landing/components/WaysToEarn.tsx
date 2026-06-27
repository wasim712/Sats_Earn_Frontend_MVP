'use client';

import React from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Smartphone, Brain, Gamepad2, Flame, Users, ClipboardList, PlaySquare, Infinity as InfinityIcon } from 'lucide-react';

export const WaysToEarn = () => {
  const earningMethods = [
    {
      status: 'LIVE',
      statusColor: 'text-green-400 bg-green-500/10 border-green-500/20',
      icon: <Smartphone className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Social Tasks',
      description: 'Follow accounts on X, Instagram, Reddit and more. Verified by our review system before sats are credited.',
      reward: '10–100 sats per task'
    },
    {
      status: 'LIVE',
      statusColor: 'text-green-400 bg-green-500/10 border-green-500/20',
      icon: <Brain className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Bitcoin Quizzes',
      description: 'Answer questions about Bitcoin, Lightning Network, and crypto fundamentals. Learn and stack simultaneously.',
      reward: '10–50 sats per quiz'
    },
    {
      status: 'LIVE',
      statusColor: 'text-green-400 bg-green-500/10 border-green-500/20',
      icon: <Gamepad2 className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Mini Games',
      description: 'Browser games built for SatsEarn, with XP rewards for free users and exclusive games for paid members.',
      reward: 'XP reward per game'
    },
    {
      status: 'LIVE',
      statusColor: 'text-green-400 bg-green-500/10 border-green-500/20',
      icon: <Flame className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Daily Streaks',
      description: 'Stay active every day and unlock streak milestone bonuses. Consistency compounds your sat earnings.',
      reward: '70–3,650 sats'
    },
    {
      status: 'LIVE',
      statusColor: 'text-green-400 bg-green-500/10 border-green-500/20',
      icon: <Users className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Refer & Earn',
      description: 'Share your referral link. Earn a percentage of the base reward every time your referrals complete tasks.',
      reward: '5%–30% commission'
    },
    {
      status: 'SOON',
      statusColor: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
      icon: <ClipboardList className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Surveys',
      description: 'Share your opinions on products and services. Higher paying tasks with verified completion tracking.',
      reward: '100–1,000 sats'
    },
    {
      status: 'SOON',
      statusColor: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
      icon: <PlaySquare className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />,
      title: 'Watch & Earn',
      description: 'Watch educational and promotional video content. Earn sats for verified watch time.',
      reward: '5–50 sats per video'
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-sats-black-950" id="ways-to-earn">
      <div className="absolute inset-0 bg-sats-black-950 bg-grid-base opacity-30 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xs font-bold tracking-widest uppercase font-mono">
              Ways to Earn
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="text-sats-orange-500">Infinite</span> Ways to<br />
            Stack Sats
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every action on SatsEarn is a chance to earn real sats — and we&apos;re adding more all the time. Pick the earning methods that fit your time and interest.
          </p>
        </FadeUp>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {earningMethods.map((method, idx) => (
            <FadeUp 
              key={idx} 
              delay={0.1 + (idx * 0.05)} 
              className="relative group p-6 rounded-2xl bg-sats-black-900/60 backdrop-blur-sm border border-white/5 hover:border-sats-orange-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-sats-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${method.statusColor}`}>
                {method.status}
              </div>

              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                {method.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow">
                {method.description}
              </p>

              <div className="mt-auto inline-flex items-center gap-2 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-md px-3 py-1.5 self-start">
                <span className="text-sats-orange-500 text-xs font-bold font-mono tracking-tight">
                  {method.reward}
                </span>
              </div>
            </FadeUp>
          ))}

          {/* And Many More Card */}
          <FadeUp 
            delay={0.45} 
            className="relative group p-6 rounded-2xl bg-gradient-to-br from-sats-orange-500/20 to-sats-black-900 border border-sats-orange-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider text-sats-orange-400 bg-black border-gray-500/20`}>
                SOON
              </div>
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left">
              <InfinityIcon className="w-8 h-8 text-sats-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">And Many More</h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
              Offerwalls, app trials, partner campaigns, seasonal events and new mechanics — we&apos;re always adding fresh ways to stack sats.
            </p>

            <div className="mt-auto inline-flex items-center gap-2 bg-sats-orange-500/20 border border-sats-orange-500/30 rounded-md px-3 py-1.5 self-start">
              <span className="text-sats-orange-500 text-xs font-bold font-mono tracking-tight">
                Infinite ways to earn
              </span>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
};