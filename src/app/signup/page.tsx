import React from 'react';
import SignupForm from '@/features/auth/components/SignupForm';

export const metadata = {
  title: 'Sign Up | SatsEarn',
  description: 'Create your account and start earning Bitcoin in minutes.',
};

export default function SignupPage() {
  return (
    <main className="w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-base opacity-30 z-0"></div>
      
      {/* Subtle, Premium Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-sats-orange-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      {/* Form Container */}
      <div className="z-10 w-full flex justify-center my-8">
        <SignupForm />
      </div>
      
    </main>
  );
}