# VeryDebate live transcript

This branch turns the recorded debate concept into a live microphone transcript.
The page keeps the concept's dark stage and speaker-colored transcript.
The meaning area stays empty. The app does not generate meanings or check claims.

## Run locally

Create `.env.local` with the shared password:

```text
DEBATE_PASSWORD=your-shared-password
```

Copy `.env.1password.example` to the ignored `.env.1password` file.
Replace the example reference with the Deepgram API key field from 1Password.
Install the 1Password CLI and enable its desktop app integration.
Start the app with `npm ci` and `npm run dev`.
The `op run` command reads the key from 1Password for the local relay.
Run `npm run check:deepgram` to confirm that the key can open a live stream.
Open `http://localhost:3000`, enter the shared password, and select **Start recording**.
Allow microphone access when the browser asks.

The browser sends microphone audio to a local WebSocket relay on port 3001.
The relay checks the password session and sends the audio to Deepgram.
The browser never receives the long-lived API key.
Deepgram assigns a numeric speaker ID to each word.
The transcript groups adjacent words from the same speaker into one entry.

The transcript stays in memory during this visit. A page reload clears it.
The **Clear transcript** control clears it before a reload.

## Checks

```bash
npm run test:unit
npm run build
```

The unit tests cover interim words, final segments, speaker changes, and the final buffer.
The live microphone path requires a valid Deepgram key and a browser microphone.
The local relay is a prototype. The production start command does not run it.

## Recorded concept

The `concepts/` directory keeps the recorded debate interface.
See [DEMO.md](DEMO.md) for its replay instructions and limits.
