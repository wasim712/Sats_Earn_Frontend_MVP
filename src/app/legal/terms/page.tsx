import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms of Service',
  description: 'Your rights and responsibilities when using SatsEarn to earn Bitcoin sats.',
  path: '/legal/terms',
});


import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function TermsPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-gray-300">
              <strong className="text-white">Summary:</strong> By using SatsEarn, you agree to these terms. We provide a platform to earn real Bitcoin satoshis by completing tasks. You must be 18 or older. We reserve the right to suspend accounts found to be abusing the platform.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-6 leading-relaxed">
            By accessing or using SatsEarn (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) at satsearn.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform. SatsEarn is operated in India and available globally.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">2. Eligibility</h3>
          <p className="mb-4 leading-relaxed">
            You must be at least 18 years of age to use SatsEarn. By creating an account, you represent and warrant that you are 18 years or older, that you have the legal capacity to enter into these terms, and that your use of the Platform does not violate any applicable laws in your jurisdiction.
          </p>
          <p className="mb-6 leading-relaxed">
            SatsEarn is not available to users in jurisdictions where Bitcoin or Lightning Network payments are prohibited by law. It is your responsibility to ensure compliance with local regulations before using the Platform.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">3. Account Registration</h3>
          <p className="mb-4 leading-relaxed">
            You must provide a valid email address to create an account. You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account. SatsEarn is not liable for any loss resulting from unauthorised access to your account.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>One account per person. Multiple accounts are strictly prohibited.</li>
            <li>You must not share your account with any other person.</li>
            <li>You must notify us immediately at support@satsearn.app if you suspect unauthorised use.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">4. Earning Sats</h3>
          <p className="mb-4 leading-relaxed">
            SatsEarn provides a platform where users can earn Bitcoin satoshis (sats) by completing verified tasks, answering quizzes, maintaining daily streaks, referring friends, and other earning mechanisms. All earnings are subject to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>A 24-hour verification period (Pending status) where task completion is reviewed by AI and manual processes.</li>
            <li>A 15-day maturity period (Maturing status) applied to all verified earnings, regardless of tier.</li>
            <li>Availability of tasks, which is not guaranteed at any time.</li>
            <li>Admin-set task reward amounts, which may change without notice.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Earnings are not guaranteed. Task availability, reward amounts, and eligibility may vary based on your tier, region, and platform conditions.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">5. Prohibited Conduct</h3>
          <p className="mb-4 leading-relaxed">
            You agree not to engage in any of the following:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Using bots, scripts, automation tools, or any artificial means to complete tasks or simulate activity.</li>
            <li>Creating multiple accounts or using another person&apos;s account.</li>
            <li>Submitting false, misleading, or fraudulent task completions.</li>
            <li>Attempting to manipulate the referral system.</li>
            <li>Reverse-engineering, scraping, or attempting to access the Platform&apos;s internal systems.</li>
            <li>Any activity that constitutes fraud, abuse, or gaming of the reward system.</li>
          </ul>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-red-200">
              <strong className="text-red-400">Violation of these rules will result in immediate account suspension and forfeiture of all pending and maturing balances.</strong> SatsEarn employs AI and manual verification to detect and act on fraudulent activity.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">6. Withdrawals</h3>
          <p className="mb-6 leading-relaxed">
            Withdrawals are processed via the Lightning Network to any compatible Bitcoin Lightning wallet. Withdrawal minimums vary by tier (10,000–25,000 sats). Fees are displayed at time of withdrawal. SatsEarn does not guarantee withdrawal processing times, which depend on Lightning Network conditions.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">7. Tier System</h3>
          <p className="mb-4 leading-relaxed">
            SatsEarn operates a freemium tier model. Free tiers (Basic through Gold) are unlocked via XP progression. Paid tiers (Platinum through Founders) require a monthly or yearly subscription. Founders tier is yearly-only and limited to 1,000 users. Subscriptions can be paid with earned sats from your available balance.
          </p>
          <p className="mb-6 leading-relaxed">
            We will never force any user to upgrade. Free tier participation is genuinely available indefinitely.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">8. Termination</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn reserves the right to suspend or terminate your account at any time for violation of these Terms, suspected fraud, or abuse of the Platform. Upon termination, any pending or maturing balances may be forfeited. Available balances at the time of termination will be reviewed on a case-by-case basis.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">9. Limitation of Liability</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn is provided &quot;as is&quot; without warranties of any kind. We are not liable for any loss of earnings due to platform downtime, changes in Bitcoin value, Lightning Network failures, or task unavailability. Our total liability to you shall not exceed the value of sats credited to your available balance at the time of any claim.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">10. Changes to Terms</h3>
          <p className="mb-6 leading-relaxed">
            We may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms. We will notify users of material changes via email or platform notification where possible.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">11. Governing Law</h3>
          <p className="mb-6 leading-relaxed">
            These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India. For informal resolution, contact us first at support@satsearn.app.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Back</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">All Policies</div>
          </Link>
          <Link href="/legal/privacy" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Privacy Policy</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
