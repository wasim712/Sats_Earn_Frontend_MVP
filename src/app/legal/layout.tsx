import { createPageMetadata } from '@/lib/seo';
import LegalClientLayout from './LegalClientLayout';

export const metadata = createPageMetadata({
  title: 'Legal & Policies',
  description: 'SatsEarn is committed to operating openly and honestly. Read our terms, privacy policy, and other legal documents.',
  path: '/legal',
});

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LegalClientLayout>{children}</LegalClientLayout>;
}
