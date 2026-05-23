import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import type { AdminTask } from '@/types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface AdminTasksState {
  tasks: AdminTask[];
  selectedTask: AdminTask | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: AdminTasksState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token');

export const fetchStandaloneTasks = createAsyncThunk('adminTasks/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/tasks`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await parseObfuscatedJson<any>(response);
    if (!response.ok) throw new Error(data.error || 'Failed to fetch tasks');
    return Array.isArray(data) ? data as AdminTask[] : [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchStandaloneTaskById = createAsyncThunk('adminTasks/fetchById', async (taskId: string, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await parseObfuscatedJson<any>(response);
    if (!response.ok) throw new Error(data.error || 'Failed to fetch task');
    return data as AdminTask;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateStandaloneTask = createAsyncThunk('adminTasks/update', async ({ taskId, data }: { taskId: string; data: Partial<AdminTask> }, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const resData = await parseObfuscatedJson<any>(response);
    if (!response.ok) throw new Error(resData.error || 'Failed to update task');
    return (resData.task || resData) as AdminTask;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const adminTasksSlice = createSlice({
  name: 'adminTasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandaloneTasks.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchStandaloneTasks.fulfilled, (state, action) => { state.isLoading = false; state.tasks = action.payload; })
      .addCase(fetchStandaloneTasks.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchStandaloneTaskById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchStandaloneTaskById.fulfilled, (state, action) => { state.isLoading = false; state.selectedTask = action.payload; })
      .addCase(fetchStandaloneTaskById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(updateStandaloneTask.pending, (state) => { state.isSaving = true; state.error = null; })
      .addCase(updateStandaloneTask.fulfilled, (state, action) => {
        state.isSaving = false;
        state.selectedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateStandaloneTask.rejected, (state, action) => { state.isSaving = false; state.error = action.payload as string; });
  },
});

export default adminTasksSlice.reducer;
