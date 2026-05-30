import { useState, useCallback } from 'react';
import { CASE_MENU } from '../data/cases/index';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';

const AVAILABLE = CASE_MENU.filter(c => c.available);

export function MainMenu({ onSelectCase, soundEnabled, onToggleSound }) {
  const [selected, setSelected] = useState(0);
  const { playClick, playSelect, playConfirm } = useSound(soundEnabled);

  const navigate = useCallback((dir) => {
    setSelected(prev => {
      const next = (prev + dir + AVAILABLE.length) % AVAILABLE.length;
      playClick();
      return next;
    });
  }, [playClick]);

  const confirm = useCallback(() => {
    const caseId = AVAILABLE[selected]?.id;
    if (caseId) {
      playConfirm();
      onSelectCase(caseId);
    }
  }, [selected, onSelectCase, playConfirm]);

  useKeyboard({
    ARROWUP:   () => navigate(-1),
    ARROWDOWN: () => navigate(1),
    'K':       () => navigate(-1),
    'J':       () => navigate(1),
    ENTER:     () => confirm(),
    ' ':       () => confirm(),
    'S':       () => onToggleSound(),
    '1': () => { setSelected(0); playSelect(); },
    '2': () => { AVAILABLE[1] && setSelected(1); },
  });

  return (
    <div className="screen-content fade-in">
      <div className="menu-header">
        <div className="menu-border">{'═'.repeat(44)}</div>
        <div className="menu-title glow-strong">CORPORATE ARCHIVES</div>
        <div className="menu-subtitle">HISTORICAL DECISION DATABASE</div>
        <div className="menu-border">{'═'.repeat(44)}</div>
      </div>

      <div className="menu-body">
        <div className="menu-section-label">AVAILABLE CASE FILES</div>
        <div className="menu-spacer" />

        {CASE_MENU.map((item, idx) => {
          const isAvailable = item.available;
          const isSelected  = isAvailable && AVAILABLE.indexOf(item) === selected;
          const num         = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={item.id}
              className={`menu-item ${isSelected ? 'menu-item-selected' : ''} ${!isAvailable ? 'menu-item-locked' : ''}`}
              onClick={() => {
                if (!isAvailable) return;
                const avIdx = AVAILABLE.indexOf(item);
                setSelected(avIdx);
                playClick();
                setTimeout(() => confirm(), 150);
              }}
            >
              <span className="menu-num">[{num}]</span>
              <span className="menu-label">{item.label}</span>
              {!isAvailable && <span className="menu-locked">LOCKED</span>}
              {isSelected && <span className="menu-cursor"> ◄</span>}
            </div>
          );
        })}

        <div className="menu-spacer" />
        <div className="menu-input-row">
          <span className="menu-prompt">SELECT CASE:</span>
          <span className="cursor" />
        </div>
      </div>

      <div className="menu-footer">
        <div className="menu-hint">↑↓ NAVIGATE  &nbsp;  ENTER SELECT  &nbsp;  S SOUND [{soundEnabled ? 'ON' : 'OFF'}]</div>
      </div>
    </div>
  );
}
