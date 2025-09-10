import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { ENDPOINTS } from '../services/api';

// Async thunks for role management
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (params = {}) => {
    const response = await api.get(ENDPOINTS.ROLES.LIST, { params });
    return response.data;
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (roleId) => {
    const response = await api.get(ENDPOINTS.ROLES.DETAIL(roleId));
    return response.data;
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData) => {
    const response = await api.post(ENDPOINTS.ROLES.CREATE, roleData);
    return response.data;
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ roleId, roleData }) => {
    const response = await api.put(ENDPOINTS.ROLES.UPDATE(roleId), roleData);
    return response.data;
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleId) => {
    await api.delete(ENDPOINTS.ROLES.DELETE(roleId));
    return roleId;
  }
);

export const assignRoleToUser = createAsyncThunk(
  'roles/assignRoleToUser',
  async (assignmentData) => {
    const response = await api.post(ENDPOINTS.ROLES.ASSIGN, assignmentData);
    return response.data;
  }
);

export const bulkAssignRoles = createAsyncThunk(
  'roles/bulkAssignRoles',
  async (bulkData) => {
    const response = await api.post(ENDPOINTS.ROLES.BULK_ASSIGN, bulkData);
    return response.data;
  }
);

const initialState = {
  roles: [],
  currentRole: null,
  userRoleAssignments: [],
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  },
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetRoles: (state) => {
      state.roles = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: state.pagination.currentPage,
        };
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Role by ID
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.unshift(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.currentRole?.id === action.payload.id) {
          state.currentRole = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(role => role.id !== action.payload);
        state.pagination.count -= 1;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Assign Role to User
      .addCase(assignRoleToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRoleToUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user role assignments if needed
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Bulk Assign Roles
      .addCase(bulkAssignRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkAssignRoles.fulfilled, (state, action) => {
        state.loading = false;
        // Handle bulk assignment response
      })
      .addCase(bulkAssignRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentPage, resetRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
