import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, setSystemPreference } from '../store/themeSlice';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme, systemPreference } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setThemeMode = (newTheme) => {
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