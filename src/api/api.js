import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('ee_auth');
    if (raw) {
      const { token } = JSON.parse(raw);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

export default api;
