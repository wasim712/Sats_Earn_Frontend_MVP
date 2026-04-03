// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// // Define the shape of the metrics based on your backend response
// export interface AdminMetrics {
//   users: { total: number; newLast24h: number };
//   campaigns: { active: number };
//   submissions: { pendingManualReview: number; completedLast24h: number };
// }

// interface AdminState {
//   metrics: AdminMetrics | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AdminState = {
//   metrics: null,
//   isLoading: false,
//   error: null,
// };

// // Fetch Metrics API Call
// export const fetchAdminMetrics = createAsyncThunk(
//   'admin/fetchMetrics',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = sessionStorage.getItem('sats_token');
      
//       const response = await fetch(`${API_URL}/admin/metrics`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // Securely pass the auth token
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch metrics');

//       return data as AdminMetrics;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Network error occurred');
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: 'admin',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminMetrics.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminMetrics.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.metrics = action.payload;
//       })
//       .addCase(fetchAdminMetrics.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default adminSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store'; // Ensure this path points to your store

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface AdminMetrics {
  users: { total: number; newLast24h: number };
  campaigns: { active: number };
  submissions: { pendingManualReview: number; completedLast24h: number };
}

interface AdminState {
  metrics: AdminMetrics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const fetchAdminMetrics = createAsyncThunk(
  'admin/fetchMetrics',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Safely grab the token directly from Redux State or SessionStorage
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_URL}/admin/metrics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch metrics');

      return data as AdminMetrics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAdminMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;