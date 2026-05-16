 import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'PROMOTION';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminAnnouncementsState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAnnouncementsState = {
  announcements: [],
  isLoading: false,
  error: null,
};

export const fetchAllAnnouncements = createAsyncThunk(
  'adminAnnouncements/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await parseObfuscatedJson<Announcement[] | { error?: string }>(response);
      if (!response.ok) throw new Error((data as { error?: string }).error || 'Failed to fetch announcements');
      return data as Announcement[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleAnnouncementStatus = createAsyncThunk(
  'adminAnnouncements/toggleStatus',
  async ({ id, isActive }: { id: string, isActive: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const data = await parseObfuscatedJson<{ error?: string }>(response);
        throw new Error(data.error || 'Failed to update announcement');
      }
      return { id, isActive }; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'adminAnnouncements/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await parseObfuscatedJson<{ error?: string }>(response);
        throw new Error(data.error || 'Failed to delete announcement');
      }
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
//creating new annoucnements
export const createAnnouncement = createAsyncThunk(
  'adminAnnouncements/create',
  async (data: { title: string; content: string; type: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/announcements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<Announcement | { error?: string; message?: string; announcement?: Announcement }>(response);
      if (!response.ok) throw new Error((resData as { error?: string; message?: string }).error || (resData as { error?: string; message?: string }).message || 'Failed to create announcement');
      return ((resData as { announcement?: Announcement }).announcement || resData) as Announcement; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
//updating existing announcement
export const updateAnnouncement = createAsyncThunk(
  'adminAnnouncements/update',
  async ({ id, data }: { id: string, data: Partial<Announcement> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<Announcement | { error?: string; message?: string; announcement?: Announcement }>(response);
      if (!response.ok) throw new Error((resData as { error?: string; message?: string }).error || (resData as { error?: string; message?: string }).message || 'Failed to update announcement');
      return ((resData as { announcement?: Announcement }).announcement || resData) as Announcement; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const adminAnnouncementsSlice = createSlice({
  name: 'adminAnnouncements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnnouncements.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAllAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAllAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleAnnouncementStatus.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.announcements[index].isActive = action.payload.isActive;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a.id !== action.payload);
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        // Only unshift if the backend returned a valid object with an ID
        if (action.payload && action.payload.id) {
          state.announcements.unshift(action.payload);
        }
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          // Merge the updated data into the existing announcement perfectly
          state.announcements[index] = { ...state.announcements[index], ...action.payload };
        }
      });
  },
});

export default adminAnnouncementsSlice.reducer;