import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/login/', credentials);
      dispatch(loginSuccess(response.data.data));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout/');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch(logout());
      window.location.href = '/login';
    }
  };

  return {
    user,
    isAuthenticated: isAuthenticated || false,
    loading: loading || false,
    login,
    logout,
  };
};
