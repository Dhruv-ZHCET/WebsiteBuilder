import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const templateAPI = {
  getIndustryTemplates: () => api.get('/templates/industries'),
  getColorThemes: () => api.get('/templates/themes'),
  previewTemplate: (templateId: string) => api.get(`/templates/preview/${templateId}`),
};

export const websiteAPI = {
  createWebsite: (data: any) => api.post('/websites', data),
  generateWebsite: (data: any) => api.post('/websites/generate', data),
  downloadWebsite: (websiteId: string) => api.get(`/websites/${websiteId}/download`, {
    responseType: 'blob'
  }),
};

export default api;