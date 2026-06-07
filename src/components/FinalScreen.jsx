import { useState, useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';
import {
  STAT_LABELS,
  getTotalScore,
  getProfile,
  dotLeader,
  formatBar,
} from '../engine/statsEngine';

export function FinalScreen({ caseData, stats, choices, onMenu, soundEnabled, user, syncStatus, onSignIn }) {
  const [phase,   setPhase]   = useState(0);
  const [counter, setCounter] = useState(0);
  const { playClick, playBeep } = useSound(soundEnabled);

  const profile    = getProfile(caseData, stats);
  const totalScore = getTotalScore(stats);
  const correct    = choices.filter(c => {
    const dec = caseData.decisions.find(d => d.id === c.decisionId);
    return dec && c.choiceKey === dec.historicalChoice;
  }).length;

  // Animate counter up to total score
  useEffect(() => {
    if (phase < 2) return;
    let start = 0;
    const step = setInterval(() => {
      start += 2;
      if (start >= totalScore) {
        setCounter(totalScore);
        clearInterval(step);
        setTimeout(() => setPhase(3), 400);
      } else {
        setCounter(start);
        playClick();
      }
    }, 40);
    return () => clearInterval(step);
  }, [phase]);

  // Sequence phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useKeyboard({
    ENTER: () => onMenu(),
    ' ':   () => onMenu(),
    M:     () => onMenu(),
  }, phase >= 3);

  return (
    <div className="screen-content fade-in">
      {/* Header */}
      {phase >= 1 && (
        <div className="final-header fade-in">
          <div className="final-border glow">{'═'.repeat(44)}</div>
          <div className="final-title glow-strong">CASE COMPLETED</div>
          <div className="final-casename">{caseData.name}</div>
          <div className="final-border glow">{'═'.repeat(44)}</div>
        </div>
      )}

      {/* Stats */}
      {phase >= 2 && (
        <div className="final-stats fade-in">
          <div className="final-section-label">ANALYST PROFILE</div>
          {Object.entries(STAT_LABELS).map(([key, label]) => (
            <div key={key} className="final-stat-row">
              <span className="final-stat-label">{dotLeader(label, stats[key], 32)}</span>
              <span className="final-stat-bar"> {formatBar(stats[key], 12)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Score counter */}
      {phase >= 2 && (
        <div className="final-score-row fade-in">
          <div className="final-divider dim">{'─'.repeat(44)}</div>
          <div className="final-score glow-strong">
            COMPOSITE SCORE ........... {String(counter).padStart(3)}
          </div>
          <div className="final-accuracy dim">
            HISTORICAL ACCURACY: {correct}/{choices.length} DECISIONS
          </div>
        </div>
      )}

      {/* Profile */}
      {phase >= 3 && (
        <div className="final-profile fade-in">
          <div className="final-divider dim">{'─'.repeat(44)}</div>
          <div className="final-profile-label">EXECUTIVE PROFILE</div>
          <div className="final-profile-title glow-strong">{profile.title}</div>
          <div className="final-profile-desc">{profile.description}</div>
          <div className="final-divider dim">{'─'.repeat(44)}</div>
          <div className="final-similarity">
            SIMILARITY TO {caseData.founders[0]}
            <span className="final-similarity-val glow"> {profile.gatesSimilarity ?? profile.sinegalSimilarity ?? profile.similarity ?? '—'}%</span>
          </div>
        </div>
      )}

      {/* Historical note */}
      {phase >= 3 && (
        <div className="final-note fade-in">
          <div className="final-divider dim">{'─'.repeat(44)}</div>
          <div className="final-note-label dim">HISTORICAL RECORD</div>
          <div className="final-note-text dim">{caseData.historicalNote}</div>
        </div>
      )}

      {/* Sync status */}
      {phase >= 3 && (
        <div className="final-sync fade-in">
          {syncStatus === 'saving' && (
            <div className="final-sync-status dim">SYNCING RECORD<span className="cursor" /></div>
          )}
          {syncStatus === 'synced' && (
            <div className="final-sync-status glow">[ RECORD SYNCED ]</div>
          )}
          {syncStatus === 'error' && (
            <div className="final-sync-status dim">[ SYNC FAILED — RECORD SAVED LOCALLY ]</div>
          )}
          {syncStatus === 'idle' && !user && (
            <div className="final-sync-status dim">
              <span className="final-sync-login" onClick={onSignIn}>
                [ AUTHENTICATE TO SAVE RECORD ]
              </span>
            </div>
          )}
        </div>
      )}

      {/* Continue */}
      {phase >= 3 && (
        <div className="final-continue fade-in" onClick={onMenu}>
          <div className="final-divider dim">{'─'.repeat(44)}</div>
          <div className="final-prompt">
            PRESS ENTER TO RETURN TO ARCHIVES <span className="cursor" />
          </div>
        </div>
      )}
    </div>
  );
}
