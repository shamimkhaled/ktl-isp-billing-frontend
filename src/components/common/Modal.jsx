import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeClasses[size]} mx-4`}
          >
            {/* Background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-30"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 light:bg-white/95 border border-white/20 light:border-gray-200 rounded-3xl shadow-2xl">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex justify-between items-center p-6 border-b border-white/10 light:border-gray-200">
                  {title && (
                    <h3 className="text-xl font-bold text-white light:text-gray-900">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button 
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 light:hover:bg-gray-100 rounded-full transition-colors text-white/70 light:text-gray-500 hover:text-white light:hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

