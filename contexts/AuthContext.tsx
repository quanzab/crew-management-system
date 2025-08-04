


import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { User, ChangelogEntry } from '../types';
import { parseChangelog } from '../services/changelogService';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_DURATION = 30 * 1000; // 30 seconds

// Mock user database
const MOCK_USERS: User[] = [
    { id: 'admin01', username: 'admin', password: 'password', name: 'Admin User', role: 'admin', avatarUrl: 'https://picsum.photos/id/1/100/100' },
    { id: 'manager01', username: 'manager', password: 'password', name: 'Fleet Manager', role: 'manager', avatarUrl: 'https://picsum.photos/id/2/100/100' },
    { id: 'officer01', username: 'officer', password: 'password', name: 'Crewing Officer', role: 'crewing_officer', avatarUrl: 'https://picsum.photos/id/3/100/100' },
    { id: 'C001', username: 'johndoe', password: 'password', name: 'John Doe', role: 'crew', avatarUrl: 'https://picsum.photos/id/1005/100/100' }
];

interface AuthContextType {
  authenticatedUser: User | null;
  currentCrewId: string | null; // For eCrew portal impersonation
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginAs: (crewId: string) => void;
  logout: () => void;
  isWarningVisible: boolean;
  countdown: number;
  extendSession: () => void;
  isSessionExpired: boolean;
  isWhatsNewVisible: boolean;
  whatsNewContent: ChangelogEntry | null;
  dismissWhatsNew: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('authenticatedUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [currentCrewId, setCurrentCrewId] = useState<string | null>(() => {
    return localStorage.getItem('currentCrewId');
  });

  const [isWarningVisible, setWarningVisible] = useState(false);
  const [isSessionExpired, setSessionExpired] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION / 1000);

  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false);
  const [whatsNewContent, setWhatsNewContent] = useState<ChangelogEntry | null>(null);

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuthenticated = !!authenticatedUser;

  const dismissWhatsNew = useCallback(() => {
    setIsWhatsNewVisible(false);
    if (whatsNewContent) {
      localStorage.setItem('lastSeenVersion', whatsNewContent.version);
    }
    setWhatsNewContent(null);
  }, [whatsNewContent]);

  const logout = useCallback(() => {
    setAuthenticatedUser(null);
    setCurrentCrewId(null);
    setWarningVisible(false);
    setSessionExpired(true);
    dismissWhatsNew(); // Ensure modal is dismissed on logout
    localStorage.removeItem('authenticatedUser');
    localStorage.removeItem('currentCrewId');
    if (inactivityTimer.current !== null) clearTimeout(inactivityTimer.current);
    if (warningTimer.current !== null) clearTimeout(warningTimer.current);
    if (countdownInterval.current !== null) clearInterval(countdownInterval.current);
  }, [dismissWhatsNew]);

  const showWarning = useCallback(() => {
    setCountdown(WARNING_DURATION / 1000);
    setWarningVisible(true);
    
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    warningTimer.current = setTimeout(logout, WARNING_DURATION);
  }, [logout]);

  const resetTimeout = useCallback(() => {
    if (inactivityTimer.current !== null) clearTimeout(inactivityTimer.current);
    if (warningTimer.current !== null) clearTimeout(warningTimer.current);
    if (countdownInterval.current !== null) clearInterval(countdownInterval.current);
    if (isAuthenticated && !isSessionExpired) {
      inactivityTimer.current = setTimeout(showWarning, INACTIVITY_TIMEOUT);
    }
  }, [showWarning, isAuthenticated, isSessionExpired]);

  const extendSession = useCallback(() => {
    setWarningVisible(false);
    resetTimeout();
  }, [resetTimeout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleActivity = () => resetTimeout();

    if (isAuthenticated) {
        events.forEach(event => window.addEventListener(event, handleActivity));
        resetTimeout();
    }

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimer.current !== null) clearTimeout(inactivityTimer.current);
      if (warningTimer.current !== null) clearTimeout(warningTimer.current);
      if (countdownInterval.current !== null) clearInterval(countdownInterval.current);
    };
  }, [resetTimeout, isAuthenticated]);

  const login = async (username: string, password: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const user = MOCK_USERS.find(u => u.username === username && u.password === password);
            if (user) {
                const { password, ...userToStore } = user;
                setAuthenticatedUser(userToStore);
                localStorage.setItem('authenticatedUser', JSON.stringify(userToStore));
                setCurrentCrewId(user.role === 'crew' ? user.id : null);
                if (user.role === 'crew') {
                    localStorage.setItem('currentCrewId', user.id);
                } else {
                    localStorage.removeItem('currentCrewId');
                }
                setSessionExpired(false);
                
                // --- What's New Logic ---
                const changelogEntries = parseChangelog();
                if (changelogEntries.length > 0) {
                    const latestEntry = changelogEntries[0];
                    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
                    if (latestEntry.version !== lastSeenVersion) {
                        setWhatsNewContent(latestEntry);
                        setIsWhatsNewVisible(true);
                    }
                }
                // --- End What's New Logic ---

                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
  };

  const loginAs = useCallback((crewId: string) => {
    // This function is for an admin impersonating a crew member.
    // We can create a temporary user object for the session.
    const tempCrewUser: User = {
        id: crewId,
        username: `crew_${crewId}`,
        name: 'Crew Member',
        role: 'crew',
        avatarUrl: 'https://picsum.photos/id/1027/100/100'
    };
    setAuthenticatedUser(tempCrewUser);
    localStorage.setItem('authenticatedUser', JSON.stringify(tempCrewUser));

    setCurrentCrewId(crewId);
    localStorage.setItem('currentCrewId', crewId);
  }, []);

  const value = useMemo(() => ({
    authenticatedUser,
    currentCrewId,
    isAuthenticated,
    login,
    loginAs,
    logout,
    isWarningVisible,
    countdown,
    extendSession,
    isSessionExpired,
    isWhatsNewVisible,
    whatsNewContent,
    dismissWhatsNew,
  }), [authenticatedUser, currentCrewId, isAuthenticated, logout, isWarningVisible, countdown, extendSession, isSessionExpired, loginAs, login, isWhatsNewVisible, whatsNewContent, dismissWhatsNew]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};