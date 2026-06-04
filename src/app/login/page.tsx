
// import React, { useEffect } from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Log In | SatsEarn',
  description: 'Log in to your account to continue earning Bitcoin.',
};

export default function LoginPage() {
  return (
    <main className=" w-full  flex flex-col items-center justify-center p-4 sm:p-8 relative">
      
      {/* FIXED Background Grid: Stays full screen */}
      {/* <div className="fixed inset-0 bg-grid-base opacity-30 z-0 pointer-events-none"></div> */}
      
      {/* FIXED Dynamic Highlight: Perfect glowing orb behind the form */}
      <div className="fixed  w-200 h-200 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="z-10 w-full flex justify-center py-4 sm:py-10">
        <LoginForm />
      </div>
      
    </main>
  );
}