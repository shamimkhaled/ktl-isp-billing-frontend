import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { ENDPOINTS } from '../services/api';

// Async thunks for permissions
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (params = {}) => {
    const response = await api.get(ENDPOINTS.PERMISSIONS.LIST, { params });
    return response.data;
  }
);

export const fetchPermissionById = createAsyncThunk(
  'permissions/fetchPermissionById',
  async (permissionId) => {
    const response = await api.get(ENDPOINTS.PERMISSIONS.DETAIL(permissionId));
    return response.data;
  }
);

const initialState = {
  permissions: [],
  currentPermission: null,
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  },
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetPermissions: (state) => {
      state.permissions = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: state.pagination.currentPage,
        };
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Permission by ID
      .addCase(fetchPermissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermission = action.payload;
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentPage, resetPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
