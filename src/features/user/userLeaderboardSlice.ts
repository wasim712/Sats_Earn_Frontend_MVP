import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserLeaderboard } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserLeaderboardState {
  data: UserLeaderboard | null;
  isLoading: boolean;
  error: string | null;
}

function normalizeLeaderboardResponse(data: unknown): UserLeaderboard | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as { data?: unknown; leaderboard?: unknown };

  if (payload.data && typeof payload.data === 'object') {
    return payload.data as UserLeaderboard;
  }

  if (payload.leaderboard && typeof payload.leaderboard === 'object') {
    return payload.leaderboard as UserLeaderboard;
  }

  return data as UserLeaderboard;
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
      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/users/leaderboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return normalizeLeaderboardResponse(data);
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
