import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import {
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
  Sparkles,
  Sun,
  Moon,
  User,
  Key
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggle();
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="relative p-3 backdrop-blur-md bg-white/10 border border-white/20 light:bg-gray-200/80 light:border-gray-300/50 rounded-2xl hover:bg-white/20 light:hover:bg-gray-300/60 transition-all duration-300 shadow-xl group"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
      )}
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
        theme === 'dark' 
          ? 'bg-yellow-400/20 group-hover:bg-yellow-400/30' 
          : 'bg-indigo-400/20 group-hover:bg-indigo-400/30'
      } opacity-0 group-hover:opacity-100 blur-lg`}></div>
    </button>
  );
};

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [onlineUsers] = useState(1247);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showUserMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 light:bg-white/90 light:border-gray-200/50 px-6 py-4 relative transition-all duration-300">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 light:from-blue-400/10 light:to-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-400/15 to-pink-400/15 light:from-purple-400/8 light:to-pink-400/8 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Left section - Logo and time */}
        <div className="flex items-center space-x-6">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-md opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-white light:text-gray-900 font-bold text-xl transition-colors duration-300">
                KTL ISP
              </h1>
              <p className="text-white/70 light:text-gray-600 text-xs transition-colors duration-300">
                Billing System
              </p>
            </div>
          </div>

          {/* Live time */}
          <div className="hidden md:flex items-center space-x-2 backdrop-blur-md bg-white/10 border border-white/20 light:bg-white/50 light:border-gray-300/50 rounded-2xl px-4 py-2 transition-all duration-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white light:text-gray-700 font-medium text-sm transition-colors duration-300">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Right section - Status, theme toggle, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Online users status */}
          <div className="hidden lg:flex items-center space-x-2 backdrop-blur-md bg-white/10 border border-white/20 light:bg-white/50 light:border-gray-300/50 rounded-2xl px-4 py-2 transition-all duration-300">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-white light:text-gray-700 font-semibold text-sm transition-colors duration-300">
              {onlineUsers.toLocaleString()} Online
            </span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 backdrop-blur-md bg-white/10 border border-white/20 light:bg-gray-200/80 light:border-gray-300/50 rounded-2xl hover:bg-white/20 light:hover:bg-gray-300/60 transition-all duration-300 shadow-xl group"
            >
              <Bell className="w-5 h-5 text-white light:text-gray-700 group-hover:scale-110 transition-all duration-300" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg shadow-red-400/50 animate-bounce">
                3
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 backdrop-blur-xl bg-white/10 border border-white/20 light:bg-white/95 light:border-gray-200 rounded-2xl shadow-2xl p-4 z-50 transition-all duration-300">
                <h3 className="text-white light:text-gray-900 font-semibold mb-3 transition-colors duration-300">Recent Notifications</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl transition-all duration-300">
                    <p className="text-sm text-white light:text-gray-800 transition-colors duration-300">New payment received from Customer #1247</p>
                    <p className="text-xs text-white/70 light:text-gray-600 mt-1 transition-colors duration-300">2 minutes ago</p>
                  </div>
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl transition-all duration-300">
                    <p className="text-sm text-white light:text-gray-800 transition-colors duration-300">Service outage reported in Zone A</p>
                    <p className="text-xs text-white/70 light:text-gray-600 mt-1 transition-colors duration-300">15 minutes ago</p>
                  </div>
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl transition-all duration-300">
                    <p className="text-sm text-white light:text-gray-800 transition-colors duration-300">Monthly report is ready for review</p>
                    <p className="text-xs text-white/70 light:text-gray-600 mt-1 transition-colors duration-300">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 backdrop-blur-md bg-white/10 border border-white/20 light:bg-gray-200/80 light:border-gray-300/50 rounded-2xl px-4 py-2 hover:bg-white/20 light:hover:bg-gray-300/60 transition-all duration-300 shadow-xl group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-green-400/50">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white light:text-gray-900 font-medium text-sm transition-colors duration-300">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-white/70 light:text-gray-600 text-xs transition-colors duration-300">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/70 light:text-gray-600 group-hover:text-white light:group-hover:text-gray-900 transition-colors duration-300" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 backdrop-blur-xl bg-white/10 border border-white/20 light:bg-white/95 light:border-gray-200 rounded-2xl shadow-2xl py-2 z-50 transition-all duration-300">
                <div className="px-4 py-3 border-b border-white/10 light:border-gray-200">
                  <p className="text-white light:text-gray-900 font-medium transition-colors duration-300">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-white/70 light:text-gray-600 text-sm transition-colors duration-300">
                    {user?.email || 'admin@ktlisp.com'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-white light:text-gray-700 hover:bg-white/20 light:hover:bg-gray-100 transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-white light:text-gray-700 hover:bg-white/20 light:hover:bg-gray-100 transition-all duration-300">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-white light:text-gray-700 hover:bg-white/20 light:hover:bg-gray-100 transition-all duration-300">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-white light:text-gray-700 hover:bg-white/20 light:hover:bg-gray-100 transition-all duration-300">
                    <Key className="w-4 h-4" />
                    <span>API Keys</span>
                  </button>
                </div>
                
                <div className="border-t border-white/10 light:border-gray-200 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-400/20 transition-colors duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;