import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
      const response = await fetch(`${API_URL}/public/countries`, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch countries');
      }

      return Array.isArray(data) ? data : [];
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
