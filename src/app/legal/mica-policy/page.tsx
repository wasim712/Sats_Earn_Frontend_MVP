import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'MiCA Policy',
  description: 'Our good-faith compliance approach to EU crypto-asset regulation.',
  path: '/legal/mica-policy',
});


import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function MiCAPolicyPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-gray-300">
              <strong className="text-white">Note:</strong> SatsEarn is operated in India. MiCA (Markets in Crypto-Assets Regulation) is an EU regulatory framework. This statement outlines our good-faith approach to MiCA principles for EU-based users of the Platform.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">What is MiCA</h3>
          <p className="mb-6 leading-relaxed">
            MiCA is the European Union&apos;s regulatory framework for crypto-asset markets, effective from December 2024. It establishes rules for the issuance, trading, and provision of services related to crypto-assets within the EU.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">SatsEarn&apos;s Position</h3>
          <p className="mb-4 leading-relaxed">
            SatsEarn is a rewards platform, not a crypto-asset issuer, exchange, or financial services provider. We do not:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Issue, create, or mint any crypto-asset or token.</li>
            <li>Operate as a cryptocurrency exchange or trading platform.</li>
            <li>Offer investment products or financial returns.</li>
            <li>Provide custodial services for Bitcoin beyond the maturity period for earned rewards.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Sats earned on SatsEarn are Bitcoin (BTC) satoshis — a decentralised, public blockchain asset not issued by SatsEarn. We facilitate earning and withdrawal of sats through task completion. We do not control, issue, or back Bitcoin in any way.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Our Commitment to EU Users</h3>
          <p className="mb-4 leading-relaxed">
            While SatsEarn may not be directly subject to MiCA as a rewards platform, we commit to the following principles aligned with MiCA&apos;s objectives for EU users:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Transparency:</strong> Clear disclosure of how rewards are earned, calculated, and distributed.</li>
            <li><strong className="text-white">Consumer Protection:</strong> Honest representation of earning potential. No guaranteed earnings claims.</li>
            <li><strong className="text-white">Risk Disclosure:</strong> Clear communication that Bitcoin is a volatile asset and earned sats may fluctuate in value.</li>
            <li><strong className="text-white">Data Protection:</strong> Full compliance with GDPR for EU user data.</li>
            <li><strong className="text-white">Anti-Fraud:</strong> Robust verification systems to protect platform integrity.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Regulatory Monitoring</h3>
          <p className="mb-6 leading-relaxed">
            As MiCA continues to be implemented and interpreted, SatsEarn will monitor regulatory developments that may apply to our operations and take appropriate steps to ensure compliance. If you have regulatory concerns about using SatsEarn as an EU resident, contact us at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/rewards-policy" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Rewards Policy</div>
          </Link>
          <Link href="/legal/regulatory-statement" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Regulatory Statement</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
