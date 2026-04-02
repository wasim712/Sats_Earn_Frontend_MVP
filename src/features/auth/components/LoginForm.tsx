'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; 
import { signInUser, resetAuthError } from '../authSlice';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Pulling loading, error, and auth state from Redux
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if logged in successfully
  useEffect(() => {
    if (isAuthenticated || user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Clear any lingering errors when the component mounts
  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatches the login action to your Express backend
    dispatch(signInUser(formData));
  };

  return (
    <div className="w-full max-w-110 bg-sats-black-950/80 border border-sats-black-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative font-sans backdrop-blur-xl mx-auto">
      
      {/* Close Button -> Routes back to landing page */}
      <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      {/* Logo Area */}
      <div className="flex justify-center items-center mb-6 mt-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-black rounded-xl border border-sats-orange-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F97316"/>
             </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">SatsEarn</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-1 text-white">Welcome back</h2>
        <p className="text-gray-400 text-sm">Log in to continue stacking sats</p>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Input */}
        <div>
          <label className="block text-sm font-bold mb-1.5 text-gray-200">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              required
              className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder-gray-600"
            />
          </div>
        </div>

        {/* Password Input with Forgot Password Link */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-bold text-gray-200">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              required
              className="w-full bg-sats-black-900 border border-sats-black-700 focus:border-sats-orange-500 focus:ring-1 focus:ring-sats-orange-500 rounded-xl py-3 pl-10 pr-12 outline-none transition-all text-white placeholder-gray-600"
            />
            {/* Password Visibility Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-bold text-base rounded-xl py-3.5 mt-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        >
          {isLoading ? 'Authenticating...' : 'Log In'}
          {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center text-sm text-gray-400">
        Do not have an account?{' '}
        <Link href="/signup" className="font-bold text-sats-orange-500 hover:text-sats-orange-400 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}