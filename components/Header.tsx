
import React, { useState, useRef, useEffect, useMemo } from 'react';
import ThemeToggle from './ThemeToggle';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { BellIcon } from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { SearchIcon } from './icons/SearchIcon';
import GlobalSearchResults from './GlobalSearchResults';
import { useHotkeys } from '../hooks/useHotkeys';
import Kbd from './Kbd';


const Header: React.FC = () => {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const { unreadCount } = useNotification();
  const { authenticatedUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setSearchVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const isMac = useMemo(() => typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform), []);

  const hotkeys = useMemo(() => ({
    'mod+k': (e: KeyboardEvent) => {
      e.preventDefault();
      searchInputRef.current?.focus();
    },
  }), []);
  useHotkeys(hotkeys);

  const handleCloseAndClearSearch = () => {
      setSearchVisible(false);
      setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-muted p-4 flex justify-between items-center space-x-4">
      {/* Global Search */}
      <div ref={searchContainerRef} className="relative flex-grow max-w-xl">
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Search crew, vessels, principals..."
                className="w-full pl-10 pr-24 py-2 bg-gray-100 dark:bg-muted border border-transparent rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 text-gray-900 dark:text-card-foreground"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchVisible(true)}
                aria-label="Global search"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center space-x-1 pointer-events-none">
              <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
              <Kbd>K</Kbd>
            </div>
        </div>
        {isSearchVisible && searchTerm.length > 0 && (
            <GlobalSearchResults searchTerm={searchTerm} onClose={handleCloseAndClearSearch} />
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(prev => !prev)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted focus:outline-none"
            aria-label="Toggle notifications"
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-card"></span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationPanel onClose={() => setNotificationsOpen(false)} />
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <img className="h-10 w-10 rounded-full object-cover" src={authenticatedUser?.avatarUrl || "https://picsum.photos/100/100"} alt="User" />
          <div>
              <p className="text-sm font-medium text-gray-900 dark:text-card-foreground">{authenticatedUser?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-muted-foreground capitalize">{authenticatedUser?.role || 'Role'}</p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
