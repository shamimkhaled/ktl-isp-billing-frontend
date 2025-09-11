// src/hooks/useTheme.js - Production ready without debug logs
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, setSystemPreference } from '../store/themeSlice';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme, systemPreference } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme to document root and body
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    body.classList.add(theme);
    
    // Also set data attribute for more specific targeting
    root.setAttribute('data-theme', theme);
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Theme applied:', theme);
    }
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
    };

    // Set initial system preference
    dispatch(setSystemPreference(mediaQuery.matches ? 'dark' : 'light'));

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Toggling theme from', theme, 'to', newTheme);
    }
    dispatch(toggleTheme());
  };

  const setThemeMode = (newTheme) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting theme to:', newTheme);
    }
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    systemPreference,
    toggle,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};