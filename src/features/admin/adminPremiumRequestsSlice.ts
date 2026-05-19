import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface AdminPremiumRequest {
  id: string;
  plan: string;
  intent: 'NOTIFY_ME' | 'UPGRADE';
  status: 'OPEN' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED';
  source?: string | null;
  userEmail: string;
  userFullName?: string | null;
  userActiveTier: string;
  adminNotes?: string | null;
  contactedAt?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName?: string | null;
    premiumTier?: string | null;
    premiumExpiresAt?: string | null;
    totalXp?: number;
    isActive?: boolean;
  };
}

interface AdminPremiumRequestsState {
  requests: AdminPremiumRequest[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminPremiumRequestsState = {
  requests: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchAdminPremiumRequests = createAsyncThunk(
  'adminPremiumRequests/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/premium-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch premium requests');
      return Array.isArray(data) ? data as AdminPremiumRequest[] : [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdminPremiumRequest = createAsyncThunk(
  'adminPremiumRequests/update',
  async (
    { id, status, adminNotes }: { id: string; status: 'OPEN' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED'; adminNotes?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/premium-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update premium request');
      return data.request as AdminPremiumRequest;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminPremiumRequestsSlice = createSlice({
  name: 'adminPremiumRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPremiumRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminPremiumRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAdminPremiumRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminPremiumRequest.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAdminPremiumRequest.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.requests = state.requests.map((request) => request.id === action.payload.id ? action.payload : request);
      })
      .addCase(updateAdminPremiumRequest.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export default adminPremiumRequestsSlice.reducer;
