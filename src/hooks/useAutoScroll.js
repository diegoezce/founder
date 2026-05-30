import { useEffect, useRef } from 'react';

export function useAutoScroll(dependency) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    requestAnimationFrame(() => {
      sentinelRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    });
  }, [dependency]);

  return sentinelRef;
}
