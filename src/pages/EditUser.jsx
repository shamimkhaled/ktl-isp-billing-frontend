import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, User, Mail, Phone, Building, Shield } from 'lucide-react';
import { useUser, useUpdateUser, usePermissions } from '../services/userService';
import { useRoles } from '../services/roleService';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEditUsers, currentUser } = usePermissions();

  // Fetch user data
  const { data: user, isLoading, isError } = useUser(id);
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        login_id: user.login_id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        user_type: user.user_type,
        employee_id: user.employee_id,
        designation: user.designation,
        department: user.department,
        is_active: user.is_active,
      });
    }
  }, [user, reset]);

  // All users can edit users - no permission check needed

  const onSubmit = async (data) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: id,
        userData: data
      });
      navigate('/users');
    } catch (error) {
      // Error handled by mutation
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
            Edit User
          </h1>
          <p className="text-white/60 mt-2">
            Update user information and settings
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <GlassCard className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Login ID */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Login ID *
              </label>
              <input
                {...register('login_id', { required: 'Login ID is required' })}
                type="text"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter login ID"
              />
              {errors.login_id && (
                <p className="text-red-300 text-sm mt-1">{errors.login_id.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email *
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Full name is required' })}
                type="text"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Mobile Number
              </label>
              <input
                {...register('mobile')}
                type="tel"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter mobile number"
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                User Type *
              </label>
              <select
                {...register('user_type', { required: 'User type is required' })}
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              >
                <option value="">Select user type</option>
                <option value="user">User</option>
                <option value="ktl_staff">KTL Staff</option>
                <option value="manager">Manager</option>
                <option value="support_staff">Support Staff</option>
                <option value="field_staff">Field Staff</option>
                <option value="reseller_admin">Reseller Admin</option>
                <option value="sub_reseller_admin">Sub Reseller Admin</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              {errors.user_type && (
                <p className="text-red-300 text-sm mt-1">{errors.user_type.message}</p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Employee ID
              </label>
              <input
                {...register('employee_id')}
                type="text"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter employee ID"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Designation
              </label>
              <input
                {...register('designation')}
                type="text"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter designation"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Department
              </label>
              <input
                {...register('department')}
                type="text"
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                placeholder="Enter department"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Status
              </label>
              <select
                {...register('is_active')}
                className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateUserMutation.isLoading}
              className="flex items-center space-x-2"
            >
              {updateUserMutation.isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update User</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default EditUser;

