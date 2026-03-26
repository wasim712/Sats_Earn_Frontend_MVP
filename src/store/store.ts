import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // When we build the dashboard, we will add dashboard: dashboardReducer here
  },
});

// These types are crucial for TypeScript to understand what is inside your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;