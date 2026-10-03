# VeryDebate live transcript and interpretations

The app makes a live microphone transcript and short interpretation cards.
The page keeps the dark stage and speaker-colored transcript.
The cards describe possible meaning. They do not check facts or replace the transcript.

## Run locally

Copy `.env.1password.example` to the ignored `.env.1password` file.
Replace the references with the Deepgram and Grok API key fields from 1Password.
Install the 1Password CLI and enable its desktop app integration.
Start the app with `npm ci` and `npm run dev`.
The `op run` command reads the keys from 1Password for the local relay.
Run `npm run check:deepgram` to confirm that the key can open a live stream.
Open `http://localhost:3000` and select **Start recording**.
Allow microphone access when the browser asks.
Use the Science demo and Abortion demo buttons to open the recorded conversations.

The browser sends microphone audio to a local WebSocket relay on port 3001.
The relay accepts the local page and sends the audio to Deepgram.
The app has no password gate. Both development servers listen on loopback only.
The production command also listens on loopback until the app has a public access design.
The browser never receives the long-lived API keys.
Deepgram assigns a numeric speaker ID to each word.
The transcript joins adjacent segments from the same speaker into one bubble.
A speaker change starts a new bubble. Live words appear in the current bubble.
The relay sends final transcript segments to Grok after a short interval or a complete point.
The model can create a card, revise the same point, or return no card.
Valibot checks every model result. The relay also checks speaker IDs and transcript sources.
Select a meaning card to show only its source transcript.
Select the transcript strip to open or close it. Drag the strip to change its height.
The app shows a service message if the Grok key is absent. The transcript still works.

The transcript and cards stay in memory during this visit. A page reload clears them.
The **Clear transcript** control clears both the transcript and the cards.
The local relay sends transcript text to xAI for interpretation.
This prototype does not request zero data retention.

## Checks

```bash
npm run test:unit
npm run build
```

The unit tests cover transcript segments, speaker changes, model validation, and card sources.
The live microphone path requires a valid Deepgram key and a browser microphone.
The local relay is a prototype. The production start command does not run it.
Set `LIVE_APP_PORT` and `LIVE_RELAY_PORT` to run a separate local preview.

## Recorded concept

The `concepts/` directory keeps the recorded debate interface.
See [DEMO.md](DEMO.md) for its replay instructions and limits.
The app serves these files at `/demos/` and links to both recorded conversations.
