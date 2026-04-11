'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();
    const handleGoBack = () => {
    // document.referrer holds the exact URL of the page the user came from
    if (document.referrer) {
      // Using window.location.href forces a HARD reload, clearing the stuck spinner!
      window.location.href = document.referrer;
    } else {
      // Safe fallback if they typed the 404 URL directly into a new tab
      router.push('/');
    }
  };
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 relative bg-sats-black-950 overflow-hidden font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-base opacity-20 z-0 pointer-events-none"></div>
      
      {/* Subtle Premium Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 sm:w-150 sm:h-150 bg-sats-orange-500/4 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center text-center max-w-lg animate-in fade-in zoom-in-95 duration-500 mt-[-5vh]">
        
        {/* Brand Logo Display */}
        <div className="relative mb-8">
          {/* Outer glowing rings */}
          <div className="absolute inset-0 bg-sats-orange-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          
          {/* Logo Box */}
          <div className="relative w-28 h-28 bg-sats-black-900 border border-sats-black-700 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)]">
            <Image width="150" height="150" src='/icon.png' alt='LOGO'className=" rounded-3xl ">
          </Image>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 mb-2 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
          Page Not Found on <span className="text-white">Sats<span className="text-sats-orange-500">Earn</span></span>
        </h2>
        
        <p className="text-gray-400 mb-10 leading-relaxed text-sm sm:text-base max-w-[85%] mx-auto">
          The link you followed might be broken, or the page may have been moved. New features and tasks are <span className="text-sats-orange-500 font-semibold">coming soon!</span>
        </p>

        {/* Dynamic Return Button (Goes to previous page) */}
        <button 
          onClick={handleGoBack}
          className="flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-extrabold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-1 active:scale-[0.98]"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

      </div>
    </main>
  );
}