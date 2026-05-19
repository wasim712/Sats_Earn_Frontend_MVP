import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { obfuscatedJsonRequest } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface AdminCountriesState {
  countries: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminCountriesState = {
  countries: [],
  isLoading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'adminCountries/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await obfuscatedJsonRequest<unknown>(`${API_URL}/public/countries`, { cache: 'no-store' });
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object') {
        const payload = data as { data?: unknown; countries?: unknown; items?: unknown };
        if (Array.isArray(payload.data)) return payload.data as string[];
        if (Array.isArray(payload.countries)) return payload.countries as string[];
        if (Array.isArray(payload.items)) return payload.items as string[];
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch countries');
    }
  }
);

const adminCountriesSlice = createSlice({
  name: 'adminCountries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminCountriesSlice.reducer;
