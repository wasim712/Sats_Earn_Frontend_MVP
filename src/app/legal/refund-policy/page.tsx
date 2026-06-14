'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function RefundPolicyPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-red-300">
              <strong className="text-red-400">Important:</strong> All payments made to SatsEarn are final. We do not offer refunds of any kind once a payment has been completed. Please read this policy carefully and make sure you understand it before making any purchase.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">All Sales Are Final</h3>
          <p className="mb-4 leading-relaxed">
            Except where required by applicable law, paid tier subscriptions (Platinum, Diamond, Crown, Elite, Founders) and any other payments made to SatsEarn are non-refundable. Once a payment is completed, it cannot be reversed, refunded, or credited back, regardless of usage. This applies to:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Initial subscription purchases — non-refundable from the moment of payment.</li>
            <li>Subscription renewals (monthly or yearly) — non-refundable once the billing cycle begins.</li>
            <li>Subscriptions paid for using earned sats — the sats spent are not returned.</li>
            <li>Any partial billing period — we do not provide prorated or partial refunds.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Cancelling a Subscription</h3>
          <p className="mb-6 leading-relaxed">
            You may cancel your paid subscription at any time to stop future renewals. Cancellation prevents the next billing cycle from being charged, but it does not refund the current or any previous billing period. You will retain access to your paid tier benefits until the end of the period you have already paid for.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Sat Earnings — Non-Refundable</h3>
          <p className="mb-4 leading-relaxed">
            Sats earned through task completion, quizzes, streaks, or referrals are rewards for completed activity, not a purchase, and are never subject to refunds. Sats spent on subscriptions or other platform features cannot be recovered once used.
          </p>
          <p className="mb-6 leading-relaxed">
            Earned sats do not represent a bank deposit, a stored-value account, an investment product, or legal tender held by SatsEarn on behalf of users. They cannot be exchanged for cash unless a withdrawal method is explicitly supported by the platform.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Limited Exceptions</h3>
          <p className="mb-6 leading-relaxed">
            The only adjustments we make are platform corrections — for example, where a verified technical error on our side resulted in an incorrect charge or sat deduction. In these cases SatsEarn will investigate and credit the appropriate amount back to your account. These are corrections, not refunds, and are made at SatsEarn&apos;s sole discretion.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Chargebacks &amp; Payment Disputes</h3>
          <p className="mb-4 leading-relaxed">
            If you believe a billing error has occurred, please contact <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> before initiating a chargeback or payment dispute with your bank or card provider. Most issues can be resolved quickly and directly.
          </p>
          <p className="mb-6 leading-relaxed">
            Fraudulent or abusive chargebacks — for example, disputing a charge for a subscription you used — may result in suspension of your account, removal of earned rewards, loss of subscription benefits, and permanent termination of your access to SatsEarn.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Changes to Paid Services</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn reserves the right to modify, replace, discontinue, or remove paid tiers, features, rewards, or subscription benefits at any time. Where appropriate, SatsEarn may provide replacement benefits, account credits, or other remedies at its discretion. Such changes do not, on their own, create a right to a refund.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Questions Before You Pay</h3>
          <p className="mb-6 leading-relaxed">
            Because all payments are final, we encourage you to use the free tier and review the platform fully before purchasing a paid subscription. If you have any questions about a paid tier before buying, email <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> and we will be happy to help.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/manage-cookies" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Manage Cookies</div>
          </Link>
          <Link href="/legal/sats-disclaimer" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Sats Disclaimer</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
