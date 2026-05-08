import { configureStore } from '@reduxjs/toolkit';
import storiesReducer from './slices/storiesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    auth: authReducer,
  },
});
