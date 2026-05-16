import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { TodayQuiz, TodayQuizResponse, QuizResult } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const fetchTodayQuiz = createAsyncThunk(
  'userQuiz/fetchToday',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      const data = await obfuscatedJsonRequest<TodayQuiz | TodayQuizResponse>(`${API_URL}/users/quiz/today`, { headers: { Authorization: `Bearer ${token}` } });

      if (data && typeof data === 'object' && 'quiz' in data) {
        return data as TodayQuizResponse;
      }

      return { status: 'available', quiz: data as TodayQuiz } as TodayQuizResponse;
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
      const data = await obfuscatedJsonRequest<QuizResult>(`${API_URL}/users/quiz/today/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      return data as QuizResult;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
      .addCase(fetchTodayQuiz.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTodayQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quiz = action.payload.quiz;
        state.result = action.payload.result ?? null;
      })
      .addCase(fetchTodayQuiz.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(submitTodayQuiz.pending, (state) => { state.isSubmitting = true; state.error = null; })
      .addCase(submitTodayQuiz.fulfilled, (state, action) => { state.isSubmitting = false; state.result = action.payload; })
      .addCase(submitTodayQuiz.rejected, (state, action) => { state.isSubmitting = false; state.error = action.payload as string; });
  },
});

export const { clearQuizState } = userQuizSlice.actions;
export default userQuizSlice.reducer;
