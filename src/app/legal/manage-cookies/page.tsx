'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function ManageCookiesPage() {
  const [prefCookies, setPrefCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);

  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <p className="mb-6 leading-relaxed">
            Use the controls below to manage which types of cookies SatsEarn may use on your device. Essential cookies cannot be disabled as they are required for the Platform to function.
          </p>

          <div className="bg-sats-black-900/60 border border-white/[0.04] rounded-xl p-5 mb-6 flex flex-col gap-4">
            
            {/* Essential Cookies */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
              <div>
                <div className="text-sm font-bold text-white mb-1">Essential Cookies</div>
                <div className="text-xs text-gray-400">Login sessions, security, fraud detection. Always active.</div>
              </div>
              <div className="bg-green-500 rounded-full px-3 py-1 text-[11px] font-bold text-black uppercase tracking-wide">
                Always On
              </div>
            </div>

            {/* Preference Cookies */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
              <div>
                <div className="text-sm font-bold text-white mb-1">Preference Cookies</div>
                <div className="text-xs text-gray-400">Remember your UI settings and preferences.</div>
              </div>
              <button 
                onClick={() => setPrefCookies(!prefCookies)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${prefCookies ? 'bg-sats-orange-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${prefCookies ? 'transform translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Analytics Cookies */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-white mb-1">Analytics Cookies</div>
                <div className="text-xs text-gray-400">Anonymised data to help us improve the platform.</div>
              </div>
              <button 
                onClick={() => setAnalyticsCookies(!analyticsCookies)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${analyticsCookies ? 'bg-sats-orange-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${analyticsCookies ? 'transform translate-x-5' : ''}`} />
              </button>
            </div>

          </div>

          <button 
            className="mt-4 px-6 py-2.5 bg-sats-orange-500 hover:bg-sats-orange-400 text-black border-none rounded-lg font-sans text-sm font-bold cursor-pointer transition-all duration-200"
          >
            Save Preferences
          </button>
          
          <p className="mt-3 text-xs text-gray-400">
            Preferences are stored locally and applied on your next visit. To withdraw consent entirely, contact us at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/cookie-policy" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Cookie Policy</div>
          </Link>
          <Link href="/legal/refund-policy" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Refund Policy</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
