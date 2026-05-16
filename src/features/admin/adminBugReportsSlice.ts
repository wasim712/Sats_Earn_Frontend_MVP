import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import type { RootState } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export type AdminBugReport = {
  id: string;
  title: string;
  description: string;
  screenshotUrl?: string | null;
  status: 'OPEN' | 'REWARDED' | 'REJECTED';
  rewardSats: number;
  adminNotes?: string | null;
  createdAt: string;
  user: { fullName?: string | null; email: string };
};

type ReviewPayload = {
  id: string;
  status: 'REWARDED' | 'REJECTED';
  rewardSats?: number;
  adminNotes?: string;
};

interface AdminBugReportsState {
  items: AdminBugReport[];
  isLoading: boolean;
  loadingId: string | null;
  error: string | null;
}

const initialState: AdminBugReportsState = {
  items: [],
  isLoading: false,
  loadingId: null,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchAdminBugReports = createAsyncThunk('adminBugReports/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/bug-reports`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await parseObfuscatedJson<AdminBugReport[] | { error?: string }>(response);
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Failed to load bug reports.');
    return data as AdminBugReport[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to load bug reports.');
  }
});

export const reviewAdminBugReport = createAsyncThunk('adminBugReports/review', async (payload: ReviewPayload, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/bug-reports/${payload.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: payload.status, rewardSats: payload.rewardSats || 0, adminNotes: payload.adminNotes || '' }),
    });
    const data = await parseObfuscatedJson<{ error?: string } | Record<string, never>>(response);
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Failed to review bug report.');
    return payload.id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to review bug report.');
  }
});

const adminBugReportsSlice = createSlice({
  name: 'adminBugReports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBugReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBugReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminBugReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(reviewAdminBugReport.pending, (state, action) => {
        state.loadingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(reviewAdminBugReport.fulfilled, (state) => {
        state.loadingId = null;
      })
      .addCase(reviewAdminBugReport.rejected, (state, action) => {
        state.loadingId = null;
        state.error = action.payload as string;
      });
  },
});

export default adminBugReportsSlice.reducer;
