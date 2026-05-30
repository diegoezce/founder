import { useEffect } from 'react';

export function useKeyboard(keyMap, active = true) {
  useEffect(() => {
    if (!active) return;

    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (keyMap[key]) {
        e.preventDefault();
        keyMap[key](e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap, active]);
}
