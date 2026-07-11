import { createPageMetadata } from '@/lib/seo';
import UserClientLayout from './UserClientLayout';

export const metadata = createPageMetadata({
  title: 'User Dashboard',
  description: 'SatsEarn User Dashboard',
  noindex: true,
  path: '/user',
});

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserClientLayout>{children}</UserClientLayout>;
}
