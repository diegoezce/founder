import { useState } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useKeyboard } from '../hooks/useKeyboard';
import { useAutoScroll } from '../hooks/useAutoScroll';

export function ResultScreen({ decision, choice, onNext, isLast, soundEnabled }) {
  const [ready, setReady] = useState(false);

  const outcome    = decision.outcomes[choice];
  const wasCorrect = choice === decision.historicalChoice;
  const chosenOpt  = decision.options.find(o => o.key === choice);
  const histOpt    = decision.options.find(o => o.key === decision.historicalChoice);

  const outcomeLines = [
    '─'.repeat(44),
    '',
    wasCorrect
      ? '✓ YOU MATCHED THE HISTORICAL DECISION'
      : `✗ HISTORICAL DECISION: ${histOpt?.label}`,
    '',
    `OUTCOME — ${outcome.headline}`,
    '',
    ...outcome.narrative.split('\n'),
  ];

  const { displayed, isDone } = useTypingEffect(outcomeLines, {
    speed: 16,
    lineDelay: 80,
    onComplete: () => setReady(true),
  });
  const scrollRef = useAutoScroll(displayed);

  const delta = outcome.statsDelta;

  useKeyboard({
    ENTER: () => ready && onNext(),
    ' ':   () => ready && onNext(),
    N:     () => ready && onNext(),
  }, true);

  return (
    <div className="screen-content">

      {/* ── Decision context — static, already read ── */}
      <div className="result-context dim">
        <div className="result-ctx-meta">
          YEAR: {decision.year} &nbsp;│&nbsp; {decision.location}
        </div>
        <div className="result-ctx-divider">{'─'.repeat(44)}</div>
        {decision.situation.split('\n').map((l, i) => (
          <div key={i} className="result-ctx-line">{l || ' '}</div>
        ))}
        <div className="result-ctx-divider">{'─'.repeat(44)}</div>
        <div className="result-ctx-choice">
          {'>'} {chosenOpt?.label}
        </div>
      </div>

      {/* ── Outcome — types in below ── */}
      <div className="result-outcome-body" ref={scrollRef}>
        {displayed.map((line, i) => {
          if (line == null) return null;
          const isOutcome  = line.startsWith('OUTCOME —');
          const isMatch    = line.startsWith('✓') || line.startsWith('✗');
          const isDivider  = line === '─'.repeat(44);
          const className  = isOutcome ? 'result-outcome-head glow'
                           : isMatch   ? wasCorrect ? 'result-match glow' : 'result-nomatch'
                           : isDivider ? 'result-divider dim'
                           : 'result-text';
          return (
            <div key={i} className={`result-line ${className}`}>
              {line || ' '}
            </div>
          );
        })}
      </div>

      {/* ── Attribute delta ── */}
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

      {/* ── Continue ── */}
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
