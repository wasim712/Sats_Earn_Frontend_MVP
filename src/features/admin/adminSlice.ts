
// export default adminSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store'; // Ensure this path points to your store
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface AdminMetrics {
  users: {
    total: number;
    accountActive: number;
    accountInactive: number;
    newLast24h: number;
    activeLast24h: number;
    premium: number;
  };
  campaigns: { active: number; total: number; doubleRewardsConfigured: number };
  submissions: { pendingManualReview: number; completedLast24h: number; rejectedLast24h: number };
  withdrawals: { pending: number; paid: number };
  sats: { pendingPool: number; paidOut: number };
  charts: {
    signupsLast7d: Array<{ date: string; count: number }>;
    submissionsLast7d: Array<{ date: string; approved: number; rejected: number }>;
    satsDistributedLast7d: Array<{ date: string; sats: number }>;
  };
}

interface AdminState {
  metrics: AdminMetrics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const fetchAdminMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Safely grab the token directly from Redux State or SessionStorage
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      if (!token) throw new Error('No authentication token found');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/metrics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      const data = await parseObfuscatedJson<AdminMetrics & { error?: string; message?: string }>(response);
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch metrics');

      return data as AdminMetrics;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error occurred');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAdminMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
