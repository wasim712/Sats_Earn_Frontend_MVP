import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice'
import adminCampaignsReducer from '../features/admin/adminCampaignsSlice';
import adminAnnouncementsReducer from '../features/admin/adminAnnouncementsSlice';
import adminQuizReducer from '../features/admin/adminQuizSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminCampaigns: adminCampaignsReducer,
    adminAnnouncements:adminAnnouncementsReducer,
    adminQuiz:adminQuizReducer,
  },
});

// These types are crucial for TypeScript to understand what is inside your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;