'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button'; 
import { StaggerReveal } from '../animations/StaggerReveal';
import { MobileSidebar } from './MobileSidebar';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Updated to use Anchor Links that target the IDs on your home page components
  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Ways to Earn', href: '/#ways-to-earn' },
    { name: 'For Brands', href: '/#brands' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-sats-black-800 bg-sats-black-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <StaggerReveal className="flex h-20 items-center justify-between">
            
            {/* Logo Section (Clicking this naturally routes to "/" which takes them to the top) */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sats-black-900 shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-sats-orange-500/30 overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/icon.png" alt="SatsEarn Logo" className="h-full w-full object-cover" width={100} height={100} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Sats</span>
                <span className="text-sats-orange-500">Earn</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-bold text-gray-300 transition-all duration-200 hover:text-sats-orange-500 hover:-translate-y-0.5"
                >
                  {link.name}
                </Link>
              ))}
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

// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Menu } from 'lucide-react';
// import { Button } from '../ui/Button'; 
// import { StaggerReveal } from '../animations/StaggerReveal';
// import { MobileSidebar } from './MobileSidebar';

// export const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Updated to use Anchor Links that target the IDs on your home page components
//   const navLinks = [
//     { name: 'Features', href: '/#features' },
//     { name: 'How It Works', href: '/#how-it-works' },
//     { name: 'Ways to Earn', href: '/#ways-to-earn' },
//     { name: 'For Brands', href: '/#brands' },
//     { name: 'FAQ', href: '/#faq' },
//   ];

//   return (
//     <>
//       {/* FLOATING NAVBAR WRAPPER: 
//         top-4 detaches it from the ceiling. 
//         inset-x-0 and mx-auto center it. 
//       */}
//       <header className="fixed top-4 inset-x-0 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-none">
        
//         {/* THE PILL: 
//           rounded-3xl gives the pill shape. 
//           backdrop-blur-xl and shadow create the floating glassmorphism effect.
//           pointer-events-auto re-enables clicking inside the pill.
//         */}
//         <div className="pointer-events-auto bg-sats-black-950/70 backdrop-blur-xl border border-sats-black-800 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
//           <StaggerReveal className="flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            
//             {/* Logo Section */}
//             <Link href="/" className="flex items-center gap-3 cursor-pointer group">
//               <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-sats-black-900 shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-sats-orange-500/30 overflow-hidden transition-transform group-hover:scale-105">
//                 <Image src="/icon.png" alt="SatsEarn Logo" className="h-full w-full object-cover" width={100} height={100} />
//               </div>
//               <span className="text-xl md:text-2xl font-bold tracking-tight">
//                 <span className="text-white">Sats</span>
//                 <span className="text-sats-orange-500">Earn</span>
//               </span>
//             </Link>

//             {/* Desktop Navigation Links (Inner Pill Design) */}
//             <nav className="hidden lg:flex items-center gap-1 bg-sats-black-900/40 p-1.5 rounded-full border border-sats-black-800/50">
//               {navLinks.map((link) => (
//                 <Link 
//                   key={link.name} 
//                   href={link.href} 
//                   className="text-sm font-bold text-gray-300 px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-sats-black-800 hover:shadow-sm"
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </nav>

//             {/* Desktop Auth State */}
//             <div className="hidden lg:flex items-center gap-3">
//               <Link href="/login">
//                 {/* Notice the extra className passing to standard Button to force rounded-full if your UI lib allows it */}
//                 <Button variant="ghost" size="sm" className="rounded-full hover:bg-sats-black-800">
//                   Log in
//                 </Button>
//               </Link>
//               <Link href="/signup">
//                 <Button variant="primary" size="sm" className="rounded-full shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all">
//                   Start Earning
//                 </Button>
//               </Link>
//             </div>

//             {/* Mobile Menu Toggle Button */}
//             <div className="lg:hidden flex items-center">
//               <button 
//                 onClick={() => setIsMobileMenuOpen(true)}
//                 className="text-gray-300 hover:text-sats-orange-500 p-2 bg-sats-black-900/50 border border-sats-black-800 rounded-full transition-colors cursor-pointer"
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             </div>

//           </StaggerReveal>
//         </div>
//       </header>

//       {/* Mobile Sidebar automatically inherits the new links and handles the routing */}
//       <MobileSidebar 
//         isOpen={isMobileMenuOpen} 
//         onClose={() => setIsMobileMenuOpen(false)} 
//         navLinks={navLinks} 
//       />
//     </>
//   );
// };