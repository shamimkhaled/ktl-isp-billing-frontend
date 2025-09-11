import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  // Verify token on mount with improved deduplication
  useEffect(() => {
    let isMounted = true;
    let verificationInProgress = false;

    const verifyToken = async () => {
      if (verificationInProgress) {
        console.log('Verification already in progress, skipping...');
        return;
      }

      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token || !refreshToken) {
        if (isMounted) {
          setAuthChecked(true);
        }
        return;
      }

      verificationInProgress = true;

      try {
        console.log('Starting token verification...');
        // Verify token with backend
        const response = await api.post('/auth/verify/', {});
        const { user, expires_at } = response.data.data;

        console.log('Token verification successful, updating state...');
        console.log('User data from API:', user);
        console.log('User type:', user?.user_type);

        // Update Redux state with verified user data
        dispatch(loginSuccess({
          user,
          access: token,
          refresh: refreshToken,
          expires_at
        }));

        console.log('Redux state updated with user data');
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          console.log('Token verification was canceled (duplicate request)');
          return;
        }

        console.error('Token verification failed:', error);
        // Token is invalid, clear local storage and Redux state
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('rememberMe');
        dispatch(loginFailure('Session expired'));
      } finally {
        verificationInProgress = false;
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    };

    // Use a longer delay to ensure all components are mounted
    const timeoutId = setTimeout(verifyToken, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [dispatch]);



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

    // Reset auth checked state for next login
    setAuthChecked(false);

    console.log('Redirecting to login...');
    // Force redirect to login
    window.location.replace('/login');
  };

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    loading: loading || false,
    authChecked,
    login,
    logout,
    refreshToken,
  };
};
