import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const menuItems = [
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
    gradient: 'from-gray-400 to-slate-400' 
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

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

  return (
    <div className="backdrop-blur-xl bg-white/5 light:bg-white/60 border-r border-white/10 light:border-gray-200/50 w-72 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 light:from-blue-500/2 light:via-purple-500/2 light:to-pink-500/2"></div>
      
      <div className="p-6 relative z-10">
        <nav className="space-y-3">
          {menuItems.map(({ id, label, icon: Icon, path, gradient, subItems }) => {
            const active = isActive(path);
            const expanded = expandedMenus[id];
            
            return (
              <div key={id}>
                <div className="relative">
                  <Link
                    to={path}
                    onClick={(e) => {
                      if (subItems) {
                        e.preventDefault();
                        toggleMenu(id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-left transition-all duration-300 group ${
                      active 
                        ? 'backdrop-blur-md bg-white/20 light:bg-white/80 border border-white/30 light:border-gray-300/50 shadow-2xl' 
                        : 'hover:backdrop-blur-md hover:bg-white/10 light:hover:bg-white/40 hover:border hover:border-white/20 light:hover:border-gray-300/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-white light:text-gray-900 text-base">
                          {label}
                        </span>
                        {active && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-1 h-1 bg-white light:bg-indigo-600 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-white light:bg-indigo-600 rounded-full animate-pulse delay-100"></div>
                            <div className="w-1 h-1 bg-white light:bg-indigo-600 rounded-full animate-pulse delay-200"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {active && (
                        <div className="w-2 h-8 bg-gradient-to-b from-white via-blue-200 to-purple-200 light:from-indigo-600 light:via-blue-500 light:to-purple-500 rounded-full shadow-lg"></div>
                      )}
                      {subItems && (
                        <div className="transition-transform duration-200">
                          {expanded ? (
                            <ChevronDown className="w-4 h-4 text-white/60 light:text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white/60 light:text-gray-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
                
                {/* Submenu */}
                {subItems && expanded && (
                  <div className="ml-12 mt-3 space-y-2 animate-slideDown">
                    {subItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`block w-full text-left px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                          isSubItemActive(item.path)
                            ? 'bg-white/20 light:bg-white/60 text-white light:text-indigo-700 font-medium'
                            : 'text-white/70 light:text-gray-600 hover:text-white light:hover:text-gray-900 hover:bg-white/10 light:hover:bg-white/40'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-white/10 light:border-gray-200/50">
          <div className="backdrop-blur-md bg-white/10 light:bg-white/50 border border-white/20 light:border-gray-300/50 rounded-2xl p-4">
            <div className="text-center">
              <h4 className="text-white light:text-gray-900 font-semibold text-sm mb-1">
                System Status
              </h4>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/70 light:text-gray-600">
                  All Services Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;

