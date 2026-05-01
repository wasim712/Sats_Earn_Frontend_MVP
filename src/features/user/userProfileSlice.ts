import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

import type { UserProfile } from '@/types/user';

interface UserProfileState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch profile');
      return data as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  'userProfile/update',
  async (data: {
    fullName?: string;
    phone?: string;
    twitterHandle?: string;
    instagramHandle?: string;
    telegramHandle?: string;
    discordHandle?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to update profile');
      
      // We return the payload data so we can update the local Redux state instantly
      return data; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // ... inside your extraReducers builder, add these cases:
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Merge the updated fields directly into the existing profile state
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;