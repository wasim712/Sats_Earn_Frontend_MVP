// 'use client';

// import React, { useState, useEffect } from 'react';
// import { UserSidebar } from '@/components/user/UserSidebar';
// import { Menu } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // 1. Import your actual Redux hooks and actions
// import { useAppSelector, useAppDispatch } from '@/store/hooks'; 
// import { logout } from '@/features/auth/authSlice'; // Adjust this path if your slice is somewhere else!

// export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
  
//   const router = useRouter();
//   const dispatch = useAppDispatch();
  
//   // 2. Grab the REAL user data from your Redux store
//   const { user } = useAppSelector((state) => state.auth);

//   // 3. The Bulletproof Logout Function
//   const handleLogout = () => {
//     // Step A: Destroy the tokens in the browser
//     sessionStorage.removeItem('sats_token');
//     localStorage.removeItem('sats_token');
    
//     // Step B: Tell Redux to wipe the user state (This breaks the login loop!)
//     dispatch(logout()); 
    
//     // Step C: Send them back to the login page
//     router.push('/login');
//   };

//   // Close sidebar on mobile when resizing to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) setIsSidebarOpen(false);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="min-h-screen bg-sats-black-950 font-sans text-white">
      
//       <UserSidebar 
//         isOpen={isSidebarOpen}
//         isCollapsed={isCollapsed}
//         onClose={() => setIsSidebarOpen(false)}
//         onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
//         onLogout={handleLogout}
//         // Pass the real user data down. We use a fallback just in case the state hasn't loaded yet.
//         user={user || { name: 'Earner', tier: 'BASIC', streak: 0 }} 
//       />

//       {/* MAIN CONTENT WRAPPER */}
//       <div 
//         className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col
//         ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}
//       >
//         {/* MOBILE TOPBAR */}
//         <header className="lg:hidden h-16 border-b border-sats-black-800 bg-sats-black-950/80 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 gap-4">
//           <button 
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 text-gray-400 hover:text-white bg-sats-black-900 rounded-xl border border-sats-black-800 transition-colors active:scale-95"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
          
//           <div className="flex items-center gap-2">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F97316"/>
//             </svg>
//             <span className="font-bold tracking-tight text-lg">Sats<span className="text-sats-orange-500">Earn</span></span>
//           </div>
//         </header>

//         {/* PAGE CONTENT */}
//         <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
//           {children}
//         </main>
        
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { UserSidebar } from '@/components/user/UserSidebar';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/store/hooks'; 

// 🚨 IMPORTANT: Change this path to exactly where your authSlice is! 🚨
// Example: import { logout } from '@/store/authSlice'; 
import { logout } from '@/features/auth/authSlice'; 

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Grab the REAL user data and authentication status from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("🚨 REDUX USER DATA:", user);
  // --- THE AUTH GUARD ---
  // If a user tries to access any /user route without being logged in, kick them out.
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    // Only redirect if we are 100% sure they aren't authenticated
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  const handleLogout = () => {
    sessionStorage.removeItem('sats_token');
    localStorage.removeItem('sats_token');
    
    dispatch(logout()); 
    router.push('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent rendering the dashboard UI at all if they aren't logged in
  if (!isAuthenticated && !user) {
    return null; // Or return a <LoadingSpinner /> here while it redirects
  }
  // 1. Prevent hydration errors by returning null on the server
  if (!mounted) {
    return null; 
  }

  // 2. Prevent rendering the dashboard if they aren't logged in
  if (!isAuthenticated && !user) {
    return null; 
  }
  
  return (
    <div className="min-h-screen bg-sats-black-950 font-sans text-white">
      
      <UserSidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
        user={user ? { 
          name: user.fullName || `${user.firstName} ${user.lastName}`, 
          tier: user.tier || 'BASIC', 
          streak: user.streak || 0 
        } : null} 
      />

      <div 
        className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col
        ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}
      >
        <header className="lg:hidden h-16 border-b border-sats-black-800 bg-sats-black-950/80 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white bg-sats-black-900 rounded-xl border border-sats-black-800 transition-colors active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F97316"/>
            </svg>
            <span className="font-bold tracking-tight text-lg">Sats<span className="text-sats-orange-500">Earn</span></span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  );
}