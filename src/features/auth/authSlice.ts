
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Pull the URL from your .env.local file
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 1. Define your TypeScript types
export interface SignUpPayload {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  country: string;
  dateOfBirth: string;
  referralCode?: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean; 
  isLoading: boolean;
  error: string | null;
  step: 1 | 2; 
  tempData: SignUpPayload | null;
}

// 2. Set the Initial State
// Safely check SESSION storage so users stay logged in only for this session
const tokenFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('sats_token') : null;
// FIXED: Also grab the user object from session storage so it survives reloads!
const userFromStorage = typeof window !== 'undefined' && sessionStorage.getItem('sats_user') 
  ? JSON.parse(sessionStorage.getItem('sats_user') as string) 
  : null;

const initialState: AuthState = {
  user: userFromStorage, // Restored the user object
  token: tokenFromStorage, 
  isAuthenticated: !!tokenFromStorage, 
  isLoading: false,
  error: null,
  step: 1,
  tempData: null,
};

// --- API CALLS (THUNKS) ---

// Step 1: Request OTP
export const requestSignupOtp = createAsyncThunk(
  'auth/requestOtp',
  async (formData: SignUpPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to send OTP');

      return formData; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Step 2: Verify OTP
export const verifySignupOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp }), 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Invalid OTP');

      return data; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Step 3: Sign In 
export const signInUser = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Invalid credentials');

      return data; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// --- SLICE & REDUCERS ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    goBackToStep1: (state) => {
      state.step = 1;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; 
      state.step = 1;
      state.tempData = null;
      // FIXED: Remove BOTH from Session Storage on logout
      sessionStorage.removeItem('sats_token');
      sessionStorage.removeItem('sats_user');
    }
  },
  extraReducers: (builder) => {
    builder
      // --- SIGN IN STATES ---
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; 
        state.user = action.payload.user; 
        state.token = action.payload.session; 
        
        // FIXED: Save both Token AND User to session storage
        sessionStorage.setItem('sats_token', action.payload.session);
        sessionStorage.setItem('sats_user', JSON.stringify(action.payload.user));
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- REQUEST OTP STATES ---
      .addCase(requestSignupOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestSignupOtp.fulfilled, (state, action: PayloadAction<SignUpPayload>) => {
        state.isLoading = false;
        state.step = 2; 
        state.tempData = action.payload; 
      })
      .addCase(requestSignupOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      })

      // --- VERIFY OTP STATES ---
      .addCase(verifySignupOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; 
        state.user = action.payload.user; 
        state.token = action.payload.session; 
        state.step = 1; 
        state.tempData = null; 

        // FIXED: Save both Token AND User to session storage
        sessionStorage.setItem('sats_token', action.payload.session);
        sessionStorage.setItem('sats_user', JSON.stringify(action.payload.user));
      })
      .addCase(verifySignupOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthError, goBackToStep1, logout } = authSlice.actions;
export default authSlice.reducer;