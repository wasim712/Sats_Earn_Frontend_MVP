import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice'
import adminCampaignsReducer from '../features/admin/adminCampaignsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,// When we build the dashboard, we will add dashboard: dashboardReducer here
    adminCampaigns: adminCampaignsReducer,
  },
});

// These types are crucial for TypeScript to understand what is inside your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;