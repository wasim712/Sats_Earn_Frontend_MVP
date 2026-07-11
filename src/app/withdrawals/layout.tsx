import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Withdrawals',
  description: 'Learn how to withdraw your earned Bitcoin instantly over the Lightning Network. View minimum amounts and supported wallets.',
  path: '/withdrawals',
});

export default function WithdrawalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
