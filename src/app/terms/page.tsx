import type { Metadata } from 'next';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
import { getSiteUrl, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Terms & Conditions`,
  description:
    'Review the basic terms, account expectations, reward conditions, and anti-abuse rules for using SatsEarn.',
  alternates: {
    canonical: getSiteUrl('/terms'),
  },
  openGraph: {
    title: `${SITE_NAME} Terms & Conditions`,
    description:
      'Review the basic terms, account expectations, reward conditions, and anti-abuse rules for using SatsEarn.',
    url: getSiteUrl('/terms'),
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#020202] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Legal</p>
          <h1 className="text-4xl font-black tracking-tight">Terms & Conditions</h1>
          <p className="max-w-3xl text-sm leading-7 text-gray-300">
            These terms outline the basic rules for using SatsEarn, including account expectations, reward handling,
            review processes, and prohibited abuse. By using the platform, users agree to follow these conditions.
          </p>
          <PublicTrustNav />
        </div>

        <section className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6 space-y-5">
          <div>
            <h2 className="text-xl font-black">Account and use expectations</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              Users must provide accurate account information, follow task requirements honestly, and use the platform in
              a manner consistent with applicable rules, partner requirements, and community standards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">Rewards and eligibility</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              Rewards may depend on successful task completion, validation by internal systems, and confirmation from
              advertisers or offer providers. Eligibility can vary by geography, campaign rules, account status, or
              fraud-review outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">Prohibited conduct</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              Fraud, duplicate accounts, automated activity, misleading submissions, incentive abuse, or any attempt to
              manipulate rewards or platform systems may result in disqualification, account restrictions, or removal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">Payout and review timing</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              Some rewards may appear quickly, while others require manual or partner review before they are approved.
              Payout timing is not guaranteed and may be delayed when additional verification is needed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black">Updates and limitations</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">
              SatsEarn may update features, eligibility requirements, campaign availability, and these terms over time.
              Continued use of the platform after updates indicates acceptance of the revised terms.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
