import axios from 'axios';
import { API_BASE_URL } from '../config/site.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || { message: 'Network error. Please try again.' })
);

export const publicApi = {
  bootstrap: () => api.get('/public/bootstrap').then((res) => res.data),
  sendMessage: (payload) => api.post('/messages', payload).then((res) => res.data),
  subscribe: (payload) => api.post('/newsletter/subscribe', payload).then((res) => res.data)
};

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  updateProfile: (payload) => api.put('/auth/profile', payload).then((res) => res.data),
  changePassword: (payload) => api.put('/auth/password', payload).then((res) => res.data)
};

export const adminApi = {
  analytics: () => api.get('/admin/analytics').then((res) => res.data),
  list: (resource, params) => api.get(`/admin/${resource}`, { params }).then((res) => res.data),
  create: (resource, payload) => api.post(`/admin/${resource}`, payload).then((res) => res.data),
  update: (resource, id, payload) => api.put(`/admin/${resource}/${id}`, payload).then((res) => res.data),
  remove: (resource, id) => api.delete(`/admin/${resource}/${id}`).then((res) => res.data),
  bulk: (resource, payload) => api.post(`/admin/${resource}/bulk`, payload).then((res) => res.data),
  upload: (formData) => api.post('/admin/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data)
};

export default api;
