import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoriesApi, createPostApi, updatePostApi, deletePostApi } from '../../apiRoutes/post.api';

export const fetchStories = createAsyncThunk(
  'stories/fetch',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await getStoriesApi(page, limit);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stories');
    }
  }
);

export const createPost = createAsyncThunk('posts/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createPostApi(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const updatePost = createAsyncThunk('posts/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updatePostApi(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await deletePostApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
  }
});

const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.stories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPost.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default storiesSlice.reducer;
