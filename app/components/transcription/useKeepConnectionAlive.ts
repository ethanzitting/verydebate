import { useEffect, useRef } from 'react';
import { useMicrophoneContext } from '../microphone/microphoneContextProvider';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';
import { SOCKET_STATES } from '@deepgram/sdk';
import { DeepgramContext } from '@/app/components/transcription/deepgramContextProvider';

type Props = {
  connection: DeepgramContext['connection'];
  connectionState: DeepgramContext['connectionState'];
};

export const useKeepConnectionLive = ({
  connection,
  connectionState,
}: Props) => {
  const { microphoneState } = useMicrophoneContext();

  const keepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === SOCKET_STATES.open
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10_000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [microphoneState, connectionState, connection]);
};
