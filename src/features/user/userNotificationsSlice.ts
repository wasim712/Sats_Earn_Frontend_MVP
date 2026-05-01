import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId: string | null;
  createdAt: string;
}

interface UserNotificationsState {
  notifications: UserNotification[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: UserNotificationsState = {
  notifications: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchUserNotifications = createAsyncThunk(
  'userNotifications/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch alerts.');
      return data as UserNotification[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markUserNotificationRead = createAsyncThunk(
  'userNotifications/markRead',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/users/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to mark as read.');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllUserNotificationsRead = createAsyncThunk(
  'userNotifications/markAllRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/users/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to mark all as read.');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userNotificationsSlice = createSlice({
  name: 'userNotifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markUserNotificationRead.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(markUserNotificationRead.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        );
      })
      .addCase(markUserNotificationRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(markAllUserNotificationsRead.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(markAllUserNotificationsRead.fulfilled, (state) => {
        state.isUpdating = false;
        state.notifications = state.notifications.map((notification) => ({ ...notification, isRead: true }));
      })
      .addCase(markAllUserNotificationsRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export default userNotificationsSlice.reducer;
