import axios from 'axios';

// Use relative URL in production (proxied by nginx), localhost in development
const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeRothConversion = async (data) => {
  const response = await api.post('/api/analyze', data);
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
