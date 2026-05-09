import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface AdminSubmissionUser {
  email: string;
  fullName: string | null;
  totalXp: number;
  premiumTier: string | null;
  premiumExpiresAt: string | null;
  isActive: boolean;
  activeTier: string | null;
  isPremium: boolean;
}

export interface AdminSubmissionTask {
  title: string;
  rewardSatsOverride?: number | null;
  campaign: {
    title: string;
    baseRewardSats: number;
    tierRewardMatrix?: Record<string, number> | null;
  };
}

export interface AdminSubmission {
  id: string;
  userId: string;
  taskId: string;
  screenshotUrl: string;
  imageHash: string | null;
  confidenceScore: number | null;
  status: string;
  rejectionReason: string | null;
  submittedAt: string;
  reviewedById: string | null;
  unlockAt: string | null;
  user: AdminSubmissionUser;
  task: AdminSubmissionTask;
}

interface ReviewPayload {
  id: string;
  status: 'LOCKED_15D' | 'REJECTED';
  rejectionReason?: string;
}

interface AdminSubmissionsState {
  submissions: AdminSubmission[];
  isLoading: boolean;
  isReviewing: boolean;
  error: string | null;
}

const initialState: AdminSubmissionsState = {
  submissions: [],
  isLoading: false,
  isReviewing: false,
  error: null,
};

export const fetchPendingSubmissions = createAsyncThunk(
  'adminSubmissions/fetchPending',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/admin/submissions/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch pending submissions');
      }

      return data as AdminSubmission[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  'adminSubmissions/review',
  async ({ id, status, rejectionReason }: ReviewPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/admin/submissions/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, rejectionReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to review submission');
      }

      return { id, status, response: data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const adminSubmissionsSlice = createSlice({
  name: 'adminSubmissions',
  initialState,
  reducers: {
    clearSubmissionsState: (state) => {
      state.submissions = [];
      state.error = null;
      state.isLoading = false;
      state.isReviewing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchPendingSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(reviewSubmission.pending, (state) => {
        state.isReviewing = true;
        state.error = null;
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        state.isReviewing = false;
        state.submissions = state.submissions.filter((submission) => submission.id !== action.payload.id);
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.isReviewing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubmissionsState } = adminSubmissionsSlice.actions;
export default adminSubmissionsSlice.reducer;
