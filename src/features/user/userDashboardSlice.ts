import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserDashboard } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserDashboardState {
  data: UserDashboard | null;
  isLoading: boolean;
  error: string | null;
}

function normalizeDashboardResponse(data: unknown): UserDashboard | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as { data?: unknown; dashboard?: unknown };

  if (payload.data && typeof payload.data === 'object') {
    return payload.data as UserDashboard;
  }

  if (payload.dashboard && typeof payload.dashboard === 'object') {
    return payload.dashboard as UserDashboard;
  }

  return data as UserDashboard;
}

const initialState: UserDashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchUserDashboard = createAsyncThunk(
  'userDashboard/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/users/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return normalizeDashboardResponse(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDashboard.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUserDashboard.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchUserDashboard.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export default userDashboardSlice.reducer;
