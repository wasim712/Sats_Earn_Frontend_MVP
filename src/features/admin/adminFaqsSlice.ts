import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import type { RootState } from '@/store/store';
import type { FaqItem } from '@/app/admin/content/content.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type FaqPayload = {
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
};

type FaqUpdatePayload = {
  id: string;
  question?: string;
  answer?: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
};

interface AdminFaqsState {
  items: FaqItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: AdminFaqsState = {
  items: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchAdminFaqs = createAsyncThunk('adminFaqs/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/faqs`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await parseObfuscatedJson<FaqItem[] | { error?: string }>(response);
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Failed to load FAQs.');
    return data as FaqItem[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to load FAQs.');
  }
});

export const createAdminFaq = createAsyncThunk('adminFaqs/create', async (data: FaqPayload, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const payload = await parseObfuscatedJson<FaqItem | { error?: string; item?: FaqItem }>(response);
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'Failed to create FAQ item.');
    return ((payload as { item?: FaqItem }).item || payload) as FaqItem;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create FAQ item.');
  }
});

export const deleteAdminFaq = createAsyncThunk('adminFaqs/delete', async (id: string, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await parseObfuscatedJson<{ error?: string } | Record<string, never>>(response);
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'Failed to delete FAQ item.');
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete FAQ item.');
  }
});

export const updateAdminFaq = createAsyncThunk('adminFaqs/update', async ({ id, ...data }: FaqUpdatePayload, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/faqs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const payload = await parseObfuscatedJson<FaqItem | { error?: string; item?: FaqItem }>(response);
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'Failed to update FAQ item.');
    return ((payload as { item?: FaqItem }).item || payload) as FaqItem;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update FAQ item.');
  }
});

const adminFaqsSlice = createSlice({
  name: 'adminFaqs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminFaqs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminFaqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminFaqs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createAdminFaq.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createAdminFaq.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAdminFaq.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminFaq.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateAdminFaq.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
      })
      .addCase(updateAdminFaq.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdminFaq.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default adminFaqsSlice.reducer;
