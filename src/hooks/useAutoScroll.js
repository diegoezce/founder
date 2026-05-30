import { useEffect, useRef } from 'react';

export function useAutoScroll(dependency) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current?.closest('.screen-content');
    if (el) el.scrollTop = el.scrollHeight;
  }, [dependency]);

  return ref;
}
