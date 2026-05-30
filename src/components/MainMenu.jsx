import { useState, useCallback } from 'react';
import { CASE_MENU } from '../data/cases/index';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';

const TOTAL = CASE_MENU.length;

function Stars({ count, total = 5 }) {
  return (
    <span>
      {'★'.repeat(count)}{'☆'.repeat(total - count)}
    </span>
  );
}

export function MainMenu({ onSelectCase, soundEnabled, onToggleSound, onCycleTheme }) {
  const [selected, setSelected] = useState(0);
  const { playClick, playError, playConfirm } = useSound(soundEnabled);

  const navigate = useCallback((dir) => {
    setSelected(prev => {
      const next = (prev + dir + TOTAL) % TOTAL;
      playClick();
      return next;
    });
  }, [playClick]);

  const confirm = useCallback(() => {
    const item = CASE_MENU[selected];
    if (!item) return;
    if (!item.available) { playError(); return; }
    playConfirm();
    onSelectCase(item.id);
  }, [selected, onSelectCase, playConfirm, playError]);

  useKeyboard({
    ARROWUP:   () => navigate(-1),
    ARROWDOWN: () => navigate(1),
    'K':       () => navigate(-1),
    'J':       () => navigate(1),
    ENTER:     () => confirm(),
    ' ':       () => confirm(),
    'S':       () => onToggleSound(),
    'T':       () => onCycleTheme(),
  });

  const item = CASE_MENU[selected];

  return (
    <div className="screen-content fade-in menu-layout">

      {/* ── Header ─────────────────────────── */}
      <div className="menu-header">
        <div className="menu-access-label dim">
          ACCESS LEVEL: EXECUTIVE &nbsp;│&nbsp; CLASSIFIED HISTORICAL RECORDS
        </div>
        <div className="menu-border">{'═'.repeat(44)}</div>
        <div className="menu-title glow-strong">FOUNDER</div>
        <div className="menu-tagline">WHAT WOULD YOU HAVE DONE?</div>
        <div className="menu-border">{'═'.repeat(44)}</div>
      </div>

      {/* ── Case list ──────────────────────── */}
      <div className="menu-columns">
        <div className="menu-list">
          <div className="menu-section-label">CORPORATE ARCHIVES DATABASE</div>
          <div className="menu-spacer" />

          {CASE_MENU.map((c, idx) => {
            const isSelected = idx === selected;
            const num        = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={c.id}
                className={`menu-item ${isSelected ? 'menu-item-selected' : ''} ${!c.available ? 'menu-item-locked' : ''}`}
                onClick={() => {
                  setSelected(idx);
                  playClick();
                  if (c.available) setTimeout(() => onSelectCase(c.id), 150);
                  else playError();
                }}
                onMouseEnter={() => { setSelected(idx); }}
              >
                <span className="menu-num">[{num}]</span>
                <span className="menu-label">{c.label}</span>
                {!c.available && <span className="menu-locked">RECORD NOT YET RECOVERED</span>}
                {isSelected && c.available && <span className="menu-cursor"> ◄</span>}
              </div>
            );
          })}

          <div className="menu-spacer" />
          <div className="menu-input-row">
            <span className="menu-prompt">SELECT CASE:</span>
            <span className="cursor" />
          </div>
        </div>

        {/* ── Context panel ──────────────────── */}
        <div className="menu-context">
          <div className="menu-context-inner" key={selected}>
            <div className="ctx-label dim">CASE BRIEFING</div>
            <div className="ctx-divider">{'─'.repeat(20)}</div>
            <div className={`ctx-company glow ${!item.available ? 'dim' : ''}`}>{item.label}</div>
            <div className="ctx-row dim">YEAR &nbsp;&nbsp;&nbsp;{item.year}</div>
            <div className="ctx-row dim">LOCATION &nbsp;{item.location}</div>
            <div className="ctx-divider">{'─'.repeat(20)}</div>
            <div className="ctx-teaser">
              {item.teaser.split('\n').map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
            <div className="ctx-divider">{'─'.repeat(20)}</div>
            <div className="ctx-row dim">PLAYTIME &nbsp;{item.playtime}</div>
            <div className="ctx-row dim">
              DIFFICULTY &nbsp;<Stars count={item.difficulty} />
            </div>

            {!item.available && (
              <div className="ctx-unavailable">
                <div className="ctx-divider">{'─'.repeat(20)}</div>
                <div className="ctx-locked-msg">ARCHIVE UNAVAILABLE</div>
              </div>
            )}

            {item.available && (
              <div className="ctx-cta fade-in">
                <div className="ctx-divider">{'─'.repeat(20)}</div>
                <div className="ctx-enter">ENTER TO OPEN FILE</div>
              </div>
            )}
          </div>

          {/* ── Profile area ───────────────── */}
          <div className="menu-profile-area">
            <div className="ctx-divider">{'─'.repeat(20)}</div>
            <div className="ctx-label dim">ANALYST PROFILE</div>
            <div className="ctx-profile-empty dim">NO ACTIVE PROFILE</div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────── */}
      <div className="menu-footer">
        <div className="menu-hint">
          ↑↓ NAVIGATE &nbsp;│&nbsp; ENTER SELECT &nbsp;│&nbsp; S SOUND &nbsp;│&nbsp; T THEME
        </div>
      </div>
    </div>
  );
}
