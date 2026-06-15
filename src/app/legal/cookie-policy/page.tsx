'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function CookiePolicyPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-gray-300">
              <strong className="text-white">Summary:</strong> We use cookies to keep you logged in, remember your preferences, and detect fraud. We do not use third-party advertising cookies. You can manage your cookie preferences at any time.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">What Are Cookies</h3>
          <p className="mb-6 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They allow the website to remember information about your visit and are widely used to make websites work more efficiently.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Cookies We Use</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Cookie Type</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Purpose</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Duration</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Required</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Session Cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Keep you logged in during your session</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Session end</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Authentication Cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Remember your login state between visits</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">30 days</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Security Cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">CSRF protection, fraud detection signals</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Session</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Preference Cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Remember your UI preferences (theme, language)</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">1 year</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">No</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Analytics Cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Understand how users navigate the platform (anonymised)</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">90 days</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">No</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">What We Don&apos;t Use</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>We do not use third-party advertising or tracking cookies.</li>
            <li>We do not use cookies to build advertising profiles.</li>
            <li>We do not share cookie data with ad networks.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Note: Free tier users may see ads on the Platform. These ads are served via third-party networks which may set their own cookies. Paid tier users do not see banner or forced ads.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Managing Cookies</h3>
          <p className="mb-6 leading-relaxed">
            You can manage your cookie preferences using our cookie consent tool below. You can also manage cookies through your browser settings. Note that disabling essential cookies may prevent the Platform from functioning correctly.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/privacy" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Privacy Policy</div>
          </Link>
          <Link href="/legal/manage-cookies" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Manage Cookies</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
