'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Pickaxe, CheckSquare, Wallet, 
  Settings, LogOut, X, PanelLeftClose, PanelLeftOpen, 
  User as UserIcon, HelpCircle, ChevronDown
} from 'lucide-react';

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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { type: 'divider', name: 'Earn Sats' }, 
    { name: 'Available Tasks', href: '/user/tasks', icon: Pickaxe },
    { name: 'My Submissions', href: '/user/submissions', icon: CheckSquare },
    { type: 'divider', name: 'Account' },
    { name: 'Wallet', href: '/user/wallet', icon: Wallet },
    { name: 'Settings', href: '/user/settings', icon: Settings },
  ];

  // Get initials for the avatar (e.g., "Sumit Dwivedi" -> "SD")
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
               title={isCollapsed ? "Expand Sidebar" : "SatsEarn"}
               className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-black border shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all duration-300 ${
                 isCollapsed ? 'border-sats-orange-500/30 group-hover/sidebar:border-sats-orange-500' : 'border-sats-orange-500/30 cursor-default'
               }`}
             >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all duration-300 ${isCollapsed ? 'opacity-100 group-hover/sidebar:opacity-0 group-hover/sidebar:scale-50' : 'opacity-100'}`}>
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F97316"/>
                </svg>
                {isCollapsed && (
                  <PanelLeftOpen className="absolute inset-0 m-auto w-5 h-5 text-sats-orange-500 opacity-0 scale-50 group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-all duration-300" />
                )}
             </button>

             {!isCollapsed && (
               <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden transition-opacity duration-300">
                 Sats<span className="text-sats-orange-500">Earn</span>
               </span>
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
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
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
                onClick={() => { onClose(); setIsProfileMenuOpen(false); }} 
                title={isCollapsed ? link.name : ""}
                className={`group flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? 'bg-sats-orange-500/10 text-sats-orange-400 border border-sats-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]' 
                    : 'text-gray-400 border border-transparent hover:text-white hover:bg-sats-black-900'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] transition-transform duration-300 ${isActive ? 'text-sats-orange-500' : 'text-gray-500 group-hover:text-sats-orange-400'} ${!isActive && !isCollapsed && 'group-hover:scale-110'}`} />
                {!isCollapsed && (
                  <span className={`whitespace-nowrap transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1 group-hover:text-gray-200'}`}>
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM PROFILE & POPOVER MENU */}
        <div className="p-3 border-t border-sats-black-800 bg-sats-black-950 relative" ref={menuRef}>
          
          {/* THE POPOVER MENU (Like the uploaded image) */}
          <div className={`absolute bottom-[calc(100%+8px)] left-3 w-[240px] bg-[#1e1e1e] border border-sats-black-800 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-200 origin-bottom-left z-50 ${isProfileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-2'}`}>
            
            {/* Popover Header */}
            <div className="p-4 border-b border-sats-black-800/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-gray-300 shrink-0 shadow-inner">
                <span className="text-sm font-medium">{user?.name ? getInitials(user.name) : 'SE'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-100 truncate">{user?.name || 'Sats Earner'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.tier || 'Basic'} Tier</p>
              </div>
            </div>

            {/* Popover Links */}
            <div className="p-2 space-y-0.5">
              <Link 
                href="/user/profile" 
                onClick={() => { setIsProfileMenuOpen(false); onClose(); }} 
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#2d2d2d] rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-gray-400" /> Profile
              </Link>
              <Link 
                href="/user/help" 
                onClick={() => { setIsProfileMenuOpen(false); onClose(); }} 
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#2d2d2d] rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" /> Help
              </Link>
            </div>

            {/* Popover Footer (Logout) */}
            <div className="p-2 border-t border-sats-black-800/50">
              <button 
                onClick={() => { setIsProfileMenuOpen(false); onClose(); onLogout(); }} 
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>

          {/* THE TRIGGER BUTTON */}
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-sats-black-900 transition-colors ${isProfileMenuOpen ? 'bg-sats-black-900' : ''} ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <div className="w-9 h-9 rounded-full bg-[#3d3d3d] flex items-center justify-center text-gray-300 shrink-0">
              <span className="text-xs font-medium">{user?.name ? getInitials(user.name) : 'SE'}</span>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{user?.name || 'Sats Earner'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

        </div>
      </aside>
    </>
  );
};