'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Menu, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false); // Clean hydration check

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

  // While validating session on reload, show loader
  if (!isClient || !isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-sats-black-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-sats-black-950 flex font-sans text-white">
      
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
      />

      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        
        <header className="h-20 bg-sats-black-950/80 backdrop-blur-md border-b border-sats-black-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-sats-black-900 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-200">Admin Pannel</h2>
          </div>
          <div className="flex items-center">
            <span className="flex items-center gap-2 text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden bg-sats-black-950">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}