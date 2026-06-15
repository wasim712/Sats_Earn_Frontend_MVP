'use client';

import React, { useState } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I withdraw to an on-chain Bitcoin address?',
      a: 'Not currently — withdrawals are Lightning-only. On-chain fees make small sat amounts impractical. Many Lightning wallets let you swap to on-chain Bitcoin afterward if you need to.'
    },
    {
      q: 'Do pending or maturing sats count toward my minimum?',
      a: 'No. Only matured, available sats count toward your tier\'s withdrawal minimum. You can watch each entry\'s countdown in your dashboard as it moves from maturing to available.'
    },
    {
      q: 'What happens if my withdrawal fails?',
      a: 'Your sats return to your available balance automatically — nothing is lost. Common causes are an invalid Lightning address or an expired invoice. Just double-check and try again.'
    },
    {
      q: 'How do I lower my withdrawal minimum?',
      a: (
        <>
          Upgrade to a paid tier. Minimums drop from 25,000 sats (free) down to 10,000 sats (Founders), and you earn more per task too — reaching payout far faster.{' '}
          <Link href="/#pricing" className="text-sats-orange-500 hover:text-sats-orange-400 font-bold ml-1">
            See paid tiers →
          </Link>
        </>
      )
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 relative px-4 max-w-3xl mx-auto">
      <FadeUp delay={0.1}>
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-sats-orange-500 opacity-80 flex items-center justify-center gap-3 mb-4">
          Withdrawal Questions
        </div>
        <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-10 text-white text-center">Good to Know</h2>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={`border rounded-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen 
                    ? 'bg-sats-black-900 border-sats-orange-500/40 shadow-[0_4px_20px_rgba(249,115,22,0.05)]' 
                    : 'bg-sats-black-900/40 border-white/[0.04] hover:bg-sats-black-900/80 hover:border-white/[0.1]'
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center py-4 px-5 sm:px-6 select-none group">
                  <h3 className={`text-[15px] sm:text-[17px] font-bold tracking-wide transition-colors duration-300 ${isOpen ? 'text-sats-orange-500' : 'text-white group-hover:text-sats-orange-400'}`}>
                    {faq.q}
                  </h3>
                  <div className={`shrink-0 ml-4 text-sats-orange-500 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>

                <div 
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeUp>
    </section>
  );
}
