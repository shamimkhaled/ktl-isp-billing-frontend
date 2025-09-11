import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Save, User, Mail, Phone, Building, Shield } from 'lucide-react';
import { createUser, fetchRoles, clearError } from '../store/usersSlice';
import { fetchRoles as fetchAllRoles } from '../store/rolesSlice';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.users);
  const { roles } = useSelector((state) => state.roles);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_type: 'user',
      roles: [],
    },
  });

  const password = watch('password');

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // All users can create users - no permission check needed

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare the data for API
      const userData = {
        ...data,
        roles: data.roles.map(roleId => parseInt(roleId)),
      };

      await dispatch(createUser(userData)).unwrap();
      toast.success('User created successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // All users can create users - no access denied UI needed

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Create New User
          </h1>
          <p className="text-white/60 mt-2">
            Add a new user to the system with appropriate roles and permissions
          </p>
        </div>
      </div>

      {/* Form */}
      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Login ID */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Login ID *
                </label>
                <input
                  {...register('login_id', {
                    required: 'Login ID is required',
                    minLength: {
                      value: 3,
                      message: 'Login ID must be at least 3 characters'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Login ID can only contain letters, numbers, and underscores'
                    }
                  })}
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
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                    placeholder="Enter email address"
                  />
                </div>
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
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
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
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    {...register('mobile', {
                      pattern: {
                        value: /^\+?[\d\s\-\(\)]+$/,
                        message: 'Invalid mobile number format'
                      }
                    })}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-300 text-sm mt-1">{errors.mobile.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Account Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  User Type *
                </label>
                <select
                  {...register('user_type', { required: 'User type is required' })}
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="ktl_staff">KTL Staff</option>
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
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    {...register('department')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                    placeholder="Enter department"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Password</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password *
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type="password"
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Confirm Password *
                </label>
                <input
                  {...register('password_confirm', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type="password"
                  className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
                  placeholder="Confirm password"
                />
                {errors.password_confirm && (
                  <p className="text-red-300 text-sm mt-1">{errors.password_confirm.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Roles & Permissions</h3>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Assign Roles
              </label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roles.map((role) => (
                      <label key={role.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={role.id}
                          checked={field.value.includes(role.id.toString())}
                          onChange={(e) => {
                            const value = e.target.value;
                            const currentValues = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, value]);
                            } else {
                              field.onChange(currentValues.filter(v => v !== value));
                            }
                          }}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-white/20 bg-white/10 rounded"
                        />
                        <span className="text-white/80 text-sm">{role.display_name || role.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
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
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Create User</span>
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default CreateUser;
