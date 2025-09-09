import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || 'dark';
};

const initialState = {
  theme: getInitialTheme(),
  systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setSystemPreference } = themeSlice.actions;
export default themeSlice.reducer;


