# Debate interface concepts

Open [index.html](index.html) in a browser. The index links to three example pages.

| Page | Primary task | Main idea |
| --- | --- | --- |
| [Meaning stream and transcript](live-stage.html) | Follow a recorded debate | Read likely meanings as the speakers develop them. |
| [Argument map](argument-map.html) | Understand the structure | Link positions, claims, challenges, and open points. |
| [Evidence desk](evidence-desk.html) | Review the record | Separate the quote, the source, and the assessment. |

The main page uses two real MP3 recordings and two Deepgram transcripts. The other two pages remain fictional. The page does not check factual claims. The page uses Roboto. The only external resource is an optional Google Fonts style sheet. Local fonts remain available if that resource fails.

The recording selector changes the full data set without a code change. The abortion recording has two lanes. The science recording has three lanes for Neil, Konstantin, and Francis. All meaning cards use one scroll area. The latest cards appear at the bottom, without a separate fixed area. Cards for one subject share rows across the speaker lanes. When a viewer scrolls up, a large dark shadow shows that more cards remain below. The "Return to latest" button also appears. Each speaker gets a current card only after they address the current subject. A lane can stay empty. Card position, color, and shape identify the speaker. The transcript and screen readers give their names. A card can show a question or a likely position. A spoken clarification can revise a card. A brief cue shows what the speaker rejected and clarified. The replay also marks new wording. Recorded previews and advertisements stay separate from the debate meanings.

The transcript starts as a short strip with one speech excerpt. A viewer can drag the strip up, select it, or use the keyboard to open it. A viewer can also select a meaning card. This opens the transcript and filters it to relevant speech from all speakers. The filter keeps the original speech order. It marks gaps where it omits other lines. It emphasizes a spoken acceptance or rejection when that reply changes the meaning. The system does not treat silence as agreement. The filter stays in place when the viewer closes the transcript. "Show all speech" clears it. The meaning detail dialog and visible version history are not part of this view. The debate needs no turns, rounds, clicks, labels, or pauses. "Replay last exchange" shows how the last subject developed. It uses timed manual data, not a live intelligence service. The replay waits until the cited speech ends, then adds a short settle period. It skips a version when later speech replaces it almost immediately.

The abortion data names ID 0 Sarah and maps IDs 1 and 2 to Charlie at the user's direction. The science data maps the three broad voice patterns to Neil, Konstantin, and Francis. Deepgram made some short identity errors during overlap. The raw responses remain unchanged. The display data keeps the original ID in each `deepgramSpeaker` field.

The first-person meanings are interpretations, not quotes or confirmed speaker positions. The author wrote them for this demo. The page does not produce or check them in real time. A later version can return to an earlier topic without a new section or a turn rule. The repeated topic label offers a link to the earlier discussion. That link does not merge separate claims. Each entry sits in its speaker lane and follows its latest version time. The cards do not show timestamps. The transcript and replay keep time references. A topic label appears when the subject changes. Conditions stay in the meaning text when they limit a claim. The final pair uses a little more text to state a reason or a cost. It does not reduce the text size. The page keeps Sarah's birth definition separate from her limit on full-term abortion. It does not invent a reason that joins them. The overlapping speech near 02:00 produces no new meaning card. The earlier clear meaning remains visible.

## Recording data

`debate-loader.js` selects a data pair from the `debate` URL parameter. It loads the science discussion by default. Use `?debate=abortion` for the earlier debate.

### Science, trust, and gender

- [Raw batch response](data/science-debate-batch-raw.json) has 1,178 Deepgram utterances and word-level speaker data.
- [Display data](data/science-debate-view.json) has 485 readable segments and three display speakers.
- [Meaning stream data](data/science-debate-meanings.js) has 44 manual meanings with source links.
- [Readable transcript](data/science-debate-transcript.md) has times, names, and marked inserts.

### Abortion debate

- [Raw batch response](data/debate-batch-raw.json) has Deepgram's complete transcript and word-level speaker data.
- [Raw live sample](data/debate-stream-sample.jsonl) shows Deepgram's real-time event schema for about 43 seconds.
- [Display data](data/debate-view.json) has 156 chat segments with the user correction and original Deepgram IDs.
- [Meaning stream data](data/debate-meanings.js) has 14 manual meanings, their versions, and source links. The page uses this file.
- [Earlier point notes](data/debate-points.js) has 20 manual point notes from the prior prototype. The current page does not use this file.
- [Readable transcript](data/debate-transcript.md) has times, names, and corrected display speaker IDs.

Both MP3 files stay on the user's Desktop. The repo contains transcript text, but no audio copy. Each display data file also has a JavaScript copy.

## Public interface references

- [Deliberate example](https://usedeliberate.com/) shows an argument map linked to a debate transcript.
- [DebateMeter](https://debatemeter.com/) shows a debate library. Its [sample analysis](https://debatemeter.com/debate/taylor-lorenz-vs-destiny) shows categories, a speaking timeline, time-linked findings, and a transcript.
- [Factiverse Live introduction](https://www.factiverse.ai/blog/introducing-factiverse-live-fact-checking) includes product images and describes live claim checks and source review.
- [Khaos Live AI judge](https://khaoslive.com/ai-debate-judge) describes live scores and argument analysis. The public page does not show a clear product screen.
- [Frank](https://frankflags.com/) describes live flags for meetings. The public page does not show a clear product screen.

The concepts do not use these products' images or brand assets.
