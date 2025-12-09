// API Configuration
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://fullshopweb-production.up.railway.app';

export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE}/${cleanEndpoint}`;
};

// Axios instance với baseURL đã cấu hình
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_BASE;

