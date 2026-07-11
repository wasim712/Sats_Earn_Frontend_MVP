import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Founder Tier',
  description: 'Become a Founder Tier member and get the highest rewards, lowest withdrawal limits, and exclusive perks on SatsEarn.',
  path: '/founders',
});

export default function FoundersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
