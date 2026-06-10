import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import { decryptPayload } from '@/lib/crypto';

// ─── Types ───
import type { AdminUser, AdminUserDetail } from '@/types/admin';
export type { AdminUser, AdminUserDetail } from '@/types/admin';

interface AdminUsersState {
  users: AdminUser[];
  selectedUserDetail: AdminUserDetail | null;
  detailLoading: boolean;
  actionLoading: boolean;
  isLoading: boolean;
  error: string | null;
  detailError: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  selectedUserDetail: null,
  detailLoading: false,
  actionLoading: false,
  isLoading: false,
  error: null,
  detailError: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function decryptIpField(value: string | null | undefined) {
  if (!value) return value ?? null;

  try {
    const decrypted = await decryptPayload(value);
    return decrypted || 'Unavailable';
  } catch {
    return value.startsWith('enc:') ? 'Unavailable' : value;
  }
}

async function normalizeUserDetail(data: unknown): Promise<AdminUserDetail> {
  let detail: AdminUserDetail;

  if (data && typeof data === 'object') {
    const payload = data as { user?: unknown; data?: unknown; detail?: unknown };
    if (payload.user && typeof payload.user === 'object') {
      detail = payload.user as AdminUserDetail;
    } else if (payload.data && typeof payload.data === 'object') {
      detail = payload.data as AdminUserDetail;
    } else if (payload.detail && typeof payload.detail === 'object') {
      detail = payload.detail as AdminUserDetail;
    } else {
      detail = data as AdminUserDetail;
    }
  } else {
    detail = data as AdminUserDetail;
  }

  const [registrationIp, lastIpAddress] = await Promise.all([
    decryptIpField(detail.registrationIp),
    decryptIpField(detail.lastIpAddress),
  ]);

  // console.log('Admin user detail IPs', {
  //   registrationIp,
  //   lastIpAddress,
  // });

  return {
    ...detail,
    registrationIp,
    lastIpAddress,
  };
}

function normalizeUsers(data: unknown): AdminUser[] {
  if (Array.isArray(data)) return data as AdminUser[];

  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; users?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as AdminUser[];
    if (Array.isArray(payload.users)) return payload.users as AdminUser[];
    if (Array.isArray(payload.items)) return payload.items as AdminUser[];
  }

  return [];
}

export const fetchUserDetail = createAsyncThunk(
  'adminUsers/fetchDetail',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await obfuscatedFetch(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch user details');
      return normalizeUserDetail(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user details';
      return rejectWithValue(message);
    }
  }
);

export const performUserAction = createAsyncThunk(
  'adminUsers/action',
  async ({ userId, action }: { userId: string; action: 'ban' | 'activate' | 'delete' }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const method = action === 'delete' ? 'DELETE' : 'POST';
      const endpoint =
        action === 'ban'
          ? `${API_URL}/admin/users/${userId}/ban`
          : action === 'activate'
            ? `${API_URL}/admin/users/${userId}/activate`
            : `${API_URL}/admin/users/${userId}`;

      const response = await obfuscatedFetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || `Failed to ${action} user`);
      return { userId, action };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'User action failed';
      return rejectWithValue(message);
    }
  }
);

export const updateUserPremium = createAsyncThunk(
  'adminUsers/updatePremium',
  async (
    {
      userId,
      premiumTier,
      premiumExpiresAt,
    }: {
      userId: string;
      premiumTier: 'PLATINUM' | 'DIAMOND' | 'CROWN' | 'ELITE' | 'FOUNDER' | null;
      premiumExpiresAt: string | null;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await obfuscatedFetch(`${API_URL}/admin/users/${userId}/premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ premiumTier, premiumExpiresAt }),
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update user premium tier');
      return normalizeUserDetail(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user premium tier';
      return rejectWithValue(message);
    }
  }
);

export const adjustUserSubmissionReward = createAsyncThunk(
  'adminUsers/adjustSubmissionReward',
  async (
    { userId, submissionId, amountSats, note }: { userId: string; submissionId: string; amountSats: number; note?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
      const response = await obfuscatedFetch(`${API_URL}/admin/users/${userId}/submission-adjustment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ submissionId, amountSats, note }),
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to adjust submission reward');
      return normalizeUserDetail(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to adjust submission reward';
      return rejectWithValue(message);
    }
  }
);

// ─── Thunks ───
export const fetchAllUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      // Adjust the route if your backend is mounted differently (e.g., just /users)
      const response = await obfuscatedFetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch users');
      
      return normalizeUsers(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      return rejectWithValue(message);
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
      state.selectedUserDetail = null;
      state.error = null;
      state.detailError = null;
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
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUserDetail = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(performUserAction.pending, (state) => {
        state.actionLoading = true;
        state.detailError = null;
      })
      .addCase(performUserAction.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload.action === 'delete') {
          state.users = state.users.filter((user) => user.id !== action.payload.userId);
          if (state.selectedUserDetail?.id === action.payload.userId) {
            state.selectedUserDetail = null;
          }
        }
      })
      .addCase(performUserAction.rejected, (state, action) => {
        state.actionLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(updateUserPremium.pending, (state) => {
        state.actionLoading = true;
        state.detailError = null;
      })
      .addCase(updateUserPremium.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedUserDetail = action.payload;
        state.users = state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                premiumTier: action.payload.premiumTier,
                premiumExpiresAt: action.payload.premiumExpiresAt,
                activeTier: action.payload.activeTier,
                isPremium: action.payload.isPremium,
              }
            : user,
        );
      })
      .addCase(updateUserPremium.rejected, (state, action) => {
        state.actionLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(adjustUserSubmissionReward.pending, (state) => {
        state.actionLoading = true;
        state.detailError = null;
      })
      .addCase(adjustUserSubmissionReward.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedUserDetail = action.payload;
        state.users = state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                balanceAvailable: action.payload.balanceAvailable,
                balancePending: action.payload.balancePending,
                balanceLocked: action.payload.balanceLocked,
                totalXp: action.payload.totalXp,
                premiumTier: action.payload.premiumTier,
                premiumExpiresAt: action.payload.premiumExpiresAt,
                activeTier: action.payload.activeTier,
                isPremium: action.payload.isPremium,
                underlyingFreeTier: action.payload.underlyingFreeTier,
              }
            : user,
        );
      })
      .addCase(adjustUserSubmissionReward.rejected, (state, action) => {
        state.actionLoading = false;
        state.detailError = action.payload as string;
      });
  },
});

export const { clearUsersState } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
