import { useCallback, useEffect } from "react";
import { LiveConnectionState } from "@deepgram/sdk";
import { MicrophoneEvents } from "@/app/components/microphone/typesAndConstants";
import { useDeepgramContext } from "@/app/components/transcription/deepgramContextProvider";
import { useMicrophoneContext } from "@/app/components/microphone/microphoneContextProvider";

export const useFixIosSafariBugDataAvailableListener = () => {
  const { connection, connectionState } = useDeepgramContext();
  const { microphone } = useMicrophoneContext();

  const fixIosSafariBug = useCallback(
    (e: BlobEvent) => {
      if (!microphone) return;
      if (!connection) return;
      if (connectionState !== LiveConnectionState.OPEN) return;

      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    },
    [connection, connectionState, microphone],
  );

  useEffect(() => {
    if (!microphone) return;

    microphone.addEventListener(
      MicrophoneEvents.DataAvailable,
      fixIosSafariBug,
    );

    return () => {
      microphone.removeEventListener(
        MicrophoneEvents.DataAvailable,
        fixIosSafariBug,
      );
    };
  });
};
