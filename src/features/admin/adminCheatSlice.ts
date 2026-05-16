import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { CheatUserState } from '@/app/admin/cheat/cheat.types';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type UpdateCheatPayload = {
  totalXp: number;
  balanceAvailable: number;
  balancePending: number;
  balanceLocked: number;
  currentStreak: number;
  lastClaimedStreakMilestone: number;
  premiumTier: 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER' | null;
  premiumExpiresAt: string | null;
  isActive: boolean;
};

interface AdminCheatState {
  user: CheatUserState | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminCheatState = {
  user: null,
  isLoading: false,
  isSaving: false,
  error: null,
  success: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

export const fetchCheatUser = createAsyncThunk(
  'adminCheat/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/cheat-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to load cheat user.');
      return data as CheatUserState;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCheatUser = createAsyncThunk(
  'adminCheat/updateUser',
  async (payload: UpdateCheatPayload, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await obfuscatedFetch(`${API_URL}/admin/cheat-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update cheat user.');
      return data.user as CheatUserState;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminCheatSlice = createSlice({
  name: 'adminCheat',
  initialState,
  reducers: {
    clearCheatFeedback: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheatUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCheatUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCheatUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCheatUser.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCheatUser.fulfilled, (state, action) => {
        state.isSaving = false;
        state.user = action.payload;
        state.success = 'Cheat controls updated successfully.';
      })
      .addCase(updateCheatUser.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCheatFeedback } = adminCheatSlice.actions;
export default adminCheatSlice.reducer;
