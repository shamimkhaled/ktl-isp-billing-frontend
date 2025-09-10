import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/login/', credentials);
      const { user, tokens, remember_me, expires_at } = response.data.data;

      // Store tokens and user data
      localStorage.setItem('authToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      if (remember_me) {
        localStorage.setItem('rememberMe', 'true');
      }

      dispatch(loginSuccess({
        user,
        access: tokens.access,
        refresh: tokens.refresh,
        expires_at
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh/', {
        refresh_token: refreshToken
      });

      const { tokens, expires_at } = response.data.data;

      // Update tokens
      localStorage.setItem('authToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);

      // Update Redux state with current user data
      dispatch(loginSuccess({
        user: user, // Keep existing user data
        access: tokens.access,
        refresh: tokens.refresh,
        expires_at
      }));

      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      return { success: false, error: 'Session expired' };
    }
  };

  const logout = async (logoutAllDevices = false) => {
    try {
      console.log('Starting logout process...');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Refresh token found:', !!refreshToken);

      if (refreshToken) {
        console.log('Calling logout API...');
        await api.post('/auth/logout/', {
          refresh_token: refreshToken,
          logout_all_devices: logoutAllDevices
        });
        console.log('Logout API call successful');
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    }

    console.log('Clearing local storage and Redux state...');
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');

    // Clear Redux state
    dispatch(logout());

    console.log('Redirecting to login...');
    // Force redirect to login
    window.location.replace('/login');
  };

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    loading: loading || false,
    login,
    logout,
    refreshToken,
  };
};
