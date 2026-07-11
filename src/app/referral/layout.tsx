import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Referral Program',
  description: 'Invite your friends to SatsEarn and earn a percentage of their rewards for life. Stack more sats together.',
  path: '/referral',
});

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
