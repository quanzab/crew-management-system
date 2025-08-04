import { useEffect, useCallback } from 'react';

type HotkeysMap = Record<string, (event: KeyboardEvent) => void>;

/**
 * A custom hook for handling global keyboard shortcuts.
 * @param hotkeys - A map of key combinations (e.g., 'mod+k', 'shift+alt+s') to callback functions.
 */
export const useHotkeys = (hotkeys: HotkeysMap) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const key = event.key.toLowerCase();

    for (const combination in hotkeys) {
      const parts = combination.toLowerCase().split('+');
      const targetKey = parts.pop();

      if (!targetKey || key !== targetKey) {
        continue;
      }

      const modRequired = parts.includes('mod');
      const shiftRequired = parts.includes('shift');
      const altRequired = parts.includes('alt');

      const modPressed = isMac ? event.metaKey : event.ctrlKey;

      if (
        modRequired === modPressed &&
        shiftRequired === event.shiftKey &&
        altRequired === event.altKey
      ) {
        event.preventDefault();
        hotkeys[combination](event);
        return; // A match was found and handled, no need to check others.
      }
    }
  }, [hotkeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
