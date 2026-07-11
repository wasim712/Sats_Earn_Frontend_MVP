import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'How It Works',
  description: 'Discover how you can earn Bitcoin rewards on SatsEarn by completing tasks, surveys, and offers. No purchase required.',
  path: '/how-it-works',
});

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
