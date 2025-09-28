import { useMicrophoneContext } from '@/app/components/microphone/microphoneContextProvider';
import { useCallback, useEffect, useState } from 'react';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';
import {
  createClient,
  LiveClient,
  LiveSchema,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { getToken } from '@/app/components/transcription/utils';

export const useConnectToDeepgramOnMicrophoneReady = () => {
  const { microphoneState, microphone } = useMicrophoneContext();

  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<SOCKET_STATES>(
    SOCKET_STATES.closed
  );

  const connectToDeepgram = useCallback(
    async (options: LiveSchema, endpoint?: string) => {
      const token = await getToken();
      const deepgram = createClient({ accessToken: token });

      const conn = deepgram.listen.live(options, endpoint);

      conn.on(LiveTranscriptionEvents.Open, () => {
        console.log('Transcription connection opened');
        setConnectionState(SOCKET_STATES.open);
      });

      conn.on(LiveTranscriptionEvents.Close, () => {
        console.log('Transcription connection closed');
        setConnectionState(SOCKET_STATES.closed);
      });

      conn.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log(data.channel.alternatives[0].transcript);
      });

      setConnection(conn);
    },
    []
  );

  const disconnectFromDeepgram = useCallback(async () => {
    if (connection) {
      connection.requestClose();
      setConnection(null);
      setConnectionState(SOCKET_STATES.closed);
    }
  }, [connection]);

  useEffect(() => {
    if (microphone && microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: 'nova-3',
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    } else {
      disconnectFromDeepgram();
    }
  }, [connectToDeepgram, disconnectFromDeepgram, microphone, microphoneState]);

  return {
    connection,
    connectionState,
  };
};
