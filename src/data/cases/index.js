import microsoft from './microsoft.json';
import costco    from './costco.json';

export const CASES = [
  microsoft,
  costco,
  // import amazon   from './amazon.json';
  // import cocacola from './cocacola.json';
  // import nike     from './nike.json';
  // import netflix  from './netflix.json';
  // import ikea     from './ikea.json';
  // import disney   from './disney.json';
];

/**
 * Returns the case data merged with the requested language overlay.
 * Falls back to the base (English) content if no translation exists.
 */
export function getLocalizedCase(caseData, lang) {
  if (!lang || lang === 'en' || !caseData?.i18n?.[lang]) return caseData;
  const t = caseData.i18n[lang];
  return {
    ...caseData,
    intro:         t.intro         ?? caseData.intro,
    decisions:     t.decisions     ?? caseData.decisions,
    profiles:      t.profiles      ?? caseData.profiles,
    historicalNote:t.historicalNote ?? caseData.historicalNote,
  };
}

export const CASE_MENU = [
  {
    id: 'microsoft', label: 'MICROSOFT', available: true,
    year: 1980, location: 'SEATTLE, WA',
    teaser: 'A small software company receives\nan unexpected call from IBM.',
    playtime: '10-15 MIN', difficulty: 3,
  },
  {
    id: 'costco', label: 'COSTCO', available: true,
    year: 1983, location: 'SAN DIEGO, CA',
    teaser: 'A warehouse concept that breaks\nevery rule of retail.',
    playtime: '10-15 MIN', difficulty: 2,
  },
  {
    id: 'amazon', label: 'AMAZON', available: false,
    year: 1994, location: 'SEATTLE, WA',
    teaser: 'A bookstore that wants to sell\neverything. To everyone.',
    playtime: '12-18 MIN', difficulty: 4,
  },
  {
    id: 'coca-cola', label: 'COCA-COLA', available: false,
    year: 1985, location: 'ATLANTA, GA',
    teaser: 'The most recognized brand in\nthe world changes its formula.',
    playtime: '10-15 MIN', difficulty: 3,
  },
  {
    id: 'nike', label: 'NIKE', available: false,
    year: 1971, location: 'PORTLAND, OR',
    teaser: 'Two men, a waffle iron, and\na dream to outrun Adidas.',
    playtime: '10-15 MIN', difficulty: 3,
  },
  {
    id: 'netflix', label: 'NETFLIX', available: false,
    year: 1997, location: 'SCOTTS VALLEY, CA',
    teaser: 'A late fee turns into the idea\nthat kills Blockbuster.',
    playtime: '12-18 MIN', difficulty: 4,
  },
  {
    id: 'ikea', label: 'IKEA', available: false,
    year: 1953, location: 'ÄLMHULT, SWEDEN',
    teaser: 'A young man decides furniture\nshould be for everyone.',
    playtime: '10-15 MIN', difficulty: 2,
  },
  {
    id: 'disney', label: 'DISNEY', available: false,
    year: 1928, location: 'LOS ANGELES, CA',
    teaser: 'A mouse, a sound, and the birth\nof an entertainment empire.',
    playtime: '15-20 MIN', difficulty: 3,
  },
];

export function getCaseById(id) {
  return CASES.find(c => c.id === id) || null;
}
