import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface AdminSettings {
  welcomeBonusSats: number;
  minWithdrawalSats: number;
  securityLockDays: number;
  referralBonusPercent: number;
  baseXpPerTask: number;
  dailyStreakBonusXp: number;
  tierReferralMatrix: Record<string, number>;
  tierMinWithdrawalMatrix: Record<string, number>;
}

interface AdminSettingsState {
  settings: AdminSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: AdminSettingsState = {
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

export const fetchAdminSettings = createAsyncThunk(
  'adminSettings/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to load platform settings.');
      return data as AdminSettings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdminSettings = createAsyncThunk(
  'adminSettings/update',
  async (payload: AdminSettings, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update settings.');
      return data as AdminSettings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSettingsSlice = createSlice({
  name: 'adminSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchAdminSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminSettings.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateAdminSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.settings = action.payload;
      })
      .addCase(updateAdminSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSettingsSlice.reducer;
