'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Home, Target, Lightbulb, FileCheck2, Wallet } from 'lucide-react';

import { UserSidebar } from '@/components/user/UserSidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks'; 
import { logout } from '@/features/auth/authSlice'; 
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner';

// ─── Floating Dock Links ────────────────────────────────────────────────────
// You can easily add more links here. The dock will flex and adapt automatically.
const DOCK_LINKS = [
  { label: 'Dashboard', path: '/user/dashboard', icon: Home },
  { label: 'Tasks', path: '/user/tasks', icon: Target }, 
  { label: 'Quiz', path: '/user/quiz', icon: Lightbulb },
  { label: 'Wallet', path: '/user/withdraw', icon: Wallet },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  // 🚨 UI Defaults: 
  // isSidebarOpen (Mobile Drawer) = closed by default
  // isCollapsed (Desktop Sidebar) = open (false) by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [mounted, setMounted] = useState(false);
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // ─── 1. Unified Mount & Resize Handler ───────────────────────────────────
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      // Auto-close the mobile drawer if the screen gets resized to desktop width
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isSidebarOpen]);

  // ─── 2. Auth Guard ───────────────────────────────────────────────────────
  useEffect(() => {
    if (mounted && isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, mounted, router]);

  // ─── 3. Logout Handler ───────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem('sats_token');
    localStorage.removeItem('sats_token');
    dispatch(logout()); 
    router.push('/login');
  };

  // ─── 4. Prevent Hydration Errors & Protected Route Flashes ───────────────
  if (!mounted || (!isAuthenticated && !user)) {
    return null; 
  }
    // ─── CLICK HANDLER: PREVENT REDUNDANT NAVIGATION ───
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      // If we are already on this page, strictly prevent Next.js from routing.
      // This stops the page from re-rendering and stops the useEffect from fetching again!
      e.preventDefault(); 
      
    }
  };
  // ─── DYNAMIC PAGE TITLE FORMATTER ───
  const getPageTitle = () => {
    const path = pathname || '';
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/tasks')) return 'Browse Tasks';
    if (path.includes('/submissions')) return 'Your Submissions';
    if (path.includes('/quiz')) return 'Daily Quiz';
    if (path.includes('/wallet')) return 'Withdraw Funds';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/referrals')) return 'Referrals';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/help')) return 'Help Center';
    if (path.includes('/blogs')) return 'Blogs';
    if (path.includes('/profile')) return 'User Profile';
    
    // Fallback: Capitalize the last word in the URL
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'SatsEarn';
  };
  return (
    <div className="min-h-screen bg-[#020202] font-sans text-white relative">
      {/* ─── Sidebar ─── */}
      <UserSidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
        user={user ? { 
          name: user.fullName || user.email || 'User', 
          tier: user.activeTier || 'BASIC', 
          streak: 0 
        } : null} 
      />

      {/* ─── Main Viewport (Handles Sidebar Offset) ─── */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} ${isSidebarOpen ? 'pointer-events-none lg:pointer-events-auto' : ''}`}>
        
        {/* ─── Mobile Header ─── */}
        <header className="lg:hidden h-16 border-b border-[#1a1a1a] bg-sats-black-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white bg-[#111] rounded-xl border border-[#1a1a1a] transition-colors active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Dynamic Page Title */}
            <div className="flex items-center justify-items-center grow w-full text-center justify-center pr-15">
              <h1 className="font-black tracking-tight text-xl text-white text-center">
                {getPageTitle()}
              </h1>
            </div>
          </div>
        </header>

          <AnnouncementBanner/>
        {/* ─── Main Content Area ─── */}
        {/* Note: pb-28 creates space for the dock on mobile, lg:pb-0 removes it on desktop where the dock is hidden */}
        <main className="flex-1 w-full flex flex-col relative overflow-x-hidden pb-28 lg:pb-0">

            {children}
          
        </main>
        
      </div>
{/* //*****************************************************************  */}
      {/* ─── Floating Bottom Navigation Dock (Mobile & Tablet Only) ─── */}
      <div className="fixed inset-x-0 bottom-3 z-40 flex justify-center pointer-events-none lg:hidden px-2.5 sm:px-4">
        
        {/* pointer-events-auto ensures you can click the dock, but transparent space around it allows clicking the page */}
        <nav className="pointer-events-auto grid w-full max-w-[392px] grid-cols-5 gap-1 rounded-[22px] border border-[#1a1a1a] bg-sats-black-900/95 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {/* Open Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-gray-500 transition-all hover:bg-white/5 hover:text-white"
            title="Open Menu"
          >
            <Menu className="h-5 w-5 shrink-0" />
            <span className="text-[9px] font-bold leading-none tracking-[0.02em] sm:text-[10px]">Menu</span>
          </button>

          {DOCK_LINKS.map((item) => {
            // Highlight if exactly matching OR if viewing a sub-page (like /user/tasks/123)
            const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}//prevented unnecesarry reloads
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-sats-orange-500/10 text-sats-orange-500'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <item.icon className="h-5 w-5 shrink-0" />
                </div>
                {/* Text explicitly placed under the icon, tiny and highly readable */}
                <span className={`truncate text-[9px] font-bold leading-none tracking-[0.02em] sm:text-[10px] ${isActive ? 'text-sats-orange-500' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}


          
        </nav>
      </div>

    </div>
  );
}

