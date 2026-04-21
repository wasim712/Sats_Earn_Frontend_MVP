import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

// ─── Types ───
export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  totalXp: number;
  premiumTier: string | null;
  premiumExpiresAt: string | null;
  isActive: boolean;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  referralCode: string | null;
  _count: { referrals: number; submissions: number };
  createdAt: string;
  lastActivityAt: string | null;
  activeTier: string;
  isPremium: boolean;
  underlyingFreeTier: string;
}

interface AdminUsersState {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  isLoading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Thunks ───
export const fetchAllUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      // Adjust the route if your backend is mounted differently (e.g., just /users)
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch users');
      
      return data as AdminUser[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ───
const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearUsersState: (state) => {
      state.users = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersState } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;