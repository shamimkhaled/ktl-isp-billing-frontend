// src/services/userService.js - Production optimized with better caching
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import api, { ENDPOINTS } from './api';
import { toast } from 'react-hot-toast';

// Query keys for cache management
export const USER_QUERY_KEYS = {
  all: ['users'],
  lists: () => [...USER_QUERY_KEYS.all, 'list'],
  list: (filters) => [...USER_QUERY_KEYS.lists(), { filters }],
  details: () => [...USER_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...USER_QUERY_KEYS.details(), id],
  permissions: () => [...USER_QUERY_KEYS.all, 'permissions'],
  profile: () => [...USER_QUERY_KEYS.all, 'profile'],
};

// User API service functions
export const userService = {
  // Fetch users with pagination and filtering
  getUsers: async ({ pageParam = 1, ...filters }) => {
    const params = {
      page: pageParam,
      page_size: 20,
      ...filters
    };
    
    const response = await api.get(ENDPOINTS.USERS.LIST, { params });
    return {
      data: response.data.results || response.data,
      nextPage: response.data.next ? pageParam + 1 : undefined,
      hasNextPage: !!response.data.next,
      totalCount: response.data.count,
      currentPage: pageParam
    };
  },

  // Get single user
  getUser: async (userId) => {
    const response = await api.get(ENDPOINTS.USERS.DETAIL(userId));
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post(ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  // Update user
  updateUser: async ({ userId, userData }) => {
    const response = await api.put(ENDPOINTS.USERS.UPDATE(userId), userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    await api.delete(ENDPOINTS.USERS.DELETE(userId));
    return userId;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async () => {
    const response = await api.get(ENDPOINTS.USERS.PERMISSIONS);
    return response.data;
  },

  // Get user profile - optimized for performance
  getUserProfile: async () => {
    const response = await api.get(ENDPOINTS.USERS.PROFILE);
    return response.data;
  }
};

// React Query hooks for user management
export const useUsers = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam }) => userService.getUsers({ pageParam, ...filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 2 * 60 * 1000, // 2 minutes for user lists
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
    // Enable background refetching
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId, options = {}) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => userService.getUser(userId),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes for individual users
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
    ...options
  });
};

export const useUserPermissions = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.permissions(),
    queryFn: userService.getUserPermissions,
    staleTime: 15 * 60 * 1000, // 15 minutes - permissions change rarely
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile(),
    queryFn: userService.getUserProfile,
    staleTime: 1 * 60 * 1000, // 1 minute for profile (current user)
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 3, // Retry profile requests more aggressively
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Mutations for user operations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: (data) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('User created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to create user';
      toast.error(message);
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data, variables) => {
      // Update specific user in cache
      queryClient.setQueryData(
        USER_QUERY_KEYS.detail(variables.userId),
        data
      );
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('User updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to update user';
      toast.error(message);
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (deletedUserId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(deletedUserId) });
      
      // Update users list cache
      queryClient.setQueriesData(
        { queryKey: USER_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              data: page.data.filter(user => user.id !== deletedUserId)
            }))
          };
        }
      );
      
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to delete user';
      toast.error(message);
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to change password';
      toast.error(message);
    }
  });
};

// Permission checking utilities - all permissions granted to all users
export const usePermissions = () => {
  const { data: currentUser, isLoading } = useUserProfile();

  // All users can perform all user operations
  const canCreateUsers = () => {
    return true;
  };

  const canEditUsers = () => {
    return true;
  };

  const canDeleteUsers = () => {
    return true;
  };

  // All users can view users
  const canViewUsers = () => {
    return true;
  };

  // All users can access user management routes
  const canAccessUserManagement = () => {
    return true;
  };

  // All users can manage organizations
  const canManageOrganizations = () => {
    return true;
  };

  // All users can manage permissions
  const canManagePermissions = () => {
    return true;
  };

  // All users can assign roles
  const canAssignRoles = () => {
    return true;
  };

  // No users are restricted to view only their own data
  const canOnlyViewOwnData = () => {
    return false;
  };

  // No users have read-only access
  const hasReadOnlyAccess = () => {
    return false;
  };

  return {
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canViewUsers,
    canAccessUserManagement,
    canManageOrganizations,
    canManagePermissions,
    canAssignRoles,
    canOnlyViewOwnData,
    hasReadOnlyAccess,
    currentUser,
    isLoading
  };
};
