// src/App.jsx - Fixed with proper import organization
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Store
import { store } from './store';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ForbiddenPage from './components/common/ForbiddenPage';

// Hooks
import { useAuth } from './hooks/useAuth';
import { usePermissions } from './services/userService';

// Eagerly loaded components (critical path)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Lazy loaded components for code splitting
const Users = lazy(() => import('./pages/Users'));
const CreateUser = lazy(() => import('./pages/CreateUser'));
const EditUser = lazy(() => import('./pages/EditUser'));
const ViewUser = lazy(() => import('./pages/ViewUser'));
const SDTZone = lazy(() => import('./pages/SDTZone'));
const Customers = lazy(() => import('./pages/Customers'));
const Billing = lazy(() => import('./pages/Billing'));
const Network = lazy(() => import('./pages/Network'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

// Enhanced React Query client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      // Use background refetching for better UX
      refetchOnMount: 'always',
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for critical data
    },
    mutations: {
      retry: 1,
    },
  },
});

// Auth wrapper component - all authenticated users have access
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authChecked } = useAuth();

  // Wait for authentication check to complete
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // All authenticated users have access to all routes
  return children;
};

// Route wrapper - all authenticated users have access
const RouteWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" />
          </div>
        }>
          {children}
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
};

// Main layout component with performance optimizations
const Layout = React.memo(({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 light:from-gray-50 light:via-blue-50 light:to-indigo-100 relative overflow-hidden">
      {/* Animated background elements - responsive to theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-400/10 light:bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/10 light:bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/10 dark:bg-pink-400/10 light:bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
      </div>
      
      <Header />
      
      <div className="flex relative z-10">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    // You can log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-white/60 mb-4">We're sorry, but an error occurred. Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme and performance monitoring
  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== 'undefined') {
      window.performanceMetrics = [];
    }

    // Preload critical resources
    const preloadCriticalResources = async () => {
      try {
        // Add any critical resource preloading here
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading resources:', error);
        setIsLoading(false);
      }
    };

    preloadCriticalResources();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes with Role-Based Access */}
                
                {/* Dashboard - Available to all authenticated users */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* SDT Zone - All users have access */}
                <Route path="/sdt-zone/*" element={
                  <RouteWrapper>
                    <SDTZone />
                  </RouteWrapper>
                } />

                {/* User Management - All users have access */}
                <Route path="/users" element={
                  <RouteWrapper>
                    <Users />
                  </RouteWrapper>
                } />

                <Route path="/users/create" element={
                  <RouteWrapper>
                    <CreateUser />
                  </RouteWrapper>
                } />

                <Route path="/users/edit/:id" element={
                  <RouteWrapper>
                    <EditUser />
                  </RouteWrapper>
                } />

                <Route path="/users/view/:id" element={
                  <RouteWrapper>
                    <ViewUser />
                  </RouteWrapper>
                } />

                {/* Customers - All users have access */}
                <Route path="/customers/*" element={
                  <RouteWrapper>
                    <Customers />
                  </RouteWrapper>
                } />

                {/* Billing - All users have access */}
                <Route path="/billing/*" element={
                  <RouteWrapper>
                    <Billing />
                  </RouteWrapper>
                } />

                {/* Network - All users have access */}
                <Route path="/network/*" element={
                  <RouteWrapper>
                    <Network />
                  </RouteWrapper>
                } />

                {/* Reports - All users have access */}
                <Route path="/reports/*" element={
                  <RouteWrapper>
                    <Reports />
                  </RouteWrapper>
                } />

                {/* Settings - All users have access */}
                <Route path="/settings/*" element={
                  <RouteWrapper>
                    <Settings />
                  </RouteWrapper>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>

              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              {/* React Query DevTools (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </div>
          </Router>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;