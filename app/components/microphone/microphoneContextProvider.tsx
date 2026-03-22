'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';

interface MicrophoneContext {
  microphone: MediaRecorder | null;
  microphoneState: MicrophoneState;
  errorMessage: string | null;
  startMicrophone: () => void;
  pauseMicrophone: () => void;
}

const defaultMicrophoneContext: MicrophoneContext = {
  microphone: null,
  microphoneState: MicrophoneState.NotRequested,
  errorMessage: null,
  startMicrophone: () => {},
  pauseMicrophone: () => {},
};

const microphoneContext = createContext<MicrophoneContext>(
  defaultMicrophoneContext,
);

export function useMicrophoneContext(): MicrophoneContext {
  return useContext(microphoneContext);
}

export const MicrophoneContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotRequested,
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeMicrophone = useCallback(async () => {
    try {
      setErrorMessage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.start(250);

      mediaRecorder.addEventListener('error', (event) => {
        setMicrophoneState(MicrophoneState.Error);
        setErrorMessage(`Recording error: ${event.error.name}`);
        setMicrophone(null);
      });

      setMicrophoneState(MicrophoneState.Open);
      setMicrophone(mediaRecorder);
    } catch (err) {
      setMicrophone(null);
      setMicrophoneState(MicrophoneState.Error);

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Microphone permission denied. Please allow access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('No microphone found. Please connect a microphone.');
        } else {
          setErrorMessage(`Microphone error: ${err.message}`);
        }
      } else {
        setErrorMessage('Failed to access microphone.');
      }
    }
  }, []);

  const pauseMicrophone = useCallback(() => {
    if (!microphone || microphone.state !== 'recording') return;
    microphone.pause();
    setMicrophoneState(MicrophoneState.Paused);
  }, [microphone]);

  const resumeMicrophone = useCallback(() => {
    if (!microphone) return;
    microphone.resume();
    setMicrophoneState(MicrophoneState.Open);
    setErrorMessage(null);
  }, [microphone]);

  const startMicrophone = useCallback(async () => {
    if (microphone?.state === 'paused') {
      resumeMicrophone();
    } else {
      await initializeMicrophone();
    }
  }, [initializeMicrophone, microphone?.state, resumeMicrophone]);

  const value: MicrophoneContext = useMemo(
    () => ({
      microphone,
      microphoneState,
      errorMessage,
      startMicrophone,
      pauseMicrophone,
    }),
    [microphone, microphoneState, errorMessage, startMicrophone, pauseMicrophone],
  );

  return (
    <microphoneContext.Provider value={value}>
      {children}
    </microphoneContext.Provider>
  );
};
