# Authentication Services

This document explains how to use the authentication services integrated into the KTL ISP Billing Frontend.

## Overview

The authentication system supports:
- User login with JWT tokens
- Automatic token refresh
- Secure logout
- Dynamic user information display

## API Endpoints

### 1. Login
**Endpoint:** `POST /auth/login/`

**Request Body:**
```json
{
    "login_id": "admin001",
    "password": "password123",
    "remember_me": false
}
```

**Success Response:**
```json
{
    "success": true,
    "status": 200,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "login_id": "admin001",
            "email": "admin@example.com",
            "name": "Admin User",
            "mobile": "+8801712345678",
            "user_type": "admin",
            "employee_id": "EMP001",
            "is_active": true,
            "is_staff": true,
            "is_superuser": false,
            "roles": [...],
            "permissions": [...]
        },
        "tokens": {
            "access": "eyJ0eXAiOiJKV1Qi...",
            "refresh": "eyJ0eXAiOiJKV1Qi...",
            "token_type": "Bearer"
        },
        "remember_me": false,
        "expires_at": "2024-01-01T11:00:00Z"
    }
}
```

### 2. Token Refresh
**Endpoint:** `POST /auth/refresh/`

**Request Body:**
```json
{
    "refresh_token": "eyJ0eXAiOiJKV1Qi..."
}
```

### 3. Logout
**Endpoint:** `POST /auth/logout/`

**Request Body:**
```json
{
    "refresh_token": "refresh_token",
    "logout_all_devices": false
}
```

## Usage in Components

### Using the useAuth Hook

```jsx
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, refreshToken } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      login_id: 'admin001',
      password: 'password123',
      remember_me: true
    });

    if (result.success) {
      console.log('Login successful');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const handleLogout = async () => {
    await logout(); // Logout from current device
    // or
    await logout(true); // Logout from all devices
  };

  const handleRefresh = async () => {
    const result = await refreshToken();
    if (result.success) {
      console.log('Token refreshed');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name || user?.login_id}!</p>
          <p>User Type: {user?.user_type}</p>
          <p>Employee ID: {user?.employee_id}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Using Authentication Services Directly

```jsx
import { authService } from '../services/auth';

const loginUser = async () => {
  try {
    const response = await authService.login({
      login_id: 'admin001',
      password: 'password123',
      remember_me: true
    });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const refreshUserToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await authService.refreshToken(refreshToken);
    console.log('Token refreshed:', response);
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
};

const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await authService.logout(refreshToken, false);
    console.log('Logout successful:', response);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Redux State Structure

The authentication state in Redux includes:

```javascript
{
  user: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    login_id: "admin001",
    email: "admin@example.com",
    name: "Admin User",
    user_type: "admin",
    employee_id: "EMP001",
    // ... other user fields
  },
  token: "access_token_here",
  refreshToken: "refresh_token_here",
  isAuthenticated: true,
  loading: false,
  error: null,
  expiresAt: "2024-01-01T11:00:00Z",
  rememberMe: false
}
```

## Header Component Features

The Header component now displays:
- User's name (or login_id as fallback)
- User type (capitalized)
- Employee ID (if available)
- Account settings dropdown
- Logout functionality

## Automatic Token Refresh

The system automatically refreshes tokens when they expire through Axios interceptors configured in `src/services/api.js`. When a 401 error occurs, it attempts to refresh the token automatically.

## Error Handling

All authentication operations include proper error handling:
- Network errors
- Invalid credentials
- Token expiration
- Server errors

Error messages are displayed to users through toast notifications and form validation.
