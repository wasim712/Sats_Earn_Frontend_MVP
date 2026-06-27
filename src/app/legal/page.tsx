'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';

const policies = [
  {
    id: '01',
    title: 'Terms of Service',
    desc: 'Your rights and responsibilities when using SatsEarn to earn Bitcoin sats.',
    href: '/legal/terms',
  },
  {
    id: '02',
    title: 'Privacy Policy',
    desc: 'How we collect, use, and protect your data. GDPR-compliant practices.',
    href: '/legal/privacy',
  },
  {
    id: '03',
    title: 'Cookie Policy',
    desc: 'Which cookies we use and why. No third-party advertising trackers.',
    href: '/legal/cookie-policy',
  },
  {
    id: '04',
    title: 'Manage Cookies',
    desc: 'Control your cookie preferences on SatsEarn at any time.',
    href: '/legal/manage-cookies',
  },
  {
    id: '05',
    title: 'Refund Policy',
    desc: 'Refund eligibility for paid tier subscriptions and how to request one.',
    href: '/legal/refund-policy',
  },
  {
    id: '06',
    title: 'Sats Disclaimer',
    desc: 'Important information about Bitcoin volatility and earnings. Not financial advice.',
    href: '/legal/sats-disclaimer',
  },
  {
    id: '07',
    title: 'Rewards Policy',
    desc: 'How rewards are earned, verified, matured, and the rules around forfeiture.',
    href: '/legal/rewards-policy',
  },
  {
    id: '08',
    title: 'MiCA Policy',
    desc: 'Our good-faith compliance approach to EU crypto-asset regulation.',
    href: '/legal/mica-policy',
  },
  {
    id: '09',
    title: 'Regulatory Statement',
    desc: 'Our platform classification, jurisdiction, and regulatory position.',
    href: '/legal/regulatory-statement',
  },
  {
    id: '10',
    title: 'Community Guidelines',
    desc: 'Rules and expectations for participating in the SatsEarn community.',
    href: '/legal/community-guidelines',
  },
];

export default function LegalPage() {
  return (
    <main className="relative min-h-screen bg-sats-black-950 ">
      
      {/* Background Glows Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.08),transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.03),transparent_65%)]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.05),transparent_60%)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-24">
        
        {/* Breadcrumbs */}
        <div className="flex justify-start mb-8">
          <FadeUp delay={0.05}>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-gray-400 bg-sats-black-900/40 backdrop-blur-md border border-white/[0.04] rounded-lg px-4 py-2 w-fit">
              <Link href="/" className="text-gray-400 hover:text-sats-orange-500 transition-colors">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="text-sats-orange-500 font-bold">Legal</span>
            </div>
          </FadeUp>
        </div>

        {/* HERO */}
        <header className="text-center pb-12 sm:pb-16">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-5 py-2.5 mb-6 backdrop-blur-md">
              <span className="text-base leading-none">⚖️</span>
              Legal & Policies
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
              Transparency <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent">First</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              SatsEarn is committed to operating openly and honestly. All our policies are written in plain language so you understand exactly how the platform works, what we collect, and what your rights are.
            </p>
            <div className="font-mono text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span>Effective Date: <strong className="text-sats-orange-500 font-bold">March 1, 2026</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>Operated in India</span>
              <span className="hidden sm:inline">•</span>
              <span>Available Globally</span>
            </div>
          </FadeUp>
        </header>

        {/* POLICIES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {policies.map((policy, idx) => (
            <FadeUp key={policy.id} delay={0.1 + idx * 0.05}>
              <Link
                href={policy.href}
                className="group relative flex items-start gap-4 p-6 bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-300 hover:border-sats-orange-500/35 hover:bg-sats-black-900/80 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sats-orange-500 via-sats-orange-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="font-mono text-sm font-bold text-sats-orange-500 pt-1 shrink-0 w-7">
                  {policy.id}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-sats-orange-500 transition-colors">
                    {policy.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {policy.desc}
                  </p>
                </div>

                <div className="text-gray-600 group-hover:text-sats-orange-500 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            </FadeUp>
          ))}
        </section>

        {/* CONTACT SECTION */}
        <FadeUp delay={0.6}>
          <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-white/[0.05] rounded-3xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-black tracking-tight mb-2 text-white">Questions about our policies?</h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base">
              Our team responds to all legal and privacy enquiries within 5 business days.
            </p>
            <a
              href="mailto:support@satsearn.app"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-sm transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-0.5 shadow-[0_5px_15px_rgba(238,139,18,0.2)] hover:shadow-[0_8px_25px_rgba(238,139,18,0.35)] tracking-wider uppercase font-mono"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m2 7 10 6 10-6"></path>
              </svg>
              support@satsearn.app
            </a>
          </div>
        </FadeUp>

      </div>

      <FloatingSupportButton />
    </main>
  );
}
