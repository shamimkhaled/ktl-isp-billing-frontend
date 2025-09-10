import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import themeSlice from './themeSlice';
import dashboardSlice from './dasboardSlice';
import usersSlice from './usersSlice';
import rolesSlice from './rolesSlice';
import permissionsSlice from './permissionsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    dashboard: dashboardSlice,
    users: usersSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;