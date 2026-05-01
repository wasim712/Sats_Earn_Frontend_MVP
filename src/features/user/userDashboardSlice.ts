import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserDashboard } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserDashboardState {
  data: UserDashboard | null;
  isLoading: boolean;
  error: string | null;
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
      const response = await fetch(`${API_URL}/users/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data. Please try again.');
      return (await response.json()) as UserDashboard;
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
