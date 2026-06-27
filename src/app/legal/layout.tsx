'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';

const policies = [
  { id: '01', title: 'Terms of Service', href: '/legal/terms' },
  { id: '02', title: 'Privacy Policy', href: '/legal/privacy' },
  { id: '03', title: 'Cookie Policy', href: '/legal/cookie-policy' },
  { id: '04', title: 'Manage Cookies', href: '/legal/manage-cookies' },
  { id: '05', title: 'Refund Policy', href: '/legal/refund-policy' },
  { id: '06', title: 'Sats Disclaimer', href: '/legal/sats-disclaimer' },
  { id: '07', title: 'Rewards Policy', href: '/legal/rewards-policy' },
  { id: '08', title: 'MiCA Policy', href: '/legal/mica-policy' },
  { id: '09', title: 'Regulatory Statement', href: '/legal/regulatory-statement' },
  { id: '10', title: 'Community Guidelines', href: '/legal/community-guidelines' },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The main hub page has its own full-page layout
  if (pathname === '/legal') {
    return <>{children}</>;
  }

  // Find the active policy for the hero
  const activePolicy = policies.find(p => p.href === pathname);

  // Sub-pages share this layout with the sticky sidebar
  return (
    <div className="relative min-h-screen bg-sats-black-950 ">
      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[radial-gradient(circle,rgba(238,139,18,0.08),transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.03),transparent_65%)]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,139,18,0.05),transparent_60%)]"></div>
      </div>

      {/* Breadcrumbs */}
      {activePolicy && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-400 bg-sats-black-900/40 backdrop-blur-md border border-white/[0.04] rounded-lg px-4 py-2 w-fit">
            <Link href="/" className="text-gray-400 hover:text-sats-orange-500 transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link href="/legal" className="text-gray-400 hover:text-sats-orange-500 transition-colors">Legal</Link>
            <span className="text-gray-600">/</span>
            <span className="text-sats-orange-500 font-bold">{activePolicy.title}</span>
          </div>
        </div>
      )}

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 ${activePolicy ? 'pt-6' : 'pt-24'} pb-8 border-b border-sats-orange-500/20`}>
        {activePolicy && (
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.1em] uppercase text-sats-orange-500 bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-sm leading-none">⚖️</span>
              Policy {activePolicy.id} of 10
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4 text-white">
              {activePolicy.title}
            </h1>
            <div className="font-mono text-xs text-gray-400 flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
              <span>Effective Date: <strong className="text-sats-orange-500">March 1, 2026</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>Contact: <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a></span>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:border-r lg:border-sats-orange-500/10 lg:pr-8">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">
            All Policies
          </div>
          <nav className="flex flex-col gap-1.5">
            {policies.map((policy) => {
              const isActive = pathname === policy.href;
              return (
                <Link
                  key={policy.id}
                  href={policy.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm border ${
                    isActive
                      ? 'bg-sats-orange-500/10 border-sats-orange-500/30 text-sats-orange-500 shadow-[0_0_15px_rgba(238,139,18,0.05)]'
                      : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <span className={`font-mono text-xs ${isActive ? 'text-sats-orange-500' : 'text-gray-400'}`}>
                    {policy.id}
                  </span>
                  <span>{policy.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-5 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl group hover:border-sats-orange-500/40 transition-all duration-300">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <span className="text-sats-orange-500">📧</span> Legal Contact
            </div>
            <a href="mailto:support@satsearn.app" className="inline-flex items-center gap-2 text-sats-orange-500 text-sm hover:text-white font-medium break-all transition-colors">
              support@satsearn.app
            </a>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 w-full">
          {children}
        </main>
      </div>

      <FloatingSupportButton />
    </div>
  );
}
