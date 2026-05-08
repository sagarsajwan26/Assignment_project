import api from '../api/axios';

export const createPostApi = (data) => api.post('/posts', data);
export const updatePostApi = (id, data) => api.put(`/posts/${id}`, data);
export const deletePostApi = (id) => api.delete(`/posts/${id}`);
export const getStoriesApi = (page = 1, limit = 10) => api.get(`/stories?page=${page}&limit=${limit}`);
