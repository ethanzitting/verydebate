# Debate meaning demo

The `concepts/` directory saves the static debate interface and its research.
The Next.js app now uses that design for a live microphone transcript.

Open `concepts/live-stage.html` through a local web server. For example, run `python3 -m http.server 8765 --directory concepts` from the repository root. Then open `http://localhost:8765/live-stage.html?debate=science&moment=shortlist`.

The page includes two recorded debates. The science debate has three speakers. The abortion debate has two display speakers. Use the recording menu to switch between them.

Deepgram produced the transcripts. A person wrote the meaning cards for this demo. The page replays those cards at set times. It does not produce meanings or check claims in real time.

The `concepts/` directory has the interface and debate data. The `docs/` directory has the design decisions and research. The `scripts/` directory has the transcript preparation tools. The source repository for this snapshot is `truth-provider` at commit `746d881`.
