import React from 'react';
import SignupForm from '@/features/auth/components/SignupForm';

export const metadata = {
  title: 'Sign Up | SatsEarn',
  description: 'Create your account and start earning Bitcoin in minutes.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-sats-black-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Grid Pattern (Assumes you kept it in layout, but added here just in case) */}
      <div className="absolute inset-0 bg-grid-base opacity-30 z-0"></div>
      
      {/* Dynamic Highlight Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-sats-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Form Container */}
      <div className="z-10 w-full flex justify-center mt-8">
        <SignupForm />
      </div>
      
    </main>
  );
}