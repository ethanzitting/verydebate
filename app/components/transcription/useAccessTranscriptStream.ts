import { useCallback, useEffect, useState } from 'react';
import { useDeepgramContext } from './deepgramContextProvider';
import {
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { useFixIosSafariBugDataAvailableListener } from '@/app/components/microphone/useFixIosSafariBugDataAvailableListener';
import _ from 'lodash';

export type SpeakerStatement = {
  speakerIndex: number;
  statement: string;
};

export const useAccessTranscriptStream = () => {
  const { connection, connectionState } = useDeepgramContext();

  const [speakerStatements, setSpeakerStatements] = useState<
    SpeakerStatement[]
  >([]);

  useFixIosSafariBugDataAvailableListener();

  const saveCompletedParagraphs = useCallback(
    (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal, channel } = data;
      const { alternatives } = channel;

      if (alternatives.length > 1) console.error('Multiple alternatives');
      const statement = alternatives[0];

      const thisCaption = statement.transcript;
      if (!isFinal || !speechFinal || !thisCaption) return;

      const speakerStatements = _.groupBy(statement.words, 'speaker');

      const foo = Object.keys(speakerStatements).map((speaker) => {
        const speakerStatement = speakerStatements[speaker];

        return {
          speakerIndex: speakerStatement[0].speaker,
          statement: speakerStatement.map((word) => word.word).join(' '),
        };
      });

      setSpeakerStatements((prev) => [...prev, ...foo]);
    },
    []
  );

  useEffect(() => {
    if (!connection) return;

    if (connectionState === SOCKET_STATES.open) {
      connection.addListener(
        LiveTranscriptionEvents.Transcript,
        saveCompletedParagraphs
      );
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        saveCompletedParagraphs
      );
    };
  }, [connection, connectionState, saveCompletedParagraphs]);

  return {
    paragraphs: speakerStatements,
  };
};
