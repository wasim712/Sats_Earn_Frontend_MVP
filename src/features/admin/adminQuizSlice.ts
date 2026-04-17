

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  dailyQuizId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  date: string;
  title: string;
  rewardSats: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
    attempts: number;
  };
  questions?: Question[];
}

interface AdminQuizState {
  quizzes: Quiz[];
  singleQuiz: Quiz | null;
  isLoading: boolean;
  isQuestionLoading: boolean; // Granular loader for question CRUD only
  error: string | null;
}

const initialState: AdminQuizState = {
  quizzes: [],
  singleQuiz: null,
  isLoading: false,
  isQuestionLoading: false,
  error: null,
};

// ─── QUIZ THUNKS ─────────────────────────────────────────────────────────────

export const fetchAllQuizzes = createAsyncThunk(
  'adminQuiz/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/admin/quiz/daily`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch quizzes');
      return data as Quiz[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSingleQuiz = createAsyncThunk(
  'adminQuiz/fetchSingle',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/admin/quiz/daily/single/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch quiz details');
      return data as Quiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleQuizStatus = createAsyncThunk(
  'adminQuiz/toggleStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update quiz');
      return { id, isActive };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  'adminQuiz/create',
  async (data: { title: string; date: string; rewardSats: number,questions: Array<{
      questionText: string;
      options: string[];
      correctAnswer: string;
      order: number;
    }>; }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/admin/quiz/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to create quiz');
      return resData as Quiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'adminQuiz/update',
  async ({ id, data }: { id: string; data: Partial<Quiz> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update quiz');
      return resData as Quiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'adminQuiz/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete quiz');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────

const adminQuizSlice = createSlice({
  name: 'adminQuiz',
  initialState,
  reducers: {
    clearQuizState: (state) => {
      state.singleQuiz = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All ──────────────────────────────────────────────────────────
      .addCase(fetchAllQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchAllQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Fetch Single ───────────────────────────────────────────────────────
      .addCase(fetchSingleQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleQuiz = action.payload;
      })
      .addCase(fetchSingleQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Toggle Status ──────────────────────────────────────────────────────
      .addCase(toggleQuizStatus.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) state.quizzes[index].isActive = action.payload.isActive;
        if (state.singleQuiz?.id === action.payload.id) {
          state.singleQuiz.isActive = action.payload.isActive;
        }
      })

      // ── Update Quiz ────────────────────────────────────────────────────────
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) state.quizzes[index] = { ...state.quizzes[index], ...action.payload };
        if (state.singleQuiz?.id === action.payload.id) {
          state.singleQuiz = { ...state.singleQuiz, ...action.payload };
        }
      })

      // ── Create Quiz ────────────────────────────────────────────────────────
      .addCase(createQuiz.fulfilled, (state, action) => {
        if (action.payload?.id) state.quizzes.unshift(action.payload);
      })

      // ── Delete Quiz ────────────────────────────────────────────────────────
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
      })

      
  },
});

export const { clearQuizState } = adminQuizSlice.actions;
export default adminQuizSlice.reducer;