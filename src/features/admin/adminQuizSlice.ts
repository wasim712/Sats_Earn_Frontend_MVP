import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { AdminQuiz, AdminQuizQuestion } from '@/types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export type Quiz = AdminQuiz;
export type Question = AdminQuizQuestion & {
  id: string;
  correctAnswer: string;
};

interface AdminQuizState {
  quizzes: Quiz[];
  singleQuiz: Quiz | null;
  isLoading: boolean;
  isQuestionLoading: boolean;
  error: string | null;
}

const initialState: AdminQuizState = {
  quizzes: [],
  singleQuiz: null,
  isLoading: false,
  isQuestionLoading: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

export const fetchAllQuizzes = createAsyncThunk(
  'adminQuiz/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_URL}/admin/quiz/daily`, { headers: { Authorization: `Bearer ${token}` } });
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
      const token = getToken(getState() as RootState);
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${API_URL}/admin/quiz/daily/single/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
  async (data: { title: string; date: string; rewardSats: number; xpReward: number; questions: Array<{ questionText: string; options: string[]; correctAnswer: string; order: number; }>; }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/quiz/daily`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to create quiz');
      return (resData.quiz || resData) as Quiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'adminQuiz/update',
  async ({ id, data }: { id: string; data: Partial<Quiz> }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update quiz');
      return (resData.quiz || resData) as Quiz;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'adminQuiz/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState() as RootState);
      const response = await fetch(`${API_URL}/admin/quiz/daily/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to delete quiz');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
      .addCase(fetchAllQuizzes.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAllQuizzes.fulfilled, (state, action) => { state.isLoading = false; state.quizzes = action.payload; })
      .addCase(fetchAllQuizzes.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchSingleQuiz.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchSingleQuiz.fulfilled, (state, action) => { state.isLoading = false; state.singleQuiz = action.payload; })
      .addCase(fetchSingleQuiz.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createQuiz.fulfilled, (state, action) => { state.quizzes.unshift(action.payload); })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((quiz) => quiz.id === action.payload.id ? { ...quiz, ...action.payload } : quiz);
        if (state.singleQuiz?.id === action.payload.id) state.singleQuiz = { ...state.singleQuiz, ...action.payload };
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload);
        if (state.singleQuiz?.id === action.payload) state.singleQuiz = null;
      })
      .addCase(toggleQuizStatus.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((quiz) => quiz.id === action.payload.id ? { ...quiz, isActive: action.payload.isActive } : quiz);
        if (state.singleQuiz?.id === action.payload.id) state.singleQuiz = { ...state.singleQuiz, isActive: action.payload.isActive };
      });
  },
});

export const { clearQuizState } = adminQuizSlice.actions;
export default adminQuizSlice.reducer;
