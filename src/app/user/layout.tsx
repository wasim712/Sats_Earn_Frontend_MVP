'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import { UserSidebar } from '@/components/user/UserSidebar';
import { useAppSelector, useAppDispatch } from '@/store/hooks'; 
import { logout } from '@/features/auth/authSlice'; 

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // ─── 1. Unified Mount & Resize Handler ───────────────────────────────────
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
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
    return null; // Renders nothing while checking auth or hydrating
  }
  
  return (
    <div className="min-h-screen bg-[#020202] font-sans text-white">
      
      {/* ─── Sidebar ─── */}
      <UserSidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
        user={user ? { 
          name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User', 
          tier: user.tier || 'BASIC', 
          streak: user.streak || 0 
        } : null} 
      />

      {/* ─── Main Viewport (Handles Sidebar Offset) ─── */}
      <div 
        className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col
        ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}
      >
        
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

        {/* ─── Main Content Area ─── */}
        {/* FIXED: Removed max-w-7xl so the inner pages can center themselves using mx-auto! */}
        <main className="flex-1 w-full flex flex-col relative overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  );
}