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

  getProfile: async () => {
    const response = await api.get(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};

// SDT Service
import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh/', {
      refresh_token: refreshToken
    });
    return response.data;
  },

  logout: async (refreshToken, logoutAllDevices = false) => {
    const response = await api.post('/auth/logout/', {
      refresh_token: refreshToken,
      logout_all_devices: logoutAllDevices
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile/', profileData);
    return response.data;
  },
};

export const sdtService = {
  getSDTList: async (params = {}) => {
    const response = await api.get(ENDPOINTS.SDT.LIST, { params });
    return response.data;
  },

  getSDT: async (id) => {
    const response = await api.get(ENDPOINTS.SDT.DETAIL(id));
    return response.data;
  },

  createSDT: async (sdtData) => {
    const response = await api.post(ENDPOINTS.SDT.CREATE, sdtData);
    return response.data;
  },

  updateSDT: async (id, sdtData) => {
    const response = await api.put(ENDPOINTS.SDT.UPDATE(id), sdtData);
    return response.data;
  },

  deleteSDT: async (id) => {
    const response = await api.delete(ENDPOINTS.SDT.DELETE(id));
    return response.data;
  },

  getSDTStatus: async (id) => {
    const response = await api.get(ENDPOINTS.SDT.STATUS(id));
    return response.data;
  },

  getSDTHealth: async (id) => {
    const response = await api.get(ENDPOINTS.SDT.HEALTH(id));
    return response.data;
  },

  getMonitoringData: async () => {
    const response = await api.get(ENDPOINTS.SDT.MONITORING);
    return response.data;
  },
};
