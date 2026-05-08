import api from '../api/axios';

export const loginApi = (data) => api.post('/auth/login', data);
export const signupApi = (data) => api.post('/auth/register', data);
export const logoutApi = () => api.post('/auth/logout');
