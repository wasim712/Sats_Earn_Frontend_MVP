import type { Metadata } from 'next';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
import { getSiteUrl, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `About`,
  description:
    'Learn what SatsEarn is, who it is for, how users earn Bitcoin rewards, and how to reach support.',
  alternates: {
    canonical: getSiteUrl('/about'),
  },
  openGraph: {
    title: `About`,
    description:
      'Learn what SatsEarn is, who it is for, how users earn Bitcoin rewards, and how to reach support.',
    url: getSiteUrl('/about'),
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#020202] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">About</p>
          <h1 className="text-4xl font-black tracking-tight">What SatsEarn Does</h1>
          <p className="max-w-3xl text-sm leading-7 text-gray-300">
            SatsEarn is a public rewards platform designed to help people earn small amounts of Bitcoin by completing
            legitimate online tasks, offers, surveys, and community activities. The platform is built for users who want
            a simple, accessible way to start stacking sats without buying crypto upfront.
          </p>
          <PublicTrustNav />
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6">
            <h2 className="text-xl font-black">How users earn</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              Users can create an account, review available opportunities, complete tasks that meet platform and partner
              requirements, and receive rewards after validation. Reward timing can vary depending on the offer type,
              fraud checks, and advertiser confirmation.
            </p>
          </div>

          <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6">
            <h2 className="text-xl font-black">Who the platform is for</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              SatsEarn is intended for people who want to earn Bitcoin rewards online through time-based digital tasks,
              referrals, and promotions. It is especially useful for beginners who want a straightforward introduction to
              sats and reward-based earning.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6 space-y-5">
          <div>
            <h2 className="text-xl font-black">Legitimacy and safety</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              SatsEarn aims to operate as a clear, user-facing product with published support and policy pages, review
              steps for suspicious activity, and public information about how rewards work. Completing a task does not
              guarantee an instant payout if additional review is required for abuse prevention or partner validation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">Support and contact</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              For account help, policy questions, or business inquiries, use the public contact page on this website.
              Support requests are reviewed through official SatsEarn channels so users have a clear path to assistance.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
