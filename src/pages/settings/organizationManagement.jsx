// src/pages/settings/OrganizationManagement.jsx - Organization Management Component
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users
} from 'lucide-react';
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization
} from '../../services/organizationService';

import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { toast } from 'react-hot-toast';

const OrganizationForm = ({ organization, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: organization || {}
  });

  useEffect(() => {
    if (organization) {
      reset(organization);
    }
  }, [organization, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Organization Name *
          </label>
          <input
            {...register('name', { required: 'Organization name is required' })}
            type="text"
            className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
            placeholder="Enter organization name"
          />
          {errors.name && (
            <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Organization Code */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Organization Code *
          </label>
          <input
            {...register('code', { required: 'Organization code is required' })}
            type="text"
            className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
            placeholder="Enter organization code"
          />
          {errors.code && (
            <p className="text-red-300 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Email
          </label>
          <input
            {...register('email', {
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

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
            placeholder="Enter phone number"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Website
          </label>
          <input
            {...register('website')}
            type="url"
            className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all"
            placeholder="Enter website URL"
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

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Address
        </label>
        <textarea
          {...register('address')}
          rows={3}
          className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all resize-none"
          placeholder="Enter organization address"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/50 transition-all resize-none"
          placeholder="Enter organization description"
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{organization ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{organization ? 'Update' : 'Create'}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const OrganizationCard = ({ organization, onEdit, onDelete, onView }) => {
  return (
    <GlassCard className="hover:bg-white/20 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{organization.name}</h3>
              <p className="text-white/60 text-sm">Code: {organization.code}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              organization.is_active 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {organization.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {organization.email && (
            <div className="flex items-center text-white/60 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              {organization.email}
            </div>
          )}
          {organization.phone && (
            <div className="flex items-center text-white/60 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              {organization.phone}
            </div>
          )}
          {organization.website && (
            <div className="flex items-center text-white/60 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              {organization.website}
            </div>
          )}
          {organization.address && (
            <div className="flex items-center text-white/60 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              {organization.address}
            </div>
          )}
        </div>

        {organization.description && (
          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {organization.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center text-white/50 text-xs">
            <Users className="w-4 h-4 mr-1" />
            {organization.user_count || 0} users
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(organization)}
              className="text-white/60 hover:text-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(organization)}
              className="text-white/60 hover:text-white"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(organization)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const OrganizationManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);

  // All users can manage organizations - no permission check needed

  // React Query hooks
  const { data: organizations, isLoading, isError, error, refetch } = useOrganizations();
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  // Event handlers
  const handleCreateNew = () => {
    setEditingOrganization(null);
    setShowForm(true);
  };

  const handleEdit = (organization) => {
    setEditingOrganization(organization);
    setShowForm(true);
  };

  const handleView = (organization) => {
    // TODO: Implement view details modal or navigate to detail page
    toast.info('View details feature coming soon!');
  };

  const handleDeleteClick = (organization) => {
    setOrganizationToDelete(organization);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingOrganization) {
        await updateMutation.mutateAsync({
          organizationId: editingOrganization.id,
          organizationData: data
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingOrganization(null);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrganization(null);
  };

  const handleDeleteConfirm = async () => {
    if (organizationToDelete) {
      try {
        await deleteMutation.mutateAsync(organizationToDelete.id);
        setShowDeleteModal(false);
        setOrganizationToDelete(null);
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  // All users can manage organizations - no permission check needed

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
        <h2 className="text-xl font-semibold text-white mb-2">Error Loading Organizations</h2>
        <p className="text-white/60 mb-4">{error?.message || 'Something went wrong'}</p>
        <Button onClick={() => refetch()} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Organization Management
          </h1>
          <p className="text-white/60 mt-2">
            Manage system organizations ({Array.isArray(organizations) ? organizations.length : 0} organizations)
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateNew}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Organization</span>
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(!organizations || organizations.length === 0) ? (
          <div className="col-span-full">
            <GlassCard className="p-12 text-center">
              <Building className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Organizations Found</h3>
              <p className="text-white/60 mb-4">
                Get started by creating your first organization
              </p>
              <Button variant="primary" onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </GlassCard>
          </div>
        ) : (
          (Array.isArray(organizations) ? organizations : []).map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingOrganization ? 'Edit Organization' : 'Create Organization'}
        size="xl"
      >
        <OrganizationForm
          organization={editingOrganization}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Organization"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Delete {organizationToDelete?.name}?
              </h3>
              <p className="text-white/60 text-sm">
                This action cannot be undone. All organization data will be permanently removed.
                Users associated with this organization may be affected.
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
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Organization'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrganizationManagement;

