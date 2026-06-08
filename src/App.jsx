import { useReducer, useCallback, useState, useEffect } from 'react';
import { reducer, createInitialState, SCREENS } from './engine/gameEngine';
import { getCaseById, getLocalizedCase } from './data/cases/index';
import { HELP_TEXT } from './engine/commandParser';
import { getTotalScore } from './engine/statsEngine';
import { useAuth } from './hooks/useAuth';
import { saveProgress, loadAllProgress } from './services/progressService';

import { BootSequence }   from './components/BootSequence';
import { MainMenu }       from './components/MainMenu';
import { CaseIntro }      from './components/CaseIntro';
import { DecisionScreen } from './components/DecisionScreen';
import { ResultScreen }   from './components/ResultScreen';
import { FinalScreen }    from './components/FinalScreen';
import { CommandLine }    from './components/CommandLine';
import { PlayerStats }    from './components/PlayerStats';
import { AuthButton }          from './components/AuthButton';
import { LoginBenefitsModal }  from './components/LoginBenefitsModal';
import './styles/global.css';
import './styles/components.css';

const THEMES = ['amber', 'green', 'mono'];

export default function App() {
  const [state,    dispatch] = useReducer(reducer, createInitialState());
  const [cmdMode,  setCmdMode]    = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [showStats, setShowStats]   = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('founder-theme') || 'amber'
  );
  const [lang, setLang] = useState(
    () => localStorage.getItem('founder-lang') || 'en'
  );
  const { user, signIn, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [caseProgress, setCaseProgress] = useState({});
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('founder-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('founder-lang', lang);
  }, [lang]);

  useEffect(() => {
    if (!user) { setCaseProgress({}); return; }
    loadAllProgress(user.id).then(setCaseProgress);
  }, [user]);

  useEffect(() => {
    if (state.screen !== SCREENS.FINAL || !user || !caseData) return;
    setSyncStatus('saving');
    const totalScore = getTotalScore(state.stats);
    const score = totalScore;
    const tier = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';
    const correct = state.choices.filter(c => {
      const dec = caseData.decisions.find(d => d.id === c.decisionId);
      return dec && c.choiceKey === dec.historicalChoice;
    }).length;
    const accuracy = state.choices.length
      ? Math.round((correct / state.choices.length) * 100)
      : 0;
    saveProgress(user.id, state.currentCase, { totalScore, tier, accuracy })
      .then(() => {
        setSyncStatus('synced');
        setCaseProgress(prev => ({
          ...prev,
          [state.currentCase]: { totalScore, tier, accuracy },
        }));
      })
      .catch(() => setSyncStatus('error'));
  }, [state.screen, user]);

  const cycleTheme = useCallback(() => {
    setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
  }, []);

  const cycleLang = useCallback(() => {
    setLang(l => l === 'en' ? 'es' : 'en');
  }, []);

  const rawCase   = state.currentCase ? getCaseById(state.currentCase) : null;
  const caseData  = getLocalizedCase(rawCase, lang);
  const decision = caseData
    ? caseData.decisions[state.decisionIndex] ?? null
    : null;

  /* ── Terminal command handler ──────────────── */
  const handleCommand = useCallback((cmd, raw) => {
    const push = (text, type = 'output') =>
      setCmdHistory(prev => [...prev.slice(-30), { text, type }]);

    push(`> ${raw}`, 'input');

    switch (cmd.type) {
      case 'HELP':
        HELP_TEXT.split('\n').forEach(l => push(l, 'system'));
        break;

      case 'OPEN': {
        const c = getCaseById(cmd.payload);
        if (c) {
          push(`LOADING: ${c.name}...`, 'system');
          setTimeout(() => dispatch({ type: 'SELECT_CASE', payload: c.id }), 400);
        } else {
          push(`ERROR: CASE FILE "${(cmd.payload || '').toUpperCase()}" NOT FOUND`, 'error');
        }
        break;
      }

      case 'INSPECT':
        if (caseData) {
          push(`CASE: ${caseData.name}`, 'system');
          push(`FOUNDED: ${caseData.founded}  SECTOR: ${caseData.sector}`, 'system');
          push(`FOUNDERS: ${caseData.founders.join(', ')}`, 'system');
        } else {
          push('NO ACTIVE CASE. USE: open <company>', 'error');
        }
        break;

      case 'STATS':
        setShowStats(s => !s);
        push('DISPLAYING ANALYST PROFILE', 'system');
        break;

      case 'CONTINUE':
        if (state.screen === SCREENS.INTRO)
          dispatch({ type: 'START_DECISIONS' });
        else
          push('NOTHING TO CONTINUE', 'error');
        break;

      case 'BACK':
      case 'MENU':
        dispatch({ type: 'GO_MENU' });
        push('RETURNING TO MAIN MENU', 'system');
        break;

      case 'SOUND':
        dispatch({ type: 'TOGGLE_SOUND' });
        push(`AUDIO: ${state.soundEnabled ? 'DISABLED' : 'ENABLED'}`, 'system');
        break;

      case 'CLEAR':
        setCmdHistory([]);
        break;

      case 'CHOOSE_A':
      case 'CHOOSE_B':
      case 'CHOOSE_C': {
        const key = cmd.type.replace('CHOOSE_', '');
        if (state.screen === SCREENS.DECISION && decision) {
          push(`EXECUTING CHOICE: ${key}`, 'system');
          setTimeout(() =>
            dispatch({ type: 'MAKE_DECISION', payload: { caseData, choiceKey: key } }),
            200
          );
        } else {
          push('NO ACTIVE DECISION', 'error');
        }
        break;
      }

      case 'UNKNOWN':
        push(`COMMAND NOT RECOGNIZED: "${raw.toUpperCase()}"`, 'error');
        push('TYPE "HELP" FOR AVAILABLE COMMANDS', 'system');
        break;

      default:
        break;
    }
  }, [state, caseData, decision]);

  const toggleCmd   = () => setCmdMode(m => !m);
  const toggleSound = () => dispatch({ type: 'TOGGLE_SOUND' });

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 't' || e.key === 'T') cycleTheme();
      if (e.key === 'l' || e.key === 'L') cycleLang();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cycleTheme, cycleLang]);

  const statusLeft  = state.currentCase
    ? `CASE: ${caseData?.name || '---'}`
    : 'FOUNDER v1.0';
  const statusRight = `${new Date().toTimeString().slice(0, 8)} | SND:${state.soundEnabled ? 'ON' : 'OFF'} | ${cmdMode ? 'CMD' : 'GUI'}`;

  return (
    <div className="crt-wrapper">
      <div className="scan-line" />
      <div className="terminal-screen">

        {state.screen === SCREENS.BOOT && (
          <BootSequence
            onComplete={() => dispatch({ type: 'BOOT_COMPLETE' })}
            soundEnabled={state.soundEnabled}
          />
        )}

        {state.screen === SCREENS.MENU && (
          <MainMenu
            onSelectCase={(id) => dispatch({ type: 'SELECT_CASE', payload: id })}
            soundEnabled={state.soundEnabled}
            onToggleSound={toggleSound}
            onCycleTheme={cycleTheme}
            onCycleLang={cycleLang}
            caseProgress={caseProgress}
          />
        )}

        {state.screen === SCREENS.INTRO && caseData && (
          <CaseIntro
            caseData={caseData}
            onStart={() => dispatch({ type: 'START_DECISIONS' })}
            soundEnabled={state.soundEnabled}
          />
        )}

        {state.screen === SCREENS.DECISION && decision && (
          <DecisionScreen
            key={decision.id}
            decision={decision}
            decisionNumber={state.decisionIndex + 1}
            totalDecisions={caseData.decisions.length}
            onDecide={(key) =>
              dispatch({ type: 'MAKE_DECISION', payload: { caseData, choiceKey: key } })
            }
            soundEnabled={state.soundEnabled}
          />
        )}

        {state.screen === SCREENS.RESULT && (() => {
          const lastChoice = state.choices[state.choices.length - 1];
          const lastDec    = caseData?.decisions.find(d => d.id === lastChoice?.decisionId);
          return lastDec && lastChoice ? (
            <ResultScreen
              key={lastChoice.decisionId}
              decision={lastDec}
              choice={lastChoice.choiceKey}
              isLast={state.decisionIndex >= caseData.decisions.length}
              onNext={() => dispatch({
                type: 'NEXT_DECISION',
                payload: { totalDecisions: caseData.decisions.length },
              })}
              soundEnabled={state.soundEnabled}
            />
          ) : null;
        })()}

        {state.screen === SCREENS.FINAL && caseData && (
          <FinalScreen
            caseData={caseData}
            stats={state.stats}
            choices={state.choices}
            onMenu={() => { setSyncStatus('idle'); dispatch({ type: 'GO_MENU' }); }}
            soundEnabled={state.soundEnabled}
            user={user}
            syncStatus={syncStatus}
            onSignIn={signIn}
          />
        )}

        <PlayerStats stats={state.stats} visible={showStats} />

        {cmdMode && state.screen !== SCREENS.BOOT && (
          <CommandLine
            visible={cmdMode}
            onCommand={handleCommand}
            history={cmdHistory}
            soundEnabled={state.soundEnabled}
          />
        )}

        {showLoginModal && (
          <LoginBenefitsModal
            onConfirm={() => { setShowLoginModal(false); signIn(); }}
            onCancel={() => setShowLoginModal(false)}
          />
        )}

        <div className="status-bar">
          <span className="status-bar-item">{statusLeft}</span>
          <span className="status-bar-item status-center">
            {state.screen !== SCREENS.BOOT && (
              <>
                <span className="status-btn" onClick={toggleSound} title="Toggle sound [S]">
                  [SND]
                </span>
                <span className="status-btn" onClick={cycleTheme} title="Cycle theme [T]">
                  [{theme.toUpperCase()}]
                </span>
                <span className="status-btn" onClick={cycleLang} title="Toggle language">
                  [{lang.toUpperCase()}]
                </span>
                <span className="status-btn" onClick={toggleCmd} title="Terminal mode">
                  [CMD]
                </span>
                {state.screen !== SCREENS.MENU && (
                  <span className="status-btn" onClick={() => setShowStats(s => !s)} title="Stats">
                    [STATS]
                  </span>
                )}
                {state.screen !== SCREENS.MENU && (
                  <span className="status-btn" onClick={() => dispatch({ type: 'GO_MENU' })} title="Menu">
                    [MENU]
                  </span>
                )}
                <AuthButton user={user} onSignIn={() => setShowLoginModal(true)} onSignOut={signOut} />
              </>
            )}
          </span>
          <span className="status-bar-item">{statusRight}</span>
        </div>
      </div>
    </div>
  );
}
