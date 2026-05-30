import { useState } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSound } from '../hooks/useSound';
import { useAutoScroll } from '../hooks/useAutoScroll';

export function CaseIntro({ caseData, onStart, soundEnabled }) {
  const [ready, setReady] = useState(false);
  const { playBeep } = useSound(soundEnabled);

  const headerLines = [
    `CASE FILE: ${caseData.name}`,
    `CLASSIFICATION: ${caseData.classification}  CLEARANCE: ${caseData.clearanceLevel}`,
    `YEAR: ${caseData.intro.year}`,
    `LOCATION: ${caseData.intro.location}`,
    `SECTOR: ${caseData.sector}`,
    `STATUS: ${caseData.intro.status}`,
    `EMPLOYEES: ${caseData.intro.employees}`,
    `REVENUE: ${caseData.intro.revenue}`,
    '',
    '─'.repeat(44),
    '',
  ];

  const allLines = [...headerLines, ...caseData.intro.narrative];

  const { displayed, isDone } = useTypingEffect(allLines, {
    speed: 18,
    lineDelay: 80,
    onComplete: () => setReady(true),
  });
  const scrollRef = useAutoScroll(displayed);

  useKeyboard({
    ENTER: () => ready && onStart(),
    ' ':   () => ready && onStart(),
  }, true);

  return (
    <div className="screen-content fade-in">
      <div className="intro-lines" ref={scrollRef}>
        {displayed.map((line, i) => {
          const isHeader = i < headerLines.length;
          return (
            <div key={i} className={`intro-line ${isHeader ? 'intro-header' : 'intro-narrative'}`}>
              {line || ' '}
            </div>
          );
        })}
        {!isDone && <span className="cursor" />}
      </div>

      {isDone && (
        <div className="intro-continue fade-in">
          <div className="intro-divider">{'─'.repeat(44)}</div>
          <div className="intro-prompt" onClick={onStart}>
            PRESS ENTER TO BEGIN CASE  <span className="cursor" />
          </div>
        </div>
      )}
    </div>
  );
}
