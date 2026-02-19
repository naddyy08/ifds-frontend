// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/auth/profile');

// Inventory
export const getAllInventory = () => api.get('/inventory/');
export const getInventoryById = (id) => api.get(`/inventory/${id}`);
export const addInventory = (data) => api.post('/inventory/', data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);
export const searchInventory = (query) => api.get(`/inventory/search?q=${query}`);
export const getLowStock = () => api.get('/inventory/low-stock');

// Transactions
export const getAllTransactions = () => api.get('/transactions/');
export const stockIn = (data) => api.post('/transactions/stock-in', data);
export const stockOut = (data) => api.post('/transactions/stock-out', data);
export const recordWaste = (data) => api.post('/transactions/waste', data);
export const getTransactionSummary = () => api.get('/transactions/summary');

// Fraud Detection
export const getAllAlerts = () => api.get('/fraud/');
export const getAlertById = (id) => api.get(`/fraud/${id}`);
export const reviewAlert = (id, data) => api.put(`/fraud/${id}/review`, data);
export const getFraudStatistics = () => api.get('/fraud/statistics');
export const getPendingCount = () => api.get('/fraud/pending-count');

// Reports
export const getDailyInventory = () => api.get('/reports/daily-inventory');
export const getWeeklyFraud = () => api.get('/reports/weekly-fraud');
export const getMonthlyAnalytics = () => api.get('/reports/monthly-analytics');
export const getUserActivity = () => api.get('/reports/user-activity');
export const getLowStockAlert = () => api.get('/reports/low-stock-alert');
export const getWasteAnalysis = () => api.get('/reports/waste-analysis');
export const getDashboardSummary = () => api.get('/reports/dashboard-summary');

export default api;