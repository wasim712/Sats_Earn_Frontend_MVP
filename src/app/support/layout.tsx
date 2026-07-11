import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Support',
  description: 'Need help? Contact the SatsEarn support team for assistance with your account, tasks, or withdrawals.',
  path: '/support',
});

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
