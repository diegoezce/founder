import { useEffect, useRef } from 'react';

const LINES = [
  { text: '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★', type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'CONGRATULATIONS, ANALYST.',               type: 'title' },
  { text: '',                                        type: 'gap' },
  { text: 'YOU HAVE REVIEWED ALL AVAILABLE',        type: 'body' },
  { text: 'RECORDS IN THE CORPORATE ARCHIVES.',     type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: 'THE BOARD IS IMPRESSED.',                type: 'glow' },
  { text: '',                                        type: 'gap' },
  { text: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',   type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'COMING SOON TO THE ARCHIVES',            type: 'title' },
  { text: '',                                        type: 'gap' },
  { text: '►  AMAZON      ·  1994',                 type: 'upcoming' },
  { text: '►  COCA-COLA   ·  1985',                 type: 'upcoming' },
  { text: '►  NIKE        ·  1971',                 type: 'upcoming' },
  { text: '►  NETFLIX     ·  1997',                 type: 'upcoming' },
  { text: '►  IKEA        ·  1953',                 type: 'upcoming' },
  { text: '►  DISNEY      ·  1928',                 type: 'upcoming' },
  { text: '',                                        type: 'gap' },
  { text: 'AND MANY MORE CLASSIFIED RECORDS',       type: 'body' },
  { text: 'AWAITING DECLASSIFICATION.',             type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',   type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'FUEL THE ARCHIVES',                      type: 'title' },
  { text: '',                                        type: 'gap' },
  { text: 'EACH CASE REQUIRES DEEP RESEARCH,',     type: 'body' },
  { text: 'WRITING, AND LATE NIGHTS.',              type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: 'IF YOU ENJOYED THIS, CONSIDER',         type: 'body' },
  { text: 'BUYING THE ARCHIVIST A COFFEE.',        type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: '[ ☕  INVITAME UN CAFECITO ]',            type: 'cta' },
  { text: 'cafecito.app/goplanify',                  type: 'cta-url' },
  { text: '',                                        type: 'gap' },
  { text: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',   type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'CREATED BY',                             type: 'credit-label' },
  { text: 'DIEGO CERVERA',                          type: 'credit-name' },
  { text: '',                                        type: 'gap' },
  { text: 'A SPARKIO PROJECT',                      type: 'credit-label' },
  { text: 'sparkio.co',                             type: 'credit-name' },
  { text: '',                                        type: 'gap' },
  { text: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─',   type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'NO FOUNDERS WERE HARMED',               type: 'body' },
  { text: 'IN THE MAKING OF THIS GAME.',           type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: 'ALL DECISIONS ARE HISTORICALLY',        type: 'body' },
  { text: 'INSPIRED BUT DRAMATISED FOR',           type: 'body' },
  { text: 'GAMEPLAY PURPOSES.',                    type: 'body' },
  { text: '',                                        type: 'gap' },
  { text: '★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★', type: 'divider' },
  { text: '',                                        type: 'gap' },
  { text: 'FOUNDER  v1.0',                         type: 'title' },
  { text: 'WHAT WOULD YOU HAVE DONE?',             type: 'tagline' },
  { text: '',                                        type: 'gap' },
  { text: '',                                        type: 'gap' },
  { text: '',                                        type: 'gap' },
];

const COFFEE_URL = 'https://cafecito.app/goplanify';

export function CreditsScreen({ onClose }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.6;
    let raf;
    const tick = () => {
      pos += speed;
      el.style.transform = `translateY(-${pos}px)`;
      if (pos > el.scrollHeight) pos = -window.innerHeight * 0.8;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="credits-overlay" onClick={onClose}>
      <div className="credits-viewport" onClick={(e) => e.stopPropagation()}>
        <div className="credits-scroll" ref={scrollRef}>
          {LINES.map((line, i) => (
            <div key={i} className={`credits-line credits-${line.type}`}>
              {(line.type === 'cta' || line.type === 'cta-url') ? (
                <a
                  href={COFFEE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credits-coffee-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {line.text}
                </a>
              ) : (
                line.text || ' '
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="credits-close-hint">[ ESC / CLICK TO CLOSE ]</div>
    </div>
  );
}
