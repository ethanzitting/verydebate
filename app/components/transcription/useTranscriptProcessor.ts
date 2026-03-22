'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeepgramContext } from './deepgramContextProvider';
import {
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { useFixIosSafariBugDataAvailableListener } from '@/app/components/microphone/useFixIosSafariBugDataAvailableListener';
import {
  type Utterance,
  type Speaker,
  type InterimPreview,
  type SpeakerColor,
  createSpeaker,
} from '@/app/types';

type WordWithSpeaker = {
  word: string;
  speaker: number;
};

/**
 * Groups consecutive words by speaker into Utterance records.
 * e.g. [sp0, sp0, sp1, sp1, sp0] → 3 utterances
 */
function flushWordsToUtterances(words: WordWithSpeaker[]): Utterance[] {
  if (words.length === 0) return [];

  const utterances: Utterance[] = [];
  let currentSpeaker = words[0].speaker;
  let currentWords: string[] = [];

  for (const w of words) {
    if (w.speaker !== currentSpeaker) {
      utterances.push({
        id: crypto.randomUUID(),
        speakerIndex: currentSpeaker,
        text: currentWords.join(' '),
        timestampMs: Date.now(),
      });
      currentSpeaker = w.speaker;
      currentWords = [];
    }
    currentWords.push(w.word);
  }

  // Flush remaining
  if (currentWords.length > 0) {
    utterances.push({
      id: crypto.randomUUID(),
      speakerIndex: currentSpeaker,
      text: currentWords.join(' '),
      timestampMs: Date.now(),
    });
  }

  return utterances;
}

export type TranscriptProcessorResult = {
  utterances: Utterance[];
  speakers: Speaker[];
  palette: SpeakerColor[];
  interimPreview: InterimPreview | null;
};

export const useTranscriptProcessor = (
  palette: SpeakerColor[],
): TranscriptProcessorResult => {
  const { connection, connectionState } = useDeepgramContext();

  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [interimPreview, setInterimPreview] = useState<InterimPreview | null>(
    null,
  );

  // Buffer for is_final:true segments accumulating toward speech_final
  const pendingWordsRef = useRef<WordWithSpeaker[]>([]);

  useFixIosSafariBugDataAvailableListener();

  const ensureSpeakerExists = useCallback(
    (speakerIndex: number) => {
      setSpeakers((prev) => {
        if (prev.some((s) => s.index === speakerIndex)) return prev;
        return [...prev, createSpeaker(speakerIndex, palette)];
      });
    },
    [palette],
  );

  const flushPendingBuffer = useCallback(() => {
    const words = pendingWordsRef.current;
    if (words.length === 0) return;

    pendingWordsRef.current = [];
    const newUtterances = flushWordsToUtterances(words);
    if (newUtterances.length > 0) {
      setUtterances((prev) => [...prev, ...newUtterances]);
    }
    setInterimPreview(null);
  }, []);

  const handleTranscript = useCallback(
    (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal, channel } = data;
      const alternative = channel.alternatives[0];
      if (!alternative) return;

      const words: WordWithSpeaker[] = alternative.words.map((w) => ({
        word: w.punctuated_word ?? w.word,
        speaker: w.speaker ?? 0,
      }));

      // Ensure all speakers in this result exist
      const speakerIndices = new Set(words.map((w) => w.speaker));
      for (const idx of speakerIndices) {
        ensureSpeakerExists(idx);
      }

      if (!isFinal) {
        // Interim result — show as preview
        if (alternative.transcript) {
          const primarySpeaker =
            words.length > 0 ? words[0].speaker : null;
          setInterimPreview({
            text: alternative.transcript,
            speakerIndex: primarySpeaker,
          });
        }
        return;
      }

      // is_final: true — accumulate words into buffer
      if (words.length > 0) {
        pendingWordsRef.current = [...pendingWordsRef.current, ...words];
      }

      if (speechFinal) {
        // Utterance complete — flush buffer
        flushPendingBuffer();
      }
    },
    [ensureSpeakerExists, flushPendingBuffer],
  );

  const handleUtteranceEnd = useCallback(() => {
    // Safety net: flush any remaining buffered words
    flushPendingBuffer();
  }, [flushPendingBuffer]);

  useEffect(() => {
    if (!connection) return;
    if (connectionState !== SOCKET_STATES.open) return;

    connection.addListener(
      LiveTranscriptionEvents.Transcript,
      handleTranscript,
    );
    connection.addListener(
      LiveTranscriptionEvents.UtteranceEnd,
      handleUtteranceEnd,
    );

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        handleTranscript,
      );
      connection.removeListener(
        LiveTranscriptionEvents.UtteranceEnd,
        handleUtteranceEnd,
      );
    };
  }, [connection, connectionState, handleTranscript, handleUtteranceEnd]);

  return {
    utterances,
    speakers,
    palette,
    interimPreview,
  };
};
