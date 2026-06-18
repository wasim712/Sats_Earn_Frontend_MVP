'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { FloatingSupportButton } from '@/components/ui/FloatingSupportButton';

export function RouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const showPublicFooter = !pathname.startsWith('/admin') && !pathname.startsWith('/user');

  return (
    <>
      {isHome && (
         <header>
            <div className="p-5 text-center  text-gray-500">
            </div>
         </header>
      )}

      {/* Apply max-w-7xl and mx-auto to all pages except Home, which has its own full-width sections */}
      <main className={`relative z-10 flex min-h-screen w-full flex-col overflow-x-hidden ${!isHome ? 'mx-auto max-w-7xl' : ''}`}>
        {children}
      </main>

      {showPublicFooter && (
        <>
          <Footer />
          <FloatingSupportButton />
        </>
      )}
    </>
  );
}
