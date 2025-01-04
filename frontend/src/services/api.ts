import axios from 'axios';
import getConfig from '../config/config';

const config = getConfig();

const api = axios.create({
  baseURL: config.apiUrl, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
// Interceptores (opcional, mas útil para autenticação ou logs)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Exemplo de token armazenado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/

export default api;