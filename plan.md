# VeryDebate — Implementation Plan

Each phase produces a working, committable state. Later phases build on earlier ones.

---

## Phase 1: Storybook + Data Types + Chat Bubble Component

**Goal**: Establish the visual foundation with no backend wiring. Get the chat bubble component pixel-perfect in Storybook with mock data.

- Install and configure Storybook for Next.js + Tailwind v4
- Define shared types in `app/types.ts`: `Utterance`, `Speaker`, `DebateSession`, `PendingSegment`, `InterimPreview`
- Define the speaker color palette and randomized assignment utility
- Build `ChatBubble` component: renders a single utterance with speaker color, indentation based on speaker index and total speaker count
- Build `TranscriptView` component: vertically scrolling list of `ChatBubble`s, plus an interim preview bubble at the bottom
- Stories for `ChatBubble` (1 speaker, 2 speakers, 3-4 speakers, interim preview) and `TranscriptView` (mock conversation)

**Verify**: Storybook renders all stories correctly. Bubbles are color-coded, indented properly for 2/3/4 speaker scenarios.

---

## Phase 2: Auto-Scroll Behavior

**Goal**: TranscriptView auto-scrolls to bottom on new utterances, stops when user scrolls up, shows a "scroll to bottom" button.

- Add auto-scroll logic to `TranscriptView`: detect when user has scrolled away from bottom, pause auto-scroll
- Build `ScrollToBottomButton` component: appears when not at bottom, clicking it scrolls down and re-enables auto-scroll
- Storybook story that appends utterances on a timer to demonstrate auto-scroll

**Verify**: In Storybook, auto-scroll works. Scrolling up pauses it and shows the button. Clicking the button resumes.

---

## Phase 3: Password Gate

**Goal**: Lock the app behind a password screen.

- Add `DEBATE_PASSWORD` env var
- Add API route `app/api/auth/route.ts`: POST endpoint that checks the password against the env var, returns success/failure
- Build `PasswordGate` component: full-screen input, submit on Enter, shows error on wrong password
- On success, store a flag in localStorage. On load, skip the gate if the flag is present.
- Add `PasswordGate` to the provider pyramid / layout so the app is gated
- Storybook story for `PasswordGate`

**Verify**: App shows password screen on fresh load. Wrong password shows error. Correct password grants access. Refresh preserves access.

---

## Phase 4: Microphone Refactor

**Goal**: Rework the microphone context to match the spec's state machine (`notRequested` → `open` ↔ `paused`, `error`).

- Update `MicrophoneState` enum: `NotRequested`, `Open`, `Paused`, `Error`
- Refactor `MicrophoneContextProvider`: track permission state, handle `getUserMedia` errors with clear messaging
- Refactor `MicControlButton`: show distinct states (not yet requested, recording, paused, error). Visual recording indicator (pulsing dot or similar).
- Storybook stories for each mic button state

**Verify**: Click to start → requests mic → shows recording state. Click again → pauses. Click again → resumes. Denying permission shows error state.

---

## Phase 5: Deepgram Result Buffering

**Goal**: Implement the correct `is_final` / `speech_final` buffering logic per the Deepgram docs.

- Update Deepgram config: add `endpointing: 300`, change `utterance_end_ms` to `1000`
- Rewrite transcript processing hook (replacing `useAccessTranscriptStream`):
  - Maintain a `PendingSegment[]` buffer for `is_final: true` segments
  - On `is_final: true, speech_final: false`: append words to buffer
  - On `is_final: true, speech_final: true`: append words to buffer, then flush — group consecutive words by speaker into `Utterance` records
  - On `is_final: false`: update the `InterimPreview` (latest interim text + speaker if available)
  - On `UtteranceEnd` event: flush any remaining buffer as a safety net
- Lazy-create `Speaker` entries on first appearance of a new speaker index

**Verify**: Run the app with a real microphone. Speak with pauses — utterances appear correctly. Interim text shows and disappears on finalization. Multiple `is_final: true` segments before `speech_final` are concatenated, not dropped.

---

## Phase 6: Wire Transcript UI to Live Data

**Goal**: Connect the Deepgram buffering logic to the `TranscriptView` component.

- Create a `DebateSessionContext` that holds the `DebateSession` state, exposes `addUtterance`, `addSpeaker`, `reset`
- Wire the transcript processing hook to push finalized utterances and interim preview into the context
- Replace the current `HomePage` with: mic button + `TranscriptView` reading from context
- Remove the old `homePage.tsx` rendering code

**Verify**: Full end-to-end: click record, speak, see color-coded bubbles appear in real time with interim previews. Two people speaking produces correctly attributed, differently colored bubbles.

---

## Phase 7: Session Persistence + Reset

**Goal**: Persist the debate session in localStorage and allow clearing it.

- Add debounced localStorage write (1000ms) in `DebateSessionContext` — triggered on utterance additions
- On mount, restore `DebateSession` from localStorage if present
- Build `ResetButton` component: clears localStorage and resets session state
- Place reset button in the UI (e.g. top bar or alongside mic controls)
- Storybook story for `ResetButton`

**Verify**: Record some speech. Refresh the page — transcript reappears. Click reset — transcript clears. Refresh again — starts fresh.

---

## Phase 8: Polish + Cleanup

**Goal**: Clean up unused code, finalize styling, verify edge cases.

- Remove unused components/hooks from the original scaffold (`useLogIfVariableChanges`, `useSingleUseFunction`, `unimplementedFunction`, etc.) if no longer referenced
- Verify microphone pause/resume cycle creates new Deepgram connections and appends to the same session cleanly
- Test with 1, 2, 3, and 4 speakers (as best as possible with one person)
- Verify endpointing and `utterance_end_ms` feel right for debate pacing, adjust if needed
- Final styling pass on all components
