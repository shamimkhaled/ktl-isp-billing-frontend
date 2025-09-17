import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme, setSystemPreference } from '../store/themeSlice';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme, systemPreference } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme to document - properly manage classes
    const htmlElement = document.documentElement;
    
    // Remove any existing theme classes
    htmlElement.classList.remove('dark', 'light');
    
    // Add the current theme class
    htmlElement.classList.add(theme);
    
    // Debug logging
    console.log('Theme changed to:', theme);
    console.log('HTML classes:', htmlElement.className);
    
    // Also update body background dynamically for immediate visual feedback
    const body = document.body;
    if (theme === 'dark') {
      body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
      body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
    }
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
    console.log('Toggling theme from:', theme);
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