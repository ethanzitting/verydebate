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

  const [caption, setCaption] = useState<string | undefined>(
    'Powered by Deepgram'
  );
  const captionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useFixIosSafariBugDataAvailableListener();

  const handleTranscriptTextStream = useCallback(
    (data: LiveTranscriptionEvent) => {
      console.log('Transcript event', data);
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      console.log('thisCaption', thisCaption);
      if (thisCaption !== '') {
        console.log('thisCaption !== ""', thisCaption);
        setCaption(thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
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

  return { caption };
};
