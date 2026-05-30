import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(lines, { speed = 28, lineDelay = 120, onComplete } = {}) {
  const [displayed, setDisplayed]   = useState([]);
  const [isDone,    setIsDone]      = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setDisplayed([]);
    setIsDone(false);

    if (!lines || lines.length === 0) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    let cumulativeDelay = 0;

    lines.forEach((line, lineIdx) => {
      const chars = String(line).split('');

      // Pause before each line
      cumulativeDelay += lineIdx === 0 ? 0 : lineDelay;

      // Empty lines: set immediately at their scheduled delay
      if (chars.length === 0) {
        const t = setTimeout(() => {
          setDisplayed(prev => {
            const next = [...prev];
            next[lineIdx] = '';
            return next;
          });
        }, cumulativeDelay);
        timeoutsRef.current.push(t);
      }

      // Reveal characters one by one
      chars.forEach((_, charIdx) => {
        const delay = cumulativeDelay + charIdx * speed;
        const t = setTimeout(() => {
          setDisplayed(prev => {
            const next = [...prev];
            next[lineIdx] = String(line).slice(0, charIdx + 1);
            return next;
          });
        }, delay);
        timeoutsRef.current.push(t);
      });

      cumulativeDelay += chars.length * speed;
    });

    // Mark complete
    const totalDelay = cumulativeDelay + 200;
    const t = setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, totalDelay);
    timeoutsRef.current.push(t);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [JSON.stringify(lines)]);

  return { displayed, isDone };
}

export function useInstantText(lines) {
  return { displayed: lines, isDone: true };
}
