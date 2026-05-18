import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store'; 
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 🚨 UPDATED INTERFACE: Matches your new Prisma/Backend schema exactly
import type { Campaign, AdminTask } from '@/types/admin';
export type { Campaign } from '@/types/admin';
export type Task = AdminTask;

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

function normalizeCampaigns(data: unknown): Campaign[] {
  if (Array.isArray(data)) return data as Campaign[];
  if (data && typeof data === 'object') {
    const payload = data as { data?: unknown; campaigns?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as Campaign[];
    if (Array.isArray(payload.campaigns)) return payload.campaigns as Campaign[];
    if (Array.isArray(payload.items)) return payload.items as Campaign[];
  }
  return [];
}

function normalizeCampaign(data: unknown): Campaign | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as { campaign?: unknown; data?: unknown; item?: unknown };

  if (payload.campaign && typeof payload.campaign === 'object') return payload.campaign as Campaign;
  if (payload.data && typeof payload.data === 'object') return payload.data as Campaign;
  if (payload.item && typeof payload.item === 'object') return payload.item as Campaign;

  return data as Campaign;
}

// --- THUNKS ---

export const fetchAllCampaigns = createAsyncThunk(
  'adminCampaigns/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to fetch campaigns');
      return normalizeCampaigns(data);
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
      
      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(data.error || 'Failed to update campaign');
      return { id, isActive }; 
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
      
      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(resData.error || 'Failed to update campaign');
      const campaign = normalizeCampaign(resData);
      if (!campaign) throw new Error('Failed to update campaign');
      return campaign; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCampaign = createAsyncThunk(
  'adminCampaigns/create',
  async (data: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      
      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to create campaign');
      const campaign = normalizeCampaign(resData);
      if (!campaign) throw new Error('Failed to create campaign');
      return campaign; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadCampaignCover = createAsyncThunk(
  'adminCampaigns/uploadCover',
  async (file: File, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');
      const formData = new FormData();
      formData.append('coverImage', file);

      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/upload-cover`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(resData.error || 'Failed to upload campaign cover');
      return resData.coverImageUrl as string;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'adminCampaigns/createTask',
  async ({ campaignId, data }: { campaignId: string; data: Partial<Task> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/${campaignId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to create task');
      return resData as Task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'adminCampaigns/updateTask',
  async (
    { campaignId, taskId, data }: { campaignId: string; taskId: string; data: Partial<Task> },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || sessionStorage.getItem('sats_token');

      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/${campaignId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await parseObfuscatedJson<any>(response);
      if (!response.ok) throw new Error(resData.error || resData.message || 'Failed to update task');
      return resData as Task;
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
      
      const response = await obfuscatedFetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await parseObfuscatedJson<any>(response);
        throw new Error(data.error || 'Failed to delete campaign');
      }
      return id; 
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
      // Update
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload; 
        }
      })
      // Create
      .addCase(createCampaign.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.campaigns.unshift(action.payload);
        }
      });
  },
});

export default adminCampaignsSlice.reducer;
