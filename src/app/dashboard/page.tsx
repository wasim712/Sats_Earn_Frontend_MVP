'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { User, Mail, MapPin, Calendar, LogOut, ShieldCheck, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Security Check: ONLY rely on isAuthenticated for kicking users out
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout()); 
    router.push('/login'); 
  };

  // DEBUGGING: Let's see exactly what the backend returned
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Current User Object in Redux:", user);
    }
  }, [isAuthenticated, user]);

  // If we are redirecting, render nothing
  if (!isAuthenticated) return null;

  // IF AUTHENTICATED BUT NO USER DATA YET: Show a loader instead of redirecting!
  if (!user) {
    return (
      <main className="min-h-screen w-full bg-sats-black-950 flex flex-col items-center justify-center p-4 relative">
        <Loader2 className="w-10 h-10 text-sats-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading your profile data...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-sats-black-950 flex flex-col items-center justify-center p-4 sm:p-8 relative">
      
      <div className="fixed inset-0 bg-grid-base opacity-30 z-0 pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="z-10 w-full max-w-2xl bg-sats-black-950/80 border border-sats-black-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] backdrop-blur-xl">
        
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-sats-black-800 pb-6 mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sats-orange-600 to-sats-orange-400 p-0.5 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <div className="w-full h-full bg-sats-black-900 rounded-2xl flex items-center justify-center border border-sats-black-950">
                <span className="text-2xl font-bold text-white uppercase">
                  {user.fullName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Welcome, {user.fullName?.split(' ')[0] || 'User'}!
                <ShieldCheck className="w-5 h-5 text-sats-orange-500" />
              </h1>
              <p className="text-sm text-gray-400">Your account is fully verified and active.</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-sats-black-900 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-sats-black-800 hover:border-red-500/30 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-sats-black-900/50 border border-sats-black-800 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-3 bg-sats-black-800 rounded-xl text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-white font-medium">{user.fullName || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-sats-black-900/50 border border-sats-black-800 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-3 bg-sats-black-800 rounded-xl text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-white font-medium">{user.email || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-sats-black-900/50 border border-sats-black-800 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-3 bg-sats-black-800 rounded-xl text-gray-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Country</p>
              <p className="text-white font-medium">{user.country || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-sats-black-900/50 border border-sats-black-800 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-3 bg-sats-black-800 rounded-xl text-gray-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Date of Birth</p>
              <p className="text-white font-medium">
                {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-sats-black-800 flex justify-between items-center text-xs text-gray-500">
           <p>Database ID: <span className="font-mono text-gray-400">{user.id || 'Pending'}</span></p>
           {user.referralCode && (
             <p className="flex items-center gap-1.5">
               Referral Code: <span className="font-mono font-bold text-sats-orange-500 bg-sats-orange-500/10 px-2 py-0.5 rounded">{user.referralCode}</span>
             </p>
           )}
        </div>

      </div>
    </main>
  );
}