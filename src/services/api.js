// src/services/api.js - Optimized with conditional logging and performance improvements
import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

// Base URL configuration
const BASE_URL = 'https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1';

// Create axios instance with optimized configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Reduced from 30s to 15s for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global request queue management to prevent duplicate requests
const pendingRequests = new Map();

// Development flag for logging
const isDevelopment = process.env.NODE_ENV === 'development';

// Request interceptor with timing and deduplication
api.interceptors.request.use(
  (config) => {
    // Start timing
    config.metadata = { startTime: performance.now() };
    
    // Add auth token if available
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request deduplication key
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
    
    // Cancel duplicate requests
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller.abort('Duplicate request cancelled');
    }
    
    // Create new abort controller for this request
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    // Only log in development
    if (isDevelopment) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        timestamp: new Date().toISOString(),
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ [API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with timing and auto-retry
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = performance.now() - response.config.metadata.startTime;
    
    // Remove from pending requests
    const requestKey = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params)}`;
    pendingRequests.delete(requestKey);

    // Only log in development or for slow requests
    if (isDevelopment) {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // Log slow requests even in production for monitoring
    if (duration > 2000) {
      console.warn(`🐌 [Slow Request] ${response.config.url} took ${duration.toFixed(2)}ms`);
      
      // Send to monitoring service in production
      if (!isDevelopment && window.performanceMetrics) {
        window.performanceMetrics.push({
          type: 'slow_request',
          url: response.config.url,
          method: response.config.method,
          duration,
          timestamp: Date.now()
        });
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const duration = originalRequest?.metadata ? 
      performance.now() - originalRequest.metadata.startTime : 0;

    // Remove from pending requests
    if (originalRequest) {
      const requestKey = `${originalRequest.method}:${originalRequest.url}:${JSON.stringify(originalRequest.params)}`;
      pendingRequests.delete(requestKey);
    }

    // Only log detailed errors in development
    if (isDevelopment) {
      console.error(`❌ [API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        message: error.message,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    } else {
      // In production, only log critical errors
      if (error.response?.status >= 500) {
        console.error(`Server Error: ${error.response?.status} for ${originalRequest?.url}`);
      }
    }

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        if (refreshToken) {
          const response = await api.post('/auth/refresh/', {
            refresh_token: refreshToken
          });
          
          const { access: newToken } = response.data.data.tokens;
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced endpoints with organization management
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
    VERIFY: '/auth/verify/',
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
  },

  // Organization Management
  ORGANIZATIONS: {
    LIST: '/organizations/',
    CREATE: '/organizations/',
    DETAIL: (id) => `/organizations/${id}/`,
    UPDATE: (id) => `/organizations/${id}/`,
    DELETE: (id) => `/organizations/${id}/`,
  },

  // SDT Management
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
    SEARCH: '/customers/search/',
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
};

// Performance monitoring utilities (optimized)
export const apiPerformance = {
  measureRequestTime: (url, method = 'GET') => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Only log in development
      if (isDevelopment) {
        console.log(`📊 [Performance] ${method} ${url}: ${duration.toFixed(2)}ms`);
      }
      
      // Store metrics for analytics (production safe)
      if (typeof window !== 'undefined' && window.performanceMetrics) {
        window.performanceMetrics.push({
          url,
          method,
          duration,
          timestamp: Date.now()
        });
        
        // Keep only last 100 metrics to prevent memory leaks
        if (window.performanceMetrics.length > 100) {
          window.performanceMetrics = window.performanceMetrics.slice(-50);
        }
      }
      
      return duration;
    };
  },

  getSlowRequests: () => {
    if (typeof window === 'undefined' || !window.performanceMetrics) return [];
    return window.performanceMetrics
      .filter(metric => metric.duration > 2000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // Return only top 10 slowest
  },

  clearMetrics: () => {
    if (typeof window !== 'undefined' && window.performanceMetrics) {
      window.performanceMetrics = [];
    }
  }
};

// Initialize performance metrics collection (production safe)
if (typeof window !== 'undefined') {
  window.performanceMetrics = [];
  
  // Clear metrics periodically to prevent memory leaks
  setInterval(() => {
    if (window.performanceMetrics && window.performanceMetrics.length > 200) {
      window.performanceMetrics = window.performanceMetrics.slice(-100);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}

export default api;