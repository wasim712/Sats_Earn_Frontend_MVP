import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import type { AdminWithdrawal } from '@/types/admin';

interface AdminPaymentsState {
  withdrawals: AdminWithdrawal[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: AdminPaymentsState = {
  withdrawals: [],
  isLoading: false,
  isProcessing: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

function normalizeWithdrawals(data: unknown): AdminWithdrawal[] {
  if (Array.isArray(data)) return data as AdminWithdrawal[];

  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; withdrawals?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as AdminWithdrawal[];
    if (Array.isArray(payload.withdrawals)) return payload.withdrawals as AdminWithdrawal[];
    if (Array.isArray(payload.items)) return payload.items as AdminWithdrawal[];
  }

  return [];
}

export const fetchAdminWithdrawals = createAsyncThunk(
  'adminPayments/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch withdrawals queue.');
      return normalizeWithdrawals(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveWithdrawal = createAsyncThunk(
  'adminPayments/approve',
  async ({ id, paymentProof }: { id: string; paymentProof: string }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/withdrawals/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentProof }),
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to approve withdrawal.');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectWithdrawal = createAsyncThunk(
  'adminPayments/reject',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to reject withdrawal.');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminPaymentsSlice = createSlice({
  name: 'adminPayments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchAdminWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(approveWithdrawal.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.withdrawals = state.withdrawals.filter((withdrawal) => withdrawal.id !== action.payload);
      })
      .addCase(approveWithdrawal.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      .addCase(rejectWithdrawal.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.withdrawals = state.withdrawals.filter((withdrawal) => withdrawal.id !== action.payload);
      })
      .addCase(rejectWithdrawal.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export default adminPaymentsSlice.reducer;
