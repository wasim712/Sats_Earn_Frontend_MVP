'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ListChecks,
  CheckSquare,
  Users,
  Trophy,
  Wallet,
  Bell,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Lightbulb,
  Bug,
  Medal,
  CircleHelp,
  Gamepad2,
  Star,
  Shield,
  Crown,
  Gem,
  Zap,
  TrendingUp,
  Coins,
  CircleStar,
  Sparkles,
  Rocket,
} from 'lucide-react';
import Image from 'next/image';
import { useGetUserNotificationsQuery } from '@/store/services/userApi';

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
    level?: number;
  } | null;
}

interface NotificationItem {
  isRead?: boolean;
}

function isNotificationArray(value: unknown): value is NotificationItem[] {
  return Array.isArray(value);
}

function normalizeNotificationsResponse(data: unknown): NotificationItem[] {
  if (isNotificationArray(data)) return data;

  if (data && typeof data === 'object') {
    const payload = data as {
      notifications?: unknown;
      data?: unknown;
      items?: unknown;
      results?: unknown;
    };

    if (isNotificationArray(payload.notifications)) return payload.notifications;
    if (isNotificationArray(payload.data)) return payload.data;
    if (isNotificationArray(payload.items)) return payload.items;
    if (isNotificationArray(payload.results)) return payload.results;

    if (payload.data && typeof payload.data === 'object') {
      const nested = payload.data as {
        notifications?: unknown;
        items?: unknown;
        results?: unknown;
        data?: unknown;
      };

      if (isNotificationArray(nested.notifications)) return nested.notifications;
      if (isNotificationArray(nested.items)) return nested.items;
      if (isNotificationArray(nested.results)) return nested.results;
      if (isNotificationArray(nested.data)) return nested.data;
    }
  }

  return [];
}

function getTierMeta(tier?: string) {
  const normalizedTier = (tier || 'BASIC').toUpperCase();

  switch (normalizedTier) {
    case 'BASIC':
      return {
        icon: <Shield className="h-3.5 w-3.5 text-gray-400" />,
        textClass: 'text-gray-400',
      };
    case 'COPPER':
      return {
        icon: <Coins className="h-3.5 w-3.5 text-[#b87333]" />,
        textClass: 'text-[#b87333]',
      };
    case 'BRONZE':
      return {
        icon: <Medal className="h-3.5 w-3.5 text-[#cd7f32]" />,
        textClass: 'text-[#cd7f32]',
      };
    case 'SILVER':
      return {
        icon: <Star className="h-3.5 w-3.5 text-[#C0C0C0]" />,
        textClass: 'text-[#C0C0C0]',
      };
    case 'GOLD':
      return {
        icon: <Trophy className="h-3.5 w-3.5 text-[#FFD700]" />,
        textClass: 'text-[#FFD700]',
      };
    case 'PLATINUM':
      return {
        icon: <CircleStar className="h-3.5 w-3.5 text-[#e5e4e2]" />,
        textClass: 'text-[#e5e4e2]',
      };
    case 'DIAMOND':
      return {
        icon: <Gem className="h-3.5 w-3.5 text-[#b9f2ff]" />,
        textClass: 'text-[#b9f2ff]',
      };
    case 'CROWN':
      return {
        icon: <Crown className="h-3.5 w-3.5 text-[#ffb347]" />,
        textClass: 'text-[#ffb347]',
      };
    case 'ELITE':
      return {
        icon: <Sparkles className="h-3.5 w-3.5 text-[#8a2be2]" />,
        textClass: 'text-[#8a2be2]',
      };
    case 'FOUNDER':
      return {
        icon: <Rocket className="h-3.5 w-3.5 text-[#ff4500]" />,
        textClass: 'text-[#ff4500]',
      };
    default:
      return {
        icon: <Star className="h-3.5 w-3.5 text-gray-400" />,
        textClass: 'text-gray-400',
      };
  }
}

export const UserSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, onLogout, user }: UserSidebarProps) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: notificationsData, refetch } = useGetUserNotificationsQuery();

  const tierMeta = useMemo(() => getTierMeta(user?.tier), [user?.tier]);
  const displayLevel = Math.max(1, user?.level || 1);

  const fetchUnreadCount = async () => {
    try {
      const notifications = isNotificationArray(notificationsData)
        ? notificationsData
        : normalizeNotificationsResponse(notificationsData);
      const unread = notifications.filter((notification) => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch sidebar notifications count', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);

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
    { name: 'Browse Tasks', href: '/user/tasks', icon: ListChecks },
    { name: 'Standalone Tasks', href: '/user/standalone-tasks', icon: CheckSquare },
    { name: 'Mini Games', href: '/user/minigames', icon: Gamepad2 },
    { name: 'Bug Bounty', href: '/user/bug-bounty', icon: Bug },
    { name: 'Daily Quiz', href: '/user/quiz', icon: Lightbulb },
    { name: 'Referrals', href: '/user/referrals', icon: Users },
    { name: 'Rewards', href: '/user/rewards', icon: Medal },
    { name: 'Leaderboard', href: '/user/leaderboard', icon: Trophy },
    { name: 'Withdraw', href: '/user/wallet', icon: Wallet },
    { name: 'Settings', href: '/user/settings', icon: Settings },
    { name: 'Help', href: '/user/help', icon: CircleHelp },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'SE';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const generateHandle = (name?: string) => {
    if (!name) return '@earner';
    return `@${name.replace(/\s+/g, '').toLowerCase()}`;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (window.innerWidth < 1024 && isOpen) {
      onClose();
    }

    if (pathname === href) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`group/sidebar fixed top-0 left-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-col overflow-y-auto overflow-x-hidden border-r border-sats-black-800 bg-sats-black-950 shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-[280px]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex h-24 items-center bg-sats-black-950 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={()=>{{isCollapsed?onToggleCollapse():onClose();}
            }}
              title={isCollapsed ? 'Expand Sidebar' : 'SatsEarn'}
              className="relative flex items-center justify-center transition-transform active:scale-95"
            >
              <Image
                width={36}
                height={36}
                alt="logo"
                className={`rounded-xl transition-all duration-300 ${isCollapsed ? 'opacity-100 group-hover/sidebar:scale-50 group-hover/sidebar:opacity-0' : 'opacity-100'}`}
                src="/icon.png"
              />
              {isCollapsed && (
                <PanelLeftOpen className="absolute inset-0 m-auto h-6 w-6 scale-50 text-sats-orange-500 opacity-0 transition-all duration-300 group-hover/sidebar:scale-100 group-hover/sidebar:opacity-100" />
              )}
            </button>

            {!isCollapsed && (
                <Link href="/user/dashboard" onClick={(e)=>{if (window.innerWidth < 1024 && isOpen) {
                  onClose();
                } if (pathname === "/user/dashboard") {
                  e.preventDefault();
                }}}>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-white">
                  Sats<span className="text-sats-orange-500">Earn</span>
                </span>
                <span className="rounded-full bg-sats-orange-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-sats-orange-500">
                  Beta
                </span>

              </div>
                </Link>
            )}
          </div>

          {!isCollapsed && (
            <button onClick={onToggleCollapse} className="hidden rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-sats-black-800 hover:text-white lg:flex">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}

          <button onClick={onClose} className="rounded-full p-2 text-gray-500 transition-colors hover:bg-sats-black-900 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="custom-scrollbar flex-1 min-h-0 space-y-1 overflow-x-hidden px-4 py-2 pb-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                title={isCollapsed ? link.name : ''}
                className={`group relative flex items-center justify-between rounded-2xl py-3.5 font-semibold transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'border border-sats-orange-500/20 bg-[#1c140a] text-white shadow-inner' : 'border border-transparent text-gray-300 hover:bg-sats-black-900 hover:text-white'}`}
              >
                <div className="relative flex items-center gap-4">
                  <Icon className={`h-5 w-5 min-w-[20px] transition-colors duration-300 ${isActive ? 'text-sats-orange-500' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {!isCollapsed && <span className="whitespace-nowrap text-[15px] tracking-wide">{link.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 flex flex-col gap-4 border-t border-sats-black-800 bg-sats-black-950 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/user/profile"
                onClick={(e) => handleLinkClick(e, '/user/profile')}
                title="Profile"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sats-black-800 bg-[#121212] text-black transition-all duration-300 hover:border-sats-orange-500/30 hover:bg-[#171717]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sats-orange-500 text-sm font-extrabold">
                  {getInitials(user?.name)}
                </div>
              </Link>

              <Link
                href="/user/notifications"
                onClick={(e) => handleLinkClick(e, '/user/notifications')}
                title="Notifications"
                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 ${pathname.startsWith('/user/notifications') ? 'border-sats-orange-500/30 bg-[#1c140a] text-sats-orange-500' : 'border-sats-black-800 bg-[#121212] text-gray-300 hover:border-sats-orange-500/20 hover:bg-[#171717] hover:text-white'}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-sats-black-950 bg-sats-orange-500 px-1 text-[9px] font-black leading-none text-black shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
           <div className="relative overflow-hidden rounded-[24px] border border-white/[0.04] bg-gradient-to-b from-[#111] to-[#0a0a0a] shadow-sm transition-all duration-300 hover:border-white/[0.08] hover:shadow-md">
  <div className="flex items-center justify-between gap-2 p-1.5">
    
    {/* Profile Link (Takes all flexible space, maximizing username area) */}
    <Link
      href="/user/profile"
      onClick={(e) => handleLinkClick(e, '/user/profile')}
      className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 transition-colors duration-300 ${
        pathname === '/user/profile' ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sats-orange-400 to-sats-orange-600 text-sm font-black text-black shadow-[0_2px_10px_rgba(249,115,22,0.3)]">
        {getInitials(user?.name)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-tight text-white/95 tracking-wide max-w-[15ch]">
          {generateHandle(user?.name)}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] font-bold leading-none text-white/40 ">
          <span className={`flex items-center gap-1 uppercase tracking-wider ${tierMeta.textClass}`}>
            {tierMeta.icon}
            {user?.tier ? user.tier.toLowerCase() : 'basic'}
          </span>
        </div>
      </div>
    </Link>

    {/* Notification Bell (Shrink-0 ensures it only stays within its square box) */}
    <Link
      href="/user/notifications"
      onClick={(e) => handleLinkClick(e, '/user/notifications')}
      className={`relative mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border transition-all duration-300 ${
        pathname.startsWith('/user/notifications')
          ? 'bg-sats-orange-500/10 border-sats-orange-500/20 text-sats-orange-500 shadow-[inset_0_0_12px_rgba(249,115,22,0.1)]'
          : 'bg-[#0f0f0f] border-[#222] text-gray-400 hover:bg-[#1a1a1a] hover:border-[#333] hover:text-white'
      }`}
      aria-label="Open notifications"
      title="Notifications"
    >
      <Bell className="h-[18px] w-[18px]" />
      {unreadCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#111] bg-sats-orange-500 px-1 text-[9px] font-black leading-none text-black shadow-[0_0_10px_rgba(249,115,22,0.5)]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
    
  </div>
</div>
          )}

          <button
            onClick={onLogout}
            title={isCollapsed ? 'Secure Logout' : ''}
            className={`group flex w-full items-center gap-3 rounded-xl border border-transparent py-3 font-medium text-gray-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut className="h-5 w-5 min-w-[20px] transition-transform duration-300 group-hover:scale-110" />
            {!isCollapsed && <span className="whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">Secure Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

