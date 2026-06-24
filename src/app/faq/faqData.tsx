import React from 'react';
import Link from 'next/link';

export interface FAQQuestion {
  q: string;
  a: React.ReactNode;
}

export interface FAQCategory {
  id: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
  questions: FAQQuestion[];
}

export   const faqData: FAQCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      sub: 'New to SatsEarn? Start here.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      questions: [
        {
          q: 'What is SatsEarn?',
          a: (
            <span>
              SatsEarn is a <strong>Bitcoin rewards platform</strong> where you stack real satoshis (sats) by completing tasks, answering quizzes, maintaining daily streaks, referring friends, and more. No buying required — ever. Earned sats are paid via the Lightning Network directly to your wallet.
            </span>
          )
        },
        {
          q: 'Is SatsEarn free to use?',
          a: (
            <span>
              Yes — completely free forever. The free tier (Basic through Gold) never expires and never forces an upgrade. You earn real sats, maintain streaks, and refer friends at no cost. Paid tiers are optional and only needed if you want higher rewards, lower withdrawal minimums, and exclusive features.
            </span>
          )
        },
        {
          q: 'Do I need to buy Bitcoin to use SatsEarn?',
          a: (
            <span>
              <strong>Never.</strong> SatsEarn exists specifically to remove that barrier. You earn Bitcoin sats by completing tasks — no money needed, no exchange account, no credit card required. That&apos;s the whole point.
            </span>
          )
        },
        {
          q: 'Do I need a Bitcoin wallet to sign up?',
          a: (
            <span>
              No. You can sign up and start earning without a wallet. You only need a Lightning-compatible Bitcoin wallet when you&apos;re ready to withdraw. We recommend setting one up early so you&apos;re ready when your sats mature.
            </span>
          )
        },
        {
          q: 'Is SatsEarn available in my country?',
          a: (
            <span>
              SatsEarn is available globally in 180+ countries — anywhere internet access and Bitcoin are accessible. It is your responsibility to verify that receiving Bitcoin rewards is legal in your jurisdiction. SatsEarn is not available in countries where Bitcoin is legally prohibited.
            </span>
          )
        },
        {
          q: 'What are satoshis (sats)?',
          a: (
            <span>
              A satoshi (sat) is the smallest unit of Bitcoin. 1 Bitcoin = 100,000,000 satoshis. SatsEarn pays you in sats — real Bitcoin — not points or tokens. Everything you earn on SatsEarn is actual Bitcoin on the Lightning Network.
            </span>
          )
        },
        {
          q: 'Is SatsEarn currently in beta?',
          a: (
            <span>
              Yes. SatsEarn is currently in public beta. We&apos;re building in public, listening to user feedback, and improving the platform continuously. Some features are still being rolled out. You can track our progress on the <Link href="/about#roadmap" className="text-sats-orange-500 hover:underline">public roadmap</Link>.
            </span>
          )
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Login',
      sub: 'Managing your SatsEarn account.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      questions: [
        {
          q: 'How do I create an account?',
          a: (
            <span>
              Go to <Link href="/signup" className="text-sats-orange-500 hover:underline">satsearn.app/signup</Link>, enter your email address and create a password. No ID or payment details required to sign up. Your account starts at Basic tier immediately.
            </span>
          )
        },
        {
          q: 'Can I have more than one account?',
          a: (
            <span>
              <strong>No.</strong> One account per person is strictly enforced. Creating multiple accounts is a Terms of Service violation and will result in permanent suspension of all associated accounts and forfeiture of all balances. Our systems detect duplicate accounts automatically.
            </span>
          )
        },
        {
          q: 'I forgot my password. How do I reset it?',
          a: (
            <span>
              Click &quot;Forgot password&quot; on the login page and enter your registered email. You&apos;ll receive a reset link within a few minutes. Check your spam folder if it doesn&apos;t arrive. If you continue having issues, contact <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
            </span>
          )
        },
        {
          q: 'How do I change my email address?',
          a: (
            <span>
              Email changes can be requested via <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>. We verify identity before processing email changes to protect your account security.
            </span>
          )
        },
        {
          q: 'How do I delete my account?',
          a: (
            <span>
              Email <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> with the subject &quot;Account Deletion Request&quot;. We recommend withdrawing any available balance first. Pending and maturing balances cannot be withdrawn after deletion is processed. Account deletion is permanent.
            </span>
          )
        },
        {
          q: 'My account was suspended. What do I do?',
          a: (
            <span>
              Account suspensions occur for Terms of Service violations — typically bot usage, multiple accounts, or fraudulent task completions. If you believe your account was suspended in error, contact <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> with your account email and a description of the situation. We review all appeals within 5 business days.
            </span>
          )
        },
        {
          q: 'Is KYC (identity verification) required?',
          a: (
            <span>
              No KYC is required for standard platform use. You can earn and withdraw without submitting any identity documents. We may request additional verification for unusually large withdrawal amounts or if suspicious activity is detected.
            </span>
          )
        }
      ]
    },
    {
      id: 'earning',
      title: 'Earning Sats',
      sub: 'How rewards work on SatsEarn.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      questions: [
        {
          q: 'How can I earn Bitcoin online for free?',
          a: (
            <span>
              SatsEarn allows you to earn Bitcoin (satoshis) online for free by completing tasks, answering daily quizzes, and participating in the community. No investment is required.
            </span>
          )
        },
        {
          q: 'What are the ways to earn sats on SatsEarn?',
          a: (
            <div>
              Current earning methods include:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Social tasks</strong> — follow accounts on X, Instagram, Reddit and more</li>
                <li><strong>Bitcoin quizzes</strong> — answer questions about Bitcoin and Lightning</li>
                <li><strong>Mini-games</strong> — browser games (free tier earns XP; paid tiers earn sats)</li>
                <li><strong>Daily streaks</strong> — milestone bonuses for consistent daily activity</li>
                <li><strong>Referrals</strong> — earn commission on your referrals&apos; task completions</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">Coming soon: surveys, watch & earn, offerwalls, app installs, learn & earn.</p>
            </div>
          )
        },
        {
          q: 'Are the sats real Bitcoin?',
          a: (
            <span>
              Yes. SatsEarn pays real Bitcoin satoshis via Lightning Network. There are no internal points, loyalty coins, or synthetic tokens on this platform. When you withdraw, real sats arrive in your Lightning wallet. This is what makes SatsEarn different.
            </span>
          )
        },
        {
          q: 'Why is my earned balance showing as &quot;Pending&quot;?',
          a: (
            <span>
              Every completed task enters a <strong>Pending</strong> state for up to 24 hours while our AI and manual review systems verify the completion was genuine. Once verified, it moves to <strong>Maturing</strong> status for the 15-day lock period. This protects the platform from fraud and ensures every reward is legitimate.
            </span>
          )
        },
        {
          q: 'Why do my sats take 15 days to become available?',
          a: (
            <span>
              The 15-day maturity period is our fraud and bot protection layer. It allows us to detect and reverse fraudulent completions before sats are released. This applies to every user on every tier — it&apos;s what keeps the platform honest and ensures every sat that reaches your available balance was genuinely earned.
            </span>
          )
        },
        {
          q: 'Is there a limit to how much I can earn?',
          a: (
            <span>
              There is no user-level earnings cap. You can earn as much as available tasks allow. Task rewards are set by admins per task — some tasks have total completion limits (once the budget is spent, the task closes). Referral commission has lifetime caps for free tier users which lift completely on any paid tier.
            </span>
          )
        },
        {
          q: 'What happens if a task I completed gets rejected?',
          a: (
            <span>
              If a task completion is rejected during verification, the pending reward is removed and not added to your balance. Reasons include: incomplete action, reversed action (e.g. unfollowed after completing), or detected fraud signals. Repeated rejections may affect your account standing.
            </span>
          )
        },
        {
          q: 'Can I earn sats from mini-games on a free tier?',
          a: (
            <span>
              Free tier users earn <strong>XP</strong> from the 1–2 free games available to all users. Sats rewards from games are exclusive to paid tier users via paid-exclusive games. We&apos;re monitoring game traffic before enabling broader sats rewards.
            </span>
          )
        },
        {
          q: 'What are 2x bonus events?',
          a: (
            <span>
              Occasionally SatsEarn runs 2x reward events for 24–48 hours, typically on special dates or milestones. During these events, task rewards double platform-wide — for all users on all tiers. For example, a Basic user normally earning 5 sats per task would earn 10 sats during a 2x event. Watch our social channels for announcements.
            </span>
          )
        }
      ]
    },
    {
      id: 'free-tier',
      title: 'Free Tiers',
      sub: 'Basic, Copper, Bronze, Silver, Gold.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      ),
      questions: [
        {
          q: 'What are the free tiers and how do they work?',
          a: (
            <span>
              Free tiers are Basic → Copper → Bronze → Silver → Gold. You start at Basic and progress automatically as you earn XP through activity on the platform. Each tier upgrade increases your per-task sat reward. No payment is ever required to progress through free tiers.
            </span>
          )
        },
        {
          q: 'How do I level up my free tier?',
          a: (
            <span>
              You level up by accumulating XP. XP is earned from completing tasks, playing games, maintaining streaks, and other platform activity. When you reach the XP threshold for the next tier, your tier upgrades automatically — no action required from you.
            </span>
          )
        },
        {
          q: 'How much do I earn per task on each free tier?',
          a: (
            <div>
              Free tier task rewards per example task:
              <ul className="list-solid pl-5 mt-2 space-y-1 list-disc">
                <li>Basic — 5 sats</li>
                <li>Copper — 6 sats</li>
                <li>Bronze — 7 sats</li>
                <li>Silver — 8 sats</li>
                <li>Gold — 9 sats</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">Note: Some tasks may pay equally across all tiers. Admin sets the base reward per task.</p>
            </div>
          )
        },
        {
          q: 'What is the withdrawal minimum on free tiers?',
          a: (
            <span>
              All free tier users (Basic through Gold) have a withdrawal minimum of <strong>25,000 sats</strong>. This applies regardless of which free tier you&apos;re on. Paid tiers have significantly lower minimums — down to 10,000 sats for Founders.
            </span>
          )
        },
        {
          q: 'Do free tier users see ads?',
          a: (
            <span>
              Yes. Free tier users see banner and standard ads on the platform. Rewarded ads (click to earn or watch to revive a game) are available to all users. Paid tier users do not see forced or banner ads — ad-free experience is a paid tier benefit.
            </span>
          )
        },
        {
          q: 'What features are locked on free tiers?',
          a: (
            <span>
              Free tier users cannot access: premium streak milestones (90, 180, 365 days), exclusive paid-tier games, special premium tasks, and reduced withdrawal fees. Locked features are visible in the dashboard with an upgrade prompt — they are never hidden entirely.
            </span>
          )
        }
      ]
    },
    {
      id: 'paid-tier',
      title: 'Paid Tiers',
      sub: 'Platinum, Diamond, Crown, Elite, Founders.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      questions: [
        {
          q: 'Do I need to upgrade to earn on SatsEarn?',
          a: (
            <span>
              <strong>Never.</strong> Paid tiers are an optional amplifier. Free tier is genuinely viable indefinitely. We will never force an upgrade or gate core earning behind a paywall. Upgrading gives you more — it doesn&apos;t restrict what you already have.
            </span>
          )
        },
        {
          q: 'What are the paid tiers and their referral rates?',
          a: (
            <div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Platinum — 10% referral, 20,000 sat withdrawal minimum</li>
                <li>Diamond — 15% referral, 15,000 sat minimum</li>
                <li>Crown — 20% referral, 15,000 sat minimum</li>
                <li>Elite — 25% referral, 15,000 sat minimum</li>
                <li>Founders — 30% referral, 10,000 sat minimum (1,000 spots only)</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">All paid tiers have unlimited referrals, no earnings caps, exclusive game access, premium streak milestones, and ad-free experience.</p>
            </div>
          )
        },
        {
          q: 'Can I pay for a subscription using my earned sats?',
          a: (
            <span>
              Yes. Any paid tier subscription can be purchased using sats from your available balance. This means dedicated stackers can effectively upgrade without spending any fiat currency — using only what they&apos;ve earned on the platform.
            </span>
          )
        },
        {
          q: 'What happens when my paid subscription expires?',
          a: (
            <span>
              When a paid subscription lapses, you automatically fall back to whichever <strong>free tier matches your current XP</strong> — not necessarily Basic. Your XP, earned sats, streak progress, and referral history are all fully preserved. You never lose progress when downgrading.
            </span>
          )
        },
        {
          q: 'What is the Founders tier?',
          a: (
            <span>
              Founders is the highest tier on SatsEarn — yearly-only, limited to 1,000 users. Benefits include 30 sats per task, 30% referral commission, 10,000 sat withdrawal minimum, all exclusive games and premium milestones, and the unique <strong>Founders Referral Rotation</strong> — automatic assignment of unattributed new users to Founders in a round-robin queue.
            </span>
          )
        },
        {
          q: 'Are paid tier subscriptions monthly or yearly?',
          a: (
            <span>
              Platinum, Diamond, Crown, and Elite are available as monthly or yearly subscriptions. Founders is <strong>yearly only</strong> and limited to 1,000 users. Yearly plans offer better value. All plans can be paid with earned sats or standard payment methods.
            </span>
          )
        }
      ]
    },
    {
      id: 'withdrawal',
      title: 'Withdrawals',
      sub: 'Getting your sats out.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      ),
      questions: [
        {
          q: 'How do I withdraw my sats?',
          a: (
            <span>
              Once your sats are in your <strong>Available balance</strong> and meet your tier&apos;s withdrawal minimum, go to your dashboard, click Withdraw, enter your Lightning wallet address (LNURL or Lightning invoice), and confirm. Fees are shown transparently before you confirm.
            </span>
          )
        },
        {
          q: 'What is the minimum withdrawal amount?',
          a: (
            <div>
              Minimums by tier:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Basic, Copper, Bronze, Silver, Gold — <strong>25,000 sats</strong></li>
                <li>Platinum — <strong>20,000 sats</strong></li>
                <li>Diamond, Crown, Elite — <strong>15,000 sats</strong></li>
                <li>Founders — <strong>10,000 sats</strong></li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">Paid tier users reach their threshold faster due to both lower minimums and higher per-task earnings.</p>
            </div>
          )
        },
        {
          q: 'What are the withdrawal fees?',
          a: (
            <span>
              Fees are shown transparently at the time of withdrawal. They vary by tier — paid tiers pay lower fees. There are no hidden charges. What you see at confirmation is what gets deducted.
            </span>
          )
        },
        {
          q: 'How long does a withdrawal take?',
          a: (
            <span>
              Lightning Network withdrawals are typically processed within seconds to a few minutes. In rare cases of network routing issues, it may take longer. If a withdrawal fails, the sats are returned to your available balance automatically.
            </span>
          )
        },
        {
          q: 'Why is my withdrawal minimum 25,000 sats on a free tier?',
          a: (
            <span>
              The 25,000 sat minimum for free tiers is set to balance Lightning Network transaction costs, fraud protection, and operational sustainability. Paid tier users have lower minimums as a benefit of their subscription. Consistent daily earning significantly reduces the time to reach the threshold.
            </span>
          )
        },
        {
          q: 'My withdrawal failed. What do I do?',
          a: (
            <span>
              If a withdrawal fails, your sats are automatically returned to your available balance — nothing is lost. Common causes include: invalid Lightning address, expired invoice, or routing failures. Double-check your wallet address and try again. If the issue persists, contact <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a>.
            </span>
          )
        }
      ]
    },
    {
      id: 'lightning',
      title: 'Lightning Network',
      sub: 'How Bitcoin payments work on SatsEarn.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z"/>
          <polygon points="13 8 8 13 12 13 11 17 16 12 12 12 13 8"/>
        </svg>
      ),
      questions: [
        {
          q: 'What is the Lightning Network?',
          a: (
            <span>
              The Lightning Network is a payment layer built on top of Bitcoin that enables fast, low-fee transactions. Instead of waiting for Bitcoin blockchain confirmations, Lightning payments settle in seconds. SatsEarn uses Lightning to pay out sats instantly and cheaply once they&apos;re available.
            </span>
          )
        },
        {
          q: 'What wallets are compatible with SatsEarn withdrawals?',
          a: (
            <span>
              Any Lightning-compatible Bitcoin wallet works. Popular options include Wallet of Satoshi, Phoenix, Muun, Breez, Zeus, and Blue Wallet. Make sure your wallet supports LNURL-pay or Lightning invoices. We recommend Wallet of Satoshi or Phoenix for beginners.
            </span>
          )
        },
        {
          q: 'Can I withdraw to a regular Bitcoin (on-chain) address?',
          a: (
            <span>
              Currently, withdrawals are Lightning Network only. We do not support on-chain Bitcoin withdrawals at this time. This may change in future. Many Lightning wallets allow you to swap Lightning sats to on-chain Bitcoin if needed.
            </span>
          )
        },
        {
          q: 'Is the Lightning Network safe?',
          a: (
            <span>
              Lightning Network is a mature, widely-used Bitcoin payment layer. Like all technology, it carries some risk — channel failures or routing issues can occasionally delay transactions, but funds are never permanently lost. SatsEarn uses established Lightning infrastructure with redundancy to minimise issues.
            </span>
          )
        },
        {
          q: 'Why does SatsEarn use Lightning instead of regular Bitcoin?',
          a: (
            <span>
              On-chain Bitcoin has transaction fees that make small sat amounts impractical to send. Lightning enables micro-payments of just a few sats with near-zero fees and instant settlement — making it the only practical way to pay out small sat rewards to users globally.
            </span>
          )
        }
      ]
    },
    {
      id: 'referrals',
      title: 'Referrals',
      sub: 'Earn by inviting others.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      questions: [
        {
          q: 'How does the referral programme work?',
          a: (
            <span>
              Share your referral link. When someone signs up using your link and completes tasks, you earn a commission based on the admin-set base reward for that task. Commission is calculated on the base reward — not on what your referral earns based on their own tier.
            </span>
          )
        },
        {
          q: 'How is referral commission calculated?',
          a: (
            <div>
              Example with base reward = 10 sats:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You&apos;re on Basic (5%) → you earn 0.5 sats per task your referral completes</li>
                <li>You&apos;re on Founders (30%) → you earn 3 sats per task</li>
              </ul>
              <p className="mt-2.5">Your commission rate is determined by <strong>your tier</strong>, not your referral&apos;s tier. The base reward is set by admin and is the same for everyone.</p>
              <div className="bg-sats-orange-500/5 border-l-2 border-sats-orange-500 rounded-r-lg p-3.5 mt-3 text-sm text-gray-300">
                <strong className="text-sats-orange-500">Key point:</strong> Commission is only earned when your referral is active and completing tasks — not just for signing up.
              </div>
            </div>
          )
        },
        {
          q: 'What are the referral caps for free tiers?',
          a: (
            <div>
              Free tier referral caps are cumulative across all free tiers:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Basic — 20 referrals, 2,000 sats lifetime</li>
                <li>Copper — 40 referrals, 4,000 sats lifetime</li>
                <li>Bronze — 60 referrals, 6,000 sats lifetime</li>
                <li>Silver — 80 referrals, 8,000 sats lifetime</li>
                <li>Gold — 100 referrals, 10,000 sats lifetime</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">These caps are cumulative — a Gold user&apos;s 10,000 sat cap includes everything earned since Basic. Caps lift completely on any paid tier.</p>
            </div>
          )
        },
        {
          q: 'Do paid tiers have referral caps?',
          a: (
            <span>
              No. All paid tiers (Platinum through Founders) have unlimited referrals and zero earnings caps. There is no ceiling on how much you can earn from referrals on a paid tier.
            </span>
          )
        },
        {
          q: 'What is the Founders Referral Rotation?',
          a: (
            <span>
              When a new user signs up <strong>without a referral code</strong>, SatsEarn automatically assigns them to the next Founder in a round-robin queue. That Founder earns commission on all that user&apos;s task completions for life — or until their Founders subscription lapses. Once all 1,000 Founders have been assigned once, the queue resets from Founder #1. Earlier Founders complete more rotation cycles.
            </span>
          )
        },
        {
          q: 'When do I stop earning referral commission?',
          a: (
            <span>
              For free tiers, commission stops when you reach your lifetime cap or max referral count. For paid tiers, commission continues indefinitely as long as your referrals are active. If your paid subscription lapses, free tier caps apply going forward — but commission already earned is not reversed.
            </span>
          )
        },
        {
          q: 'Where is my referral link and how does attribution work?',
          a: (
            <span>
              Every account gets one unique referral link in your dashboard. When someone opens it and creates an account, they&apos;re permanently attributed to you as their referrer. There&apos;s nothing to set up — share the link and any signups through it are tracked to your account automatically.
            </span>
          )
        },
        {
          q: 'When is referral commission paid out?',
          a: (
            <span>
              Referral commission follows the same balance flow as all earned sats. Each commission entry first goes through a 24-hour verification window (Pending), then a 15-day maturity lock (Maturing) with its own countdown, after which it becomes Available to withdraw. Each entry matures independently, so commission unlocks on a rolling basis as your referrals stay active.
            </span>
          )
        },
        {
          q: 'Do my referrals or my referral link expire?',
          a: (
            <span>
              No. Your referral link doesn&apos;t expire, and a referral stays attributed to you for as long as they use SatsEarn. On a paid tier you keep earning commission on their activity indefinitely. On a free tier, you keep earning until you hit your lifetime referral cap.
            </span>
          )
        },
        {
          q: 'Can I refer myself, family, or friends on the same network?',
          a: (
            <span>
              You can refer genuine people — friends and family who are real, separate users with their own accounts and activity. What&apos;s not allowed is self-referral: creating extra accounts for yourself, or using bots or fake accounts to game the system. That&apos;s treated as abuse and results in forfeiture of affected balances and possible account action.
            </span>
          )
        }
      ]
    },
    {
      id: 'streaks',
      title: 'Streaks & Milestones',
      sub: 'Consistency rewards.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      questions: [
        {
          q: 'How do streaks work?',
          a: (
            <span>
              A streak is maintained by being active on the platform at least once per day. Activity includes completing at least one task, playing a game, or engaging with platform features. Miss a day and your streak resets to zero. Streaks unlock milestone rewards at specific day counts.
            </span>
          )
        },
        {
          q: 'What are the streak milestone rewards?',
          a: (
            <div>
              Free tier milestones (available to all):
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Week One — 7 days — 70 sats</li>
                <li>Three Week Run — 21 days — 210 sats</li>
                <li>Two Month Grind — 60 days — 600 sats</li>
              </ul>
              <p className="mt-3">Premium milestones (paid tiers only):</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Quarter Grind — 90 days — 900 sats</li>
                <li>Half Year Grind — 180 days — 1,800 sats</li>
                <li>Year One — 365 days — 3,650 sats</li>
              </ul>
            </div>
          )
        },
        {
          q: 'What happens if I hit a premium milestone while on a free tier?',
          a: (
            <span>
              Your sats are <strong>held securely</strong> in your account — not lost. When you upgrade to any paid tier, the held sats release to your available balance instantly. Held sats never expire. You never lose progress.
            </span>
          )
        },
        {
          q: 'Can I claim each milestone multiple times?',
          a: (
            <span>
              No. Streak milestones are <strong>one-time lifetime awards</strong> per account. Each milestone can only be claimed once, no matter how many times you reset and rebuild your streak. This mirrors achievement systems in apps like Duolingo or Headspace.
            </span>
          )
        },
        {
          q: 'Does my streak reset if I miss a day?',
          a: (
            <span>
              Yes — missing a single day resets your active streak counter to zero. However, any milestones already claimed are permanently awarded and cannot be reversed. In future, we plan to introduce Streak Shield features to protect against occasional missed days.
            </span>
          )
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Trust',
      sub: 'How we protect you and the platform.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      questions: [
        {
          q: 'Is SatsEarn legit or a scam?',
          a: (
            <span>
              SatsEarn is a verified platform that has processed numerous Lightning Network withdrawals. We never ask for deposits, credit cards, or investments, making it a zero-risk environment to learn and earn.
            </span>
          )
        },
        {
          q: 'Are there bots on SatsEarn?',
          a: (
            <span>
              <strong>Zero bots allowed — ever.</strong> Every action on SatsEarn must be performed by a verified human. Our AI verification system, 24-hour review period, and 15-day maturity lock work together to detect and eliminate bot activity. Bot usage results in immediate account suspension and forfeiture of all balances.
            </span>
          )
        },
        {
          q: 'How does SatsEarn verify task completions?',
          a: (
            <span>
              Task completions go through a two-stage process: <strong>AI review</strong> that detects patterns consistent with automation or fraud, followed by <strong>manual verification</strong> for flagged or high-value completions. The 24-hour pending period is where this happens. The 15-day maturity lock provides additional protection against reversed actions (e.g. unfollowing after completing a follow task).
            </span>
          )
        },
        {
          q: 'Is my personal data safe?',
          a: (
            <span>
              Yes. We collect minimal data — only what&apos;s needed to run the platform. We use encrypted connections (HTTPS), hashed passwords, and strict access controls. We do not sell your data to third parties. See our <Link href="/legal/privacy" className="text-sats-orange-500 hover:underline">Privacy Policy</Link> for full details.
            </span>
          )
        },
        {
          q: 'What happens if I try to cheat the system?',
          a: (
            <span>
              Cheating includes using bots, multiple accounts, submitting false completions, or manipulating the referral system. Our systems detect these behaviours automatically. Consequences: immediate account suspension, forfeiture of all pending and maturing balances, and a permanent ban. We take platform integrity seriously.
            </span>
          )
        },
        {
          q: 'How do I report suspicious activity or a bug?',
          a: (
            <span>
              Email <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> with details of the suspicious activity or bug. For security vulnerabilities, please include as much technical detail as possible. We take all reports seriously and respond within 2 business days.
            </span>
          )
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Compliance',
      sub: 'Policies, regulations, and your rights.',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      questions: [
        {
          q: 'Do I need to pay taxes on the Bitcoin I earn?',
          a: (
            <span>
              Tax regulations vary by jurisdiction. In many countries, earning cryptocurrency is considered taxable income. We recommend consulting a local tax professional regarding your satoshi earnings.
            </span>
          )
        },
        {
          q: 'Where is SatsEarn based?',
          a: (
            <span>
              SatsEarn is operated in India and available globally. All legal matters are governed by Indian law. For EU users, we maintain GDPR-compliant data practices. See our <Link href="/legal" className="text-sats-orange-500 hover:underline">Regulatory Statement</Link> for full details.
            </span>
          )
        },
        {
          q: 'Is SatsEarn a financial service or investment platform?',
          a: (
            <span>
              <strong>No.</strong> SatsEarn is a rewards platform, not a financial services provider, investment platform, or cryptocurrency exchange. Sats are rewards for completing tasks — not investment returns. Nothing on SatsEarn constitutes financial advice.
            </span>
          )
        },
        {
          q: 'Do I need to pay tax on earned sats?',
          a: (
            <span>
              Tax obligations depend on your jurisdiction. In India, virtual digital assets (VDAs) including Bitcoin are taxable. In other countries, rules vary. It is your sole responsibility to understand and comply with applicable tax laws. SatsEarn does not provide tax advice.
            </span>
          )
        },
        {
          q: 'What is your refund policy?',
          a: (
            <span>
              All payments to SatsEarn are final. We do not offer refunds once a payment is completed — this includes initial subscription purchases, renewals, and subscriptions paid using earned sats. You can cancel anytime to stop future renewals, and you&apos;ll keep access until the end of the period you&apos;ve paid for. Earned sats are also non-refundable. See our <Link href="legal/terms" className="text-sats-orange-500 hover:underline">Terms of Service</Link> or `legal/terms` for full details.
            </span>
          )
        },
        {
          q: 'How do I submit a GDPR data request?',
          a: (
            <span>
              Email <a href="mailto:support@satsearn.app" className="text-sats-orange-500 hover:underline">support@satsearn.app</a> with the subject &quot;GDPR Data Request&quot; and specify what you need — access, correction, deletion, or portability. We respond to all GDPR requests within 30 days as required by regulation.
            </span>
          )
        },
        {
          q: 'Where can I read all SatsEarn policies?',
          a: (
            <span>
              All policies are available at <Link href="/legal" className="text-sats-orange-500 hover:underline">satsearn.app/legal</Link> — Terms of Service, Privacy Policy, Cookie Policy, Refund Policy, Sats Disclaimer, Rewards Policy, MiCA Policy, and Regulatory Statement — all in one place with easy navigation.
            </span>
          )
        }
      ]
    }
  ];
