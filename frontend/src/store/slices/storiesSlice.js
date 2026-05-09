import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoriesApi, toggleBookmarkApi, getBookmarksApi, createPostApi, updatePostApi, deletePostApi } from '../../apiRoutes/post.api';

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

export const fetchBookmarks = createAsyncThunk('stories/fetchBookmarks', async (_, { rejectWithValue }) => {
  try {
    const res = await getBookmarksApi();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks');
  }
});

export const toggleBookmark = createAsyncThunk('stories/toggleBookmark', async (id, { rejectWithValue }) => {
  try {
    const res = await toggleBookmarkApi(id);
    return { id, bookmarked: res.data.data.bookmarked };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle bookmark');
  }
});

export const createPost = createAsyncThunk('stories/createPost', async (data, { rejectWithValue }) => {
  try {
    const res = await createPostApi(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const updatePost = createAsyncThunk('stories/updatePost', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updatePostApi(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update post');
  }
});

export const deletePost = createAsyncThunk('stories/deletePost', async (id, { rejectWithValue }) => {
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
    bookmarks: [],
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
        state.items = action.payload?.stories ?? [];
        state.pagination = action.payload?.pagination ?? state.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchBookmarks.fulfilled, (state, action) => { state.bookmarks = action.payload; })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { id, bookmarked } = action.payload;
        if (bookmarked) {
          const story = state.items.find((s) => s._id === id);
          if (story && !state.bookmarks.find((b) => b._id === id)) state.bookmarks.push(story);
        } else {
          state.bookmarks = state.bookmarks.filter((b) => b._id !== id);
        }
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      });
  },
});

export default storiesSlice.reducer;
