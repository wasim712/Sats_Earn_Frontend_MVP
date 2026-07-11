import { createPageMetadata } from '@/lib/seo';
import AdminClientLayout from './AdminClientLayout';

export const metadata = createPageMetadata({
  title: 'Admin Dashboard',
  description: 'SatsEarn Admin Dashboard',
  noindex: true,
  path: '/admin',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
