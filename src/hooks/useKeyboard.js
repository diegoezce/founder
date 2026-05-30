import { useEffect, useRef } from 'react';

export function useKeyboard(keyMap, active = true) {
  const mapRef = useRef(keyMap);
  mapRef.current = keyMap;

  useEffect(() => {
    if (!active) return;

    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (mapRef.current[key]) {
        e.preventDefault();
        mapRef.current[key](e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);
}
