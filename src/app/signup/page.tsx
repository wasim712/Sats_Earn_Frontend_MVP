import React from 'react';
import SignupForm from '@/features/auth/components/SignupForm';

export const metadata = {
  title: 'Sign Up | SatsEarn',
  description: 'Create your account and start earning Bitcoin in minutes.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 relative bg-sats-black-950 overflow-x-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-base opacity-20 z-0"></div>
      
      {/* Subtle, Premium Glow Effect - Hidden on small mobile to improve performance */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sats-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Form Container */}
      <div className="z-10 w-full flex justify-center py-8">
        <SignupForm />
      </div>
      
    </main>
  );
}