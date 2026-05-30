import { STAT_LABELS, formatBar } from '../engine/statsEngine';

export function PlayerStats({ stats, visible }) {
  if (!visible) return null;

  return (
    <div className="player-stats fade-in">
      <div className="stats-title dim">ANALYST ATTRIBUTES</div>
      {Object.entries(STAT_LABELS).map(([key, label]) => (
        <div key={key} className="stats-row">
          <span className="stats-label">{label.padEnd(12)}</span>
          <span className="stats-bar">{formatBar(stats[key], 10)}</span>
          <span className="stats-val">{stats[key]}</span>
        </div>
      ))}
    </div>
  );
}
