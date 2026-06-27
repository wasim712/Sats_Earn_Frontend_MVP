'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

const faqs = [
  {
    q: "Where is my referral link and how does attribution work?",
    a: "Every account gets one unique referral link in your dashboard. When someone opens it and creates an account, they're permanently attributed to you. Share the link and any signups through it are tracked to you automatically — nothing to set up."
  },
  {
    q: "How is my commission calculated?",
    a: "Commission is a percentage of the admin-set base reward for each task your referral completes — set by your tier, not theirs. Example at a 10-sat base reward: Platinum (10%) earns 1 sat per task; Founders (30%) earns 3 sats. You only earn when your referral is genuinely active, not just for signing up."
  },
  {
    q: "When is referral commission paid out?",
    a: "It follows the same flow as all earned sats: a 24-hour verification window (Pending), then a 15-day maturity lock (Maturing) with its own countdown, then it becomes Available to withdraw. Each entry matures independently, so commission unlocks on a rolling basis."
  },
  {
    q: "Is there a cap on referral earnings?",
    a: "Free tiers have cumulative lifetime caps (Basic 20 referrals / 2,000 sats, up to Gold 100 referrals / 10,000 sats). All paid tiers — Platinum through Founders — are uncapped: unlimited referrals, no earnings ceiling."
  },
  {
    q: "Do my referrals or my link expire?",
    a: "No. Your link doesn't expire and a referral stays attributed to you for as long as they use SatsEarn. On a paid tier you keep earning on their activity indefinitely; on a free tier, until you hit your lifetime cap."
  },
  {
    q: "Can I refer myself or family?",
    a: "You can refer genuine people — real friends and family with their own accounts and activity. Self-referral is not allowed: extra accounts for yourself, bots, or fake accounts are treated as abuse and result in forfeiture of affected balances and possible account action."
  }
];

export const ReferralFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <>
      {/* FOUNDERS ROTATION TIE-IN */}
      <section className="px-4 py-8 bg-sats-black-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-gradient-to-r from-sats-orange-500/15 to-transparent border border-sats-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 hover:border-sats-orange-500/50 transition-colors">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-sats-black-800 border border-sats-orange-500/30 flex items-center justify-center text-sats-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.2"/><path d="M22 19v-2a4 4 0 0 0-3-3.87"/><path d="M16 4.13A4 4 0 0 1 16 11.5"/></svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Founders get extra: the Rotation</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4 sm:mb-0">
                  Founders don't just earn the top 30% rate. New users who join SatsEarn without a referrer are shared out evenly across the founding cohort as <strong className="text-white">crew members</strong> — so Founders earn commission on people the platform brings in, not only those they invite themselves.
                </p>
              </div>

              <Link 
                href="/founders"
                className="shrink-0 bg-transparent border border-sats-orange-500/30 text-sats-orange-500 font-mono text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all hover:bg-sats-orange-500 hover:text-black hover:border-sats-orange-500"
              >
                See Founders Tier →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* REFERRAL FAQ */}
      <section id="faq" className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="mb-10 sm:mb-14 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-sats-black-800 border border-white/10 text-xs font-mono tracking-widest uppercase text-sats-orange-500 font-bold mb-4 shadow-sm">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              Common referral questions
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto">
              The things people ask most before sharing their link.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index}
                    className={`bg-sats-black-800 border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-sats-orange-500/30 shadow-[0_4px_20px_rgba(249,115,22,0.05)]' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    >
                      <span className={`text-[15px] sm:text-base font-bold transition-colors ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                        {faq.q}
                      </span>
                      <span className={`font-mono text-xl transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-45 text-sats-orange-500' : 'text-gray-400'}`}>
                        +
                      </span>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                    >
                      <div className="px-5 pb-5 text-sm sm:text-[15px] text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-10 text-sm text-gray-400">
              More questions? See the full <Link href="/faq" className="text-sats-orange-500 font-bold hover:underline">FAQ</Link>.
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:py-32 relative overflow-hidden text-center bg-sats-black-950">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(249,115,22,0.1),transparent_70%)] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
              Start building your network
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed mb-10">
              Grab your referral link and start earning sats from the people you bring to SatsEarn.
            </p>
            <Link 
              href="/signup" 
              className="inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-sats-orange-500 text-black font-extrabold text-base sm:text-lg transition-all hover:bg-sats-orange-400 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.3)] mb-6"
            >
              Get Your Referral Link
            </Link>
            <div className="text-[13px] text-gray-400 font-mono tracking-wide uppercase">
              Free to start · No purchase required · Earn real sats
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
};
