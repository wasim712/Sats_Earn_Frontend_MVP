import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store'; // Adjust path if needed

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  targetUrl: string | null;
  socialHandleTarget: string | null;
  targetCountries: string[];
  requiredTier: string;
  rewardSats: number;
  totalCompletions: number;
  maxCompletions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminCampaignsState {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminCampaignsState = {
  campaigns: [],
  isLoading: false,
  error: null,
};

// --- THUNKS ---

export const fetchAllCampaigns = createAsyncThunk(
  'adminCampaigns/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_URL}/admin/campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch campaigns');
      return data as Campaign[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCampaignStatus = createAsyncThunk(
  'adminCampaigns/toggleStatus',
  async ({ id, isActive }: { id: string, isActive: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update campaign');
      return { id, isActive }; // Return data to update Redux state instantly
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'adminCampaigns/update',
  async ({ id, data }: { id: string, data: Partial<Campaign> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update campaign');
      return resData as Campaign; // Return the fully updated campaign
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
//create campaign thunk
export const createCampaign = createAsyncThunk(
  'adminCampaigns/create',
  async (data: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await fetch(`${API_URL}/admin/campaigns`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to create campaign');
      return resData as Campaign; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  'adminCampaigns/delete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete campaign');
      }
      return id; // Return ID to filter out of Redux state instantly
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---

const adminCampaignsSlice = createSlice({
  name: 'adminCampaigns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAllCampaigns.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Toggle Status
      .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index].isActive = action.payload.isActive;
        }
      })
      
      // Delete
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
      })
      //builder bloack
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload; // Instantly updates the UI list
        }
      })
      // --- CREATE CAMPAIGN ---
      .addCase(createCampaign.fulfilled, (state, action) => {
        // THE FIX: Only unshift if the backend actually returned a full object with an ID.
        // Otherwise, do nothing. The redirect to the Campaigns page will trigger 
        // fetchAllCampaigns() and grab the fresh, correct data from the database automatically!
        if (action.payload && action.payload.id) {
          state.campaigns.unshift(action.payload);
        }
      });
  },
});


export default adminCampaignsSlice.reducer;