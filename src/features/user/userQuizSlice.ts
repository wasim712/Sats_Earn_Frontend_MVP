import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { TodayQuiz, TodayQuizResponse, QuizResult, SubmitQuizAnswerResponse } from '@/types/user';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

function extractInnerQuiz(rawQuiz: unknown): Partial<TodayQuiz> {
  if (!rawQuiz || typeof rawQuiz !== 'object') return {};

  const candidate =
    'quiz' in (rawQuiz as Record<string, unknown>)
      ? (rawQuiz as { quiz?: unknown }).quiz
      : rawQuiz;

  if (!candidate || typeof candidate !== 'object') return {};

  return candidate as Partial<TodayQuiz>;
}

function isQuizResultPayload(payload: unknown): payload is QuizResult {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    'score' in payload &&
    'rewardEarned' in payload,
  );
}

function isWrappedQuizResponse(payload: unknown): payload is TodayQuizResponse {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    'status' in payload &&
    'quiz' in payload,
  );
}

function isLegacyQuizPayload(payload: unknown): payload is TodayQuiz {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    'id' in payload &&
    'title' in payload &&
    'questions' in payload,
  );
}

function normalizeQuizPayload(payload: unknown): TodayQuizResponse {
  if (isWrappedQuizResponse(payload)) {
    const innerQuiz = extractInnerQuiz(payload.quiz);

    return {
      status: payload.status,
      quiz: {
        ...innerQuiz,
        id: innerQuiz.id || '',
        title: innerQuiz.title || 'Daily Quiz',
        description:
          innerQuiz.description ||
          'Answer all questions to earn today\'s reward. Your payout is based on how many answers you get correct.',
        rewardSats: typeof innerQuiz.rewardSats === 'number' ? innerQuiz.rewardSats : 0,
        xpReward: typeof innerQuiz.xpReward === 'number' ? innerQuiz.xpReward : 0,
        questions: Array.isArray(innerQuiz.questions) ? innerQuiz.questions : [],
      },
      result: payload.result,
    };
  }

  if (isLegacyQuizPayload(payload)) {
    return {
      status: 'available',
      quiz: {
        ...payload,
        id: payload.id || '',
        title: payload.title || 'Daily Quiz',
        description:
          payload.description ||
          'Answer all questions to earn today\'s reward. Your payout is based on how many answers you get correct.',
        rewardSats: typeof payload.rewardSats === 'number' ? payload.rewardSats : 0,
        xpReward: typeof payload.xpReward === 'number' ? payload.xpReward : 0,
        questions: Array.isArray(payload.questions) ? payload.questions : [],
      },
    };
  }

  if (isQuizResultPayload(payload)) {
    return {
      status: 'submitted',
      quiz: {
        id: '',
        title: payload.quizTitle || 'Daily Quiz',
        description:
          payload.quizDescription ||
          'Answer all questions to earn today\'s reward. Your payout is based on how many answers you get correct.',
        rewardSats: payload.rewardEarned || 0,
        xpReward: payload.xpEarned || 0,
        questions: (payload.review || []).map((item) => ({
          id: item.questionId,
          questionText: item.questionText,
          explanation: item.explanation,
          options: item.options || [],
          order: item.order,
          correctAnswer: item.correctAnswer,
        })),
      },
      result: payload,
    };
  }

  return {
    status: 'available',
    quiz: {
      id: '',
      title: 'Daily Quiz',
      description: '',
      rewardSats: 0,
      xpReward: 0,
      questions: [],
    },
  };
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const fetchTodayQuiz = createAsyncThunk(
  'userQuiz/fetchToday',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      const todayKey = getLocalDateKey();
      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/users/quiz/today?date=${todayKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return normalizeQuizPayload(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitQuizAnswer = createAsyncThunk(
  'userQuiz/submitAnswer',
  async (payload: { questionId: string; answer: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      const todayKey = state.userQuiz.quiz?.date || getLocalDateKey();
      const data = await obfuscatedJsonRequest<SubmitQuizAnswerResponse>(`${API_URL}/users/quiz/today/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...payload, date: todayKey }),
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitTodayQuiz = createAsyncThunk(
  'userQuiz/submitToday',
  async (answers: { questionId: string; answer: string; attemptCount: number }[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      const todayKey = state.userQuiz.quiz?.date || getLocalDateKey();
      const data = await obfuscatedJsonRequest<QuizResult>(`${API_URL}/users/quiz/today/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: todayKey, answers }),
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
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
      .addCase(fetchTodayQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quiz = action.payload.quiz;
        state.result = action.payload.result ?? null;
        state.error = null;
      })
      .addCase(fetchTodayQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(submitQuizAnswer.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitQuizAnswer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.result = action.payload.result;
        state.error = null;
      })
      .addCase(submitQuizAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
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
