
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import type { AuthUser, SignUpPayload } from '@/types/user';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
};
// ADD THIS below it
const extractApiError = (data: any, fallback: string): string => {
  // Handle Zod/validation details array: { details: [{ path, message }] }
  if (Array.isArray(data.details) && data.details.length > 0) {
    return data.details
      .map((d: { path?: string; message: string }) => {
        // Strip "body." prefix from path so it reads cleanly
        const field = d.path
          ? d.path.replace(/^body\./, '').replace(/^params\./, '')
          : null;
        return field ? `${field}: ${d.message}` : d.message;
      })
      .join(' · ');
  }
  // Fallback to top-level error/message string
  return data.error || data.message || fallback;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean; 
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  step: 1 | 2; 
  tempData: SignUpPayload | null;
}

const getStorageToken = () => {
  if (typeof window === 'undefined') return;

  return localStorage.getItem('sats_token') || sessionStorage.getItem('sats_token');
};

const getStorageUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('sats_user') || sessionStorage.getItem('sats_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to parse user from storage:', error);
    return null;
  }
};

const persistAuthSession = (token: string | null, user: AuthUser | null) => {
  if (typeof window === 'undefined') return;

  if (token) {
    sessionStorage.setItem('sats_token', token);
    localStorage.setItem('sats_token', token);
  } else {
    sessionStorage.removeItem('sats_token');
    localStorage.removeItem('sats_token');
  }

  if (!user) {
    sessionStorage.removeItem('sats_user');
    localStorage.removeItem('sats_user');
    return;
  }

  const serializedUser = JSON.stringify(user);
  sessionStorage.setItem('sats_user', serializedUser);
  localStorage.setItem('sats_user', serializedUser);
};

const persistAuthUser = (user: AuthUser | null) => {
  const token = getStorageToken();
  persistAuthSession(token || null, user);
};

// --- SAFE STORAGE HELPERS ---
const getSafeToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');
};

const getSafeUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = sessionStorage.getItem('sats_user') || localStorage.getItem('sats_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse user from storage:", error);
    return null;
  }
};

const tokenFromStorage = getSafeToken();
const userFromStorage = getSafeUser();

const initialState: AuthState = {
  user: userFromStorage,
  token: tokenFromStorage, 
  isAuthenticated: !!tokenFromStorage, 
  isInitialized: false,
  isLoading: false,
  error: null,
  step: 1,
  tempData: null,
};

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    const token = getStorageToken() || null;
    const storedUser = getStorageUser();

    if (!token) {
      return { token: null, user: null };
    }

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(extractApiError(data, 'Failed to restore session'));
      }

      return {
        token,
        user: storedUser ? { ...storedUser, ...data } : data,
      };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to restore session'));
    }
  }
);

// --- API CALLS (THUNKS) ---

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
      if (!response.ok) throw new Error(extractApiError(data, 'Failed to send OTP'));

      return formData; 
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Network error occurred'));
    }
  }
);

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
      if (!response.ok) throw new Error(extractApiError(data, 'Invalid OTP'));

      return data; 
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Network error occurred'));
    }
  }
);

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
      if (!response.ok) throw new Error(extractApiError(data, 'Invalid credentials'));


      return data; 
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Network error occurred'));
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(extractApiError(data, 'Failed to send reset code'));

      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Network error occurred'));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    payload: { email: string; token: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(extractApiError(data, 'Failed to reset password'));

      return data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Network error occurred'));
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
      state.isInitialized = true;
      state.step = 1;
      state.tempData = null;
      
      // 🚨 FIXED: Clear both storages fully
      sessionStorage.removeItem('sats_token');
      sessionStorage.removeItem('sats_user');
      localStorage.removeItem('sats_token');
      localStorage.removeItem('sats_user');
    },
    syncUserTier: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      persistAuthUser(state.user);
    },
    updateOnboardingState: (state, action: PayloadAction<Pick<AuthUser, 'hasCompletedOnboarding' | 'hasSkippedOnboarding' | 'shouldShowOnboarding'>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      persistAuthUser(state.user);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; 
        state.isInitialized = true;
        state.user = action.payload.user; 
        state.token = action.payload.session; 
        
        persistAuthSession(action.payload.session, action.payload.user);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string; // Will now cleanly receive a string
      })

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

      .addCase(verifySignupOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true; 
        state.isInitialized = true;
        state.user = action.payload.user; 
        state.token = action.payload.session; 
        state.step = 1; 
        state.tempData = null; 

        persistAuthSession(action.payload.session, action.payload.user);
      })
      .addCase(verifySignupOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = Boolean(action.payload.token && action.payload.user);
        persistAuthSession(action.payload.token, action.payload.user);
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        persistAuthSession(null, null);
      });
  },
});

export const { resetAuthError, goBackToStep1, logout, syncUserTier, updateOnboardingState } = authSlice.actions;
export default authSlice.reducer;
