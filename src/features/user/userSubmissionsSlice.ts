import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserSubmissionHistoryItem } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserSubmissionsState {
  items: UserSubmissionHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

function normalizeSubmissionsResponse(data: unknown): UserSubmissionHistoryItem[] {
  if (Array.isArray(data)) {
    return data as UserSubmissionHistoryItem[];
  }

  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; items?: unknown; submissions?: unknown };

    if (Array.isArray(payload.data)) {
      return payload.data as UserSubmissionHistoryItem[];
    }

    if (Array.isArray(payload.items)) {
      return payload.items as UserSubmissionHistoryItem[];
    }

    if (Array.isArray(payload.submissions)) {
      return payload.submissions as UserSubmissionHistoryItem[];
    }
  }

  return [];
}

const initialState: UserSubmissionsState = {
  items: [],
  isLoading: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchUserSubmissions = createAsyncThunk(
  'userSubmissions/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/users/submissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return normalizeSubmissionsResponse(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load submission history');
    }
  }
);

const userSubmissionsSlice = createSlice({
  name: 'userSubmissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSubmissionsSlice.reducer;
