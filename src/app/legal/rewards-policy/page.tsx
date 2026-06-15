'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function RewardsPolicyPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-orange-500/10 border border-sats-orange-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm m-0 text-gray-300">
              <strong className="text-white">Summary:</strong> Rewards are earned by completing genuine tasks. All earnings go through a 24-hour verification and 15-day maturity period. Fraudulent activity results in forfeiture of all rewards.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">How Rewards Are Calculated</h3>
          <p className="mb-4 leading-relaxed">
            Sat rewards on SatsEarn are determined by:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Task base reward:</strong> Set by the admin for each task. The same base applies regardless of your tier.</li>
            <li><strong className="text-white">Tier multiplier:</strong> Your tier determines your sat reward per task (5 sats for Basic up to 30 sats for Founders).</li>
            <li><strong className="text-white">Referral commission:</strong> Calculated as a percentage (5–30% depending on tier) of the admin-set base reward, not of your referral&apos;s tier earnings.</li>
            <li><strong className="text-white">Bonus events:</strong> Admin may activate 2x reward periods for limited times (24–48 hours). These apply platform-wide.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Reward States</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">State</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Duration</th>
                  <th className="bg-sats-black-900/60 p-3 text-xs font-bold tracking-wider uppercase text-gray-400 border-b border-white/[0.04]">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Pending</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Up to 24 hours</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Task under AI and manual verification review</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Maturing</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">15 days</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Verified reward in maturity lock — fraud protection period</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-white/[0.04] text-white">Available</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Indefinite</td>
                  <td className="p-3 border-b border-white/[0.04] text-gray-400">Sats available to withdraw via Lightning Network</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Referral Rewards</h3>
          <p className="mb-4 leading-relaxed">
            Referral commission is earned only when your referred users are active — meaning they complete tasks on the platform. Commission is not earned for referred users who sign up but do not complete tasks.
          </p>
          <p className="mb-6 leading-relaxed">
            Free tier referral commission is subject to lifetime caps (2,000–10,000 sats total depending on tier). Paid tier referrals have no caps.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Streak Milestones</h3>
          <p className="mb-6 leading-relaxed">
            Streak milestone rewards (Week One through Year One) are one-time lifetime awards. Each milestone can only be claimed once per account. If a user reaches a premium milestone while on a free tier, the reward is held securely and released upon upgrading to any paid tier. Held rewards never expire.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Forfeiture of Rewards</h3>
          <p className="mb-4 leading-relaxed">
            Rewards in Pending or Maturing status may be forfeited in the following circumstances:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Account suspended for Terms of Service violations.</li>
            <li>Fraudulent task completion detected during verification.</li>
            <li>Abuse of the referral system detected.</li>
            <li>Use of bots, automation, or multiple accounts.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Available balance rewards will be reviewed on a case-by-case basis in the event of account suspension.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Reward Modification</h3>
          <p className="mb-6 leading-relaxed">
            SatsEarn reserves the right to adjust task reward amounts, tier rates, referral percentages, and earning structures at any time. Changes will be communicated via platform notifications. Continued use of the Platform constitutes acceptance of updated reward structures.
          </p>
        </div>
      </FadeUp>

      {/* Prev/Next Pager */}
      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-sats-orange-500/10">
          <Link href="/legal/sats-disclaimer" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Sats Disclaimer</div>
          </Link>
          <Link href="/legal/mica-policy" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Next →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">MiCA Policy</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
