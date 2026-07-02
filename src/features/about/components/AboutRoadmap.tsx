'use client';
import React, { useState } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';

const roadmapData = [
  {
    phase: "Phase 1",
    status: "Live",
    statusColor: "text-green-500 bg-green-500/10",
    date: "June – July 2026",
    title: "Beta Launch & Core Features",
    items: [
      { text: "Public beta launch", state: "done" },
      { text: "Social tasks live (X, Instagram, Reddit)", state: "done" },
      { text: "Bitcoin quizzes live", state: "done" },
      { text: "Mini-games (SAT-WORM) live", state: "done" },
      { text: "Streak milestone system live", state: "done" },
      { text: "Mobile PWA available", state: "done" },
      { text: "Paid tier subscriptions live", state: "done" },
      { text: "Lightning withdrawal system operational", state: "done" },
      { text: "Early Founders community building", state: "done" }
    ],
    defaultOpen: true
  },
  {
    phase: "Phase 2",
    status: "Coming Soon",
    statusColor: "text-sats-orange-500 bg-sats-orange-500/10",
    date: "August – October 2026",
    title: "Scaling & New Features",
    items: [
      { text: "Surveys launch", state: "coming" },
      { text: "Offerwalls launch", state: "coming" },
      { text: "Third-party SDK integrations (BitLabs, Lootably, etc.)", state: "coming" },
      { text: "Payment gateway integration", state: "coming" },
      { text: "Affiliate and brand partnerships", state: "coming" },
      { text: "International expansion and localisation", state: "coming" }
    ],
    defaultOpen: false
  },
  {
    phase: "Phase 3",
    status: "Planned",
    statusColor: "text-gray-400 bg-sats-black-700",
    date: "November – December 2026",
    title: "Optimisation & Growth",
    items: [
      { text: "Multi-language support", state: "future" },
      { text: "Regional payment methods", state: "future" },
      { text: "Advanced gamification (leaderboards, challenges, raffle rewards)", state: "future" },
      { text: "Community features (groups, forums)", state: "future" },
      { text: "User analytics dashboard", state: "future" }
    ],
    defaultOpen: false
  },
  {
    phase: "Phase 4",
    status: "Planned",
    statusColor: "text-gray-400 bg-sats-black-700",
    date: "2027+",
    title: "Long-term Vision",
    items: [
      { text: "Open API for brands and developers", state: "future" },
      { text: "Native desktop and mobile app expansion", state: "future" },
      { text: "Decentralised governance roadmap", state: "future" },
      { text: "Sustainable, profitable operations at scale", state: "future" }
    ],
    defaultOpen: false
  }
];

export const AboutRoadmap = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="roadmap" className="px-4 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <FadeUp className="text-center mb-12 sm:mb-16">
          <div className="inline-block text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">
            Transparent Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            Where We&apos;re <span className="text-sats-orange-500">Going</span>
          </h2>
          <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            We build in public. This is our honest roadmap — what&apos;s done, what&apos;s coming, and what We&apos;re planning long-term.
          </p>
        </FadeUp>

        <FadeUp>
          <div className="flex flex-col gap-4">
            {roadmapData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index}
                  className={`bg-sats-black-800 rounded-2xl overflow-hidden border transition-colors ${
                    isOpen ? 'border-sats-orange-500/30' : 'border-white/10'
                  }`}
                >
                  <div 
                    className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 p-5 sm:p-6 cursor-pointer flex-col sm:flex-row"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className='flex gap-3 items-center justify-between w-full self-start'>
                      
                      <span className='flex gap-3 sm:gap-4 items-center w-full  self-start'>
                        <span className="text-[12px] font-bold tracking-[0.15em] text-sats-orange-500 font-mono shrink-0">
                          {item.phase}
                        </span>
                        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md tracking-wide ${item.statusColor}`}>
                          {item.status === 'Live' && '● '}
                          {item.status}
                        </span>
                      
                        <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                          {item.date}
                        </span>
                      </span>
                        <span className={`text-xl sm:text-2xl text-sats-orange-500 transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                    </span>
                    <span className=' flex items-center gap-3 w-full justify-between sm:hidden'>
                    <span className="text-xs text-gray-400 font-mono sm:hidden">
                      {item.date}
                    </span>
                    </span>
                    <span className="text-[15px] sm:text-base font-bold text-white flex-1 min-w-full sm:min-w-[180px] order-4 sm:order-none mt-2 sm:mt-0">
                      {item.title}
                    </span>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
                    <div className="px-5 sm:px-6 pb-6 pt-0">
                      <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                        {item.items.map((li, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm sm:text-[15px] text-gray-300">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                              li.state === 'done' ? 'bg-green-500' : 
                              li.state === 'coming' ? 'bg-sats-orange-500' : 'bg-gray-600'
                            }`} />
                            {li.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
