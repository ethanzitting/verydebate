'use client';

import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';
import { unimplementedFunction } from '@/app/components/unimplementedFunction';

interface MicrophoneContext {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  microphoneState: MicrophoneState | null;
}

const defaultMicrophoneContext: MicrophoneContext = {
  microphone: null,
  startMicrophone: unimplementedFunction,
  stopMicrophone: unimplementedFunction,
  microphoneState: null,
};

const microphoneContext = createContext<MicrophoneContext>(
  defaultMicrophoneContext
);

export function useMicrophoneContext(): MicrophoneContext {
  return useContext(microphoneContext);
}

export const MicrophoneContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.Closed
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  const initializeMicrophone = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.start(1000);

      mediaRecorder.addEventListener('error', (event) => {
        console.error(`error recording stream: ${event.error.name}`);
        setMicrophoneState(MicrophoneState.Closed);
        setMicrophone(null);
      });

      setMicrophoneState(MicrophoneState.Open);
      setMicrophone(mediaRecorder);
    } catch (error) {
      setMicrophoneState(MicrophoneState.Closed);
      console.error(error);
      setMicrophone(null);

      throw error;
    }
  }, []);

  const pauseMicrophone = useCallback(() => {
    if (!microphone || microphone.state !== 'recording') return;

    microphone.pause();
    setMicrophoneState(MicrophoneState.Closed);
  }, [microphone]);

  const resumeMicrophone = useCallback(() => {
    if (!microphone) return;

    microphone.resume();
    setMicrophoneState(MicrophoneState.Open);
  }, [microphone]);

  const startMicrophone = useCallback(async () => {
    if (microphone?.state === 'paused') {
      resumeMicrophone();
    } else {
      await initializeMicrophone();
    }
  }, [initializeMicrophone, microphone?.state, resumeMicrophone]);

  const value: MicrophoneContext = useMemo(() => {
    return {
      microphone,
      startMicrophone,
      stopMicrophone: pauseMicrophone,
      microphoneState,
    };
  }, [microphone, startMicrophone, pauseMicrophone, microphoneState]);

  return (
    <microphoneContext.Provider value={value}>
      {children}
    </microphoneContext.Provider>
  );
};
