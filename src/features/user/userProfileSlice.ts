import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

import type { UserProfile } from '@/types/user';

interface UserProfileState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

function normalizeProfileResponse(data: unknown): UserProfile | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as { data?: unknown; profile?: unknown; user?: unknown };

  if (payload.data && typeof payload.data === 'object') {
    return payload.data as UserProfile;
  }

  if (payload.profile && typeof payload.profile === 'object') {
    return payload.profile as UserProfile;
  }

  if (payload.user && typeof payload.user === 'object') {
    return payload.user as UserProfile;
  }

  return data as UserProfile;
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

      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return normalizeProfileResponse(data);
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

      await obfuscatedJsonRequest(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
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
