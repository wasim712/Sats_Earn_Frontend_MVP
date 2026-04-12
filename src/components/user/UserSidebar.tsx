'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ListChecks, Users, Trophy, Wallet, 
  Bell, Settings, LogOut, X, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import Image from 'next/image';

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

export const UserSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, onLogout, user }: UserSidebarProps) => {
  const pathname = usePathname();

  // Exactly matching the straight list from your provided image
  const navLinks = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Browse Tasks', href: '/user/tasks', icon: ListChecks },
    { name: 'Referrals', href: '/user/referrals', icon: Users },
    { name: 'Leaderboard', href: '/user/leaderboard', icon: Trophy },
    { name: 'Withdraw', href: '/user/wallet', icon: Wallet },
    { name: 'Notifications', href: '/user/notifications', icon: Bell, badge: 3 }, // Hardcoded badge for now
    { name: 'Settings', href: '/user/settings', icon: Settings },
  ];

  // Safely get initials (e.g., "Sumit Dwivedi" -> "SD")
  const getInitials = (name?: string) => {
    if (!name) return 'SE';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Convert "Sumit Dwivedi" into "@sumitdwivedi" to match the image handle
  const generateHandle = (name?: string) => {
    if (!name) return '@earner';
    return '@' + name.replace(/\s+/g, '').toLowerCase();
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
        {/* HEADER SECTION (Logo + Beta Badge) */}
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
                 {/* The Beta Badge from the image */}
                 <span className="bg-sats-orange-500/20 text-sats-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                   Beta
                 </span>
               </div>
             )}
          </div>
          
          {/* Close / Collapse toggles */}
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
                onClick={onClose} 
                title={isCollapsed ? link.name : ""}
                className={`group flex items-center justify-between py-3.5 rounded-2xl font-semibold transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? 'bg-[#1c140a] border border-sats-orange-500/20 text-white shadow-inner' 
                    : 'text-gray-300 border border-transparent hover:text-white hover:bg-sats-black-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 min-w-[20px] transition-colors duration-300 ${isActive ? 'text-sats-orange-500' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap tracking-wide text-[15px]">
                      {link.name}
                    </span>
                  )}
                </div>

                {/* Optional Notification Badge */}
                {!isCollapsed && link.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION (Profile Card & Logout) */}
        <div className="p-4 border-t border-sats-black-800 bg-sats-black-950 flex flex-col gap-4">
          
          {/* 1. Profile Card (Matches Image Exactly) */}
          <div className={`flex items-center gap-3 p-3 bg-[#121212] rounded-[20px] border border-sats-black-800 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* Orange Solid Avatar */}
            <div className="w-10 h-10 rounded-full bg-sats-orange-500 flex items-center justify-center text-black font-extrabold text-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm font-bold text-white truncate leading-tight">
                    {generateHandle(user?.name)}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 capitalize mt-0.5">
                    {user?.tier ? user.tier.toLowerCase() : 'Basic'} Tier
                  </p>
                </div>
                
                {/* Internal Settings Gear */}
                <Link href="/user/settings" className="p-1.5 text-gray-500 hover:text-white hover:bg-sats-black-800 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* 2. Simple Log Out Text Button */}
          <button 
            onClick={onLogout} 
            title={isCollapsed ? "Log out" : ""}
            className={`flex items-center gap-3 text-gray-400 hover:text-white transition-colors font-semibold text-sm px-2 pb-2 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
          
        </div>
      </aside>
    </>
  );
};