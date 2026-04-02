'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from './Navbar';

export function RouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      {isHome && (
         <header>
            <div className="p-5 text-center  text-gray-500">
            </div>
         </header>
      )}

      {/* FIXED: Only apply max-w-7xl and mx-auto if it is the Home Page! */}
      <main className={`relative z-10 flex min-h-screen w-full flex-col ${isHome ? 'mx-auto max-w-7xl' : ''}`}>
        {children}
      </main>

      {isHome && <Footer />}
    </>
  );
}