import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserReferralDashboard, UserReferralDashboardView } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserReferralsState {
  data: UserReferralDashboardView | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserReferralsState = {
  data: null,
  isLoading: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

const mapReferralDashboard = (payload: UserReferralDashboard, activeTier?: string): UserReferralDashboardView => ({
  referralCode: payload.referralCode,
  stats: {
    totalInvited: payload.totalReferrals,
    activeReferrals: payload.activeReferrals,
    inactiveReferrals: payload.inactiveReferrals,
    lifetimeEarningsSats: payload.lifetimeEarningsSats,
    referralRewardCapSats: payload.referralRewardCapSats,
  },
  referralsList: payload.referrals,
  activeTier: payload.activeTier || activeTier,
});

export const fetchUserReferrals = createAsyncThunk(
  'userReferrals/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const payload = await obfuscatedJsonRequest<UserReferralDashboard>(`${API_URL}/users/referrals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      let activeTier: string | undefined;
      try {
        const dashboardPayload = await obfuscatedJsonRequest<any>(`${API_URL}/users/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        activeTier = dashboardPayload?.gamification?.activeTier;
      } catch {
      }

      return mapReferralDashboard(payload, activeTier);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userReferralsSlice = createSlice({
  name: 'userReferrals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReferrals.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUserReferrals.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchUserReferrals.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export default userReferralsSlice.reducer;
