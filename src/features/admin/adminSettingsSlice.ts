import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UserSidebarConfig {
  dashboard: boolean;
  tasks: boolean;
  standaloneTasks: boolean;
  minigames: boolean;
  bugBounty: boolean;
  quiz: boolean;
  referrals: boolean;
  rewards: boolean;
  leaderboard: boolean;
  wallet: boolean;
  settings: boolean;
  help: boolean;
  notifications: boolean;
  profile: boolean;
  shareAndEarn: boolean;
}

export interface AdminSettings {
  welcomeBonusSats: number;
  minWithdrawalSats: number;
  securityLockDays: number;
  referralBonusPercent: number;
  baseXpPerTask: number;
  dailyStreakBonusXp: number;
  btcPriceUsd: number;
  tierReferralMatrix: Record<string, number>;
  tierMinWithdrawalMatrix: Record<string, number>;
  premiumMonthlySatsMatrix: Record<string, number>;
  premiumYearlySatsMatrix: Record<string, number>;
  premiumMonthlyUsdMatrix: Record<string, number>;
  premiumYearlyUsdMatrix: Record<string, number>;
  userSidebarConfig: UserSidebarConfig;
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
      const response = await obfuscatedFetch(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to load platform settings.');
      return ((data.settings || data) as AdminSettings);
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
      const response = await obfuscatedFetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update settings.');
      return ((data.settings || data) as AdminSettings);
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
