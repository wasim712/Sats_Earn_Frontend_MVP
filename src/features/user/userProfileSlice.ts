import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  twitterHandle: string | null;
  instagramHandle: string | null;
  telegramHandle: string | null;
  discordHandle: string | null;
  referralCode: string;
  createdAt: string;
}

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      });
  },
});

export default userProfileSlice.reducer;