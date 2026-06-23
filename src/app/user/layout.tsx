'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Home, Target, Lightbulb, Wallet, Bell } from 'lucide-react';

import { UserSidebar } from '@/components/user/UserSidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks'; 
import { logout, hydrateAuthFromStorage } from '@/features/auth/authSlice'; 
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner';
import { useGetUserNotificationsQuery } from '@/store/services/userApi';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';
import type { UserSidebarConfig } from '@/features/admin/adminSettingsSlice';

// ─── Floating Dock Links ────────────────────────────────────────────────────
// You can easily add more links here. The dock will flex and adapt automatically.
const DOCK_LINKS = [
  { key: 'dashboard', label: 'Dashboard', path: '/user/dashboard', icon: Home },
  { key: 'tasks', label: 'Tasks', path: '/user/tasks', icon: Target },
  { key: 'quiz', label: 'Quiz', path: '/user/quiz', icon: Lightbulb },
  { key: 'wallet', label: 'Wallet', path: '/user/wallet', icon: Wallet },
] as const;

const DEFAULT_USER_SIDEBAR_CONFIG: UserSidebarConfig = {
  dashboard: true,
  tasks: true,
  standaloneTasks: true,
  minigames: true,
  bugBounty: true,
  quiz: true,
  referrals: true,
  rewards: true,
  leaderboard: true,
  wallet: true,
  settings: true,
  help: true,
  notifications: true,
  profile: true,
};

const USER_ROUTE_CONFIG: Array<{ key: keyof UserSidebarConfig; prefix: string }> = [
  { key: 'dashboard', prefix: '/user/dashboard' },
  { key: 'tasks', prefix: '/user/tasks' },
  { key: 'minigames', prefix: '/user/minigames' },
  { key: 'bugBounty', prefix: '/user/bug-bounty' },
  { key: 'quiz', prefix: '/user/quiz' },
  { key: 'referrals', prefix: '/user/referrals' },
  { key: 'rewards', prefix: '/user/rewards' },
  { key: 'leaderboard', prefix: '/user/leaderboard' },
  { key: 'wallet', prefix: '/user/wallet' },
  { key: 'settings', prefix: '/user/settings' },
  { key: 'help', prefix: '/user/help' },
  { key: 'notifications', prefix: '/user/notifications' },
  { key: 'profile', prefix: '/user/profile' },
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
  const [sidebarConfig, setSidebarConfig] = useState<UserSidebarConfig>(DEFAULT_USER_SIDEBAR_CONFIG);
  
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const { data: notificationsData } = useGetUserNotificationsQuery();

  const unreadCount = useMemo(() => {
    if (!Array.isArray(notificationsData)) return 0;
    return notificationsData.filter((notification) => !notification.isRead).length;
  }, [notificationsData]);

  const allowedDockLinks = useMemo(
    () => DOCK_LINKS.filter((item) => sidebarConfig[item.key]),
    [sidebarConfig]
  );

  const derivedLevel = useMemo(() => {
    const totalXp = Number(user?.totalXp || 0);
    return Math.max(1, Math.floor(totalXp / 1000) + 1);
  }, [user?.totalXp]);

  // ─── 1. Unified Mount & Resize Handler ───────────────────────────────────
  useEffect(() => {
    setMounted(true);
    dispatch(hydrateAuthFromStorage());
    
    const handleResize = () => {
      // Auto-close the mobile drawer if the screen gets resized to desktop width
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
        if (!token) return;

        const response = await obfuscatedJsonRequest<{ userSidebarConfig?: Partial<UserSidebarConfig> }>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/users/settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSidebarConfig({
          ...DEFAULT_USER_SIDEBAR_CONFIG,
          ...(response.userSidebarConfig || {}),
        });
      } catch {
        setSidebarConfig(DEFAULT_USER_SIDEBAR_CONFIG);
      }
    };

    fetchSidebarConfig();

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'hidden') return;
      fetchSidebarConfig();
    };

    window.addEventListener('focus', handleVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityRefresh);

    return () => {
      window.removeEventListener('focus', handleVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
    };
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
    if (!mounted) return;

    const token = sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
    if (!token && isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, mounted, router]);

  useEffect(() => {
    if (!mounted || !pathname) return;

    const blockedRoute = USER_ROUTE_CONFIG.find((item) => pathname.startsWith(item.prefix) && !sidebarConfig[item.key]);
    if (blockedRoute) {
      router.replace('/user/dashboard');
    }
  }, [mounted, pathname, router, sidebarConfig]);

  // ─── 3. Logout Handler ───────────────────────────────────────────────────
  const handleLogout = () => {
    sessionStorage.removeItem('sats_token');
    localStorage.removeItem('sats_token');
    dispatch(logout()); 
    router.push('/login');
  };

  // ─── 4. Prevent Hydration Errors & Protected Route Flashes ───────────────
  if (!mounted || !isInitialized || (!isAuthenticated && !user)) {
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
    if (path.includes('/standalone-tasks')) return 'Browse Tasks';
    
    // Fallback: Capitalize the last word in the URL
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'SatsEarn';
  };
  return (
    <div className="min-h-screen bg-[#020202] font-sans text-white relative">
      {/* ─── Sidebar ─── */}
      <UserSidebar 
              sidebarConfig={sidebarConfig}
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
        user={user ? { 
          name: user.fullName || user.email || 'User', 
          tier: user.activeTier || 'BASIC', 
          streak: 0,
          level: derivedLevel,
        } : null} 
      />

      {/* ─── Main Viewport (Handles Sidebar Offset) ─── */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} ${isSidebarOpen ? 'pointer-events-none lg:pointer-events-auto' : ''}`}>
        
        {/* ─── Mobile Header ─── */}
        <header className="lg:hidden h-16 border-b border-[#1a1a1a] bg-sats-black-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 w-full min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white bg-[#111] rounded-xl border border-[#1a1a1a] transition-colors active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Dynamic Page Title */}
            <div className="flex items-center justify-items-center grow w-full text-center justify-center min-w-0 px-2">
              <h1 className="font-black tracking-tight text-xl text-white text-center">
                {getPageTitle()}
              </h1>
            </div>

            {sidebarConfig.notifications && (
              <Link
                href="/user/notifications"
                onClick={(e) => handleLinkClick(e, '/user/notifications')}
                aria-label="Open notifications"
                className={`relative shrink-0 rounded-xl border p-2 transition-all duration-300 ${pathname?.startsWith('/user/notifications') ? 'border-sats-orange-500/30 bg-sats-orange-500/10 text-sats-orange-500' : 'border-[#1a1a1a] bg-[#111] text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-sats-black-950 bg-sats-orange-500 px-1 text-[9px] font-black leading-none text-black shadow-[0_0_12px_rgba(249,115,22,0.45)]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
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

          {allowedDockLinks.map((item) => {
            // Highlight if exactly matching OR if viewing a sub-page (like /user/tasks/123)
            let isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
            
            // Special case for Tasks to also highlight on standalone-tasks
            if (item.key === 'tasks' && pathname?.includes('/standalone-tasks')) {
              isActive = true;
            }
            
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

