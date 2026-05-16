'use client';

import { Provider } from 'react-redux';
import { store } from './store'; // Assume you have your standard Redux store.ts here
import { ApiObfuscationProvider } from '@/components/ui/ApiObfuscationProvider';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApiObfuscationProvider />
      {children}
    </Provider>
  );
}
