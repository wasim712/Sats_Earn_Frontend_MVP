'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

export const NavbarWrapper = () => {
  const pathname = usePathname();

  // Show only on homepage "/"
  if (pathname !== '/') return null;

  return <Navbar />;
};