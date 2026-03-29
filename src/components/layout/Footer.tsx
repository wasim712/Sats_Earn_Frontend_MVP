import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- DATA CONFIGURATION ---
const FOOTER_LINKS = {
  Earn: [
    { name: 'Social Tasks', href: '#' },
    { name: 'Surveys', href: '#' },
    { name: 'Offerwalls', href: '#' },
    { name: 'Referral Program', href: '#' },
    { name: 'Leaderboard', href: '#' },
  ],
  Company: [
    { name: 'About Us', href: '#' },
    { name: 'For Brands', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  Legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Anti-Fraud Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const SOCIAL_LINKS = [
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com/satsearn',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-gray-400 transition-all duration-300 hover:fill-white hover:scale-110 hover:drop-shadow-[0_0_8px_white]"
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
        className="w-5 h-5 fill-gray-400 transition-all duration-300 hover:fill-blue-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#3b82f6]"
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
        className="w-5 h-5 fill-gray-400 transition-all duration-300 hover:fill-red-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#ef4444]"
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
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-gray-400 transition-all duration-300 hover:fill-blue-500 hover:scale-110 hover:drop-shadow-[0_0_10px_#3b82f6]"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0l-3.81 2.4c-.53.35-1.01.52-1.47.51-.51-.01-1.49-.29-2.22-.53-.89-.29-1.6-.44-1.54-.93.03-.26.39-.53 1.07-.81 4.2-1.82 7-3.03 8.39-3.61 3.98-1.66 4.81-1.95 5.35-1.96.12 0 .39.03.55.16.14.11.18.26.19.37.01.08.01.23 0 .33z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <div className="group">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-gray-400 transition-all duration-500 group-hover:fill-[#E1306C] group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_#E1306C]"
          aria-hidden="true"
        >
          {/* FIXED: The full Instagram SVG Path */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </svg>
      </div>
    ),
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // FIXED: Added w-full to ensure it spans the whole page
    <footer className="relative w-full bg-sats-black-950 border-t border-sats-black-800 pt-20 pb-10 overflow-hidden z-20">
      
      {/* Container keeps content centered and max-width restricted */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Flex layout that changes to row on desktop */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand Info */}
          <div className="lg:w-2/5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sats-black-900 border border-sats-orange-500/30 overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/icon.png" alt="SatsEarn Logo" className="h-full w-full object-cover" width={100} height={100} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Sats</span>
                <span className="text-sats-orange-500">Earn</span>
              </span>
            </Link>
            
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              The premium gamified platform to earn Bitcoin. Complete tasks, level up your tier, and withdraw instantly via the Lightning Network.
            </p>
          </div>

          {/* Columns 2+: The Links (Responsive Grid) */}
          {/* Mobile: 2 columns | Tablet/Desktop: 3 columns */}
          <div className="lg:w-3/5 grid grid-cols-2 sm:grid-cols-3  gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className="flex flex-col">
                <h4 className="text-white font-bold text-lg mb-6 tracking-wide">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-sats-orange-500 font-medium transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        <div className="pt-8 border-t border-sats-black-800 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <p className="text-gray-500 text-sm font-medium text-center md:text-left">
            © {currentYear} SatsEarn. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a 
                key={social.name} 
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-gray-500 transition-colors duration-300 transform"
              >
                {social.icon}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};