// src/services/roleService.js - Role service for the EditUser component
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { ENDPOINTS } from './api';
import { toast } from 'react-hot-toast';

// Query keys for cache management
export const ROLE_QUERY_KEYS = {
  all: ['roles'],
  lists: () => [...ROLE_QUERY_KEYS.all, 'list'],
  list: (filters) => [...ROLE_QUERY_KEYS.lists(), { filters }],
  details: () => [...ROLE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...ROLE_QUERY_KEYS.details(), id],
  assignments: () => [...ROLE_QUERY_KEYS.all, 'assignments'],
};

// Role API service functions
export const roleService = {
  // Fetch roles with filtering
  getRoles: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ROLES.LIST, { params });
    return response.data;
  },

  // Get single role
  getRole: async (roleId) => {
    const response = await api.get(ENDPOINTS.ROLES.DETAIL(roleId));
    return response.data;
  },

  // Create role
  createRole: async (roleData) => {
    const response = await api.post(ENDPOINTS.ROLES.CREATE, roleData);
    return response.data;
  },

  // Update role
  updateRole: async ({ roleId, roleData }) => {
    const response = await api.put(ENDPOINTS.ROLES.UPDATE(roleId), roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (roleId) => {
    await api.delete(ENDPOINTS.ROLES.DELETE(roleId));
    return roleId;
  },

  // Assign role to user
  assignRoleToUser: async (assignmentData) => {
    const response = await api.post(ENDPOINTS.ROLES.ASSIGN, assignmentData);
    return response.data;
  },

  // Bulk assign roles
  bulkAssignRoles: async (bulkData) => {
    const response = await api.post(ENDPOINTS.ROLES.BULK_ASSIGN, bulkData);
    return response.data;
  },

  // Get user role assignments
  getUserRoleAssignments: async (params = {}) => {
    const response = await api.get(ENDPOINTS.USER_ROLES.LIST, { params });
    return response.data;
  }
};

// React Query hooks for role management
export const useRoles = (filters = {}) => {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.list(filters),
    queryFn: () => roleService.getRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useRole = (roleId, options = {}) => {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.detail(roleId),
    queryFn: () => roleService.getRole(roleId),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useUserRoleAssignments = (filters = {}) => {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.assignments(),
    queryFn: () => roleService.getUserRoleAssignments(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations for role operations
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: roleService.createRole,
    onSuccess: (data) => {
      // Invalidate and refetch roles list
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
      toast.success('Role created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create role';
      toast.error(message);
    }
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: roleService.updateRole,
    onSuccess: (data, variables) => {
      // Update specific role in cache
      queryClient.setQueryData(
        ROLE_QUERY_KEYS.detail(variables.roleId),
        data
      );
      
      // Invalidate roles list
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
      toast.success('Role updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update role';
      toast.error(message);
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: (deletedRoleId) => {
      // Remove role from cache
      queryClient.removeQueries({ queryKey: ROLE_QUERY_KEYS.detail(deletedRoleId) });
      
      // Invalidate roles list
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
      toast.success('Role deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete role';
      toast.error(message);
    }
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: roleService.assignRoleToUser,
    onSuccess: () => {
      // Invalidate user role assignments
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.assignments() });
      toast.success('Role assigned successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to assign role';
      toast.error(message);
    }
  });
};

export const useBulkAssignRoles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: roleService.bulkAssignRoles,
    onSuccess: () => {
      // Invalidate user role assignments
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.assignments() });
      toast.success('Roles assigned successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to assign roles';
      toast.error(message);
    }
  });
};