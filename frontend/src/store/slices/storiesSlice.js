import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStoriesApi, createStoryApi, updateStoryApi, deleteStoryApi,
  toggleBookmarkApi, getBookmarksApi, triggerScrapeApi,
} from '../../apiRoutes/post.api';

export const fetchStories = createAsyncThunk('stories/fetch', async ({ page = 1, limit = 10, createdBy = null } = {}, { rejectWithValue }) => {
  try {
    const res = await getStoriesApi(page, limit, createdBy);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stories');
  }
});

export const createStory = createAsyncThunk('stories/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createStoryApi(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create story');
  }
});

export const updateStory = createAsyncThunk('stories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateStoryApi(id, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update story');
  }
});

export const deleteStory = createAsyncThunk('stories/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteStoryApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete story');
  }
});

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

export const triggerScrape = createAsyncThunk('stories/scrape', async (_, { rejectWithValue }) => {
  try {
    const res = await triggerScrapeApi();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Scrape failed');
  }
});

const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    items: [],
    bookmarks: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    loading: false,
    scraping: false,
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
      .addCase(createStory.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateStory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      })
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
      .addCase(triggerScrape.pending, (state) => { state.scraping = true; })
      .addCase(triggerScrape.fulfilled, (state) => { state.scraping = false; })
      .addCase(triggerScrape.rejected, (state) => { state.scraping = false; });
  },
});

export default storiesSlice.reducer;
