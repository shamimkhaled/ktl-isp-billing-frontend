import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Building,
  User,
  Lock,
  Bell,
  Palette,
  Database,
  Shield,
  Globe,
  HardDrive,
  Mail,
  Wifi,
  Monitor,
  ChevronRight
} from 'lucide-react';
import { usePermissions } from '../services/userService';
import GlassCard from '../components/common/GlassCard';
import OrganizationManagement from './settings/organizationManagement';

// Settings navigation items
const getSettingsNavigation = (canManageOrganizations) => [
  {
    id: 'general',
    label: 'General',
    icon: SettingsIcon,
    path: '/settings/general',
    description: 'Basic application settings',
    accessible: true
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building,
    path: '/settings/organizations',
    description: 'Manage organizations',
    accessible: canManageOrganizations,
    restricted: true
  },
  {
    id: 'users',
    label: 'User Settings',
    icon: User,
    path: '/settings/users',
    description: 'User management preferences',
    accessible: true
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    path: '/settings/security',
    description: 'Password policies and authentication',
    accessible: true
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/settings/notifications',
    description: 'Email and system notifications',
    accessible: true
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    path: '/settings/appearance',
    description: 'Theme and UI preferences',
    accessible: true
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    path: '/settings/database',
    description: 'Database configuration and backups',
    accessible: true
  },
  {
    id: 'permissions',
    label: 'Permissions',
    icon: Shield,
    path: '/settings/permissions',
    description: 'Role and permission management',
    accessible: true
  },
  {
    id: 'network',
    label: 'Network',
    icon: Wifi,
    path: '/settings/network',
    description: 'Network configuration',
    accessible: true
  },
  {
    id: 'system',
    label: 'System',
    icon: Monitor,
    path: '/settings/system',
    description: 'System monitoring and logs',
    accessible: true
  }
];

// Placeholder components for other settings sections
const GeneralSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">General Settings</h2>
      <p className="text-white/60">Basic application configuration</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">General settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const UserSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">User Settings</h2>
      <p className="text-white/60">User management preferences</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">User settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
      <p className="text-white/60">Password policies and authentication</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Security settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Notification Settings</h2>
      <p className="text-white/60">Email and system notifications</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Notification settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const AppearanceSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Appearance Settings</h2>
      <p className="text-white/60">Theme and UI preferences</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Appearance settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const DatabaseSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Database Settings</h2>
      <p className="text-white/60">Database configuration and backups</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Database settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const PermissionSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Permission Settings</h2>
      <p className="text-white/60">Role and permission management</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Permission settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const NetworkSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Network Settings</h2>
      <p className="text-white/60">Network configuration</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">Network settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

const SystemSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
      <p className="text-white/60">System monitoring and logs</p>
    </div>
    <GlassCard className="p-6">
      <p className="text-white/70">System settings configuration coming soon...</p>
    </GlassCard>
  </div>
);

// Settings navigation component
const SettingsNavigation = ({ navigation, currentPath }) => {
  return (
    <div className="space-y-2">
      {navigation
        .filter(item => item.accessible)
        .map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white/20 border border-white/30'
                  : 'hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                    : 'bg-white/10'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {item.label}
                    {item.restricted && (
                      <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                        Super Admin Only
                      </span>
                    )}
                  </h3>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </Link>
          );
        })}
    </div>
  );
};

const Settings = () => {
  const location = useLocation();
  const { canManageOrganizations } = usePermissions();
  
  const navigation = getSettingsNavigation(canManageOrganizations());
  const currentPath = location.pathname;

  // Redirect to general settings if on base settings path
  if (currentPath === '/settings' || currentPath === '/settings/') {
    return <Navigate to="/settings/general" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-white/60 mt-2">
          Configure your application settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Settings Menu</h2>
            <SettingsNavigation navigation={navigation} currentPath={currentPath} />
          </GlassCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="general" element={<GeneralSettings />} />
            <Route path="organizations" element={<OrganizationManagement />} />
            <Route path="users" element={<UserSettings />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
            <Route path="database" element={<DatabaseSettings />} />
            <Route path="permissions" element={<PermissionSettings />} />
            <Route path="network" element={<NetworkSettings />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="*" element={<Navigate to="/settings/general" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Settings;