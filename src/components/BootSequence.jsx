import { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const BOOT_LINES = [
  { text: 'CORPORATE ARCHIVES v1.0', delay: 0,    style: 'title' },
  { text: '(C) 1984 ARCHIVE SYSTEMS INC.', delay: 600,  style: 'dim' },
  { text: '', delay: 900, style: 'blank' },
  { text: 'CPU CHECK ........................ OK', delay: 1100, style: 'check' },
  { text: 'MEMORY CHECK ..................... OK', delay: 1400, style: 'check' },
  { text: 'DISK ARRAY [A:] .................. OK', delay: 1700, style: 'check' },
  { text: '', delay: 2000, style: 'blank' },
  { text: 'LOADING HISTORICAL DATABASE ...', delay: 2200, style: 'load' },
  { text: 'LOADING EXECUTIVE RECORDS .....',  delay: 2700, style: 'load' },
  { text: 'LOADING CASE FILES .............',  delay: 3200, style: 'load' },
  { text: 'DECRYPTING ARCHIVES ............',  delay: 3700, style: 'load' },
  { text: '', delay: 4100, style: 'blank' },
  { text: 'VERIFYING CLEARANCE ...........',  delay: 4300, style: 'load' },
  { text: '', delay: 4900, style: 'blank' },
  { text: '██████████████████████ 100%',       delay: 5100, style: 'bar' },
  { text: '', delay: 5400, style: 'blank' },
  { text: 'ACCESS GRANTED',                   delay: 5600, style: 'access' },
  { text: 'WELCOME, ANALYST.',                delay: 6100, style: 'welcome' },
  { text: '', delay: 6400, style: 'blank' },
  { text: 'PRESS ANY KEY TO CONTINUE',        delay: 6600, style: 'prompt' },
];

export function BootSequence({ onComplete, soundEnabled }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [ready,        setReady]        = useState(false);
  const [blinkPrompt,  setBlinkPrompt]  = useState(false);
  const timeoutsRef = useRef([]);
  const { playClick } = useSound(soundEnabled);

  useEffect(() => {
    BOOT_LINES.forEach((line, idx) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        if (line.style === 'check' || line.style === 'load') playClick();
      }, line.delay);
      timeoutsRef.current.push(t);
    });

    const readyT = setTimeout(() => {
      setReady(true);
      setBlinkPrompt(true);
    }, 6700);
    timeoutsRef.current.push(readyT);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const handler = () => onComplete();
    window.addEventListener('keydown', handler);
    window.addEventListener('click',   handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click',   handler);
    };
  }, [ready, onComplete]);

  return (
    <div className="screen-content boot-screen">
      {visibleLines.map((line, i) => (
        <BootLine key={i} line={line} blink={blinkPrompt && line.style === 'prompt'} />
      ))}
    </div>
  );
}

function BootLine({ line, blink }) {
  if (line.style === 'blank') return <div className="boot-blank" />;

  const className = {
    title:   'boot-title glow-strong',
    dim:     'boot-dim',
    check:   'boot-check',
    load:    'boot-load',
    bar:     'boot-bar glow',
    access:  'boot-access glow-strong',
    welcome: 'boot-welcome glow',
    prompt:  `boot-prompt${blink ? ' boot-blink' : ''}`,
  }[line.style] || 'boot-line';

  return (
    <div className={`boot-line ${className}`}>
      {line.text}
    </div>
  );
}
