import api from '../api/axios';

export const getStoriesApi = (page = 1, limit = 10, createdBy = null) => {
  let url = `/stories?page=${page}&limit=${limit}`;
  if (createdBy) url += `&createdBy=${createdBy}`;
  console.log('API Request URL:', url);
  return api.get(url);
};
export const getStoryApi = (id) => api.get(`/stories/${id}`);
export const createStoryApi = (data) => api.post('/stories', data);
export const updateStoryApi = (id, data) => api.put(`/stories/${id}`, data);
export const deleteStoryApi = (id) => api.delete(`/stories/${id}`);
export const toggleBookmarkApi = (id) => api.post(`/stories/${id}/bookmark`);
export const getBookmarksApi = () => api.get('/stories/bookmarks');
export const triggerScrapeApi = () => api.post('/scrape');
