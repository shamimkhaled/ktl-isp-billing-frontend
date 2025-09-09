import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  const handleThemeToggle = () => {
    toggle();
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="relative p-3 backdrop-blur-md bg-white/10 light:bg-gray-200/50 border border-white/20 light:border-gray-300/50 rounded-2xl hover:bg-white/20 light:hover:bg-gray-300/50 transition-all duration-300 shadow-xl group"
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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [onlineUsers] = useState(1247);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 light:bg-white/80 border-b border-white/20 light:border-gray-200/50 px-6 py-4 relative">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 light:from-blue-400/10 light:to-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -top-2 right-20 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 light:from-purple-400/10 light:to-pink-400/10 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 light:from-gray-900 light:via-indigo-800 light:to-purple-800 bg-clip-text text-transparent">
                KTL ISP Panel
              </h1>
              <p className="text-sm text-white/60 light:text-gray-600 font-medium">
                {currentTime.toLocaleTimeString()} • {currentTime.toDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Online Users Counter */}
          <div className="backdrop-blur-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 light:from-green-500/10 light:to-emerald-500/10 border border-green-400/30 light:border-green-400/20 px-4 py-2 rounded-2xl shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-white light:text-green-700 font-semibold text-sm">
                {onlineUsers.toLocaleString()} Online
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 backdrop-blur-md bg-white/10 light:bg-gray-200/50 border border-white/20 light:border-gray-300/50 rounded-2xl hover:bg-white/20 light:hover:bg-gray-300/50 transition-all duration-300 shadow-xl group"
            >
              <Bell className="w-5 h-5 text-white light:text-gray-700 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg shadow-red-400/50 animate-bounce">
                3
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 backdrop-blur-xl bg-white/10 light:bg-white/90 border border-white/20 light:border-gray-200 rounded-2xl shadow-2xl p-4 z-50">
                <h3 className="text-white light:text-gray-900 font-semibold mb-3">Recent Notifications</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl">
                    <p className="text-sm text-white light:text-gray-800">New customer registration in Zone A</p>
                    <p className="text-xs text-white/60 light:text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl">
                    <p className="text-sm text-white light:text-gray-800">SDT-003 temperature alert</p>
                    <p className="text-xs text-white/60 light:text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-3 bg-white/10 light:bg-gray-100 rounded-xl">
                    <p className="text-sm text-white light:text-gray-800">Payment received from customer #1247</p>
                    <p className="text-xs text-white/60 light:text-gray-500 mt-1">10 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 backdrop-blur-md bg-white/10 light:bg-gray-200/50 border border-white/20 light:border-gray-300/50 px-4 py-3 rounded-2xl shadow-xl hover:bg-white/20 light:hover:bg-gray-300/50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-white light:text-gray-900 font-semibold block">
                  {user?.username || 'Administrator'}
                </span>
                <p className="text-xs text-white/60 light:text-gray-600">Super User</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60 light:text-gray-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 backdrop-blur-xl bg-white/10 light:bg-white/90 border border-white/20 light:border-gray-200 rounded-2xl shadow-2xl p-4 z-50">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-white/10 light:hover:bg-gray-100 rounded-xl transition-colors">
                    <Settings className="w-4 h-4 text-white/70 light:text-gray-600" />
                    <span className="text-white light:text-gray-800">Account Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-500/20 light:hover:bg-red-50 rounded-xl transition-colors text-red-300 light:text-red-600"
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

      {/* Click outside handlers */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Header;


