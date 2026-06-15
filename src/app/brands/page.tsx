'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';

export default function BrandsPage() {
  return (
    <main className="relative min-h-screen bg-sats-black-950 bg-grid-base overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.08),transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.03),transparent_65%)]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(238,139,18,0.05),transparent_60%)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-24">
        
        {/* Breadcrumb */}
        <FadeUp delay={0.05}>
          <div className="flex justify-start mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-gray-500 bg-sats-black-900/40 backdrop-blur-md border border-white/[0.04] rounded-lg px-4 py-2 w-fit">
              <Link href="/" className="text-gray-400 hover:text-sats-orange-500 transition-colors">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="text-sats-orange-500 font-bold">For Brands</span>
            </div>
          </div>
        </FadeUp>

        {/* HERO */}
        <header className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.1em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-5 py-2 mb-6 backdrop-blur-md">
              For Brands & Advertisers
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
              Reach Bitcoin Users Who <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent">Actually Engage</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8">
              Put your app, game, or offer in front of a community that earns real Bitcoin for genuine activity. Fund campaigns in <b className="text-white">USD, USDT, or INR</b>, pay only for verified actions, and reach people who are already comfortable with the Lightning Network.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:border-sats-orange-500/30 transition-colors">
                <span className="text-sats-orange-500">⚡</span> <b className="text-white">Lightning</b>-native payouts
              </div>
              <div className="flex items-center gap-2 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:border-sats-orange-500/30 transition-colors">
                <span className="text-green-500">✅</span> <b className="text-white">Verified</b> human actions
              </div>
              <div className="flex items-center gap-2 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:border-sats-orange-500/30 transition-colors">
                <span>🌍</span> <b className="text-white">180+</b> countries
              </div>
              <div className="flex items-center gap-2 bg-sats-black-900/60 backdrop-blur-sm border border-white/[0.04] rounded-full px-4 py-2 text-sm font-medium text-gray-300 hover:border-sats-orange-500/30 transition-colors">
                <span className="text-sats-orange-500 font-bold">₿</span> Pay in <b className="text-white">Bitcoin</b>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-gray-300 leading-relaxed text-center">
              <b className="text-sats-orange-500">We&apos;re pre-launch.</b> SatsEarn is building its user base now, and we&apos;re opening conversations with early advertising partners. No inflated metrics, no fake numbers — just an honest pitch and the chance to get in early.{' '}
              <Link href="/contact?topic=partnership" className="text-sats-orange-500 font-bold hover:underline ml-1">Let&apos;s talk →</Link>
            </div>
          </FadeUp>
        </header>

        {/* WHO YOU'LL REACH */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">The Audience</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Who You&apos;ll Reach</h2>
              <p className="max-w-3xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
                SatsEarn users are engaged, real people who complete tasks to earn Bitcoin — and they&apos;re open to discovering all kinds of products, not just crypto. If your offer is legitimate and gives our users genuine value, you&apos;re welcome to advertise. We only draw the line at illegal and harmful content.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FadeUp delay={0.2}>
              <div className="bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20 rounded-2xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 font-bold text-lg text-white mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  Welcome to advertise
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> Apps, games & digital products
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> Surveys, sign-ups & free trials
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> E-commerce, brands & services
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> Bitcoin, Lightning & crypto products
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> Education, content & communities
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> Anything legitimate that gives users real value
                  </div>
                </div>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.3}>
              <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 font-bold text-lg text-white mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </div>
                  What we won&apos;t run
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-500 font-bold mt-0.5">✕</span> Anything illegal in our or your jurisdiction
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-500 font-bold mt-0.5">✕</span> Scams, fraud & &quot;get-rich-quick&quot; schemes
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-500 font-bold mt-0.5">✕</span> Misleading, deceptive, or unsafe offers
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-500 font-bold mt-0.5">✕</span> Malware, phishing & adult / harmful content
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
          
          <FadeUp delay={0.4}>
            <p className="max-w-4xl mx-auto text-center mt-8 text-sm text-gray-400 leading-relaxed">
              We <b className="text-white">manually review every campaign</b> before it runs. Our audience is global and Bitcoin-friendly, so crypto offers tend to resonate especially well — but any honest product that respects our users is welcome. If something isn&apos;t a fit, we&apos;ll tell you straight.
            </p>
          </FadeUp>
        </section>

        {/* HOW A CAMPAIGN WORKS */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">For Advertisers</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">How a Campaign Works</h2>
            </div>
          </FadeUp>

          <div className="max-w-4xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-sats-orange-500/50 via-sats-orange-500/20 to-transparent z-0 hidden sm:block"></div>

            <div className="flex flex-col gap-6 sm:gap-8">
              {[
                { num: '1', title: 'Tell us your goals', desc: 'Share your product, your target audience, and what a successful campaign looks like — installs, sign-ups, in-app actions, or survey completions. We\'ll shape the right approach together.' },
                { num: '2', title: 'Fund your campaign', desc: 'Fund your budget in USD, USDT, or INR — whichever suits where you\'re paying from. We\'re based in India and work with advertisers globally. Your budget goes straight into the reward pool for your offer.' },
                { num: '3', title: 'Your offer runs as a task', desc: 'Your campaign appears to SatsEarn users as a rewarded task. They discover your product and complete the action you define — an install, a trial, a sign-up, or a survey.' },
                { num: '4', title: 'Actions are verified', desc: 'Every completion passes through our verification system before it counts. Combined with our 15-day maturity window, this filters out bots and fake activity — so you pay for genuine engagement, not noise.' },
                { num: '5', title: 'Users earn real sats & you get results', desc: 'Verified users are paid in Bitcoin via Lightning. You receive performance data on the actions that completed — so you can see what worked and decide how to scale.' }
              ].map((step, idx) => (
                <FadeUp key={step.num} delay={0.1 + idx * 0.1}>
                  <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-8 items-start bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 hover:border-sats-orange-500/30 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/30 text-sats-orange-500 font-mono font-bold text-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sats-orange-500 group-hover:text-black transition-colors">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* WHY ADVERTISE WITH US */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">Why SatsEarn</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">Why Advertise With Us</h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></>, title: 'Bitcoin-Native Audience', desc: 'Our users already understand Bitcoin and Lightning. They\'re engaged, curious, and open to discovering new products — crypto and beyond.' },
              { icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></>, title: 'Pay for Verified Actions', desc: 'Performance-based by design. You fund rewards for specific actions — not impressions or clicks. Verification runs before anything counts.' },
              { icon: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/>, title: 'Real Anti-Fraud', desc: 'A verification step plus a 15-day maturity window gives us time to catch and reverse fraudulent activity before payouts — protecting your budget.' },
              { icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>, title: 'Instant Lightning Settlement', desc: 'Payments and rewards move over the Lightning Network — fast, low-fee, and borderless. No banks, no conversion, no long delays.' },
              { icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/></>, title: 'Global Reach', desc: 'Bitcoin is borderless, and so is SatsEarn — available across 180+ countries without local-currency friction or cross-border banking restrictions.' },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, title: 'Aligned Incentives', desc: 'Users earn real Bitcoin — not points or gift cards — so the people engaging with your product are genuinely motivated, not just chasing throwaways.' }
            ].map((feat, idx) => (
              <FadeUp key={idx} delay={0.1 + idx * 0.05}>
                <div className="bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 sm:p-8 h-full hover:border-sats-orange-500/30 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 text-sats-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(247,147,26,0)] group-hover:shadow-[0_0_15px_rgba(247,147,26,0.2)]">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {feat.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-sats-orange-500 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">The Difference</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">Traditional vs Bitcoin-Native</h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="max-w-4xl mx-auto overflow-x-auto border border-white/[0.08] rounded-2xl bg-sats-black-900/40 backdrop-blur-sm">
              <table className="w-full text-left min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.08]">
                    <th className="p-5 font-mono text-xs uppercase tracking-wider text-gray-500">Feature</th>
                    <th className="p-5 font-mono text-xs uppercase tracking-wider text-gray-500">Traditional Ads</th>
                    <th className="p-5 font-mono text-xs uppercase tracking-wider text-sats-orange-500">SatsEarn (Bitcoin-Native)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">How you pay</td>
                    <td className="p-5 text-sm text-gray-500">Fiat (cards / invoicing)</td>
                    <td className="p-5 text-sm text-white font-bold">USD, USDT, or INR</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">How users are rewarded</td>
                    <td className="p-5 text-sm text-gray-500">Points or gift cards</td>
                    <td className="p-5 text-sm text-white font-bold">Real Bitcoin via Lightning</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">Reward settlement speed</td>
                    <td className="p-5 text-sm text-gray-500">Delayed / batched</td>
                    <td className="p-5 text-sm text-white font-bold">Instant — Lightning Network</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">Audience</td>
                    <td className="p-5 text-sm text-gray-500">Broad, mixed intent</td>
                    <td className="p-5 text-sm text-white font-bold">Bitcoin-native, engaged</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">Global coverage</td>
                    <td className="p-5 text-sm text-gray-500">Limited by banking rails</td>
                    <td className="p-5 text-sm text-white font-bold">180+ countries</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm text-gray-300 font-medium">Fraud protection</td>
                    <td className="p-5 text-sm text-gray-500">Varies by network</td>
                    <td className="p-5 text-sm text-white font-bold">Verification + 15-day maturity</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4 italic max-w-2xl mx-auto leading-relaxed">
              Comparison reflects the SatsEarn model versus typical traditional ad networks. Exact fees and timing depend on your campaign and network conditions.
            </p>
          </FadeUp>
        </section>

        {/* ANTI-FRAUD HIGHLIGHT */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-sats-orange-500/10 to-transparent border border-sats-orange-500/20 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-sats-orange-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" className="text-sats-orange-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Your budget goes to real people</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  SatsEarn was built fraud-first. Every task completion is checked by our verification system, and <strong className="text-white">all rewards pass through a 15-day maturity window</strong> before they can be withdrawn — giving us time to detect and reverse bot activity, duplicate accounts, and fake completions. The same protections that keep the reward pool honest for users keep your spend honest too. We start with manual-first review and scale verification as the platform grows.
                </p>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
                <svg viewBox="0 0 24 24" width="300" height="300" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ON YOUR TERMS */}
        <section className="mb-24 sm:mb-32">
          <FadeUp delay={0.1}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold mb-3">On Your Terms</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">You Stay in Control</h2>
              <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
                No long contracts, no big upfront commitments. Run a small test, see how it lands, and scale only if it works for you.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: <path d="M12 1v22M5 5h14a3 3 0 0 1 0 6H5a3 3 0 0 0 0 6h14"/>, title: 'Start small', desc: 'Flexible budgets — test an offer before you scale. No minimum spend to begin a conversation.' },
              { icon: <><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>, title: 'Pause anytime', desc: 'Pause or resume your campaign whenever you need. Your budget is yours until it\'s spent.' },
              { icon: <path d="M18 20V10M12 20V4M6 20v-6"/>, title: 'Bring your own tracking', desc: 'Add your own UTM links and measure results in your analytics. We report delivery; you own conversions.' },
              { icon: <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v6M18 9v6"/></>, title: 'Flexible payment', desc: 'Pay in USD, USDT, or INR depending on where you\'re based — we bill advertisers worldwide.' }
            ].map((box, idx) => (
              <FadeUp key={idx} delay={0.1 + idx * 0.1}>
                <div className="bg-sats-black-900/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 text-center h-full hover:-translate-y-1 hover:border-sats-orange-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-sats-orange-500/10 text-sats-orange-500 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {box.icon}
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{box.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{box.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA */}
        <FadeUp delay={0.2}>
          <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-sats-orange-500/20 rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Become an Early Advertising Partner</h2>
            <p className="text-gray-300 mb-10 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;re talking with brands who want to reach Bitcoin-native users from day one. Tell us about your product and audience — we&apos;ll be straight with you about where we are and what we can offer.
            </p>
            <Link
              href="/contact?topic=partnership"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 shadow-[0_5px_15px_rgba(238,139,18,0.3)] hover:shadow-[0_12px_25px_rgba(238,139,18,0.45)]"
            >
              <svg viewBox="0 0 56 72" width="16" height="19" fill="#000" style={{ verticalAlign: '-2px', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg"><path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z"/></svg>
              Talk to Us
            </Link>
            <div className="mt-8 pt-6 border-t border-white/[0.06] text-xs text-gray-500 max-w-lg mx-auto">
              SatsEarn is pre-launch and building its audience. We make no guarantees about reach, ROAS, or specific results. All campaign terms are agreed directly with you.
            </div>
          </div>
        </FadeUp>

      </div>

      <FloatingSupportButton />
    </main>
  );
}
