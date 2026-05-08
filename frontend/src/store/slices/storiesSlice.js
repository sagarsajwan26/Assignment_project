import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchStories = createAsyncThunk(
  'stories/fetch',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/stories?page=${page}&limit=${limit}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stories');
    }
  }
);

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
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.stories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storiesSlice.reducer;
