# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build` (uses Turbopack)
- **Start prod:** `npm start`
- **Lint:** `npx eslint .`
- **Storybook:** `npx storybook dev`

No test framework is configured.

## Architecture

Next.js 15 app using the App Router with React 19, Tailwind CSS v4, and TypeScript (strict mode). Path alias `@/*` maps to the project root.

The app is a real-time speech transcription tool ("Very Debate") that uses the Deepgram SDK for live audio-to-text with speaker diarization. See `spec.md` for full product spec and `plan.md` for implementation phases.

### Context provider pattern

Global state is managed via React Context providers nested in `app/components/providerPyramid.tsx`, which wraps the entire app in the root layout:

- **PasswordGate** — gates the app behind a single password
- **MicrophoneContextProvider** — manages MediaRecorder lifecycle (`NotRequested`/`Open`/`Paused`/`Error`), exposes `microphone`, `startMicrophone`, `pauseMicrophone`, `microphoneState`, `errorMessage`
- **DeepgramContextProvider** — connects to Deepgram's live transcription WebSocket when the microphone is ready, exposes `connection` and `connectionState`
- **DebateSessionResettable** — wraps `useTranscriptProcessor`, manages utterances/speakers/palette/interimPreview, persists to localStorage with debounce, supports full reset via key-based remount

### Transcript processing

`useTranscriptProcessor` implements the correct Deepgram result lifecycle: buffers `is_final:true` segments, flushes on `speech_final:true` splitting consecutive words by speaker into separate `Utterance` records. Handles `UtteranceEnd` as a safety-net flush. Shows latest `is_final:false` result as a transient interim preview.

### API routes

- `app/api/authenticate/route.ts` — GET endpoint that generates temporary Deepgram auth tokens (or returns the API key directly in development mode via `DEEPGRAM_ENV=development`)
- `app/api/auth/route.ts` — POST endpoint that checks password against `DEBATE_PASSWORD` env var

### Key env vars

- `DEEPGRAM_API_KEY` — Deepgram API key
- `DEEPGRAM_ENV` — set to `development` to skip token generation and use the API key directly
- `DEBATE_PASSWORD` — password for site access

## Conventions

### Use lodash

This project uses `lodash` for utility functions. Prefer lodash over hand-rolled implementations for common operations (groupBy, debounce, throttle, etc.).

### Custom hooks

Use the project's custom hooks in `app/components/hooks/`:

- **`useUpdatingRef`** — keeps a ref in sync with a value, useful for accessing current state in callbacks without adding to dependency arrays
- **`useOnMount`** — runs a callback once on mount (wraps `useEffect` with empty deps)
- **`useSingleUseFunction`** — returns a wrapper that ensures a callback only fires once
- **`useLogIfVariableChanges`** — debug hook that logs when a variable changes (useful during development)

### Variable naming

If a property or variable stores a number with units, the name must include the units (e.g. `maxDistanceKm`, `minDurationMs`, `timestampMs`, `debounceDelayMs`).

### ESLint config

- Uses flat config (`eslint.config.ts`) with typescript-eslint, eslint-plugin-react, next, and drizzle plugins
- `no-console` is a warning in JSX/TSX files
- Unused vars prefixed with `_` are allowed
