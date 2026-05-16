import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import type { AdminNotification } from '@/types/admin';

interface AdminNotificationsState {
  notifications: AdminNotification[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminNotificationsState = {
  notifications: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

function normalizeAdminNotifications(data: unknown): AdminNotification[] {
  if (Array.isArray(data)) return data as AdminNotification[];

  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; notifications?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as AdminNotification[];
    if (Array.isArray(payload.notifications)) return payload.notifications as AdminNotification[];
    if (Array.isArray(payload.items)) return payload.items as AdminNotification[];
  }

  return [];
}

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

export const fetchAdminNotifications = createAsyncThunk(
  'adminNotifications/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch notifications.');
      return normalizeAdminNotifications(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAdminNotificationsRead = createAsyncThunk(
  'adminNotifications/markAllRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await parseObfuscatedJson<any>(response);
        throw new Error(data.error || 'Failed to mark all notifications as read.');
      }
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAdminNotificationRead = createAsyncThunk(
  'adminNotifications/markRead',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await parseObfuscatedJson<any>(response);
        throw new Error(data.error || 'Failed to mark notification as read.');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminNotificationsSlice = createSlice({
  name: 'adminNotifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllAdminNotificationsRead.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(markAllAdminNotificationsRead.fulfilled, (state) => {
        state.isUpdating = false;
        state.notifications = state.notifications.map((notification) => ({ ...notification, isRead: true }));
      })
      .addCase(markAllAdminNotificationsRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(markAdminNotificationRead.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(markAdminNotificationRead.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        );
      })
      .addCase(markAdminNotificationRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export default adminNotificationsSlice.reducer;
