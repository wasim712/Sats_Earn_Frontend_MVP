'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, CheckSquare, CopyPlus, 
  List, Settings, LogOut, X, PanelLeftClose, PanelLeftOpen,Megaphone,Lightbulb,
  MonitorCog
} from 'lucide-react';
import Image from 'next/image';
import { LogoText } from '../ui/LogoText';

interface AdminSidebarProps {
  isOpen: boolean;           
  isCollapsed: boolean;      
  onClose: () => void;       
  onToggleCollapse: () => void; 
  onLogout: () => void;
}

export const AdminSidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, onLogout }: AdminSidebarProps) => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Submissions', href: '/admin/submissions', icon: CheckSquare },
    { type: 'divider', name: 'Campaigns' }, 
    { name: 'All Campaigns', href: '/admin/campaigns', icon: List },
    { name: 'Add Campaign', href: '/admin/addcampaign', icon: CopyPlus },
    { type: 'divider', name: 'Quiz' }, 
    { name: 'Quiz', href: '/admin/quiz', icon: Lightbulb },
    { type: 'divider', name: 'System' },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Payments', href: '/admin/payments', icon: MonitorCog },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* ADDED: group/sidebar to the main aside element so the whole sidebar tracks hovers */}
      <aside 
        className={`group/sidebar fixed top-0 left-0 h-screen bg-sats-black-950 border-r border-sats-black-800 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-[5px_0_30px_rgba(0,0,0,0.5)] 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
        ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* HEADER SECTION */}
        <div className={`h-20 flex items-center border-b border-sats-black-800 bg-sats-black-950 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          <div className="flex items-center gap-3">
             
             {/* THE MAGIC LOGO TOGGLE */}
             {/* CHANGED: Now listens to group-hover/sidebar instead of its own group hover */}
             <button 
               onClick={onToggleCollapse}
               title={isCollapsed ? "Expand Sidebar" : "SatsEarn Admin"}
               className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-black border shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all duration-300 ${
                 isCollapsed ? 'border-sats-orange-500/30 group-hover/sidebar:border-sats-orange-500' : 'border-sats-orange-500/30 cursor-default'
               }`}
             >
                {/* 1. Default Logo (Fades out when hovering ANYWHERE on the collapsed sidebar) */}
                <Image width="45" height="45" alt='logo' className={` rounded-4xl transition-all duration-300 ${isCollapsed ? 'opacity-100  group-hover/sidebar:opacity-0 group-hover/sidebar:scale-50' : 'opacity-100'}`}src="/icon.png">
                </Image>

                {/* 2. Expand Icon (Scales in when hovering ANYWHERE on the collapsed sidebar) */}
                {isCollapsed && (
                  <PanelLeftOpen className="absolute inset-0 m-auto w-5 h-5 text-sats-orange-500 opacity-0 scale-50 group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 transition-all duration-300" />
                )}
             </button>

             {/* Brand Text */}
             {!isCollapsed && (
               <LogoText className="text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-300"/>
             )}
          </div>
          
          {/* Desktop Collapse Button */}
          {!isCollapsed && (
            <button 
              onClick={onToggleCollapse} 
              title="Collapse Sidebar"
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-sats-black-800 transition-colors"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}

          {/* Mobile Close Button */}
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
                onClick={onClose} 
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

        {/* LOGOUT SECTION */}
        <div className="p-3 border-t border-sats-black-800 bg-sats-black-950 flex flex-col gap-2">
          <button 
            onClick={onLogout} 
            title={isCollapsed ? "Secure Logout" : ""}
            className={`group flex items-center gap-3 py-3 w-full rounded-xl font-medium text-gray-400 transition-all border border-transparent hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut className="w-5 h-5 min-w-[20px] transition-transform duration-300 group-hover:scale-110" />
            {!isCollapsed && <span className="whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">Secure Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};