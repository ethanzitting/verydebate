# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build` (uses Turbopack)
- **Start prod:** `npm start`
- **Lint:** `npx eslint .`

No test framework is configured.

## Architecture

Next.js 15 app using the App Router with React 19, Tailwind CSS v4, and TypeScript (strict mode). Path alias `@/*` maps to the project root.

The app is a real-time speech transcription tool ("Very Debate") that uses the Deepgram SDK for live audio-to-text with speaker diarization.

### Context provider pattern

Global state is managed via React Context providers nested in `app/components/providerPyramid.tsx`, which wraps the entire app in the root layout:

- **MicrophoneContextProvider** — manages MediaRecorder lifecycle (open/pause/resume), exposes `microphone`, `startMicrophone`, `stopMicrophone`, and `microphoneState`
- **DeepgramContextProvider** — connects to Deepgram's live transcription WebSocket when the microphone is ready, exposes `connection` and `connectionState`

### API route

`app/api/authenticate/route.ts` — GET endpoint that generates temporary Deepgram auth tokens (or returns the API key directly in development mode via `DEEPGRAM_ENV=development`).

### Key env vars

- `DEEPGRAM_API_KEY` — Deepgram API key
- `DEEPGRAM_ENV` — set to `development` to skip token generation and use the API key directly

### ESLint config

- Uses flat config (`eslint.config.ts`) with typescript-eslint, eslint-plugin-react, next, and drizzle plugins
- `no-console` is a warning in JSX/TSX files
- Unused vars prefixed with `_` are allowed
