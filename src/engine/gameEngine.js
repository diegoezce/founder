import { BASE_STATS, applyDelta } from './statsEngine';

export const SCREENS = {
  BOOT:     'BOOT',
  MENU:     'MENU',
  INTRO:    'INTRO',
  DECISION: 'DECISION',
  RESULT:   'RESULT',
  FINAL:    'FINAL',
};

export function createInitialState() {
  return {
    screen:           SCREENS.BOOT,
    currentCase:      null,
    decisionIndex:    0,
    stats:            { ...BASE_STATS },
    choices:          [],
    soundEnabled:     false,
    terminalHistory:  [],
    sessionTime:      Date.now(),
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      return { ...state, screen: SCREENS.MENU };

    case 'SELECT_CASE':
      return {
        ...state,
        screen:        SCREENS.INTRO,
        currentCase:   action.payload,
        decisionIndex: 0,
        stats:         { ...BASE_STATS },
        choices:       [],
      };

    case 'START_DECISIONS':
      return { ...state, screen: SCREENS.DECISION };

    case 'MAKE_DECISION': {
      const { caseData, choiceKey } = action.payload;
      const decision  = caseData.decisions[state.decisionIndex];
      const outcome   = decision.outcomes[choiceKey];
      const newStats  = applyDelta(state.stats, outcome.statsDelta);
      const newChoice = {
        decisionId:  decision.id,
        choiceKey,
        outcome,
        year:        decision.year,
      };
      return {
        ...state,
        screen:  SCREENS.RESULT,
        stats:   newStats,
        choices: [...state.choices, newChoice],
      };
    }

    case 'NEXT_DECISION': {
      const nextIndex = state.decisionIndex + 1;
      const hasMore   = nextIndex < action.payload.totalDecisions;
      return {
        ...state,
        screen:        hasMore ? SCREENS.DECISION : SCREENS.FINAL,
        decisionIndex: nextIndex,
      };
    }

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'PUSH_TERMINAL':
      return {
        ...state,
        terminalHistory: [
          ...state.terminalHistory.slice(-50),
          action.payload,
        ],
      };

    case 'GO_MENU':
      return {
        ...createInitialState(),
        screen:       SCREENS.MENU,
        soundEnabled: state.soundEnabled,
      };

    default:
      return state;
  }
}
