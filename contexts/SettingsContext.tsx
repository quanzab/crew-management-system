

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface NotificationSettings {
  compliance: boolean;
  billing: boolean;
  appraisals: boolean;
  hr: boolean;
}

interface Settings {
  theme: Theme;
  notifications: NotificationSettings;
}

interface SettingsContextType {
  settings: Settings;
  setTheme: (theme: Theme) => void;
  setNotificationSetting: <K extends keyof NotificationSettings>(key: K, value: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  theme: 'dark',
  notifications: {
    compliance: true,
    billing: true,
    appraisals: true,
    hr: true,
  },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        // Merge saved settings with defaults to prevent errors if new settings are added
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error("Could not parse settings from localStorage", error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    // Handle theme application
    const root = window.document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
    
    // Save settings to localStorage
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save settings to localStorage", error);
    }
  }, [settings]);

  // Add listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        // Trigger a re-render if the theme is 'system'
        if (settings.theme === 'system') {
            setSettings(s => ({...s}));
        }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);


  const setTheme = useCallback((theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const setNotificationSetting = useCallback(<K extends keyof NotificationSettings>(key: K, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  }, []);

  const value = useMemo(() => ({ settings, setTheme, setNotificationSetting }), [settings, setTheme, setNotificationSetting]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};