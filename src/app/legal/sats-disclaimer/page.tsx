import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Sats Disclaimer',
  description: 'Important information about Bitcoin volatility and earnings. Not financial advice.',
  path: '/legal/sats-disclaimer',
});


import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function SatsDisclaimerPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-red-300">
              <strong className="text-red-400">This is not financial advice. Earning sats on SatsEarn does not constitute investment advice or a recommendation to buy, hold, or sell Bitcoin.</strong>
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Nature of Sats</h3>
          <p className="mb-6 leading-relaxed">
            Satoshis (sats) are the smallest unit of Bitcoin (BTC), a decentralised digital currency. Bitcoin is a volatile asset whose value can increase or decrease significantly in short periods. SatsEarn does not make any representations about the future value of Bitcoin or sats earned on the Platform.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Earnings Are Not Guaranteed</h3>
          <p className="mb-4 leading-relaxed">
            Task availability, reward amounts, and earning opportunities on SatsEarn are not guaranteed. The following factors may affect your earnings:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Task availability in your region or tier.</li>
            <li>Changes to admin-set reward amounts.</li>
            <li>Account verification and task approval decisions.</li>
            <li>Platform maintenance or downtime.</li>
            <li>Changes to the Platform&apos;s tier structure or reward system.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Value Fluctuation</h3>
          <p className="mb-6 leading-relaxed">
            The fiat currency equivalent of your earned sats will fluctuate with Bitcoin&apos;s market price. SatsEarn has no control over Bitcoin&apos;s price and accepts no responsibility for any loss of value resulting from price movements after sats have been earned or withdrawn.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Not a Financial Product</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is a rewards platform, not a financial services provider, investment platform, or cryptocurrency exchange. We do not offer interest, yield, or financial returns. Sats are rewards for completed tasks, not investment returns.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Tax Obligations</h3>
          <p className="mb-6 leading-relaxed">
            Depending on your jurisdiction, earned sats may be subject to income tax, capital gains tax, or other tax obligations. It is your sole responsibility to understand and comply with applicable tax laws in your country. SatsEarn does not provide tax advice.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Lightning Network Risks</h3>
          <p className="mb-6 leading-relaxed">
            Withdrawals are processed via the Lightning Network. While reliable, the Lightning Network is a developing technology that may experience channel failures, routing issues, or other technical limitations. SatsEarn is not responsible for delays or failures caused by Lightning Network conditions outside our control.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/refund-policy" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Refund Policy</div>
          </Link>
          <Link href="/legal/rewards-policy" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Rewards Policy</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
