
import React from 'react';
import { useToast } from '../hooks/useToast';
import ToastComponent from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-[100] flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end"
    >
      <div className="w-full flex flex-col items-center space-y-2 sm:items-end">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;