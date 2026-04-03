'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeUp } from '@/components/animations/FadeUp';

// --- DATA CONFIGURATION ---
const FAQ_DATA = [
  {
    question: "How much can I earn?",
    answer: "Earnings vary based on task availability and your tier. Active users typically earn 1,000-10,000 sats daily. Higher tiers unlock better-paying tasks."
  },
  {
    question: "How do withdrawals work?",
    answer: "We support Lightning Network withdrawals. Simply paste your Lightning invoice and receive your sats instantly. No minimum amount, zero fees."
  },
  {
    question: "Is SatsEarn really free?",
    answer: "Yes! SatsEarn is 100% free to use. We earn revenue from our brand partners, not from users. You will never be asked to deposit or pay anything."
  },
  {
    question: "How does the referral program work?",
    answer: "Share your unique referral link. You earn 10% of your direct referrals' task earnings for life. Higher tiers unlock up to 30% commission rates."
  },
  {
    question: "What are the tier levels?",
    answer: "We have Bronze, Silver, Gold, Platinum, and Diamond tiers. Each tier unlocks higher-paying tasks, better referral rates, and exclusive bonuses."
  },
  {
    question: "How do I get started?",
    answer: "Sign up with your email, choose a username, and start completing tasks immediately. No KYC, no credit card, no minimum deposit required."
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