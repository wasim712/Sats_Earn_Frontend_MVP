'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, navLinks }) => {
  // Lock the background scroll when the sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* 1. The Blurred Overlay Backdrop */}
      <div 
        className={`fixed inset-0 z-60 bg-sats-black-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. The Sliding Sidebar */}
      <aside 
        className={`fixed top-0 right-0 z-70 h-screen w-70 bg-sats-black-950 border-l border-sats-black-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-sats-black-800">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Sats</span>
            <span className="text-sats-orange-500">Earn</span>
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-sats-orange-500 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-6 py-8 space-y-6 grow">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={onClose}
              className="text-lg font-bold text-gray-100 hover:text-sats-orange-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons (Footer of Sidebar) */}
        <div className="p-6 border-t border-sats-black-800 flex flex-col gap-4 bg-sats-black-900/50">
          <Link href="/login" onClick={onClose} className="w-full">
            <Button variant="ghost" className="w-full text-base py-3 border border-sats-black-700">
              Log in
            </Button>
          </Link>
          <Link href="/signup" onClick={onClose} className="w-full">
            <Button variant="primary" className="w-full text-base py-3">
              Sign up
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
};