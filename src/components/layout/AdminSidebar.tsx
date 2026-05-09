'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, CheckSquare, CopyPlus, 
  List, Settings, LogOut, X, PanelLeftClose, PanelLeftOpen, Megaphone, Lightbulb,
  MonitorCog, Bell, Bug,
  ShieldAlert, BookOpen
} from 'lucide-react';
import Image from 'next/image';
import { LogoText } from '../ui/LogoText';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface AdminSidebarProps {
  isOpen: boolean;           
  isCollapsed: boolean;      
  onClose: () => void;       
  onToggleCollapse: () => void; 
  onLogout: () => void;
}

interface NotificationItem {
  isRead?: boolean;
}

export const AdminSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, onLogout }: AdminSidebarProps) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // --- FETCH UNREAD ALERTS ---
  const fetchUnreadCount = async () => {
    try {
      const token = sessionStorage.getItem('sats_token');
      if (!token) return;

      const res = await fetch(`${API_URL}/admin/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json() as NotificationItem[];
        // Count how many are NOT read
        const unread = data.filter((notification) => !notification.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch sidebar notifications count", err);
    }
  };

  useEffect(() => {
    // 1. Fetch on initial load
    fetchUnreadCount();

    // 2. Poll every 60 seconds to keep it updated if the admin leaves the tab open
    const interval = setInterval(fetchUnreadCount, 60000);

    // 3. Listen for our custom "instant update" event from the notifications page
    const handleInstantUpdate = () => fetchUnreadCount();
    window.addEventListener('notifications-updated', handleInstantUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', handleInstantUpdate);
    };
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Alerts', href: '/admin/notifications', icon: Bell, count: unreadCount },
    { name: 'Submissions', href: '/admin/submissions', icon: CheckSquare },
    { name: 'Bug Reports', href: '/admin/bug-reports', icon: Bug },
    { type: 'divider', name: 'Campaigns' }, 
    { name: 'Security', href: '/admin/fraud', icon: ShieldAlert },
    { name: 'All Campaigns', href: '/admin/campaigns', icon: List },
    { name: 'Add Campaign', href: '/admin/addcampaign', icon: CopyPlus },
    { type: 'divider', name: 'Quiz' }, 
    { name: 'Quiz', href: '/admin/quiz', icon: Lightbulb },
    { type: 'divider', name: 'System' },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Payments', href: '/admin/payments', icon: MonitorCog },
  ];
    // ─── CLICK HANDLER: PREVENT REDUNDANT NAVIGATION ───
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Always close the mobile drawer when any link is clicked
      if (window.innerWidth < 1024 && isOpen) {
        onClose();
      }

      // Prevent redundant navigation only if already on this page
      if (pathname === href) {
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
        ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* HEADER SECTION */}
        <div className={`h-20 flex items-center border-b border-sats-black-800 bg-sats-black-950 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3">
             <button 
               onClick={onToggleCollapse}
               title={isCollapsed ? "Expand Sidebar" : "SatsEarn Admin"}
               className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-black border shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all duration-300 ${
                 isCollapsed ? 'border-sats-orange-500/30 group-hover/sidebar:border-sats-orange-500' : 'border-sats-orange-500/30 cursor-default'
               }`}
             >
                <Image width="45" height="45" alt='logo' className={` rounded-4xl transition-all duration-300 ${isCollapsed ? 'opacity-100  group-hover/sidebar:opacity-0 group-hover/sidebar:scale-50' : 'opacity-100'}`}src="/icon.png" />
                {isCollapsed && (
                  <PanelLeftOpen className="absolute inset-0 m-auto w-5 h-5 text-sats-orange-500 opacity-0 scale-50 group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-all duration-300" />
                )}
             </button>

             {!isCollapsed && (
               <LogoText className="text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-300"/>
             )}
          </div>
          
          {!isCollapsed && (
            <button 
              onClick={onToggleCollapse} 
              title="Collapse Sidebar"
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-sats-black-800 transition-colors"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}

          <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-white rounded-full hover:bg-sats-black-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navLinks.map((link, index) => {
            if (link.type === 'divider') {
              return (
                <div key={index} className={`pt-4 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider transition-all duration-300 ${isCollapsed ? 'text-center opacity-0 h-0 p-0 m-0' : 'px-3 opacity-100'}`}>
                  {!isCollapsed && link.name}
                </div>
              );
            }

            const isActive = pathname === link.href;
            const Icon = link.icon!;
            
            return (
              <Link 
                key={link.name} 
                href={link.href!}
                onClick={(e) => handleLinkClick(e, link.href!)}
                title={isCollapsed ? link.name : ""}
                className={`group flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-300 relative ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? 'bg-sats-orange-500/10 text-sats-orange-400 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]' 
                    : 'text-gray-400 border border-transparent hover:text-white hover:bg-sats-black-900'
                }`}
              >
                {/* Icon Container (Used for absolute positioning the badge when collapsed) */}
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 min-w-5 transition-transform duration-300 ${isActive ? 'text-sats-orange-500' : 'text-gray-500 group-hover:text-sats-orange-400'} ${!isActive && !isCollapsed && 'group-hover:scale-110'}`} />
                  
                  {/* Badge for Collapsed State */}
                  {isCollapsed && link.count !== undefined && link.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-sats-orange-500 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-sats-black-950">
                      {link.count > 9 ? '9+' : link.count}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span className={`whitespace-nowrap transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1 group-hover:text-gray-200'}`}>
                      {link.name}
                    </span>
                    
                    {/* Badge for Expanded State */}
                    {link.count !== undefined && link.count > 0 && (
                      <span className="ml-auto bg-sats-orange-500 text-black text-xs font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                        {link.count > 99 ? '99+' : link.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT SECTION */}
        <div className="p-3 border-t border-sats-black-800 bg-sats-black-950 flex flex-col gap-2">
          <button 
            onClick={onLogout} 
            title={isCollapsed ? "Secure Logout" : ""}
            className={`group flex items-center gap-3 py-3 w-full rounded-xl font-medium text-gray-400 transition-all border border-transparent hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut className="w-5 h-5 min-w-5 transition-transform duration-300 group-hover:scale-110" />
            {!isCollapsed && <span className="whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">Secure Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
