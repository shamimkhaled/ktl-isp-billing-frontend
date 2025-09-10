import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('authToken', access);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle error messages
    const message = error.response?.data?.message || 
                   error.response?.data?.detail || 
                   error.message || 
                   'An unexpected error occurred';
    
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
  },
  
  // Dashboard
  DASHBOARD: {
    METRICS: '/dashboard/metrics/',
    STATS: '/dashboard/stats/',
    OVERVIEW: '/dashboard/overview/',
  },
  
  // Organizations (Zones)
  ZONES: {
    LIST: '/zones/',
    CREATE: '/zones/',
    DETAIL: (id) => `/zones/${id}/`,
    UPDATE: (id) => `/zones/${id}/`,
    DELETE: (id) => `/zones/${id}/`,
    STATS: (id) => `/zones/${id}/stats/`,
  },
  
  // SDT Terminals
  SDT: {
    LIST: '/sdt/',
    CREATE: '/sdt/',
    DETAIL: (id) => `/sdt/${id}/`,
    UPDATE: (id) => `/sdt/${id}/`,
    DELETE: (id) => `/sdt/${id}/`,
    STATUS: (id) => `/sdt/${id}/status/`,
    HEALTH: (id) => `/sdt/${id}/health/`,
    MONITORING: '/sdt/monitoring/',
  },
  
  // Customers
  CUSTOMERS: {
    LIST: '/customers/',
    CREATE: '/customers/',
    DETAIL: (id) => `/customers/${id}/`,
    UPDATE: (id) => `/customers/${id}/`,
    DELETE: (id) => `/customers/${id}/`,
    SUBSCRIPTIONS: (id) => `/customers/${id}/subscriptions/`,
    PAYMENTS: (id) => `/customers/${id}/payments/`,
  },
  
  // Billing
  BILLING: {
    INVOICES: '/billing/invoices/',
    PAYMENTS: '/billing/payments/',
    REPORTS: '/billing/reports/',
    GENERATE_INVOICE: '/billing/generate-invoice/',
    PROCESS_PAYMENT: '/billing/process-payment/',
  },
  
  // Network Monitoring
  NETWORK: {
    INTERFACES: '/network/interfaces/',
    CONNECTIONS: '/network/connections/',
    STATS: '/network/stats/',
    MONITORING: '/network/monitoring/',
  },
  
  // Reports
  REPORTS: {
    REVENUE: '/reports/revenue/',
    CUSTOMERS: '/reports/customers/',
    NETWORK: '/reports/network/',
    EXPORT: '/reports/export/',
  },

  // User Management
  USERS: {
    LIST: '/users/',
    CREATE: '/users/',
    DETAIL: (id) => `/users/${id}/`,
    UPDATE: (id) => `/users/${id}/`,
    DELETE: (id) => `/users/${id}/`,
    PROFILE: '/users/profile/',
    CHANGE_PASSWORD: '/users/change-password/',
    PERMISSIONS: '/users/permissions/',
  },

  // Role Management
  ROLES: {
    LIST: '/roles/',
    CREATE: '/roles/',
    DETAIL: (id) => `/roles/${id}/`,
    UPDATE: (id) => `/roles/${id}/`,
    DELETE: (id) => `/roles/${id}/`,
    ASSIGN: '/roles/assign/',
    BULK_ASSIGN: '/roles/bulk-assign/',
  },

  // User Role Assignments
  USER_ROLES: {
    LIST: '/user-roles/',
    DETAIL: (id) => `/user-roles/${id}/`,
    UPDATE: (id) => `/user-roles/${id}/`,
    DELETE: (id) => `/user-roles/${id}/`,
  },

  // Permissions
  PERMISSIONS: {
    LIST: '/permissions/',
    DETAIL: (id) => `/permissions/${id}/`,
  }
};

