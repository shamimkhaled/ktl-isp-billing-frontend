import api, { ENDPOINTS } from './api';

// SDT Service
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

export default sdtService;
