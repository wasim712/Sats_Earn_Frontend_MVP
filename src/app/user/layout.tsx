'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Home, Target, Lightbulb } from 'lucide-react';

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
      <div className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        
        {/* ─── Mobile Header ─── */}
        <header className="lg:hidden h-16 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white bg-[#111] rounded-xl border border-[#1a1a1a] transition-colors active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <Image 
                width={32} 
                height={32} 
                alt='logo' 
                className="rounded-lg shadow-sm"
                src="/icon.png" 
              />
              <span className="font-bold tracking-tight text-lg text-white">
                Sats<span className="text-sats-orange-500">Earn</span>
              </span>
              <span className="bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Beta
              </span>
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
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center pointer-events-none lg:hidden px-4">
        
        {/* pointer-events-auto ensures you can click the dock, but transparent space around it allows clicking the page */}
        <nav className="pointer-events-auto bg-sats-black-900/90 backdrop-blur-xl border border-[#1a1a1a] rounded-2xl p-1.5 flex items-center justify-center gap-1 shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-w-full overflow-x-auto">
          
          {DOCK_LINKS.map((item) => {
            // Highlight if exactly matching OR if viewing a sub-page (like /user/tasks/123)
            const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}//prevented unnecesarry reloads
                className={`flex flex-col items-center justify-center gap-1 min-w-[4.5rem] px-2 py-2 rounded-xl transition-all duration-300 shrink-0 ${
                  isActive
                    ? 'bg-sats-orange-500/10 text-sats-orange-500'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <item.icon className="w-[22px] h-[22px]" />
                </div>
                {/* Text explicitly placed under the icon, tiny and highly readable */}
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-sats-orange-500' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Vertical Divider Line */}
          <div className="w-px h-8 bg-[#2a2a2a] mx-1 shrink-0" />

          {/* Open Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-1 min-w-[4.5rem] px-2 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5.5 h-[22px]" />
            <span className="text-[10px] font-bold tracking-wide">Menu</span>
          </button>
          
        </nav>
      </div>

    </div>
  );
}
