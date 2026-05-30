import { useState, useRef, useEffect } from 'react';
import { parseCommand, HELP_TEXT } from '../engine/commandParser';
import { useSound } from '../hooks/useSound';

export function CommandLine({ visible, onCommand, history, soundEnabled }) {
  const [input,   setInput]   = useState('');
  const [cmdHist, setCmdHist] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const { playClick } = useSound(soundEnabled);

  useEffect(() => {
    if (visible && inputRef.current) inputRef.current.focus();
  }, [visible]);

  if (!visible) return null;

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      const cmd = parseCommand(input);
      playClick();
      if (cmd) {
        setCmdHist(prev => [input, ...prev.slice(0, 19)]);
        setHistIdx(-1);
        onCommand(cmd, input);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHist.length - 1);
      setHistIdx(next);
      setInput(cmdHist[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(next); setInput(cmdHist[next] || ''); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic autocomplete
      const cmds = ['open microsoft', 'help', 'stats', 'continue', 'menu', 'sound', 'inspect'];
      const match = cmds.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <div className="cmdline-wrapper">
      <div className="cmdline-history">
        {history.slice(-4).map((entry, i) => (
          <div key={i} className={`cmdline-entry ${entry.type === 'error' ? 'cmdline-error' : entry.type === 'system' ? 'cmdline-system' : ''}`}>
            {entry.type === 'input' && <span className="cmdline-prompt">{'> '}</span>}
            {entry.text}
          </div>
        ))}
      </div>
      <div className="cmdline-input-row">
        <span className="cmdline-prompt">{'> '}</span>
        <input
          ref={inputRef}
          className="cmdline-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          autoComplete="off"
          maxLength={64}
        />
      </div>
    </div>
  );
}
