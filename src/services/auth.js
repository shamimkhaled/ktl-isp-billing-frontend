import api, { ENDPOINTS } from './api';

// Authentication Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });
    return response.data;
  },

  logout: async (refreshToken, logoutAllDevices = false) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT, {
      refresh_token: refreshToken,
      logout_all_devices: logoutAllDevices
    });
    return response.data;
  },


};


