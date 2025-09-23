"use client";

import { FC } from "react";
import { useMicrophoneContext } from "../microphone/microphoneContextProvider";
import { useAudioTranscriptionHandler } from "../transcription/useAudioTranscriptionHandler";
import { useConnectToDeepgramOnMicrophoneReady } from "../transcription/useConnectToDeepgramOnMicrophoneReady";
import { useKeepConnectionLive } from "../transcription/useKeepConnectionAlive";
import { Button } from "@/app/components/button";
import { MicrophoneState } from "@/app/components/microphone/typesAndConstants";

export const HomePage: FC = () => {
  const { microphoneState, startMicrophone, stopMicrophone } =
    useMicrophoneContext();

  useConnectToDeepgramOnMicrophoneReady();
  useKeepConnectionLive();

  const { caption } = useAudioTranscriptionHandler();

  return (
    <div className="h-full w-full bg-amber-50 flex flex-col gap-6">
      <span>Mic status: {microphoneState}</span>
      {microphoneState !== MicrophoneState.Ready &&
      microphoneState !== MicrophoneState.Open ? (
        <Button onClick={startMicrophone}>Start Mic</Button>
      ) : (
        <Button onClick={stopMicrophone}>Stop Mic</Button>
      )}
      {caption && <span className="p-8">{caption}</span>}
    </div>
  );
};
