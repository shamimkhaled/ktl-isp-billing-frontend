import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';

const ForbiddenPage = ({ title = "Access Denied", message, showHomeButton = true }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-md w-full mx-4">
        <GlassCard className="p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>

          <p className="text-white/70 mb-6">
            {message || "You don't have permission to access this resource."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>

            {showHomeButton && (
              <Link to="/dashboard">
                <Button
                  variant="primary"
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Home className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">
              If you believe this is an error, please contact your system administrator.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ForbiddenPage;
