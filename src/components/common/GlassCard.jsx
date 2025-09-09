import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const GlassCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  gradient = 'from-blue-400 to-cyan-400', 
  children,
  className = '',
  onClick,
  loading = false,
  animate = true
}) => {
  const CardWrapper = animate ? motion.div : 'div';
  const animationProps = animate ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardWrapper 
      className={`group relative cursor-pointer ${className}`}
      onClick={onClick}
      {...animationProps}
    >
      {/* Background glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
      
      <div className="relative backdrop-blur-xl bg-white/10 light:bg-white/80 border border-white/20 light:border-gray-200/50 rounded-3xl p-6 hover:bg-white/15 light:hover:bg-white/90 transition-all duration-300 shadow-2xl">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-white/20 light:bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="w-16 h-16 bg-white/20 light:bg-gray-300 rounded-2xl"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white/70 light:text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">
                {title}
              </p>
              <p className="text-3xl font-bold text-white light:text-gray-900 mb-2">
                {value}
              </p>
              
              {change !== undefined && (
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    change > 0 
                      ? 'bg-green-500/20 light:bg-green-100 text-green-300 light:text-green-700' 
                      : change < 0
                      ? 'bg-red-500/20 light:bg-red-100 text-red-300 light:text-red-700'
                      : 'bg-gray-500/20 light:bg-gray-100 text-gray-300 light:text-gray-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(change)}%</span>
                  </div>
                  <span className="text-white/50 light:text-gray-500 text-xs">vs yesterday</span>
                </div>
              )}
              
              {children}
            </div>
            
            {Icon && (
              <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

// Specialized variants
export const MetricCard = ({ metric, ...props }) => (
  <GlassCard
    title={metric.label}
    value={metric.value}
    change={metric.change}
    icon={metric.icon}
    gradient={metric.gradient}
    {...props}
  />
);

export const StatusCard = ({ status, children, ...props }) => {
  const getStatusGradient = (status) => {
    switch (status) {
      case 'active':
      case 'online':
      case 'healthy':
        return 'from-green-400 to-emerald-400';
      case 'warning':
      case 'moderate':
        return 'from-yellow-400 to-orange-400';
      case 'error':
      case 'offline':
      case 'critical':
        return 'from-red-400 to-pink-400';
      case 'maintenance':
        return 'from-blue-400 to-cyan-400';
      default:
        return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <GlassCard
      gradient={getStatusGradient(status)}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

export const ChartCard = ({ title, children, actions, ...props }) => (
  <div className="group relative">
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${props.gradient || 'from-purple-400 to-pink-400'} rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
    
    <div className="relative backdrop-blur-xl bg-white/10 light:bg-white/80 border border-white/20 light:border-gray-200/50 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white light:text-gray-900 flex items-center space-x-3">
          {props.icon && (
            <div className={`p-2 bg-gradient-to-r ${props.gradient || 'from-purple-400 to-pink-400'} rounded-xl`}>
              <props.icon className="w-6 h-6 text-white" />
            </div>
          )}
          <span>{title}</span>
        </h3>
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      <div className="relative">
        {children}
      </div>
    </div>
  </div>
);

export default GlassCard;



