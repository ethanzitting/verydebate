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

  const [activeParagraph, setActiveParagraph] = useState<string>('');
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

  const storeCurrentStatement = useCallback((data: LiveTranscriptionEvent) => {
    console.log('Transcript event', data);
    const { channel } = data;
    const thisCaption = channel.alternatives[0].transcript;

    console.log('thisCaption: ', thisCaption);
    setActiveParagraph(thisCaption);
  }, []);

  useEffect(() => {
    if (!connection) return;

    if (connectionState === SOCKET_STATES.open) {
      connection.addListener(
        LiveTranscriptionEvents.Transcript,
        saveCompletedParagraphs
      );
      connection.addListener(
        LiveTranscriptionEvents.Transcript,
        storeCurrentStatement
      );
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        saveCompletedParagraphs
      );
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        storeCurrentStatement
      );
    };
  }, [
    connection,
    connectionState,
    saveCompletedParagraphs,
    storeCurrentStatement,
  ]);

  return {
    paragraphs: finalizedParagraphs,
    currentParagraph: activeParagraph,
  };
};
