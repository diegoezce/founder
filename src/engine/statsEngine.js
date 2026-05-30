export const BASE_STATS = {
  vision:     50,
  risk:       50,
  leadership: 50,
  discipline: 50,
  innovation: 50,
};

export const STAT_LABELS = {
  vision:     'VISION',
  risk:       'RISK',
  leadership: 'LEADERSHIP',
  discipline: 'DISCIPLINE',
  innovation: 'INNOVATION',
};

export function applyDelta(stats, delta) {
  const next = { ...stats };
  for (const key of Object.keys(delta)) {
    next[key] = Math.min(100, Math.max(0, (next[key] || 50) + delta[key]));
  }
  return next;
}

export function getTotalScore(stats) {
  const vals = Object.values(stats);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function getProfile(caseData, stats) {
  const score = getTotalScore(stats);
  if (score >= 70) return caseData.profiles.high;
  if (score >= 45) return caseData.profiles.medium;
  return caseData.profiles.low;
}

export function formatBar(value, width = 20) {
  const filled = Math.round((value / 100) * width);
  const empty  = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function dotLeader(label, value, totalWidth = 36) {
  const labelStr  = label;
  const valueStr  = String(value).padStart(3);
  const dots      = '.'.repeat(totalWidth - labelStr.length - valueStr.length - 2);
  return `${labelStr} ${dots} ${valueStr}`;
}
