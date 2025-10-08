import { useCallback, useEffect, useState } from 'react';
import { useDeepgramContext } from './deepgramContextProvider';
import {
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { useFixIosSafariBugDataAvailableListener } from '@/app/components/microphone/useFixIosSafariBugDataAvailableListener';

export const useAccessTranscriptStream = () => {
  const { connection, connectionState } = useDeepgramContext();

  const [finalizedParagraphs, setFinalizedParagraphs] = useState<string[]>([]);

  useFixIosSafariBugDataAvailableListener();

  const saveCompletedParagraphs = useCallback(
    (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal, channel } = data;
      const thisCaption = channel.alternatives[0].transcript;

      if (!isFinal || !speechFinal || !thisCaption) return;

      setFinalizedParagraphs((prev) => [...prev, thisCaption]);
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
    paragraphs: finalizedParagraphs,
  };
};
