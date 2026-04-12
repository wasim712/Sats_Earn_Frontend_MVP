'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeUp } from '@/components/animations/FadeUp';

// --- DATA CONFIGURATION ---
const FAQ_DATA = [
  {
    question: "What is SatsEarn?",
    answer: "SatsEarn is a free platform where you can earn Bitcoin (Sats) by completing simple tasks such as social tasks, watching videos, taking surveys, playing games, trying new apps, referring friends, and more."
  },
  {
    question: "Is SatsEarn really free?",
    answer: "Yes, SatsEarn is 100% free to use. We earn from brands, advertisers, and partners, and share that revenue with you. You’ll never be asked to deposit anything. Optional premium tiers (coming soon) will be available for users who want to earn higher rewards."
  },
  {
    question: "How do I get started?",
    answer: "Sign up with your email, choose a username and country, and start completing tasks. No KYC, no credit card, no signup fee, and no deposit required."
  },
  {
    question: "How much can I earn?",
    answer: "Earnings depend on task availability and your tier level. Active users typically earn between 50–1,000 Sats daily, with higher tiers unlocking better-paying tasks."
  },
  {
    question: "How can I withdraw my Sats?",
    answer: "You can withdraw your Sats to your Bitcoin wallet or Lightning wallet once you reach the minimum withdrawal threshold. Withdrawals are fast, low-fee, and may depend on maintaining a positive trust score."
  },
  {
    question: "What are the tier levels?",
    answer: `SatsEarn has two types of tiers:
  
🔹 Free Tiers:
- Basic
- Bronze
- Silver
- Gold

🔹 Premium Tiers (coming soon):
- Platinum
- Diamond
- Crown
- Elite
- Founder (highest level)

Each tier unlocks higher-paying tasks, better referral rates, and exclusive bonuses.`
  },
  {
    question: "How does the referral program work?",
    answer: "Share your unique referral link and earn bonus Sats when your friends join. You’ll earn a 5% base commission on the tasks your referrals complete. Paid/Premium tiers can unlock up to 30% commission rates. Build your referral network to unlock higher ranks and bigger rewards."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative pt-16 pb-16 sm:pt-20 sm:pb-24 overflow-hidden ">
      
      {/* Subtle Background Glow behind the FAQ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-sats-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <FadeUp className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-sats-orange-500/10 rounded-full mb-6 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <span className="text-sats-orange-500 text-xs font-bold tracking-wide uppercase">
              Got Questions?
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked <span className="text-sats-orange-500">Questions</span>
          </h2>
          <p className="text-base text-gray-400 font-medium">
            Everything you need to know about stacking sats with us.
          </p>
        </FadeUp>

        {/* FAQ Accordion List - Wrapped in a SINGLE FadeUp so they appear together */}
        <FadeUp delay={0.2}>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div 
                  key={index}
                  className={`border rounded-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen 
                      ? 'bg-sats-black-900 border-sats-orange-500/40 shadow-[0_4px_20px_rgba(249,115,22,0.05)]' 
                      : 'bg-sats-black-900/40 border-sats-black-800 hover:bg-sats-black-900/80 hover:border-sats-black-700'
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  {/* Question Header (Thinner padding: py-4 px-5) */}
                  <div className="flex justify-between items-center py-4 px-5 sm:px-6 select-none">
                    <h3 className={`text-base sm:text-lg font-semibold tracking-wide transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-200'}`}>
                      {faq.question}
                    </h3>
                    <div className="shrink-0 ml-4">
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                          isOpen ? 'rotate-180 text-sats-orange-500' : 'text-gray-500'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Smooth Expanding Answer */}
                  <div 
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* Answer Text (Distinct gray, slightly smaller font) */}
                      <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-gray-400 font-medium leading-relaxed">
                        {faq.answer}
                      </p>
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