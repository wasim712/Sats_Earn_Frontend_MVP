'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button'; 
import { StaggerReveal } from '../animations/StaggerReveal';
import { MobileSidebar } from './MobileSidebar';
import { LogoText } from '../ui/LogoText';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Updated to use Anchor Links that target the IDs on your home page components
  const navLinks = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Rewards', href: '/rewards' },
    { name: 'Withdrawals', href: '/withdrawals' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <header className="w-full border-b border-sats-black-800 bg-sats-black-950/80 backdrop-blur-md">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="flex h-15 sm:h-20 items-center justify-between">
            
            {/* Logo Section (Clicking this naturally routes to "/" which takes them to the top) */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sats-black-900 shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-sats-orange-500/30 overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/icon.png" alt="SatsEarn Logo" className="h-full w-full object-cover" width={100} height={100} />
              </div>
              <LogoText className="text-2xl font-extrabold tracking-tight"/>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href + '/'));
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive ? 'text-sats-orange-500' : 'text-gray-300 hover:text-sats-orange-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth State */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                {/* Changed text from "Sign up" to "Start Earning" */}
                <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  Start Earning
                </Button> 
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-100 hover:text-sats-orange-500 p-2 transition-colors cursor-pointer"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>

          </StaggerReveal>
        </div>
      </header>

      {/* Mobile Sidebar automatically inherits the new links and handles the routing */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navLinks={navLinks} 
      />
    </>
  );
};
