import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Bitcoin Rewards',
  description: 'Browse the latest tasks, offers, and surveys to start earning Bitcoin today. Get paid instantly via Lightning Network.',
  path: '/rewards',
});

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
