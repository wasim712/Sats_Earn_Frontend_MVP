import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'For Brands & Advertisers',
  description: 'Reach Bitcoin users who actually engage. Advertise your product on SatsEarn and pay for verified actions.',
  path: '/brands',
});

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}