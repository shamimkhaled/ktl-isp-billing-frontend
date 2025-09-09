import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border border-transparent focus:ring-blue-500 shadow-lg hover:shadow-blue-500/30',
    secondary: 'backdrop-blur-md bg-white/10 light:bg-gray-200 border border-white/20 light:border-gray-300 text-white light:text-gray-700 hover:bg-white/20 light:hover:bg-gray-300 focus:ring-white/50',
    success: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border border-transparent focus:ring-emerald-500 shadow-lg hover:shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border border-transparent focus:ring-red-500 shadow-lg hover:shadow-red-500/30',
    outline: 'border-2 border-current text-white light:text-gray-700 hover:bg-white/10 light:hover:bg-gray-100 focus:ring-current',
    ghost: 'text-white light:text-gray-700 hover:bg-white/10 light:hover:bg-gray-100 focus:ring-current'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-4 py-3 text-base rounded-2xl',
    lg: 'px-6 py-4 text-lg rounded-2xl',
    xl: 'px-8 py-5 text-xl rounded-3xl'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" color="white" className="mr-2" />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="w-5 h-5 mr-2" />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5 ml-2" />
      )}
    </motion.button>
  );
};

export default Button;