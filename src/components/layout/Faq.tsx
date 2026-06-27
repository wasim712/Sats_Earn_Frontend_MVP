'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is SatsEarn?",
    answer: "SatsEarn is a Bitcoin rewards platform where you stack real sats by completing tasks, quizzes, social actions, maintaining streaks, and referring friends. No buying required — ever. Earned sats are paid out via the Lightning Network directly to your wallet."
  },
  {
    question: "Are the sats real Bitcoin?",
    answer: "Yes. SatsEarn pays real Bitcoin satoshis via the Lightning Network. There are no internal points, no conversion steps, and no synthetic tokens. What you earn is what you withdraw — actual sats to your Lightning wallet."
  },
  {
    question: "Why does it take 15 days to withdraw?",
    answer: "Every sat earned goes through a 15-day maturity period. This is our fraud and bot protection layer — it keeps the platform honest and ensures every reward paid out was genuinely earned. Tasks also go through a 24-hour verification window before entering the maturity period. Your earning status is always visible in your dashboard with a day-by-day countdown."
  },
  {
    question: "How much can I earn on a free tier?",
    answer: "Free tier earnings depend on task availability and your current tier level. Basic tier earns 5 sats per task, rising to 9 sats per task at Gold. There is no user-level earnings cap — task rewards are set by admin and apply equally. Free tier users also earn streak milestone bonuses (70, 210, and 600 sats) and referral commission on active referrals."
  },
  {
    question: "Do I have to upgrade to a paid tier?",
    answer: "Never. Free tier is genuinely viable forever — you can complete tasks, earn real sats, maintain streaks, and refer friends without ever paying. Paid tiers are an optional amplifier: higher task rewards, lower withdrawal minimums, exclusive games, higher referral rates, and more. We will never force an upgrade or gate core earning behind a paywall."
  },
  {
    question: "Can I pay for a subscription with my earned sats?",
    answer: "Yes. Any paid tier subscription can be purchased using sats from your available balance. This means dedicated stackers can effectively upgrade for free using earnings from the platform itself."
  },
  {
    question: "What happens to my XP if my paid subscription ends?",
    answer: "Your XP is always preserved. If a paid subscription lapses, you fall back to whichever free tier matches your current XP total — not necessarily Basic. Your earned sats, streak progress, and referral history are all retained."
  },
  {
    question: "What is the Founders tier?",
    answer: "Founders is the highest tier on SatsEarn, limited to 1,000 users. It's a yearly-only subscription with the highest task rewards (30 sats), highest referral rate (30%), and the lowest withdrawal minimum (10,000 sats). Founders also participate in a referral rotation — when new users join without a referral code, they are automatically assigned to a Founder who earns commission on them for life."
  },
  {
    question: "How do I withdraw my sats?",
    answer: "Once your sats have matured (15 days) and your available balance meets your tier's withdrawal minimum, you can withdraw to any Lightning wallet directly from your dashboard. Fees are shown transparently at the time of withdrawal. No KYC required for standard withdrawals."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-transparent" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 backdrop-blur-sm">
            <span className="text-sats-orange-500 text-xl font-bold tracking-widest uppercase font-mono">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Common <span className="text-sats-orange-500">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'bg-sats-black-950 border-sats-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                  : 'bg-sats-black-950 border-white/[0.05] hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-sats-orange-500"
              >
                <span className={`text-base sm:text-lg font-medium transition-colors ${
                  openIndex === index ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'text-sats-orange-500 rotate-180' : 'text-gray-400'
                  }`} 
                />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-gray-400 leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};