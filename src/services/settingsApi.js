// src/services/settingsApi.js
import api from './api';

export const getSettings = () => api.get('/settings/');
export const updateSettings = (data) => api.put('/settings/', data);
export const exportBackup = () => api.get('/settings/backup', { responseType: 'blob' });

export default api;