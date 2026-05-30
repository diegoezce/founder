import { useState } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';

export function ResultScreen({ decision, choice, onNext, isLast, soundEnabled }) {
  const [ready, setReady] = useState(false);
  const { playBeep } = useSound(soundEnabled);

  const outcome      = decision.outcomes[choice];
  const historical   = decision.outcomes[decision.historicalChoice];
  const wasCorrect   = choice === decision.historicalChoice;

  const resultLines = [
    'YOUR DECISION:',
    `  ${decision.options.find(o => o.key === choice)?.label}`,
    '',
    '─'.repeat(44),
    '',
    'HISTORICAL DECISION:',
    `  ${decision.options.find(o => o.key === decision.historicalChoice)?.label}`,
    '',
    '─'.repeat(44),
    '',
    `OUTCOME — ${outcome.headline}`,
    '',
    ...outcome.narrative.split('\n'),
  ];

  const { displayed, isDone } = useTypingEffect(resultLines, {
    speed: 16,
    lineDelay: 90,
    onComplete: () => setReady(true),
  });

  const delta = decision.outcomes[choice].statsDelta;

  useKeyboard({
    ENTER: () => ready && onNext(),
    ' ':   () => ready && onNext(),
    N:     () => ready && onNext(),
  }, true);

  return (
    <div className="screen-content fade-in">
      <div className="result-match-badge">
        {wasCorrect
          ? <span className="result-match glow">✓ MATCHES HISTORICAL RECORD</span>
          : <span className="result-nomatch">✗ DIVERGES FROM HISTORY</span>
        }
      </div>
      <div className="result-spacer" />

      <div className="result-body">
        {displayed.map((line, i) => {
          if (line == null) return null;
          const isLabel   = line === 'YOUR DECISION:' || line === 'HISTORICAL DECISION:';
          const isOutcome = line.startsWith('OUTCOME —');
          const isDivider = line === '─'.repeat(44);
          const className = isLabel   ? 'result-label'
                          : isOutcome ? 'result-outcome-head glow'
                          : isDivider ? 'result-divider dim'
                          : 'result-text';
          return (
            <div key={i} className={`result-line ${className}`}>
              {line || ' '}
            </div>
          );
        })}
      </div>

      {isDone && (
        <div className="result-stats-delta fade-in">
          <div className="result-divider dim">{'─'.repeat(44)}</div>
          <div className="result-delta-label">ATTRIBUTE CHANGE</div>
          {Object.entries(delta).map(([stat, val]) => (
            <div key={stat} className={`result-delta-row ${val > 0 ? 'delta-pos' : val < 0 ? 'delta-neg' : 'delta-zero'}`}>
              <span className="delta-stat">{stat.toUpperCase().padEnd(12)}</span>
              <span className="delta-val">{val > 0 ? `+${val}` : val}</span>
            </div>
          ))}
        </div>
      )}

      {ready && (
        <div className="result-continue fade-in" onClick={onNext}>
          <div className="result-divider dim">{'─'.repeat(44)}</div>
          <div className="result-prompt">
            {isLast ? 'PRESS ENTER TO VIEW FINAL PROFILE' : 'PRESS ENTER TO CONTINUE'} <span className="cursor" />
          </div>
        </div>
      )}
    </div>
  );
}
