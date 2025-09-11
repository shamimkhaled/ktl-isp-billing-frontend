// src/components/common/Sidebar.jsx - Enhanced with Role-Based Access Control
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Activity,
  MapPin,
  Users,
  DollarSign,
  Wifi,
  TrendingUp,
  Settings,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Shield,
  Building
} from 'lucide-react';

// All users have access to all menu items
const getUserMenuItems = (userType) => {
  console.log('getUserMenuItems called with userType:', userType);

  const baseMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Activity,
      path: '/dashboard',
      gradient: 'from-blue-400 to-cyan-400',
      subItems: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'Login Messages', path: '/dashboard/messages' },
        { label: 'Online Users', path: '/dashboard/users' }
      ]
    },
    {
      id: 'sdt-zone',
      label: 'SDT / Zone',
      icon: MapPin,
      path: '/sdt-zone',
      gradient: 'from-emerald-400 to-green-400',
      subItems: [
        { label: 'Create Zone', path: '/sdt-zone/create' },
        { label: 'List Zone', path: '/sdt-zone/zones' },
        { label: 'List SDT', path: '/sdt-zone/sdt' },
        { label: 'Customer Payments', path: '/sdt-zone/payments' },
        { label: 'Zone Summary', path: '/sdt-zone/summary' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: '/customers',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: DollarSign,
      path: '/billing',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'network',
      label: 'Network',
      icon: Wifi,
      path: '/network',
      gradient: 'from-indigo-400 to-purple-400'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: TrendingUp,
      path: '/reports',
      gradient: 'from-teal-400 to-blue-400'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: UserCheck,
      path: '/users',
      gradient: 'from-indigo-400 to-blue-400',
      subItems: [
        { label: 'All Users', path: '/users' },
        { label: 'Create User', path: '/users/create' },
        { label: 'Roles & Permissions', path: '/users/roles' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      gradient: 'from-gray-400 to-slate-400',
      subItems: [
        { label: 'General', path: '/settings/general' },
        { label: 'Organizations', path: '/settings/organizations' },
        { label: 'User Management', path: '/settings/users' },
        { label: 'Security', path: '/settings/security' },
        { label: 'Notifications', path: '/settings/notifications' },
      ]
    }
  ];

  console.log('All menu items available for user type:', userType);

  return baseMenuItems;
};

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  
  // Get current user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Handle different possible user type field names and normalize to expected format
  const rawUserType = user?.user_type || user?.role || user?.userType || user?.type || 'user';
  const userType = rawUserType.toLowerCase().replace(/\s+/g, '_');

  // Debug logging
  console.log('Sidebar Debug:', {
    user,
    rawUserType,
    normalizedUserType: userType,
    userTypeFromUser: user?.user_type,
    userRole: user?.role,
    userTypeAlt: user?.userType,
    userTypeField: user?.type,
    hasUser: !!user,
    userKeys: user ? Object.keys(user) : [],
    isSuperUser: userType === 'super_admin' || userType === 'superuser' || userType === 'admin'
  });

  // Get filtered menu items based on user role
  const menuItems = getUserMenuItems(userType);

  console.log('Filtered menu items:', menuItems.length, 'items for user type:', userType);

  const toggleMenu = (itemId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubItemActive = (path) => {
    return location.pathname === path;
  };

  // No access denied message needed - all users have full access
  const showAccessDeniedMessage = () => {
    return null;
  };

  return (
      <div className="w-80 backdrop-blur-xl bg-white/5 dark:bg-white/5 light:bg-white/90 border-r border-white/10 dark:border-white/10 light:border-gray-200/50 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-white/10 dark:border-white/10 light:border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white dark:text-white light:text-gray-900">KTL ISP</h1>
              <p className="text-xs text-white/60 dark:text-white/60 light:text-gray-600">Billing System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10 dark:border-white/10 light:border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || user?.login_id?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white dark:text-white light:text-gray-900 font-medium text-sm truncate">
                {user?.name || user?.login_id || 'User'}
              </p>
              <p className="text-white/60 dark:text-white/60 light:text-gray-600 text-xs capitalize truncate">
                {userType?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Access Level Message */}
        {showAccessDeniedMessage()}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isMenuActive = isActive(item.path);
            const isExpanded = expandedMenus[item.id];
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} className="space-y-1">
                {/* Main Menu Item */}
                <div
                  className={`
                    group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer
                    ${isMenuActive 
                      ? 'bg-white/20 dark:bg-white/20 light:bg-blue-100 border border-white/30 dark:border-white/30 light:border-blue-200' 
                      : 'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100 border border-transparent'
                    }
                  `}
                  onClick={() => hasSubItems ? toggleMenu(item.id) : null}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative p-4">
                    <div className="flex items-center justify-between">
                      <Link 
                        to={hasSubItems ? '#' : item.path} 
                        className="flex items-center space-x-3 flex-1"
                        onClick={(e) => hasSubItems && e.preventDefault()}
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                          ${isMenuActive 
                            ? `bg-gradient-to-br ${item.gradient}` 
                            : 'bg-white/10 dark:bg-white/10 light:bg-gray-200 group-hover:bg-white/20 dark:group-hover:bg-white/20 light:group-hover:bg-gray-300'
                          }
                        `}>
                          <Icon className="w-5 h-5 text-white dark:text-white light:text-gray-700" />
                        </div>
                        <span className="text-white dark:text-white light:text-gray-900 font-medium group-hover:text-white/90 dark:group-hover:text-white/90 light:group-hover:text-gray-700 transition-colors">
                          {item.label}
                        </span>
                      </Link>
                      
                      {/* Expand/Collapse Icon for items with sub-menu */}
                      {hasSubItems && (
                        <div className="transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-white/60 dark:text-white/60 light:text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white/60 dark:text-white/60 light:text-gray-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub Menu Items */}
                {hasSubItems && (
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="pl-6 py-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`
                            block p-3 rounded-lg transition-all duration-200 text-sm
                            ${isSubItemActive(subItem.path)
                              ? 'bg-white/15 dark:bg-white/15 light:bg-blue-50 text-white dark:text-white light:text-blue-700 border-l-2 border-blue-400'
                              : 'text-white/70 dark:text-white/70 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100'
                            }
                          `}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-white/10 dark:border-white/10 light:border-gray-200/50">
          <div className="text-center">
            <p className="text-white/40 dark:text-white/40 light:text-gray-500 text-xs">
              © 2024 KTL ISP Billing System
            </p>
            <p className="text-white/30 dark:text-white/30 light:text-gray-400 text-xs mt-1">
              v2.0.0 - Enhanced
            </p>
          </div>
        </div>
      </div>
    );
};

export default Sidebar;