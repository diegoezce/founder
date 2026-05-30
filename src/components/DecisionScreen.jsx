import { useState, useCallback } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';
import { useAutoScroll } from '../hooks/useAutoScroll';

export function DecisionScreen({ decision, decisionNumber, totalDecisions, onDecide, soundEnabled }) {
  const [hovered,  setHovered]  = useState(null);
  const [chosen,   setChosen]   = useState(null);
  const [textDone, setTextDone] = useState(false);
  const { playClick, playConfirm } = useSound(soundEnabled);

  const situationLines = [
    `YEAR: ${decision.year}`,
    `LOCATION: ${decision.location}`,
    '',
    '─'.repeat(44),
    '',
    ...decision.situation.split('\n'),
    '',
    '─'.repeat(44),
    '',
    decision.question,
    '',
  ];

  const { displayed } = useTypingEffect(situationLines, {
    speed: 14,
    lineDelay: 60,
    onComplete: () => setTextDone(true),
  });
  const sentinelRef = useAutoScroll(displayed);

  const choose = useCallback((key) => {
    if (chosen) return;
    setChosen(key);
    playConfirm();
    setTimeout(() => onDecide(key), 600);
  }, [chosen, onDecide, playConfirm]);

  useKeyboard({
    'A': () => textDone && !chosen && choose('A'),
    'B': () => textDone && !chosen && choose('B'),
    'C': () => textDone && !chosen && choose('C'),
    '1': () => textDone && !chosen && choose('A'),
    '2': () => textDone && !chosen && choose('B'),
    '3': () => textDone && !chosen && choose('C'),
  }, true);

  const counter = `DECISION ${decisionNumber} OF ${totalDecisions}`;

  return (
    <div className="screen-content fade-in">
      <div className="decision-counter dim">{counter}</div>
      <div className="decision-spacer-sm" />

      <div className="decision-body">
        {displayed.map((line, i) => {
          const isMeta = i < 3;
          return (
            <div key={i} className={`decision-line ${isMeta ? 'decision-meta' : ''}`}>
              {line || ' '}
            </div>
          );
        })}
        <div ref={sentinelRef} />
      </div>

      {textDone && (
        <div className="decision-options fade-in">
          {decision.options.map(opt => {
            const isChosen   = chosen === opt.key;
            const isHovered  = hovered === opt.key;
            const isDisabled = !!chosen && !isChosen;
            return (
              <div
                key={opt.key}
                className={`option-row ${isChosen ? 'option-chosen' : ''} ${isHovered && !chosen ? 'option-hovered' : ''} ${isDisabled ? 'option-disabled' : ''}`}
                onClick={() => !chosen && choose(opt.key)}
                onMouseEnter={() => setHovered(opt.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="option-key-badge">[{opt.key}]</span>
                <span className="option-label">{opt.label}</span>
                {isHovered && !chosen && (
                  <span className="option-desc"> — {opt.description}</span>
                )}
                {isChosen && <span className="option-chosen-mark"> ◄ SELECTED</span>}
              </div>
            );
          })}
          <div className="option-input-row">
            <span className="decision-prompt">{'>'}</span>
            {!chosen && <span className="cursor" />}
            {chosen && <span className="decision-chosen-text">{chosen}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
