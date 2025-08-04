
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * @deprecated This hook is deprecated and will be removed in a future version.
 * Please use `useSettings` from `hooks/useSettings` instead for managing themes.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};