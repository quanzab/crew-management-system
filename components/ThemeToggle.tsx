
import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const ThemeToggle: React.FC = () => {
  const { settings, setTheme } = useSettings();

  // Determine the effective theme for icon display.
  // This logic is safe because SettingsContext forces a re-render on system theme changes.
  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    // A simple toggle between light and dark is the most intuitive behavior.
    // This overrides the 'system' setting.
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      {isDark ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
