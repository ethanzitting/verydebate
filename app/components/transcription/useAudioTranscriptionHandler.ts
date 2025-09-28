import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeepgramContext } from './deepgramContextProvider';
import {
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { useFixIosSafariBugDataAvailableListener } from '@/app/components/microphone/useFixIosSafariBugDataAvailableListener';

export const useAudioTranscriptionHandler = () => {
  const { connection, connectionState } = useDeepgramContext();

  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const currentParagraphRef = useRef<string>('');

  const captionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useFixIosSafariBugDataAvailableListener();

  const handleTranscriptTextStream = useCallback(
    (data: LiveTranscriptionEvent) => {
      console.log('Transcript event', data);
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      console.log('thisCaption', thisCaption);
      if (thisCaption !== '') {
        currentParagraphRef.current =
          currentParagraphRef.current + ' ' + thisCaption;
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          console.log('currentParagraphRef', currentParagraphRef.current);
          setParagraphs((prev) => [...prev, currentParagraphRef.current]);
          currentParagraphRef.current = '';
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    },
    []
  );

  useEffect(() => {
    if (!connection) return;

    if (connectionState === SOCKET_STATES.open) {
      connection.addListener(
        LiveTranscriptionEvents.Transcript,
        handleTranscriptTextStream
      );
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        handleTranscriptTextStream
      );
      clearTimeout(captionTimeout.current);
    };
  }, [connection, connectionState, handleTranscriptTextStream]);

  return { paragraphs, currentParagraph: currentParagraphRef.current };
};
