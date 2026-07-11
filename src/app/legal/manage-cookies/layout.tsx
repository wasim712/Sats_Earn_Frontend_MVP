import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Manage Cookies',
  description: 'Control your cookie preferences on SatsEarn at any time.',
  path: '/legal/manage-cookies',
});

export default function ManageCookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
