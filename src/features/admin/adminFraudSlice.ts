import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- TYPES ---
export interface FraudReport {
  userId: string;
  email: string;
  riskScore: number;
  riskLevel : string;
  flags: string[];
}

interface FraudState {
  highRiskQueue: FraudReport[];
  selectedUserReport: FraudReport | null;
  isQueueLoading: boolean;
  isReportLoading: boolean;
  error: string | null;
}

const initialState: FraudState = {
  highRiskQueue: [],
  selectedUserReport: null,
  isQueueLoading: false,
  isReportLoading: false,
  error: null,
};

// --- HELPER ---
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('sats_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// --- API CALLS (THUNKS) ---

// 1. Fetch the High Risk Queue
export const fetchHighRiskQueue = createAsyncThunk(
  'adminFraud/fetchHighRiskQueue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await obfuscatedFetch(`${API_URL}/security/fraud/high-risk`, {
        headers: getAuthHeaders(),
      });
      
      // 1. Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If it's HTML, we throw a string error instead of trying to parse it
        throw new Error(`Server returned non-JSON response. Check your API route (${response.status})`);
      }

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch high-risk queue');

      return data as FraudReport[];
    } catch (error: Error | unknown) {
      // 2. Ensure we ONLY pass a string message, never the raw Error object
      return rejectWithValue(error || 'Network error occurred');
    }
  }
);


export const fetchUserFraudReport = createAsyncThunk(
  'adminFraud/fetchUserFraudReport',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await obfuscatedFetch(`${API_URL}/security/fraud/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      
      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch user fraud report');

      return data as FraudReport;
    } catch (error: Error|unknown) {
      return rejectWithValue(error || 'Network error occurred');
    }
  }
);

// --- SLICE & REDUCERS ---

const adminFraudSlice = createSlice({
  name: 'adminFraud',
  initialState,
  reducers: {
    clearFraudError: (state) => {
      state.error = null;
    },
    clearSelectedReport: (state) => {
      state.selectedUserReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch High Risk Queue
      .addCase(fetchHighRiskQueue.pending, (state) => {
        state.isQueueLoading = true;
        state.error = null;
      })
      .addCase(fetchHighRiskQueue.fulfilled, (state, action: PayloadAction<FraudReport[]>) => {
        state.isQueueLoading = false;
        state.highRiskQueue = action.payload;
      })
      .addCase(fetchHighRiskQueue.rejected, (state, action) => {
        state.isQueueLoading = false;
        state.error = action.payload as string;
      })

      // Fetch User Fraud Report
      .addCase(fetchUserFraudReport.pending, (state) => {
        state.isReportLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFraudReport.fulfilled, (state, action: PayloadAction<FraudReport>) => {
        state.isReportLoading = false;
        state.selectedUserReport = action.payload;
      })
      .addCase(fetchUserFraudReport.rejected, (state, action) => {
        state.isReportLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFraudError, clearSelectedReport } = adminFraudSlice.actions;
export default adminFraudSlice.reducer;
