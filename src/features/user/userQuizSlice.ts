import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store'; // Adjust path if needed

// --- Types ---
export interface UserQuestion {
  id: string;
  questionText: string;
  options: string[];
  order: number;
}

export interface TodayQuiz {
  id: string;
  title: string;
  rewardSats: number;
  questions: UserQuestion[];
}

export interface QuizResult {
  message: string;
  passed: boolean;
  score: number;
  rewardEarned: number;
}

interface UserQuizState {
  quiz: TodayQuiz | null;
  result: QuizResult | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: UserQuizState = {
  quiz: null,
  result: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// --- Thunks ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // Adjust to your env

export const fetchTodayQuiz = createAsyncThunk(
  'userQuiz/fetchToday',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/users/quiz/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to fetch quiz');
      return data as TodayQuiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitTodayQuiz = createAsyncThunk(
  'userQuiz/submitToday',
  async (answers: { questionId: string; answer: string }[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await fetch(`${API_URL}/users/quiz/today/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Failed to submit quiz');
      return data as QuizResult;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice ---
const userQuizSlice = createSlice({
  name: 'userQuiz',
  initialState,
  reducers: {
    clearQuizState: (state) => {
      state.quiz = null;
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodayQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quiz = action.payload;
      })
      .addCase(fetchTodayQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit
      .addCase(submitTodayQuiz.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitTodayQuiz.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.result = action.payload;
      })
      .addCase(submitTodayQuiz.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearQuizState } = userQuizSlice.actions;
export default userQuizSlice.reducer;