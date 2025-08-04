import React from 'react';
import Card from './Card';
import { LogOutIcon } from './icons/LogOutIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  countdown: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, countdown, onExtend, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[90] flex justify-center items-center p-4">
      <Card className="w-full max-w-md text-center">
        <ShieldIcon className="h-16 w-16 mx-auto text-yellow-400" />
        <h2 className="text-2xl font-bold text-card-foreground mt-4">Are you still there?</h2>
        <p className="mt-2 text-muted-foreground">
          For your security, you will be logged out in{' '}
          <span className="font-bold text-card-foreground text-lg">{countdown}</span>{' '}
          seconds due to inactivity.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExtend}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Stay Logged In
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-muted text-card-foreground rounded-md hover:bg-gray-600 transition-colors"
          >
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SessionTimeoutModal;
