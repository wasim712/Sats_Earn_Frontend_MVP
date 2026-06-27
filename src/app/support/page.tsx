import React from 'react';
import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';
import { SupportFab } from '@/components/ui/SupportFab';
import { FadeUp } from '@/components/animations/FadeUp';

export const metadata: Metadata = {
  title: 'Support & Contact | SatsEarn',
  description: 'Reach our support team for billing, privacy, or partnership inquiries.',
  alternates: {
    canonical: getSiteUrl('/support'),
  },
};

export default function SupportPage() {
  return (
    <main className="relative min-h-screen bg-sats-black-950 overflow-hidden bg-grid-base">
      
      {/* Interactive sticky contact FAB */}
      <SupportFab />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.1),transparent_60%)] pointer-events-none -z-10"></div>
        <div className="absolute top-[30%] left-[-15%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[radial-gradient(circle,rgba(238,139,18,0.03),transparent_65%)] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.06),transparent_60%)] pointer-events-none -z-10"></div>

        {/* HERO */}
        <header className="text-center pb-16 sm:pb-24">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-5 py-2.5 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-sats-orange-500 animate-pulse"></span>
              Support & Contact
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
              We&apos;re here to <span className="bg-gradient-to-r from-sats-orange-400 via-sats-orange-500 to-sats-orange-600 bg-clip-text text-transparent">help</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
              Got a question about earning, withdrawals, your account, or anything else? Pick the channel that fits, or just email us — a real person will get back to you.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <a href="mailto:support@satsearn.app" className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-sm sm:text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(238,139,18,0.4)] shadow-[0_8px_32px_rgba(238,139,18,0.25)] tracking-wider uppercase font-mono">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
              support@satsearn.app
            </a>
          </FadeUp>
        </header>

        {/* CHANNELS */}
        <section className="py-12 sm:py-16">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-sats-orange-500/50"></div>
              <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold">Specialized Channels</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Reach the right team</h2>
            <p className="text-gray-400 max-w-2xl mb-10 text-base sm:text-lg">
              All of these reach us at the same inbox — just tell us which topic in your message and it&apos;ll be routed to the right place.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Billing & Subscriptions",
                desc: "Questions about paid-tier billing, subscription changes, payment issues, or renewals. Our refund policy is that all sales are final — see the Refund Policy for the full details.",
                icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
                email: "support@satsearn.app?subject=Billing%20%26%20Subscriptions",
                delay: 0.1
              },
              {
                title: "Privacy & Data",
                desc: "Data-access or deletion requests, privacy concerns, or questions about how your information is handled. We'll walk you through it and action verified requests.",
                icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/></svg>,
                email: "support@satsearn.app?subject=Privacy%20%26%20Data",
                delay: 0.2
              },
              {
                title: "Partnerships & Business",
                desc: "Partnerships, the creator/affiliate programme, B2B opportunities, or media inquiries. Tell us a bit about what you have in mind and we'll take it from there.",
                icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M3 21a7 7 0 0 1 14 0"/><path d="m19 8 2 2 3-3"/></svg>,
                email: "support@satsearn.app?subject=Partnership%20Inquiry",
                delay: 0.3
              }
            ].map((ch, i) => (
              <FadeUp key={i} delay={ch.delay} className="group relative flex flex-col bg-sats-black-900/60 backdrop-blur-md border border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden hover:border-sats-orange-500/30 hover:bg-sats-black-900 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center mb-6 text-sats-orange-500 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(238,139,18,0.2)] transition-all duration-300">
                  {ch.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{ch.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-1">{ch.desc}</p>
                <a href={`mailto:${ch.email}`} className="self-start inline-flex items-center gap-2.5 font-mono text-[12px] tracking-wider font-extrabold text-sats-orange-500 bg-sats-orange-500/5 border border-sats-orange-500/20 rounded-xl px-4 py-2.5 transition-all duration-300 hover:bg-sats-orange-500 hover:text-black hover:border-sats-orange-500 hover:shadow-[0_0_15px_rgba(238,139,18,0.3)] hover:-translate-y-0.5 uppercase">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                  support@satsearn.app
                </a>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* SLA */}
        <section className="py-16 sm:py-20">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-sats-orange-500/50"></div>
              <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold">Response Times</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">What you can expect</h2>
            <p className="text-gray-400 max-w-2xl mb-8 text-base sm:text-lg">
              We aim to be fast and genuinely helpful. These are our target response windows by request type.
            </p>
            <div className="inline-flex font-mono text-[12px] tracking-[0.15em] uppercase text-gray-400 border border-dashed border-gray-600 rounded-md px-3 py-1.5 mb-8">
              Indicative targets · early-stage
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-sats-black-900/60 backdrop-blur-md border border-white/[0.04] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] max-w-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-sats-orange-500/5 to-transparent pointer-events-none"></div>
              <div className="grid grid-cols-[1fr_auto] gap-4 p-5 md:px-8 items-center border-b border-white/[0.04] bg-white/[0.01]">
                <span className="font-mono text-xs tracking-[0.15em] font-bold uppercase text-sats-orange-500">Request type</span>
                <span className="font-mono text-xs tracking-[0.15em] font-bold uppercase text-sats-orange-500">Target response</span>
              </div>
              {[
                { label: "General support inquiries", time: "24–48 hours", dotColor: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" },
                { label: "Billing & payment issues", time: "12–24 hours", dotColor: "bg-sats-orange-500 shadow-[0_0_10px_rgba(238,139,18,0.5)]" },
                { label: "Critical security reports", time: "Within 4 hours", dotColor: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" },
                { label: "Accessibility issues", time: "24 hours", dotColor: "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" },
                { label: "Paid-tier priority support", time: "12 hours", dotColor: "bg-sats-orange-500 shadow-[0_0_10px_rgba(238,139,18,0.5)]" },
              ].map((sla, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-4 p-5 md:px-8 items-center border-b border-white/[0.04] last:border-b-0 hover:bg-sats-orange-500/[0.02] transition-colors relative z-10">
                  <span className="text-sm sm:text-base font-medium text-white flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sla.dotColor}`}></span>
                    {sla.label}
                  </span>
                  <span className="font-mono font-bold text-sm sm:text-base text-sats-orange-500 whitespace-nowrap text-right">
                    {sla.time}
                  </span>
                </div>
              ))}
              <div className="text-[13px] text-gray-400 p-5 md:px-8 bg-sats-black-950/80 border-t border-white/[0.04] leading-relaxed relative z-10">
                Targets apply on business days (Monday–Friday). Critical security reports are monitored around the clock. These are goals we&apos;re working toward as we grow — not contractual guarantees.
              </div>
            </div>
          </FadeUp>
        </section>

        {/* COMMUNITY */}
        <section className="py-16 sm:py-20 relative">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-sats-orange-500/50"></div>
              <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-sats-orange-500 font-bold">Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Join the conversation</h2>
            <p className="text-gray-400 max-w-2xl mb-10 text-base sm:text-lg">
              Connect with other SatsEarn users, share tips, ask questions, and stay up to date on platform news.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "X / Twitter",
                sub: "News & announcements",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                href: "https://twitter.com/satsearn",
                hoverIconColor: "group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
                hoverCardStyle: "hover:border-white/30 hover:bg-white/[0.02] hover:shadow-[0_15px_30px_rgba(255,255,255,0.06)]",
                delay: 0.1
              },
              {
                name: "Telegram",
                sub: "Live community chat",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
                href: "https://t.me/satsearnapp",
                hoverIconColor: "group-hover:text-[#24A1DE] group-hover:drop-shadow-[0_0_8px_rgba(36,161,222,0.4)]",
                hoverCardStyle: "hover:border-[#24A1DE]/40 hover:bg-[#24A1DE]/5 hover:shadow-[0_15px_30px_rgba(36,161,222,0.12)]",
                delay: 0.2
              },
              {
                name: "Discord",
                sub: "Get help & hang out",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
                href:"https://discord.gg/VX4cB2xTnZ",
                hoverIconColor: "group-hover:text-[#5865F2] group-hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.4)]",
                hoverCardStyle: "hover:border-[#5865F2]/40 hover:bg-[#5865F2]/5 hover:shadow-[0_15px_30px_rgba(88,101,242,0.12)]",
                delay: 0.3
              },
              {
                name: "LinkedIn",
                sub: "Professional network",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                href: "https://www.linkedin.com/company/satsearn",
                hoverIconColor: "group-hover:text-[#0A66C2] group-hover:drop-shadow-[0_0_8px_rgba(10,102,194,0.4)]",
                hoverCardStyle: "hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 hover:shadow-[0_15px_30px_rgba(10,102,194,0.12)]",
                delay: 0.4
              },
              {
                name: "YouTube",
                sub: "Video guides & updates",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                href: "https://www.youtube.com/@satsearnapp",
                hoverIconColor: "group-hover:text-[#FF0000] group-hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]",
                hoverCardStyle: "hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10 hover:shadow-[0_15px_30px_rgba(255,0,0,0.25)]",
                delay: 0.5
              },
              {
                name: "Instagram",
                sub: "Behind the scenes & news",
                icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
                href: "https://www.instagram.com/satsearn.app/",
                hoverIconColor: "group-hover:text-[#E4405F] group-hover:drop-shadow-[0_0_12px_rgba(228,64,95,0.8)]",
                hoverCardStyle: "hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10 hover:shadow-[0_15px_30px_rgba(228,64,95,0.25)]",
                delay: 0.6
              }
            ].map((comm, i) => (
              <FadeUp key={i} delay={comm.delay} className={i === 4 ? "md:col-start-2" : ""}>
                <a href={comm.href} className={`group flex flex-col items-center gap-3 bg-sats-black-900 border border-white/[0.04] rounded-2xl p-6 sm:p-8 no-underline transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${comm.hoverCardStyle}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className={`text-gray-400 transition-all duration-300 ${comm.hoverIconColor} group-hover:scale-110 transform`}>
                    {comm.icon}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-sm font-bold tracking-[0.5px] text-white mt-1 transition-colors">{comm.name}</span>
                    <span className="text-xs text-gray-400 text-center mt-1 group-hover:text-gray-300 transition-colors">{comm.sub}</span>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="py-12 sm:py-16">
          <FadeUp delay={0.2}>
            <div className="relative overflow-hidden bg-gradient-to-br from-sats-black-900 via-sats-black-900 to-sats-orange-500/10 border border-white/[0.05] rounded-3xl p-10 md:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Subtle accent line on top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sats-orange-500/30 to-transparent"></div>
              
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">Can&apos;t find what you need?</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">
                Email us directly and we&apos;ll get back to you. Include your account email and a clear description so we can help fast.
              </p>
              <a href="mailto:support@satsearn.app" className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-sats-orange-500 to-sats-orange-600 text-black font-extrabold text-sm sm:text-base transition-all duration-300 hover:from-sats-orange-400 hover:to-sats-orange-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(238,139,18,0.45)] shadow-[0_8px_30px_rgba(238,139,18,0.25)] tracking-wider uppercase font-mono mb-8">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                support@satsearn.app
              </a>
              <div className="text-sm font-bold flex items-center justify-center gap-3">
                <span className="text-sats-orange-500 animate-pulse">
                  <svg viewBox="0 0 56 72" width="16" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z"/></svg>
                </span>
                <span className="text-gray-400">We&apos;re here to help you stack sats.</span>
              </div>
            </div>
          </FadeUp>
        </section>

      </div>
    </main>
  );
}
