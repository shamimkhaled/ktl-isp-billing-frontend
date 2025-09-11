import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { ENDPOINTS } from './api';
import { toast } from 'react-hot-toast';

// Query keys for cache management
export const ORGANIZATION_QUERY_KEYS = {
  all: ['organizations'],
  lists: () => [...ORGANIZATION_QUERY_KEYS.all, 'list'],
  list: (filters) => [...ORGANIZATION_QUERY_KEYS.lists(), { filters }],
  details: () => [...ORGANIZATION_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...ORGANIZATION_QUERY_KEYS.details(), id],
};

// Organization API service functions
export const organizationService = {
  // Fetch organizations
  getOrganizations: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ORGANIZATIONS.LIST, { params });
    return response.data;
  },

  // Get single organization
  getOrganization: async (organizationId) => {
    const response = await api.get(ENDPOINTS.ORGANIZATIONS.DETAIL(organizationId));
    return response.data;
  },

  // Create organization
  createOrganization: async (organizationData) => {
    const response = await api.post(ENDPOINTS.ORGANIZATIONS.CREATE, organizationData);
    return response.data;
  },

  // Update organization
  updateOrganization: async ({ organizationId, organizationData }) => {
    const response = await api.put(ENDPOINTS.ORGANIZATIONS.UPDATE(organizationId), organizationData);
    return response.data;
  },

  // Delete organization
  deleteOrganization: async (organizationId) => {
    await api.delete(ENDPOINTS.ORGANIZATIONS.DELETE(organizationId));
    return organizationId;
  }
};

// React Query hooks for organization management
export const useOrganizations = (filters = {}) => {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.list(filters),
    queryFn: () => organizationService.getOrganizations(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useOrganization = (organizationId, options = {}) => {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.detail(organizationId),
    queryFn: () => organizationService.getOrganization(organizationId),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

// Mutations for organization operations
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: organizationService.createOrganization,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.lists() });
      toast.success('Organization created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create organization';
      toast.error(message);
    }
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: organizationService.updateOrganization,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ORGANIZATION_QUERY_KEYS.detail(variables.organizationId),
        data
      );
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.lists() });
      toast.success('Organization updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update organization';
      toast.error(message);
    }
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: organizationService.deleteOrganization,
    onSuccess: (deletedOrgId) => {
      queryClient.removeQueries({ queryKey: ORGANIZATION_QUERY_KEYS.detail(deletedOrgId) });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.lists() });
      toast.success('Organization deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete organization';
      toast.error(message);
    }
  });
};