import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Questions, feedback, or support — we read and respond to every message. Reach out to the SatsEarn team.',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
