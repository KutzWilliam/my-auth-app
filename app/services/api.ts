import axios from 'axios';

const initialBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: initialBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const updateApiBaseUrl = (ip: string, port: string | number) => {
  if (!ip || !port || String(port).trim() === '') {
    console.warn("Tentativa de configurar API Base URL com IP ou Porta inválidos. Usando fallback:", initialBaseUrl);
    apiClient.defaults.baseURL = initialBaseUrl;
    return;
  }
  const newBaseUrl = `http://${ip}:${port}/api`;
  apiClient.defaults.baseURL = newBaseUrl;
  console.log(`API Base URL foi atualizada para: ${newBaseUrl}`);
};

export default apiClient;