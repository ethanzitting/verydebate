"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MicrophoneState } from "@/app/components/microphone/typesAndConstants";
import { unimplementedFunction } from "@/app/components/unimplementedFunction";

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
  defaultMicrophoneContext,
);

export function useMicrophoneContext(): MicrophoneContext {
  return useContext(microphoneContext);
}

export const MicrophoneContextProvider: FC<PropsWithChildren> = ({
  children = undefined,
}) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup,
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  const setupMicrophone = useCallback(async () => {
    setMicrophoneState(MicrophoneState.SettingUp);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const mediaRecorder = new MediaRecorder(mediaStream);

      setMicrophoneState(MicrophoneState.Ready);
      setMicrophone(mediaRecorder);
      console.log("microphone setup complete", mediaRecorder);
    } catch (err: any) {
      setMicrophoneState(MicrophoneState.Error);
      console.error(err);

      throw err;
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (!microphone) return;

    setMicrophoneState(MicrophoneState.Pausing);

    if (microphone.state === "recording") {
      microphone.pause();
      setMicrophoneState(MicrophoneState.Paused);
    }
  }, [microphone]);

  const startMicrophone = useCallback(async () => {
    if (microphoneState !== MicrophoneState.Paused) {
      await setupMicrophone();
      return;
    }

    setMicrophoneState(MicrophoneState.Opening);

    if (microphone?.state === "paused") {
      microphone.resume();
    } else {
      microphone?.start(250);
    }

    setMicrophoneState(MicrophoneState.Open);
  }, [microphone]);

  const value: MicrophoneContext = useMemo(() => {
    return {
      microphone,
      startMicrophone,
      stopMicrophone,
      microphoneState,
    };
  }, [microphone, startMicrophone, stopMicrophone, microphoneState]);

  return (
    <microphoneContext.Provider value={value}>
      {children}
    </microphoneContext.Provider>
  );
};
