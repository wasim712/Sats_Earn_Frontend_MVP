import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice'
import adminCampaignsReducer from '../features/admin/adminCampaignsSlice';
import adminCountriesReducer from '../features/admin/adminCountriesSlice';
import adminAnnouncementsReducer from '../features/admin/adminAnnouncementsSlice';
import adminUsersReducer from '../features/admin/adminUsersSlice';
import adminSubmissionsReducer from '../features/admin/adminSubmissionsSlice';
import adminQuizReducer from '../features/admin/adminQuizSlice';
import userQuizReducer from '../features/user/userQuizSlice'
import userProfileReducer from '../features/user/userProfileSlice'
import adminFraudReducer from '../features/admin/adminFraudSlice'
import adminNotificationsReducer from '../features/admin/adminNotificationsSlice'
import adminPaymentsReducer from '../features/admin/adminPaymentsSlice'
import adminSettingsReducer from '../features/admin/adminSettingsSlice'
import adminCheatReducer from '../features/admin/adminCheatSlice'
import userDashboardReducer from '../features/user/userDashboardSlice'
import userNotificationsReducer from '../features/user/userNotificationsSlice'
import userReferralsReducer from '../features/user/userReferralsSlice'
import userSubmissionsReducer from '../features/user/userSubmissionsSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminCampaigns: adminCampaignsReducer,
    adminCountries: adminCountriesReducer,
    adminAnnouncements:adminAnnouncementsReducer,
    adminQuiz:adminQuizReducer,
    adminUsers:adminUsersReducer,
    adminSubmissions:adminSubmissionsReducer,
    adminNotifications:adminNotificationsReducer,
    adminPayments:adminPaymentsReducer,
    adminSettings:adminSettingsReducer,
    adminCheat: adminCheatReducer,
    userQuiz:userQuizReducer,
    userProfile:userProfileReducer,
    userDashboard:userDashboardReducer,
    userNotifications:userNotificationsReducer,
    userReferrals:userReferralsReducer,
    userSubmissions:userSubmissionsReducer,
    adminFraud: adminFraudReducer
  },
});

// These types are crucial for TypeScript to understand what is inside your Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
