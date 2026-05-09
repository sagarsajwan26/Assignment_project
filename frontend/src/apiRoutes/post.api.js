import api from '../api/axios';

export const getStoriesApi = (page = 1, limit = 10) => api.get(`/stories?page=${page}&limit=${limit}`);
export const getStoryApi = (id) => api.get(`/stories/${id}`);
export const toggleBookmarkApi = (id) => api.post(`/stories/${id}/bookmark`);
export const getBookmarksApi = () => api.get('/stories/bookmarks');
export const createPostApi = (data) => api.post('/stories', data);
export const updatePostApi = (id, data) => api.put(`/stories/${id}`, data);
export const deletePostApi = (id) => api.delete(`/stories/${id}`);
