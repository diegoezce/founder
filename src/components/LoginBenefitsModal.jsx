import { useEffect } from 'react';

const BENEFITS = [
  '  ► SAVE PROGRESS ACROSS SESSIONS',
  '  ► TRACK SCORES & TIERS PER CASE',
  '  ► SYNC ACROSS MULTIPLE DEVICES',
  '  ► COMPARE ACCURACY VS HISTORY',
];

export function LoginBenefitsModal({ onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' || e.key === 'y' || e.key === 'Y') onConfirm();
      if (e.key === 'Escape' || e.key === 'n' || e.key === 'N') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onConfirm, onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-line dim">╔{'═'.repeat(38)}╗</div>
        <div className="modal-line">║{'  ANALYST AUTHENTICATION REQUIRED  '.padEnd(38)}║</div>
        <div className="modal-line dim">╠{'═'.repeat(38)}╣</div>
        <div className="modal-line dim">║{''.padEnd(38)}║</div>
        <div className="modal-line glow">║{'  SIGN IN TO UNLOCK:'.padEnd(38)}║</div>
        <div className="modal-line dim">║{''.padEnd(38)}║</div>
        {BENEFITS.map((b, i) => (
          <div key={i} className="modal-line">║{b.padEnd(38)}║</div>
        ))}
        <div className="modal-line dim">║{''.padEnd(38)}║</div>
        <div className="modal-line dim">╠{'═'.repeat(38)}╣</div>
        <div className="modal-line">║{'  AUTHENTICATE WITH GOOGLE?'.padEnd(38)}║</div>
        <div className="modal-line dim">║{''.padEnd(38)}║</div>
        <div className="modal-line">║{'  [Y] PROCEED    [N / ESC] CANCEL'.padEnd(38)}║</div>
        <div className="modal-line dim">║{''.padEnd(38)}║</div>
        <div className="modal-line dim">╚{'═'.repeat(38)}╝</div>
        <div className="modal-actions">
          <span className="status-btn modal-btn" onClick={onConfirm}>[Y] AUTHENTICATE</span>
          <span className="status-btn modal-btn dim" onClick={onCancel}>[N] CANCEL</span>
        </div>
      </div>
    </div>
  );
}
