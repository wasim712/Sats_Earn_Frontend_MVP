'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; // Assume you have your standard Redux store.ts here
import { ApiObfuscationProvider } from '@/components/ui/ApiObfuscationProvider';
import { bootstrapAuth } from '@/features/auth/authSlice';

function AuthBootstrap() {
  useEffect(() => {
    store.dispatch(bootstrapAuth());
  }, []);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <ApiObfuscationProvider />
      {children}
    </Provider>
  );
}
