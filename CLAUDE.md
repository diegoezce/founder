# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run start      # Serve production build (0.0.0.0:4173, used by Railway)
```

No test framework is configured.

## Architecture

**Founder** is a retro CRT-styled browser game where players make business decisions as historical founders (Microsoft, Costco, Ferrari, etc.). It's pure React + Vite, no TypeScript, no external state library.

### State Machine

All game state lives in `App.jsx` via a single `useReducer` driven by `src/engine/gameEngine.js`. The reducer enforces a strict screen flow:

```
BOOT → MENU → INTRO → DECISION → RESULT → (next DECISION or FINAL) → MENU
```

Actions: `BOOT_COMPLETE`, `SELECT_CASE`, `START_DECISIONS`, `MAKE_DECISION`, `NEXT_DECISION`, `TOGGLE_SOUND`, `GO_MENU`.

### Case Data (`src/data/cases/`)

Cases are JSON files. `index.js` loads and merges i18n overlays at runtime. Structure:
```json
{
  "id", "name", "tagline", "founded", "founders", "headquarters", "sector",
  "intro": { "year", "location", "status", "narrative": [] },
  "decisions": [{
    "id", "year", "location", "situation", "question",
    "options": [{ "key", "label", "description" }],
    "outcomes": { "A": { "statsDelta": {} }, "B": {}, "C": {} }
  }],
  "profiles": { "low": {}, "medium": {}, "high": {} },
  "i18n": { "es": {} }
}
```
Adding a new case = drop a JSON file here and register it in `index.js`.

### Stats System (`src/engine/statsEngine.js`)

Five stats (vision, risk, leadership, discipline, innovation), each 0–100. Decision outcomes carry `statsDelta` maps that are applied on `MAKE_DECISION`. The final profile (low/medium/high) is derived from the average score across all stats.

### Terminal Interface (`src/engine/commandParser.js`)

A custom command parser with aliases (`ms` → `microsoft`, etc.). Supported commands: `open`, `inspect`, `stats`, `continue`, `menu`, `sound`, `help`, `choose A/B/C`. History capped at 30 entries.

### Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useKeyboard.js` | Global keyboard bindings (arrow keys, vim keys, T/L/S shortcuts) |
| `useSound.js` | Procedural Web Audio API synthesis — no audio files |
| `useTypingEffect.js` | Typewriter animation for narrative text |
| `useAutoScroll.js` | Auto-scroll terminal output |

### Styling

Two CSS files only — `src/styles/global.css` (CSS custom properties, CRT scanline effect, font imports) and `src/styles/components.css`. Theme switching is done by setting a `data-theme` attribute on the root; three themes: `amber` (default), `green`, `mono`. Theme and language are persisted to `localStorage`.

### Deployment

Railway (`railway.json`): build with `npm run build`, serve with `npm run start`. Node 22 required (`.nvmrc`).
