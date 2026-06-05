
// import React, { useEffect } from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Log In',
  description: 'Log in to your account to continue earning Bitcoin.',
};

export default function LoginPage() {
  return (
    <main className=" w-full  flex flex-col items-center justify-center p-4 sm:p-8 relative">
      
      <div className="fixed  w-200 h-200 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="z-10 w-full flex justify-center py-4 sm:py-10">
        <LoginForm />
      </div>
      
    </main>
  );
}