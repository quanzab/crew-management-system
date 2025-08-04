

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { Notification } from '../types';
import Card from './Card';
import { ShieldIcon } from './icons/ShieldIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { BellIcon } from './icons/BellIcon';
import { UsersIcon } from './icons/UsersIcon';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const getIcon = (type: Notification['type']) => {
    switch(type) {
      case 'compliance': return <ShieldIcon className="h-6 w-6 text-yellow-400" />;
      case 'billing': return <CreditCardIcon className="h-6 w-6 text-red-400" />;
      case 'appraisal': return <ClipboardIcon className="h-6 w-6 text-blue-400" />;
      case 'hr': return <UsersIcon className="h-6 w-6 text-green-400" />;
      default: return <BellIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
      markAsRead(notification.id);
      switch(notification.type) {
          case 'compliance':
              navigate('/compliance');
              break;
          case 'billing':
              navigate('/billing');
              break;
          case 'appraisal':
              navigate('/appraisals');
              break;
          case 'hr':
              navigate('/crew');
              break;
      }
      onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-card rounded-lg shadow-2xl border border-muted z-50"
    >
      <div className="p-4 border-b border-muted flex justify-between items-center">
        <h3 className="font-semibold text-card-foreground">Notifications</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm text-primary-500 hover:underline">
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center p-8">
            <BellIcon className="h-12 w-12 mx-auto text-gray-500" />
            <p className="mt-2 text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-muted">
            {notifications.map(notification => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-3 p-4 transition-colors duration-150 cursor-pointer ${
                  notification.isRead ? 'opacity-60' : 'bg-primary-950/30'
                } hover:bg-muted`}
              >
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-grow">
                  <p className="text-sm text-card-foreground">{notification.message}</p>
                   <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                   <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-2 border-t border-muted text-center">
         <button className="text-sm w-full font-medium text-primary-500 hover:bg-muted py-2 rounded-md transition-colors">
            View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;