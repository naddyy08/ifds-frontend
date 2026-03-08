import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const settingsApi = axios.create({
  baseURL: API_URL + '/settings',
  headers: {
    'Content-Type': 'application/json',
  },
});

settingsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getSettings = () => settingsApi.get('/');
export const updateSettings = (data) => settingsApi.put('/', data);
export const exportBackup = () => settingsApi.get('/backup', { responseType: 'blob' });

export default settingsApi;
