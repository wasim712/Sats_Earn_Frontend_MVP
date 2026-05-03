'use client'; // Error boundaries must be Client Components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Import this
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  
  // Dynamically determine the dashboard URL based on where the app crashed
  const isAdminArea = pathname?.startsWith('/admin');
  const dashboardUrl = isAdminArea ? '/admin/dashboard' : '/user/dashboard';
  
  // Log the error to an error reporting service (like Sentry) in production
  useEffect(() => {
    console.error('Application Error Caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 relative bg-sats-black-950 overflow-hidden font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-base opacity-20 z-0 pointer-events-none"></div>
      
      {/* Subtle Red/Orange Glow Effect for Error state */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-red-500/[0.03] rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center text-center max-w-lg animate-in fade-in zoom-in-95 duration-500 mt-[-5vh]">
        
        {/* Warning Icon Display */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          
          <div className="relative w-28 h-28 bg-sats-black-900 border border-red-500/20 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            <AlertTriangle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500 mb-4 tracking-tight">
          System Glitch
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed text-sm sm:text-base max-w-[90%] mx-auto">
          We encountered an unexpected error while loading this data. Our lightning nodes might be experiencing a tiny hiccup. 
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* The Magic Reset Button */}
          <button 
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-1 active:scale-[0.98]"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>

          {/* Dynamic Fallback to Home */}
          <Link 
            href={dashboardUrl}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-sats-black-900 hover:bg-sats-black-800 border border-sats-black-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
          >
            <Home className="w-5 h-5 text-gray-400" />
            {isAdminArea ? 'Admin Dashboard' : 'Dashboard'}
          </Link>
          
        </div>
      </div>
    </main>
  );
}