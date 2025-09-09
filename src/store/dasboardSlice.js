import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    activeUsers: { value: 0, change: 0 },
    zones: { value: 0, change: 0 },
    sdtTerminals: { value: 0, change: 0 },
    revenue: { value: '৳0', change: 0 }
  },
  onlineUsersByInterface: [],
  zones: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.metrics = action.payload.metrics;
      state.onlineUsersByInterface = action.payload.onlineUsersByInterface;
      state.zones = action.payload.zones;
      state.lastUpdated = new Date().toISOString();
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMetric: (state, action) => {
      const { metric, value, change } = action.payload;
      if (state.metrics[metric]) {
        state.metrics[metric] = { value, change };
      }
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  fetchDashboardStart, 
  fetchDashboardSuccess, 
  fetchDashboardFailure, 
  updateMetric, 
  clearDashboardError 
} = dashboardSlice.actions;
export default dashboardSlice.reducer;

