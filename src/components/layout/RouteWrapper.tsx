'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';

export function RouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only true if the URL is EXACTLY localhost:3000/
  const isHome = pathname === '/';

  return (
    <>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        {children}
      </main>

      {isHome && <Footer />}
    </>
  );
}