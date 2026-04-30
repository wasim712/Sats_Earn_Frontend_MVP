'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Menu, Loader2 } from 'lucide-react';
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => { 
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'SUPER_ADMIN') {
        router.push('/dashboard'); 
      }
    }
  }, [isClient, isAuthenticated, user, router]);

  // While validating session on reload, show premium loader
  if (!isClient || !isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    /* 1. Parent is a strict Flex Row locked to the viewport height */
    <div className="flex h-screen w-full bg-[#020202] text-white overflow-hidden font-sans">
      
      {/* 2. Desktop Sidebar Wrapper - Acts as a physical block in the flex flow, eliminating the need for margins */}
      <div className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}>
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          isCollapsed={isCollapsed}
          onClose={() => setIsSidebarOpen(false)} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar (Usually handles its own absolute/fixed overlay internally) */}
      <div className="lg:hidden">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          isCollapsed={isCollapsed}
          onClose={() => setIsSidebarOpen(false)} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onLogout={handleLogout}
        />
      </div>

      {/* 3. Main Viewport - Automatically flexes to fill the exact remaining space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header - Stays naturally at the top of the flex column */}
        <header className="shrink-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a] flex items-center justify-between px-4 sm:px-8 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#111] border border-transparent hover:border-[#1a1a1a] transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black tracking-tight text-white">Admin Panel</h2>
          </div>
          
          <div className="flex items-center">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </header>
        <AnnouncementBanner/>
        {/* Main Content Area - Handles its own internal scrolling */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#020202]">
          {/* Centering container for the actual page content */}
          <div className="max-w-[1600px] mx-auto w-full h-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}