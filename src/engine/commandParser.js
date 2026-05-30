const COMMAND_MAP = {
  help:     'HELP',
  h:        'HELP',
  '?':      'HELP',
  open:     'OPEN',
  load:     'OPEN',
  select:   'OPEN',
  inspect:  'INSPECT',
  info:     'INSPECT',
  continue: 'CONTINUE',
  next:     'CONTINUE',
  proceed:  'CONTINUE',
  back:     'BACK',
  menu:     'MENU',
  home:     'MENU',
  exit:     'MENU',
  quit:     'MENU',
  clear:    'CLEAR',
  cls:      'CLEAR',
  stats:    'STATS',
  status:   'STATS',
  profile:  'STATS',
  sound:    'SOUND',
  mute:     'SOUND',
  audio:    'SOUND',
  a:        'CHOOSE_A',
  b:        'CHOOSE_B',
  c:        'CHOOSE_C',
  'choose a': 'CHOOSE_A',
  'choose b': 'CHOOSE_B',
  'choose c': 'CHOOSE_C',
  'pick a':   'CHOOSE_A',
  'pick b':   'CHOOSE_B',
  'pick c':   'CHOOSE_C',
  '1': 'CHOOSE_A',
  '2': 'CHOOSE_B',
  '3': 'CHOOSE_C',
};

const COMPANY_ALIASES = {
  microsoft: 'microsoft',
  ms:        'microsoft',
  gates:     'microsoft',
  costco:    'costco',
  amazon:    'amazon',
  amzn:      'amazon',
  bezos:     'amazon',
  'coca-cola':'coca-cola',
  coke:      'coca-cola',
  cocacola:  'coca-cola',
  nike:      'nike',
  netflix:   'netflix',
  nflx:      'netflix',
  ikea:      'ikea',
  disney:    'disney',
};

export function parseCommand(input) {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  // Direct command match
  if (COMMAND_MAP[raw]) {
    return { type: COMMAND_MAP[raw], raw };
  }

  // Multi-word command match
  for (const [pattern, type] of Object.entries(COMMAND_MAP)) {
    if (raw === pattern) return { type, raw };
  }

  // OPEN <company>
  const openMatch = raw.match(/^(?:open|load|select|run)\s+(.+)$/);
  if (openMatch) {
    const company = COMPANY_ALIASES[openMatch[1].trim()] || openMatch[1].trim();
    return { type: 'OPEN', payload: company, raw };
  }

  return { type: 'UNKNOWN', raw };
}

export const HELP_TEXT = `
AVAILABLE COMMANDS
──────────────────────────────────
  help           Show this menu
  open <company> Load a case file
  inspect        Case information
  stats          View your profile
  continue       Advance the story
  back           Previous screen
  menu           Return to main menu
  sound          Toggle sound
  clear          Clear terminal
  a / b / c      Select an option
──────────────────────────────────
EXAMPLES
  > open microsoft
  > choose b
  > inspect
  > stats
`;
