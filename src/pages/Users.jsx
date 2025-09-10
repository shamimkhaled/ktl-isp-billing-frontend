import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
  UserX
} from 'lucide-react';
import {
  fetchUsers,
  deleteUser,
  clearError
} from '../store/usersSlice';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, pagination } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({
      search: searchTerm,
      user_type: userTypeFilter,
    }));
  }, [dispatch, searchTerm, userTypeFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id)).unwrap();
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const canManageUsers = () => {
    return currentUser?.user_type === 'super_admin' || currentUser?.user_type === 'admin';
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'manager':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'user':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-white/60 mt-2">
            Manage system users, roles, and permissions
          </p>
        </div>

        {canManageUsers() && (
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
        )}
      </div>

      {/* Search and Filters */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or login ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
            />
          </div>

          {/* Filters Toggle */}
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
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  User Type
                </label>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
                >
                  <option value="">All Types</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => (
          <GlassCard key={user.id} className="hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || user.login_id?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {user.name || user.login_id}
                  </h3>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(user.user_type)}`}>
                      {getUserTypeIcon(user.user_type)}
                      <span className="capitalize">{user.user_type?.replace('_', ' ')}</span>
                    </span>
                    {user.employee_id && (
                      <span className="text-white/40 text-xs">
                        ID: {user.employee_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link to={`/users/${user.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>

                {canManageUsers() && (
                  <>
                    <Link to={`/users/${user.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && (
        <GlassCard>
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-white/60">
              {searchTerm || userTypeFilter
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first user'
              }
            </p>
          </div>
        </GlassCard>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Are you sure you want to delete <strong>{userToDelete?.name || userToDelete?.login_id}</strong>?
            This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
              loading={loading}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
