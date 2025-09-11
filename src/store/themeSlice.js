// src/store/themeSlice.js - Production optimized without debug logs
import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }
  
  // Fall back to system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Default to dark
  return 'dark';
};

const getSystemPreference = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const initialState = {
  theme: getInitialTheme(),
  systemPreference: getSystemPreference(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Theme toggled to:', newTheme);
      }
    },
    setTheme: (state, action) => {
      const newTheme = action.payload;
      if (newTheme === 'light' || newTheme === 'dark') {
        state.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Theme set to:', newTheme);
        }
      }
    },
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setSystemPreference } = themeSlice.actions;
export default themeSlice.reducer;