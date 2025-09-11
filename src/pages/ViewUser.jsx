import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Shield, ShieldCheck, User, Mail, Phone, Building, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useUser, usePermissions } from '../services/userService';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEditUsers } = usePermissions();

  // Fetch user data
  const { data: user, isLoading, isError } = useUser(id);

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'super_admin':
        return <ShieldCheck className="w-5 h-5 text-red-400" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-blue-400" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">User Not Found</h2>
        <p className="text-white/60 mb-4">The user you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/users')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/users')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              User Details
            </h1>
            <p className="text-white/60 mt-2">
              View user information and settings
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate(`/users/edit/${id}`)}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit User</span>
        </Button>
      </div>

      {/* User Profile Card */}
      <GlassCard className="p-8">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl">
                {user.name?.charAt(0)?.toUpperCase() || user.login_id?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {user.name || user.login_id}
              </h2>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getUserTypeColor(user.user_type)}`}>
                  {getUserTypeIcon(user.user_type)}
                  <span className="capitalize">{user.user_type?.replace('_', ' ')}</span>
                </span>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${
                  user.is_active 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {user.is_active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/70">
                  <Mail className="w-5 h-5" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Phone className="w-5 h-5" />
                  <span>{user.mobile || 'No mobile number'}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <User className="w-5 h-5" />
                  <span>Login ID: {user.login_id}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/70">
                  <Building className="w-5 h-5" />
                  <span>Employee ID: {user.employee_id || 'Not assigned'}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Building className="w-5 h-5" />
                  <span>Department: {user.department || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Shield className="w-5 h-5" />
                  <span>Designation: {user.designation || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Status */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Email Verified</span>
              <span className={`px-2 py-1 rounded text-sm ${
                user.is_email_verified ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {user.is_email_verified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Phone Verified</span>
              <span className={`px-2 py-1 rounded text-sm ${
                user.is_phone_verified ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {user.is_phone_verified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Staff Member</span>
              <span className={`px-2 py-1 rounded text-sm ${
                user.is_staff ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {user.is_staff ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Super User</span>
              <span className={`px-2 py-1 rounded text-sm ${
                user.is_superuser ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {user.is_superuser ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Account Timeline */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-white/70 text-sm">Joined</div>
                <div className="text-white">
                  {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-white/70 text-sm">Last Login</div>
                <div className="text-white">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-white/70 text-sm">First Login</div>
                <div className="text-white">
                  {user.is_first_login ? 'Yes' : 'Completed'}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Roles and Permissions */}
      {user.roles && user.roles.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Assigned Roles</h3>
          <div className="space-y-3">
            {user.roles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{role.role_name}</div>
                  <div className="text-white/60 text-sm">
                    Assigned by {role.assigned_by_name} on {new Date(role.assigned_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  role.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {role.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Permissions */}
      {user.permissions && user.permissions.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {user.permissions.map((permission, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-white/70 text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ViewUser;

