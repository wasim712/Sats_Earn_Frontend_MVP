import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Bitcoin Basics',
  description: 'Learn the basics of Bitcoin, including its history, how it works, and common terminology in our comprehensive guide.',
  path: '/btc-basics',
});

export default function BtcBasicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
