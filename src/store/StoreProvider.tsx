'use client';

import { Provider } from 'react-redux';
import { store } from './store'; // Assume you have your standard Redux store.ts here

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}