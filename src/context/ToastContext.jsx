import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  Bell
} from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function show(msg, type = 'info') {
    const id = Date.now() + Math.random();
    const toast = { id, msg, type };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  const getToastConfig = (type) => {
    const configs = {
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        iconColor: 'text-green-500',
        progress: 'bg-green-500'
      },
      error: {
        icon: <XCircle className="w-5 h-5" />,
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        iconColor: 'text-red-500',
        progress: 'bg-red-500'
      },
      warning: {
        icon: <AlertCircle className="w-5 h-5" />,
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        iconColor: 'text-yellow-500',
        progress: 'bg-yellow-500'
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        iconColor: 'text-blue-500',
        progress: 'bg-blue-500'
      }
    };
    return configs[type] || configs.info;
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast, index) => {
            const config = getToastConfig(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ 
                  opacity: 0, 
                  x: 300,
                  scale: 0.8 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  x: 300,
                  scale: 0.8 
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className={`relative ${config.bg} border rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-95`}
              >
                {/* Progress Bar */}
                <motion.div
                  className={`h-1 ${config.progress}`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: "linear" }}
                />
                
                {/* Toast Content */}
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${config.iconColor}`}>
                      {config.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${config.text}`}>
                        {toast.msg}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}