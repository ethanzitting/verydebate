# Transcript and interface findings

## Data used

- The MP3 lasts 12:24. Deepgram returned 2,408 words.
- The full file used Nova-3 and the batch diarizer v2. The raw response has 89 utterances.
- A 43-second test used Deepgram's live API and the live diarizer v1. Its raw file has 66 `Results` events.
- Of those 66 events, 53 were interim results and 13 were final results. Five final results contain more than one speaker ID.
- The display uses 156 segments built from final word-level speaker IDs. It does not use utterances as chat turns.

## Live response shape

Each live `Results` event has `start`, `duration`, `is_final`, and `speech_final`. The `channel.alternatives[0].words` list has word times, text, confidence, and a speaker ID. Deepgram sent a `Metadata` event when the sample stream closed.

An interim result can change. A final result fixes its words, but it can still contain more than one speaker. The interface must not append every interim result as a new message. The batch response also has `speaker_confidence` on its words. The live sample did not have that field.

Deepgram documents the [live response](https://developers.deepgram.com/reference/speech-to-text/listen-streaming), [speaker IDs](https://developers.deepgram.com/docs/diarization), and [utterances](https://developers.deepgram.com/docs/utterances).

## What the real transcript taught us

1. **An API event is not a chat turn.** One final event can contain words from two speakers. The page must split at the word level.
2. **A speaker ID is not a person.** Deepgram assigned IDs 0, 1, and 2. Some short ID 2 segments appear to belong to a main speaker. The page keeps a question mark on those segments.
3. **An advertisement needs a clear break.** The file has a sponsored segment from about 06:38 to 07:50. The page puts it between the debate turns. It does not use that speech in the point notes.
4. **Overlap makes text uncertain.** Some rapid replies contain missing words or a wrong speaker ID. The page must not treat those words as exact evidence without review.
5. **A long turn needs readable parts.** One speaker speaks for almost a minute without a speaker change. The page divides long runs at sentence ends and time limits.
6. **The last words are not always the last point.** The debate ends with a short exchange about marriage. The latest point notes refer to the earlier college question and say when that exchange occurred.
7. **Old speech needs more room.** The point notes cover old messages when the viewer scrolls back. The page now makes the notes compact during review.
8. **Point links need the spoken words.** The note about college links to the transcript lines in an optional detail view. It describes the reply without a claim about intent.
9. **Real speech must not inherit a fictional fact check.** The earlier sample had a fictional source check. The new page removes it and states that no claims were checked.

## Limits of this demo

The page uses a complete batch transcript for the full chat. It uses the live sample to study Deepgram's event shape. It does not replay the full MP3 through the live API. The point notes are hand-written for one late exchange. They do not update across the complete recording.

The MP3 remains on the Desktop. The repo stores transcript text and API responses, but it does not store the audio. The page does not let a viewer play the source audio or correct speaker IDs. Those controls are possible later review features. They must not interrupt a live conversation.

## Files

- [Raw batch response](data/debate-batch-raw.json)
- [Raw live sample](data/debate-stream-sample.jsonl)
- [Display data](data/debate-view.json)
- [Readable transcript](data/debate-transcript.md)
- [Transcript chat](live-stage.html)
