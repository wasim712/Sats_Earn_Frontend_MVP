'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-gray-300">
              <strong className="text-white">Summary:</strong> We collect minimal data — only what&apos;s needed to run the Platform. We do not sell your data. You have the right to access, correct, and delete your data. We comply with GDPR for EU users and applicable Indian data protection regulations.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">1. Who We Are</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is a Bitcoin rewards platform operated in India. For any privacy-related enquiries, contact us at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">2. What Data We Collect</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Data Type</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">What We Collect</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Why</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Account Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Email address, username, password (hashed)</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Account creation and authentication</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Activity Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Tasks completed, XP earned, sats balance, streak data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Platform functionality and reward calculation</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Referral Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Referral codes, referred user IDs</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Referral commission tracking</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Payment Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Lightning wallet address (for withdrawals only)</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Processing withdrawals</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Technical Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">IP address, browser type, device info, session data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Security, fraud prevention, and analytics</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Cookie Data</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Session cookies, preference cookies</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Platform functionality and user experience</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-6 leading-relaxed">
            We do not collect government ID, passport, bank account details, or sensitive personal data. No KYC is required for standard platform use.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">3. How We Use Your Data</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>To operate and maintain your account and earning history.</li>
            <li>To verify task completions and calculate rewards.</li>
            <li>To process Lightning Network withdrawals.</li>
            <li>To detect and prevent fraud, bot activity, and abuse.</li>
            <li>To send transactional emails (account activity, withdrawal confirmations).</li>
            <li>To improve the Platform based on aggregated, anonymised usage data.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">4. Data Sharing</h3>
          <p className="mb-4 leading-relaxed">We do not sell your personal data to any third party. We may share data with:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Service providers:</strong> Hosting, analytics, and fraud prevention tools that process data on our behalf under strict confidentiality obligations.</li>
            <li><strong className="text-white">Legal authorities:</strong> Where required by applicable law or court order.</li>
            <li><strong className="text-white">Lightning Network:</strong> Your Lightning wallet address is used to process withdrawals. Blockchain transactions are public by nature.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">5. Your Rights (GDPR — EU Users)</h3>
          <p className="mb-4 leading-relaxed">If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have the following rights under GDPR:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate data.</li>
            <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;).</li>
            <li><strong className="text-white">Right to Restriction:</strong> Request that we limit processing of your data.</li>
            <li><strong className="text-white">Right to Portability:</strong> Receive your data in a structured, machine-readable format.</li>
            <li><strong className="text-white">Right to Object:</strong> Object to processing of your data for marketing purposes.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            To exercise any of these rights, email <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>. We will respond within 30 days.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">6. Data Retention</h3>
          <p className="mb-6 leading-relaxed">
            We retain account data for as long as your account is active. If you request account deletion, we will delete your personal data within 30 days, except where retention is required by law or for fraud prevention purposes. Earning records may be retained in anonymised form for platform integrity.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">7. Security</h3>
          <p className="mb-6 leading-relaxed">
            We implement industry-standard security measures including encrypted connections (HTTPS), hashed passwords, and access controls. No method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">8. International Transfers</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is operated from India. If you are accessing the Platform from the EU or other regions, your data may be transferred to and processed in India. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable regulations.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">9. Children&apos;s Privacy</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is not intended for users under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has created an account, contact us at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> immediately.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/terms" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Terms of Service</div>
          </Link>
          <Link href="/legal/cookie-policy" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Cookie Policy</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
