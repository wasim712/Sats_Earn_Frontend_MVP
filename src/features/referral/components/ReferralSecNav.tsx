'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const ReferralSecNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Add background shadow and border when scrolled past hero
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 120; // 120px offset for the sticky navs
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className={`sticky  z-[900] w-full transition-all duration-300 ${isScrolled ? 'bg-sats-black-900/70 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-center gap-4 py-3">
        <nav className=" flex items-center gap-4 sm:gap-6">
          {[
            { id: 'calculator', label: 'Calculator' },
            { id: 'tiers', label: 'Tiers' },
            { id: 'network', label: 'How it flows' },
            { id: 'share', label: 'Share' },
            { id: 'faq', label: 'FAQ' }
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className="text-sm font-bold text-gray-400 hover:text-sats-orange-500 whitespace-nowrap transition-all duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-4 left-0 w-full h-[2px] bg-sats-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          ))}
          <Link 
          href="/signup"
          className="bg-sats-orange-500 text-black font-bold text-[13px] px-5 py-2 rounded-[9px] whitespace-nowrap transition-all hover:bg-sats-orange-400 hover:-translate-y-px hidden sm:inline-block shrink-0 shadow-[0_4px_15px_rgba(249,115,22,0.2)]"
        >
          Get your link ⚡
        </Link>
        </nav>
      </div>
    </div>
  );
};
