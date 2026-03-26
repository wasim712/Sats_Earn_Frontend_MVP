'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Next.js specific routing
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button'; 
import { StaggerReveal } from '../animations/StaggerReveal';
import { MobileSidebar } from './MobileSidebar';
import Image from 'next/image';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Replaced "Dashboard" with "Home" pointing to "/"
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Tasks', href: '/ways-to-earn' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-sats-black-800 bg-sats-black-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <StaggerReveal className="flex h-20 items-center justify-between">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sats-black-900 shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-sats-orange-500/30 overflow-hidden transition-transform group-hover:scale-105">
                <img src="/icon.png" alt="SatsEarn Logo" className="h-full w-full object-cover" />
                
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Sats</span>
                <span className="text-sats-orange-500">Earn</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-base font-semibold text-gray-100 transition-all duration-200 hover:text-sats-orange-500 hover:-translate-y-0.5"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth State (Logged Out Default) */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
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

      {/* Render the Sidebar component we created */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navLinks={navLinks} 
      />
    </>
  );
};