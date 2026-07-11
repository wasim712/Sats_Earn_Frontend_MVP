import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Learn how SatsEarn collects, uses, and protects your data. We respect your privacy and only collect what is needed.',
  path: '/legal/privacy',
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
