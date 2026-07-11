import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Regulatory Statement',
  description: 'Our platform classification, jurisdiction, and regulatory position.',
  path: '/legal/regulatory-statement',
});


import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function RegulatoryStatementPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-red-300">
              <strong className="text-red-400">SatsEarn is not a licensed financial institution, bank, cryptocurrency exchange, or investment adviser. This platform is a Bitcoin rewards service.</strong>
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Platform Classification</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn operates as a Bitcoin rewards and task completion platform. Users earn Bitcoin satoshis as rewards for completing verified tasks, quizzes, and other platform activities. This is not a financial service, investment product, or cryptocurrency exchange.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">India Regulatory Position</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn operates from India. The platform complies with applicable Indian regulations regarding digital assets and online platforms. Virtual digital assets (VDAs) in India are subject to taxation under the Income Tax Act, 1961. Users in India are responsible for complying with Indian tax laws on any VDA income.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Global Availability</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is available globally wherever internet access and Bitcoin usage are legally permitted. It is the user&apos;s responsibility to determine whether use of SatsEarn and receipt of Bitcoin rewards is legal in their jurisdiction. SatsEarn is not responsible for regulatory non-compliance by users in their respective jurisdictions.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Jurisdictions Where Use May Be Restricted</h3>
          <p className="mb-6 leading-relaxed">
            Users from jurisdictions where Bitcoin is prohibited or heavily restricted should not use SatsEarn. This includes but may not be limited to countries where cryptocurrency transactions are explicitly banned. SatsEarn does not warrant that the Platform is appropriate or available for use in all locations.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">No Financial Advice</h3>
          <p className="mb-6 leading-relaxed">
            Nothing on the SatsEarn Platform constitutes financial, investment, legal, or tax advice. All content is for informational purposes only. Consult qualified professionals for advice specific to your circumstances.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Anti-Money Laundering (AML)</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn implements measures to prevent money laundering and financial crime, including transaction monitoring, fraud detection, and account activity review. We reserve the right to report suspicious activity to relevant authorities as required by applicable law.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Contact for Regulatory Enquiries</h3>
          <p className="mb-6 leading-relaxed">
            For any regulatory, legal, or compliance enquiries, contact us at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>. We aim to respond to all regulatory enquiries within 5 business days.
          </p>

          <div className="bg-sats-black-900/60 border border-white/[0.04] rounded-xl p-6 mt-10">
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              <strong className="text-gray-300">SatsEarn</strong> · Operated in India · support@satsearn.app<br/>
              All policies effective from March 1, 2026 · Subject to change with notice<br/>
              Bitcoin (BTC) and satoshis are not issued, backed, or guaranteed by SatsEarn.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/mica-policy" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">MiCA Policy</div>
          </Link>
          <Link href="/legal/community-guidelines" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Community Guidelines</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
