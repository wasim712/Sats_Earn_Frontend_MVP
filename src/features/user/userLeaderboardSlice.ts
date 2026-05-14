import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserLeaderboard } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserLeaderboardState {
  data: UserLeaderboard | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserLeaderboardState = {
  data: null,
  isLoading: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchUserLeaderboard = createAsyncThunk(
  'userLeaderboard/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/users/leaderboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leaderboard data.');
      return (await response.json()) as UserLeaderboard;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

const userLeaderboardSlice = createSlice({
  name: 'userLeaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userLeaderboardSlice.reducer;
