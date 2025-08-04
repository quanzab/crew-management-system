import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';

const SessionExpiredOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col justify-center items-center text-center p-4">
      <ShieldIcon className="w-24 h-24 text-primary-500" />
      <h2 className="text-4xl font-bold text-foreground mt-6">Session Expired</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        For security reasons, your session has ended.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-semibold"
      >
        Reload to Log In
      </button>
    </div>
  );
};

export default SessionExpiredOverlay;
