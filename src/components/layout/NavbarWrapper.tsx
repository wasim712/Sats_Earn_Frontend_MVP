'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AnnouncementBanner } from '../ui/AnnouncementBanner';

export const NavbarWrapper = () => {
  const pathname = usePathname();

  // Show only on homepage "/"
  if (pathname !== '/') return null;

  return (
  <div className="sticky top-0 z-50">
    <div className="hidden lg:block">
      <AnnouncementBanner />
    </div>
    <Navbar />
    <div className="lg:hidden">
      <AnnouncementBanner />
    </div>
  </div>
   );
};