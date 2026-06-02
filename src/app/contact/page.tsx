import type { Metadata } from 'next';
import { PublicTrustNav } from '@/components/layout/PublicTrustNav';
import { getSiteUrl, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Contact ${SITE_NAME}`,
  description: 'Contact SatsEarn for account support, business inquiries, or policy questions.',
  alternates: {
    canonical: getSiteUrl('/contact'),
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#020202] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Support</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Contact Us</h1>
          <p className="mt-3 text-sm text-gray-400">Reach out to SatsEarn for account help, partnership questions, policy concerns, or general support.</p>
          <div className="mt-4">
            <PublicTrustNav />
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6">
            <h2 className="text-xl font-black">General Support</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">If you need help with your account, rewards, or submissions, please contact the SatsEarn support team through our official support channels.</p>
            <p className="mt-4 text-sm font-bold text-sats-orange-400">Email: support@satsearn.com</p>
          </div>

          <div className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6">
            <h2 className="text-xl font-black">Business and Advertising</h2>
            <p className="mt-3 text-sm leading-7 text-gray-300">For brand partnerships, campaign requests, monetization inquiries, or business discussions, contact the team directly using the business email below.</p>
            <p className="mt-4 text-sm font-bold text-sats-orange-400">Email: business@satsearn.com</p>
          </div>
        </section>
      </div>
    </main>
  );
}
