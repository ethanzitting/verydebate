import { describe, expect, it } from 'vitest';
import type { LiveTranscriptionEvent } from '@deepgram/sdk';
import {
  initialTranscriptState,
  previewLines,
  reduceTranscript,
} from './transcript';

function result(
  words: Array<{ word: string; speaker?: number }>,
  isFinal: boolean,
  speechFinal = false,
): LiveTranscriptionEvent {
  return {
    is_final: isFinal,
    speech_final: speechFinal,
    channel: {
      alternatives: [{
        transcript: words.map(({ word }) => word).join(' '),
        words: words.map(({ word, speaker }) => ({
          word,
          punctuated_word: word,
          speaker,
        })),
      }],
    },
  } as LiveTranscriptionEvent;
}

describe('live transcript', () => {
  it('shows interim speech and replaces it with final speech', () => {
    const interim = reduceTranscript(initialTranscriptState, {
      type: 'result',
      result: result([{ word: 'Hel', speaker: 0 }], false),
      nowMs: 100,
    });
    expect(previewLines(interim)).toEqual([
      { speakerIndex: 0, text: 'Hel' },
    ]);

    const final = reduceTranscript(interim, {
      type: 'result',
      result: result([{ word: 'Hello.', speaker: 0 }], true, true),
      nowMs: 200,
    });
    expect(final.lines.map(({ speakerIndex, text }) => ({ speakerIndex, text })))
      .toEqual([{ speakerIndex: 0, text: 'Hello.' }]);
    expect(previewLines(final)).toEqual([]);
  });

  it('buffers final segments and separates each speaker change', () => {
    const first = reduceTranscript(initialTranscriptState, {
      type: 'result',
      result: result([{ word: 'I', speaker: 0 }, { word: 'agree.', speaker: 0 }], true),
      nowMs: 100,
    });
    expect(first.lines).toEqual([]);
    expect(previewLines(first)).toEqual([
      { speakerIndex: 0, text: 'I agree.' },
    ]);

    const second = reduceTranscript(first, {
      type: 'result',
      result: result([
        { word: 'But', speaker: 1 },
        { word: 'why?', speaker: 1 },
        { word: 'Because', speaker: 0 },
      ], true, true),
      nowMs: 200,
    });
    expect(second.lines.map(({ speakerIndex, text }) => ({ speakerIndex, text })))
      .toEqual([
        { speakerIndex: 0, text: 'I agree.' },
        { speakerIndex: 1, text: 'But why?' },
        { speakerIndex: 0, text: 'Because' },
      ]);
  });

  it('flushes final words on utterance end without assigning an unknown speaker', () => {
    const buffered = reduceTranscript(initialTranscriptState, {
      type: 'result',
      result: result([{ word: 'Maybe.' }], true),
      nowMs: 100,
    });
    const finished = reduceTranscript(buffered, { type: 'flush', nowMs: 200 });
    expect(finished.lines[0]).toMatchObject({
      speakerIndex: null,
      text: 'Maybe.',
    });
    expect(previewLines(finished)).toEqual([]);
  });
});
