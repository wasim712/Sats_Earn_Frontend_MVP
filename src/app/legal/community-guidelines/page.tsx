'use client';

import React from 'react';
import Link from 'next/link';
import { FadeUp } from '@/components/animations/FadeUp';

export default function CommunityGuidelinesPage() {
  return (
    <div className="pb-20">
      <FadeUp delay={0.1}>
        <div className="prose prose-invert max-w-none text-gray-300">
          <div className="bg-sats-black-900/60 border border-white/[0.04] rounded-xl p-6 mb-8">
            <p className="text-sm m-0 leading-relaxed text-gray-300">
              SatsEarn is a place to learn Bitcoin and earn real sats — honestly. These guidelines keep the platform fair, safe, and sustainable for every crew member. By using SatsEarn, you agree to follow them. They work alongside our <Link href="/legal/terms" className="text-sats-orange-500 hover:underline">Terms of Service</Link> and <Link href="/legal/rewards-policy" className="text-sats-orange-500 hover:underline">Rewards Policy</Link>.
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">1. Our Community Values</h3>
          <p className="mb-4 leading-relaxed">
            SatsEarn was built on a simple idea: anyone should be able to learn about Bitcoin and earn real sats for genuine effort — no buying required. We&apos;re a community of people helping each other understand sound money and orange-pill the world, one sat at a time. We expect everyone here to act with honesty, treat others with respect, and help keep the platform a welcoming place to learn. We say &quot;crew members,&quot; not &quot;users,&quot; because that&apos;s how we see you.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Respect</strong> — treat everyone with dignity, whatever their background or experience level. We&apos;re all learning.</li>
            <li><strong className="text-white">Inclusivity</strong> — Bitcoin is for everyone. Discrimination of any kind is not tolerated.</li>
            <li><strong className="text-white">Integrity</strong> — be honest and transparent. No scams, no manipulation. Earn fairly and play by the rules.</li>
            <li><strong className="text-white">Collaboration</strong> — share knowledge, answer questions, and build each other up.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">2. Expected Behaviour</h3>
          <p className="mb-4 leading-relaxed">
            The best of our community does these things — we hope you will too:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Be welcoming</strong> — help newcomers feel at home and answer questions patiently.</li>
            <li><strong className="text-white">Share knowledge</strong> — contribute helpful tips, explanations, and Bitcoin resources.</li>
            <li><strong className="text-white">Celebrate progress</strong> — congratulate fellow crew members on their milestones.</li>
            <li><strong className="text-white">Give constructive feedback</strong> — offer suggestions kindly and respectfully.</li>
            <li><strong className="text-white">Report issues</strong> — flag inappropriate content or suspicious activity so we can act.</li>
            <li><strong className="text-white">Keep it relevant</strong> — stay on-topic around Bitcoin, SatsEarn, and learning.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">3. One Account Per Person</h3>
          <p className="mb-6 leading-relaxed">
            Each person may hold one SatsEarn account. Creating or operating multiple accounts — to claim extra rewards, abuse referrals, or evade restrictions — is not allowed. Duplicate accounts may have their rewards forfeited and may be suspended or removed.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">4. Genuine Activity Only</h3>
          <p className="mb-4 leading-relaxed">
            Rewards are for real actions performed by a real human. The following are strictly prohibited:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Using bots, scripts, automation, or emulators to complete tasks or games</li>
            <li>Faking, falsifying, or manipulating task completions or engagement</li>
            <li>Using VPNs, proxies, or other tools to misrepresent your identity or location to game rewards</li>
            <li>Exploiting bugs, glitches, or loopholes instead of reporting them</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Every action is subject to verification and a maturity period before sats become withdrawable. This protects the reward pool for everyone.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">5. Honest Referrals</h3>
          <p className="mb-4 leading-relaxed">
            Our referral programme rewards you for inviting real people who genuinely use SatsEarn. To keep it fair:
          </p>
          <p className="mb-2 leading-relaxed"><strong className="text-white">Acceptable:</strong></p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Sharing your link with friends, family, and your own social networks</li>
            <li>Creating honest educational content about SatsEarn that includes your link</li>
            <li>Genuine reviews and recommendations, and answering questions before sharing</li>
          </ul>
          <p className="mb-2 leading-relaxed"><strong className="text-white">Not acceptable:</strong></p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Spamming Discord, Telegram, Reddit, or other communities where it isn&apos;t welcome</li>
            <li>Misleading anyone about earnings potential or what SatsEarn is</li>
            <li>Creating fake accounts to refer yourself, or paying people to sign up under your link</li>
            <li>Using bots or automation to share links</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Referral abuse may result in loss of referral earnings and account action. See the <Link href="/referral" className="text-sats-orange-500 hover:underline">Referral Programme</Link> for how it works.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">6. Respectful Conduct</h3>
          <p className="mb-4 leading-relaxed">
            In any SatsEarn space — including community channels on Telegram, Discord, and social platforms — treat others with respect. We do not tolerate:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Harassment, bullying, trolling, threats, or personal attacks</li>
            <li>Hate speech or discrimination of any kind</li>
            <li>Sexual harassment or unwanted advances</li>
            <li>Sharing others&apos; private information without consent (doxxing)</li>
            <li>Coordinated brigading or harassment campaigns</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">7. Content Guidelines</h3>
          <p className="mb-4 leading-relaxed">
            When you share content — posts, comments, or social shares connected to SatsEarn:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong className="text-white">Keep it family-friendly</strong> — no NSFW or explicit material.</li>
            <li><strong className="text-white">Respect copyright</strong> — don&apos;t share pirated content or violate others&apos; intellectual property.</li>
            <li><strong className="text-white">Be accurate</strong> — fact-check before sharing, and correct mistakes promptly.</li>
            <li><strong className="text-white">Give credit</strong> — attribute sources when you share someone else&apos;s work.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">8. Zero-Tolerance Violations</h3>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-4">
            <p className="text-sm m-0 text-red-300">
              <strong className="text-red-400">The following result in immediate, permanent removal — no warning — and forfeiture of any affected balances:</strong>
            </p>
          </div>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Creating multiple accounts to exploit rewards</li>
            <li>Using bots, scripts, or cheating tools</li>
            <li>Harassment, doxxing, or threats against community members or staff</li>
            <li>Sharing illegal content — including child sexual abuse material (CSAM), content depicting or promoting violence, or terrorism</li>
            <li>Impersonating SatsEarn staff, moderators, or official communications</li>
            <li>Fraud against the platform or its members — including payment fraud and abusive chargebacks (see our <Link href="/legal/refund-policy" className="text-sats-orange-500 hover:underline">Refund Policy</Link>)</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Where required by law, we may report illegal activity to the relevant authorities.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">9. Honest Sharing &amp; Representation</h3>
          <p className="mb-6 leading-relaxed">
            When you talk about SatsEarn publicly, keep it truthful. Don&apos;t impersonate SatsEarn or its team, don&apos;t make guaranteed-earnings or &quot;get rich quick&quot; claims on our behalf, and don&apos;t present sats rewards as a financial investment. SatsEarn makes no promises about future Bitcoin prices or how much anyone will earn. Spreading deliberate misinformation about SatsEarn or Bitcoin — including fake security warnings — is not allowed.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">10. Conflict Resolution</h3>
          <p className="mb-4 leading-relaxed">
            Disagreement is okay. Disrespect is not. If you have a dispute with another crew member:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Stay calm and respectful — avoid escalating.</li>
            <li>Try to resolve it privately first.</li>
            <li>If it can&apos;t be resolved, contact us for mediation rather than fighting it out in public.</li>
            <li>Don&apos;t publicly shame or call out other members.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">11. Enforcement &amp; Consequences</h3>
          <p className="mb-4 leading-relaxed">
            We apply consequences proportionate to the violation, generally following progressive discipline:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li><strong className="text-white">Warning</strong> — first-time minor violations receive a written warning and a chance to correct the behaviour.</li>
            <li><strong className="text-white">Temporary suspension</strong> — repeated violations may lead to a temporary suspension of your account or specific features.</li>
            <li><strong className="text-white">Permanent ban</strong> — severe or repeated violations result in permanent termination of access and forfeiture of affected balances.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Zero-tolerance violations (Section 8) may be acted on immediately, without prior warning. Enforcement decisions are made at SatsEarn&apos;s discretion, with fairness as our guide.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">12. Reporting a Concern</h3>
          <p className="mb-4 leading-relaxed">
            If you see behaviour that breaks these guidelines, report it at <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>. Please include the username, a description of what happened, and any screenshots or links. Don&apos;t engage with the person directly — let our team handle it. Reports are reviewed confidentially.
          </p>
          <p className="mb-6 leading-relaxed">
            <strong className="text-white">Please report in good faith.</strong> Deliberately false reports or abuse of the reporting system may itself result in penalties.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">13. Appeals</h3>
          <p className="mb-6 leading-relaxed">
            If your account has been actioned and you believe it was a mistake, you can appeal by emailing <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> within <strong className="text-white">14 days</strong> of the decision. Include your account details and anything that supports your case. We aim to respond to appeals within <strong className="text-white">5 business days</strong>. Final enforcement decisions rest with SatsEarn.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">14. Changes to These Guidelines</h3>
          <p className="mb-6 leading-relaxed">
            We may update these Community Guidelines as the platform grows. Material changes will be reflected here with an updated date and, where significant, announced through the platform. Continued use of SatsEarn after changes means you accept the updated guidelines.
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
          <Link href="/legal/regulatory-statement" className="group flex-1 p-6 bg-gradient-to-br from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">← Previous</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">Regulatory Statement</div>
          </Link>
          <Link href="/legal" className="group flex-1 p-6 bg-gradient-to-tl from-sats-orange-500/5 to-transparent backdrop-blur-sm border border-sats-orange-500/20 rounded-2xl hover:border-sats-orange-500/50 hover:from-sats-orange-500/10 transition-all duration-300 text-right">
            <div className="font-mono text-xs uppercase tracking-wider text-sats-orange-500/70 mb-2 group-hover:text-sats-orange-500 transition-colors">Done →</div>
            <div className="font-bold text-lg text-white group-hover:text-sats-orange-500 transition-colors">All Policies</div>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
