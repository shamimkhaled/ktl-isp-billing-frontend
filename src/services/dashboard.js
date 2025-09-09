import api, { ENDPOINTS } from './api';

export const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get(ENDPOINTS.DASHBOARD.METRICS);
    return response.data;
  },

  getStats: async (period = '24h') => {
    const response = await api.get(`${ENDPOINTS.DASHBOARD.STATS}?period=${period}`);
    return response.data;
  },
};
