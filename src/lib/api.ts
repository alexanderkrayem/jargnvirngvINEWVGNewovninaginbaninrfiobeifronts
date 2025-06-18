import axios from 'axios';

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles API
export const articlesApi = {
  // Get all articles with optional filters
  getAll: async (params?: { tag?: string; search?: string; limit?: number; page?: number }) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get featured articles
  getFeatured: async () => {
    const response = await api.get('/articles/featured');
    return response.data;
  },

  // Get single article by ID
  getById: async (id: string) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Get related articles
  getRelated: async (id: string, limit = 3) => {
    const response = await api.get(`/articles/${id}/related`, { params: { limit } });
    return response.data;
  },
};

// Research API
export const researchApi = {
  // Get all research papers with optional filters
  getAll: async (params?: { journal?: string; search?: string; limit?: number; page?: number }) => {
    const response = await api.get('/research', { params });
    return response.data;
  },

  // Get single research paper by ID
  getById: async (id: string) => {
    const response = await api.get(`/research/${id}`);
    return response.data;
  },

  // Get available journals
  getJournals: async () => {
    const response = await api.get('/research/journals/list');
    return response.data;
  },
};

export default api;