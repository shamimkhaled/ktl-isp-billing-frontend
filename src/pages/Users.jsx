
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users as UsersIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Shield,
  ShieldCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { useUsers, useDeleteUser, usePermissions } from '../services/userService';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

// Memoized user row component to prevent unnecessary re-renders
const UserRow = React.memo(({ user, onEdit, onDelete, onView }) => {
  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ktl_staff':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'manager':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'reseller_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'sub_reseller_admin':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'super_admin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  return (
    <GlassCard className="hover:bg-white/20 transition-all duration-300 mb-4">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {user.name?.charAt(0)?.toUpperCase() || user.login_id?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {user.name || user.login_id}
            </h3>
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(user.user_type)}`}>
                {getUserTypeIcon(user.user_type)}
                <span className="capitalize">{user.user_type?.replace('_', ' ')}</span>
              </span>
              {user.employee_id && (
                <span className="text-xs text-white/50">
                  ID: {user.employee_id}
                </span>
              )}
              {!user.is_active && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                  <UserX className="w-3 h-3" />
                  <span>Inactive</span>
                </span>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="hidden md:flex flex-col items-end text-right text-sm text-white/60">
            <div>Department: {user.department || 'N/A'}</div>
            <div>Designation: {user.designation || 'N/A'}</div>
            <div>Last Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(user)}
            className="text-white/60 hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="text-white/60 hover:text-white"
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
});

UserRow.displayName = 'UserRow';

const Users = () => {
  const navigate = useNavigate();
  const {
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canViewUsers,
    canAccessUserManagement,
    canOnlyViewOwnData,
    hasReadOnlyAccess,
    currentUser
  } = usePermissions();

  // State management
  const [filters, setFilters] = useState({
    search: '',
    user_type: '',
    is_active: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // All users can access user management - no permission check needed

  // React Query hooks
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useUsers(filters);

  const deleteUserMutation = useDeleteUser();

  // Flatten all pages data for display
  const allUsers = useMemo(() => {
    return data?.pages?.flatMap(page => page.data) || [];
  }, [data]);

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500),
    []
  );

  // Event handlers
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleEditUser = (user) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleViewUser = (user) => {
    navigate(`/users/view/${user.id}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const exportUsers = () => {
    // TODO: Implement user export functionality
    toast.success('Export feature coming soon!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Error Loading Users</h2>
        <p className="text-white/60 mb-4">{error?.message || 'Something went wrong'}</p>
        <Button onClick={() => refetch()} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </Button>
      </div>
    );
  }

  // All users can view users - no permission check needed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-white/60 mt-2">
            Manage system users, roles, and permissions ({allUsers.length} users)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={exportUsers}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>

          <Link to="/users/create">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add User</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* User Type Filter */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  User Type
                </label>
                <select
                  value={filters.user_type}
                  onChange={(e) => handleFilterChange('user_type', e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Types</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="ktl_staff">KTL Staff</option>
                  <option value="manager">Manager</option>
                  <option value="reseller_admin">Reseller Admin</option>
                  <option value="sub_reseller_admin">Sub Reseller Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status
                </label>
                <select
                  value={filters.is_active}
                  onChange={(e) => handleFilterChange('is_active', e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => setFilters({ search: '', user_type: '', is_active: '' })}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Users List */}
      <div className="relative">
        {allUsers.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <UsersIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
            <p className="text-white/60 mb-4">
              {filters.search || filters.user_type || filters.is_active
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first user'}
            </p>
            <Link to="/users/create">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {/* User List */}
            <div className="max-h-[600px] overflow-y-auto space-y-4">
              {allUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteClick}
                  onView={handleViewUser}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="flex items-center space-x-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Load More</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Delete {userToDelete?.name || userToDelete?.login_id}?
              </h3>
              <p className="text-white/60 text-sm">
                This action cannot be undone. All user data will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isLoading}
            >
              {deleteUserMutation.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;