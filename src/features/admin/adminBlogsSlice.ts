import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { obfuscatedFetch, parseObfuscatedJson } from '@/lib/obfuscatedFetch';
import type { RootState } from '@/store/store';
import type { BlogPost } from '@/app/admin/content/content.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type BlogPayload = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  isPublished: boolean;
};

interface AdminBlogsState {
  posts: BlogPost[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: AdminBlogsState = {
  posts: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

const getToken = (state: RootState) => state.auth.token || sessionStorage.getItem('sats_token') || localStorage.getItem('sats_token');

export const fetchAdminBlogs = createAsyncThunk('adminBlogs/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/blogs`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await parseObfuscatedJson<BlogPost[] | { error?: string }>(response);
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Failed to load blog posts.');
    return data as BlogPost[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to load blog posts.');
  }
});

export const saveAdminBlog = createAsyncThunk('adminBlogs/save', async ({ id, data }: { id?: string | null; data: BlogPayload }, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const url = id ? `${API_URL}/admin/blogs/${id}` : `${API_URL}/admin/blogs`;
    const method = id ? 'PATCH' : 'POST';
    const response = await obfuscatedFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    const payload = await parseObfuscatedJson<BlogPost | { error?: string; post?: BlogPost }>(response);
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'Failed to save blog post.');
    return ((payload as { post?: BlogPost }).post || payload) as BlogPost;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to save blog post.');
  }
});

export const deleteAdminBlog = createAsyncThunk('adminBlogs/delete', async (id: string, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState() as RootState);
    const response = await obfuscatedFetch(`${API_URL}/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await parseObfuscatedJson<{ error?: string } | Record<string, never>>(response);
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'Failed to delete blog post.');
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete blog post.');
  }
});

const adminBlogsSlice = createSlice({
  name: 'adminBlogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveAdminBlog.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveAdminBlog.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.posts.findIndex((post) => post.id === action.payload.id);
        if (index === -1) {
          state.posts.unshift(action.payload);
        } else {
          state.posts[index] = action.payload;
        }
      })
      .addCase(saveAdminBlog.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdminBlog.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default adminBlogsSlice.reducer;
