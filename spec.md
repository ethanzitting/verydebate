# VeryDebate — Product Spec

## Overview

A desktop web app for live transcription of in-person debates. Users open the site, enter a password, click record, and see a real-time color-coded chat transcript with speaker diarization. Built with Next.js 15, React 19, Deepgram nova-3, and Tailwind CSS v4.

## Authentication

- Single shared password stored in an environment variable (`DEBATE_PASSWORD`).
- Full-screen password input on load. Submit with Enter.
- On success, persist auth in a cookie or localStorage so the user doesn't re-enter on refresh.
- No user accounts, sessions, or server-side auth middleware beyond the password check.

## Microphone Handling

- Desktop-focused. Microphone UX must be intuitive and reliable.
- States: `notRequested`, `open`, `paused`, `error`.
- On first click, request `getUserMedia`. Show clear feedback if permission is denied or unavailable.
- Toggle button: click to start recording, click again to pause, click again to resume.
- Visual indicator of active recording state (e.g. pulsing dot, audio visualizer).
- On pause, close the Deepgram WebSocket. On resume, open a new connection and continue appending to the same session.

## Deepgram Connection

### Configuration

```typescript
{
  model: "nova-3",
  interim_results: true,
  smart_format: true,
  filler_words: true,
  diarize: true,
  endpointing: 300,
  utterance_end_ms: 1000,
}
```

### Result Lifecycle

Deepgram streaming results follow this pattern:

1. **Interim results** (`is_final: false`): Preliminary predictions that refine over time. Display the latest one as a transient "pending" bubble.
2. **Finalized segments** (`is_final: true, speech_final: false`): A segment is locked in, but the utterance continues. Accumulate these in a buffer.
3. **Speech final** (`is_final: true, speech_final: true`): The utterance is complete. Append this segment to the buffer, then flush the entire buffer into finalized `Utterance` records, splitting by speaker where the `speaker` field changes between words.

Each word in a response carries a `speaker` integer (0-indexed). A single response can contain words from multiple speakers. When flushing the buffer, group consecutive words by `speaker` to produce per-speaker utterances.

### iOS Safari Bug

Continue handling the zero-size packet bug in `dataavailable` (already implemented).

## Data Structures

```typescript
type Utterance = {
  id: string;                  // crypto.randomUUID()
  speakerIndex: number;        // 0-3, from Deepgram
  text: string;                // finalized transcript text
  timestampMs: number;         // Date.now() when finalized
};

type Speaker = {
  index: number;               // 0-3
  name: string | null;         // future: LLM-detected name
  color: string;               // assigned from palette on first appearance
};

type DebateSession = {
  id: string;
  startedAtMs: number;
  speakers: Speaker[];
  utterances: Utterance[];
};
```

### Interim State (not persisted)

```typescript
// Buffer of is_final segments accumulating toward speech_final
type PendingSegment = {
  words: Array<{ word: string; speaker: number }>;
};

// The most recent is_final: false result, displayed as a transient bubble
type InterimPreview = {
  text: string;
  speakerIndex: number | null;  // may not have diarization in interims
};
```

## Transcript UI

### Chat Bubble Layout

Vertically scrolling chat log. Each finalized `Utterance` renders as a color-coded bubble.

**Indentation for 2 speakers:**
- Speaker 0: right-aligned
- Speaker 1: left-aligned

**Indentation for 3–4 speakers (spreading out):**
- Speaker 0: all the way right
- Speaker 1: slightly indented from right
- Speaker 2: slightly indented from left
- Speaker 3: all the way left

Speakers 1 and 2 have largely overlapping horizontal positions but remain visually distinct via color.

### Colors

Assign each speaker a color from a stately, subtle palette. Randomize the palette assignment per session so speakers don't always get the same color. Example palette: muted slate blue, warm taupe, sage green, dusty rose.

### Interim Display

The current interim preview renders at the bottom of the chat as a visually distinct bubble (e.g. reduced opacity, italic text, no background fill or a lighter version of the speaker's color). It replaces itself with each new interim result and disappears when the utterance finalizes into real bubbles.

### Auto-Scroll

- Chat auto-scrolls to the bottom as new utterances arrive.
- If the user scrolls up to review, auto-scroll stops.
- A "scroll to bottom" button appears when the user is scrolled away from the bottom. Clicking it resumes auto-scroll.

## Session Persistence

- Store the current `DebateSession` in localStorage.
- Debounce writes (e.g. 1000ms after the last finalized utterance).
- On page load, restore the session from localStorage if one exists.
- A **Reset** button clears the current session from localStorage and state, starting fresh.

## Storybook

- Use Storybook to view major components in isolation.
- Define which components get stories as we build them.

## Environment Variables

| Variable | Description |
|---|---|
| `DEEPGRAM_API_KEY` | Deepgram API key |
| `DEEPGRAM_ENV` | Set to `development` to skip token generation |
| `DEBATE_PASSWORD` | Password for site access |

## Future (punted)

- **Speaker name detection**: Stream transcript to an LLM to detect when speakers identify themselves, then map speaker index to name.
- **LLM analysis pipeline**: Stream transcript to an LLM for summarization, fact-checking, and other analysis.
- **Mobile support**.
