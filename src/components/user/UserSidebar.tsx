'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ListChecks, Users, Trophy, Wallet, 
  Bell, Settings, LogOut, X, PanelLeftClose, PanelLeftOpen,
  Lightbulb, Bug,
  Medal,
  BookOpen,
  CircleHelp
} from 'lucide-react';
import Image from 'next/image';
import { useGetUserNotificationsQuery } from '@/store/services/userApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserSidebarProps {
  isOpen: boolean;           
  isCollapsed: boolean;      
  onClose: () => void;       
  onToggleCollapse: () => void; 
  onLogout: () => void;
  user: {
    name: string;
    tier: string;
    streak: number;
  } | null;
}

interface NotificationItem {
  isRead?: boolean;
}

function isNotificationArray(value: unknown): value is NotificationItem[] {
  return Array.isArray(value);
}

function normalizeNotificationsResponse(data: unknown): NotificationItem[] {
  if (isNotificationArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    const payload = data as { notifications?: unknown; data?: unknown; items?: unknown; results?: unknown };

    if (isNotificationArray(payload.notifications)) {
      return payload.notifications;
    }

    if (isNotificationArray(payload.data)) {
      return payload.data;
    }

    if (isNotificationArray(payload.items)) {
      return payload.items;
    }

    if (isNotificationArray(payload.results)) {
      return payload.results;
    }

    if (payload.data && typeof payload.data === 'object') {
      const nested = payload.data as { notifications?: unknown; items?: unknown; results?: unknown; data?: unknown };

      if (isNotificationArray(nested.notifications)) return nested.notifications;
      if (isNotificationArray(nested.items)) return nested.items;
      if (isNotificationArray(nested.results)) return nested.results;
      if (isNotificationArray(nested.data)) return nested.data;
    }
  }

  return [];
}

export const UserSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, onLogout, user }: UserSidebarProps) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: notificationsData, refetch } = useGetUserNotificationsQuery();

  // --- FETCH UNREAD ALERTS ---
  const fetchUnreadCount = async () => {
    try {
      const notifications = isNotificationArray(notificationsData)
        ? notificationsData
        : normalizeNotificationsResponse(notificationsData);
      const unread = notifications.filter((notification) => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch sidebar notifications count", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every 60s
    
    // Listen for custom event from the notifications page to clear badge instantly
    const handleInstantUpdate = () => {
      refetch();
      fetchUnreadCount();
    };
    window.addEventListener('user-notifications-updated', handleInstantUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('user-notifications-updated', handleInstantUpdate);
    };
  }, [notificationsData, refetch]);

  const navLinks = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', href: '/user/notifications', icon: Bell, count: unreadCount }, // <-- NEW
    { name: 'Browse Tasks', href: '/user/tasks', icon: ListChecks },
    { name: 'Bug Bounty', href: '/user/bug-bounty', icon: Bug },
    { name: 'Daily Quiz', href: '/user/quiz', icon: Lightbulb },
    { name: 'Referrals', href: '/user/referrals', icon: Users },
    { name: 'Rewards', href: '/user/rewards', icon: Medal },
    // { name: 'Blogs', href: '/user/blogs', icon: BookOpen },
    { name: 'Help', href: '/user/help', icon: CircleHelp },
    { name: 'Leaderboard', href: '/user/leaderboard', icon: Trophy },
    { name: 'Withdraw', href: '/user/wallet', icon: Wallet },
    { name: 'Settings', href: '/user/settings', icon: Settings },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'SE';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const generateHandle = (name?: string) => {
    if (!name) return '@earner';
    return '@' + name.replace(/\s+/g, '').toLowerCase();
  };

  // ─── CLICK HANDLER: PREVENT REDUNDANT NAVIGATION ───
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Always close the mobile drawer when any link is clicked
      if (window.innerWidth < 1024 && isOpen) {
        onClose();
      }
    if (pathname === href) {
      // If we are already on this page, strictly prevent Next.js from routing.
      // This stops the page from re-rendering and stops the useEffect from fetching again!
      e.preventDefault(); 
    }
  };
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      <aside 
        className={`group/sidebar fixed top-0 left-0 h-screen bg-sats-black-950 border-r border-sats-black-800 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-[5px_0_30px_rgba(0,0,0,0.5)] 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        ${isCollapsed ? 'w-20' : 'w-[280px]'}`}
      >
        {/* HEADER SECTION */}
        <div className={`h-24 flex items-center bg-sats-black-950 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3">
             <button 
               onClick={onToggleCollapse}
               title={isCollapsed ? "Expand Sidebar" : "SatsEarn"}
               className="relative flex items-center justify-center transition-transform active:scale-95"
             >
                <Image 
                  width={36} 
                  height={36} 
                  alt='logo' 
                  className={`rounded-xl transition-all duration-300 ${isCollapsed ? 'opacity-100 group-hover/sidebar:opacity-0 group-hover/sidebar:scale-50' : 'opacity-100'}`}
                  src="/icon.png" 
                />
                {isCollapsed && (
                  <PanelLeftOpen className="absolute inset-0 m-auto w-6 h-6 text-sats-orange-500 opacity-0 scale-50 group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-all duration-300" />
                )}
             </button>

             {!isCollapsed && (
               <div className="flex items-center gap-2 overflow-hidden">
                 <span className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                   Sats<span className="text-sats-orange-500">Earn</span>
                 </span>
                 <span className="bg-sats-orange-500/20 text-sats-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                   Beta
                 </span>
               </div>
             )}
          </div>
          
          {!isCollapsed && (
            <button onClick={onToggleCollapse} className="hidden lg:flex p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-sats-black-800 transition-colors">
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-white rounded-full hover:bg-sats-black-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 py-2 px-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)} 
                title={isCollapsed ? link.name : ""}
                className={`group flex items-center justify-between py-3.5 rounded-2xl font-semibold transition-all duration-300 relative ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? 'bg-[#1c140a] border border-sats-orange-500/20 text-white shadow-inner' 
                    : 'text-gray-300 border border-transparent hover:text-white hover:bg-sats-black-900'
                }`}
              >
                <div className="flex items-center gap-4 relative">
                  <Icon className={`w-5 h-5 min-w-[20px] transition-colors duration-300 ${isActive ? 'text-sats-orange-500' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  
                  {/* Badge for Collapsed State */}
                  {isCollapsed && link.count !== undefined && link.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-sats-orange-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-sats-black-950">
                      {link.count > 9 ? '9+' : link.count}
                    </span>
                  )}

                  {!isCollapsed && (
                    <span className="whitespace-nowrap tracking-wide text-[15px]">
                      {link.name}
                    </span>
                  )}
                </div>

                {/* Badge for Expanded State */}
                {!isCollapsed && link.count !== undefined && link.count > 0 && (
                  <span className="bg-sats-orange-500 text-black text-xs font-black px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                    {link.count > 99 ? '99+' : link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}  
        <div className="p-4 border-t border-sats-black-800 bg-sats-black-950 flex flex-col gap-4">
          <Link href="/user/profile">
          <div className={`flex items-center gap-3 p-3 bg-[#121212] rounded-[20px] border border-sats-black-800 ${isCollapsed ? 'justify-center' : ''}`} onClick={(e)=>{  if (window.innerWidth < 1024 && isOpen) {
        onClose();
      }
          if (pathname === '/user/profile') {
      // If we are already on this page, strictly prevent Next.js from routing.
      // This stops the page from re-rendering and stops the useEffect from fetching again!
      e.preventDefault(); 
    }
      }}>
            <div className="w-10 h-10 rounded-full bg-sats-orange-500 flex items-center justify-center text-black font-extrabold text-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {generateHandle(user?.name)}
                </p>
                <p className="text-[11px] font-medium text-gray-400 capitalize mt-0.5">
                  {user?.tier ? user.tier.toLowerCase() : 'Basic'} Tier
                </p>
              </div>
            )}
          </div>
          </Link>

          <button 
            onClick={onLogout} 
            title={isCollapsed ? "Log out" : ""}
            className={`flex items-center gap-3 text-gray-400 bg-sats-black-900 hover:bg-[#2d0a0a] transition-all duration-300 font-semibold text-sm px-2 pb-4 pt-4 rounded-3xl ${isCollapsed ? 'justify-center' : 'justify-center'} hover:border-red-600 border border-transparent`}
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};



