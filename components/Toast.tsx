
import React, { useState, useEffect } from 'react';
import { Toast as ToastType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertCircleIcon } from './icons/AlertCircleIcon';
import { InfoIcon } from './icons/InfoIcon';
import { XIcon } from './icons/XIcon';

interface ToastProps {
  toast: ToastType;
  onDismiss: () => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
  error: <AlertCircleIcon className="h-6 w-6 text-red-400" />,
  warning: <AlertCircleIcon className="h-6 w-6 text-yellow-400" />,
  info: <InfoIcon className="h-6 w-6 text-blue-400" />,
};

const ToastComponent: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Allow time for unmount animation before removing from DOM
    setTimeout(onDismiss, 300);
  };

  const icon = icons[toast.type];

  return (
    <div
      role="alert"
      className={`max-w-sm w-full bg-card shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-card-foreground">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleDismiss}
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastComponent;