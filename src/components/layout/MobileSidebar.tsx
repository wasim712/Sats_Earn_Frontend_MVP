  'use client';

  import React, { useEffect } from 'react';
  import Link from 'next/link';
  import Image from 'next/image';
  import { usePathname } from 'next/navigation';
  import { X } from 'lucide-react';
  import { Button } from '../ui/Button';

  // ─── Social Links ─────────────────────────────────────────────────────────────

  const SOCIAL_LINKS = [
    {
      name: 'X (Twitter)',
      href: 'https://x.com/satsearn',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-gray-500 transition-all duration-300 hover:fill-white hover:scale-110 hover:drop-shadow-[0_0_8px_white]"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/satsearn',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-gray-500 transition-all duration-300 hover:fill-blue-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#3b82f6]"
          aria-hidden="true"
        >
          <path d="M4.98 3.5C4.98 5 3.88 6 2.5 6S0 5 0 3.5 1.1 1 2.48 1 4.98 2 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-.9 1.7-2.2 3.6-2.2 3.9 0 4.6 2.5 4.6 5.8V24h-4v-8.5c0-2-.1-4.5-2.8-4.5-2.8 0-3.2 2.2-3.2 4.3V24h-4V8z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@satsearnapp',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-gray-500 transition-all duration-300 hover:fill-red-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#ef4444]"
          aria-hidden="true"
        >
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: 'https://t.me/satsearnapp',
      icon: (
        <Image
          src="/telelogo.svg"
          height={22}
          width={22}
          alt="Telegram logo"
          className="grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300"
        />
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/satsearn.app/',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-gray-500 transition-all duration-500 hover:fill-[#E1306C] hover:scale-110 hover:drop-shadow-[0_0_12px_#E1306C]"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </svg>
      ),
    },
    {
        name: 'Discord',
        href: 'https://discord.gg/VX4cB2xTnZ',
        icon: (
          <Image src="./Discord_purple.svg" height={22} width={22} alt='discord logo' className='w-[22px] h-[22px] grayscale-100 hover:grayscale-0 hover:scale-110 duration-500 transition-all'>
    
          </Image>
        ),
      },
  ];

  // ─── Props ────────────────────────────────────────────────────────────────────

  interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navLinks: { name: string; href: string }[];
  }

  // ─── Component ────────────────────────────────────────────────────────────────

  export const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    onClose,
    navLinks,
  }) => {
    const pathname = usePathname();

    // Lock background scroll and add class when open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.classList.add('mobile-sidebar-open');
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('mobile-sidebar-open');
      }
      return () => { 
        document.body.style.overflow = ''; 
        document.documentElement.style.overflow = '';
        document.body.classList.remove('mobile-sidebar-open');
      };
    }, [isOpen]);

    return (
      <>
        {/* ── Backdrop ── */}
        <div
          className={`fixed inset-0 z-[1600] bg-sats-black-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden touch-none cursor-pointer ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* ── Sliding panel ── */}
        <aside
          className={`
            fixed top-0 right-0 z-[1610] h-dvh w-72
            bg-sats-black-950 border-l border-sats-black-800
            shadow-2xl flex flex-col overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            lg:hidden
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sats-black-800 shrink-0">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Sats</span>
              <span className="text-sats-orange-500">Earn</span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-gray-400 hover:text-sats-orange-500 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* ── Nav links ── */}
          <nav className="flex flex-col px-6 pt-8 pb-4 space-y-6 grow">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href + '/'));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`text-lg font-bold transition-colors ${
                    isActive ? 'text-sats-orange-500' : 'text-gray-100 hover:text-sats-orange-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Social links ── */}
          <div className="px-6 py-5 border-t border-sats-black-800/60 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4">
              Follow Us
            </p>
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center justify-center transition-transform duration-200 active:scale-90"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Auth buttons ── */}
          <div className="px-6 py-5 border-t border-sats-black-800 flex flex-col gap-3 bg-sats-black-900/50 shrink-0">
            <Link href="/login" onClick={onClose} className="w-full">
              <Button
                variant="ghost"
                className="w-full text-base py-3 border border-sats-black-700"
              >
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