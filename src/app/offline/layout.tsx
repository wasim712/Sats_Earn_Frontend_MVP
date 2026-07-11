import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Offline',
  description: 'You are currently offline.',
  path: '/offline',
});

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
