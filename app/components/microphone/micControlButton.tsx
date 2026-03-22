'use client';

import { FC, useCallback } from 'react';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';
import { useMicrophoneContext } from '@/app/components/microphone/microphoneContextProvider';
import { FontAwesomeIcon } from '@/app/components/fontawesome/fontAwesomeIcon';

export const MicControlButton: FC = () => {
  const { microphoneState, errorMessage, startMicrophone, pauseMicrophone } =
    useMicrophoneContext();

  const isOpen = microphoneState === MicrophoneState.Open;
  const isError = microphoneState === MicrophoneState.Error;

  const handleClick = useCallback(() => {
    if (isOpen) {
      pauseMicrophone();
    } else {
      startMicrophone();
    }
  }, [isOpen, startMicrophone, pauseMicrophone]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-neutral-300 bg-white transition-colors hover:border-neutral-400"
      >
        {isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20" />
        )}
        {isOpen ? (
          <FontAwesomeIcon icon="fa-pause" size="24px" />
        ) : (
          <FontAwesomeIcon icon="fa-microphone" size="24px" />
        )}
        {isOpen && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
        )}
      </button>
      {isError && errorMessage && (
        <p className="max-w-64 text-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}
      {microphoneState === MicrophoneState.Paused && (
        <p className="text-xs text-neutral-400">Paused</p>
      )}
    </div>
  );
};
