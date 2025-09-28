import { FC, useCallback } from 'react';
import { MicrophoneState } from '@/app/components/microphone/typesAndConstants';
import { useMicrophoneContext } from '@/app/components/microphone/microphoneContextProvider';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@/app/components/fontawesome/fontAwesomeIcon';

export const MicControlButton: FC = () => {
  const { microphoneState, startMicrophone, stopMicrophone } =
    useMicrophoneContext();

  const handleMicToggle = useCallback(() => {
    if (microphoneState === MicrophoneState.Open) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  }, [microphoneState, startMicrophone, stopMicrophone]);

  return (
    <>
      <span>Mic status: {microphoneState}</span>
      <button
        className={twMerge(
          'max-h-[60px] max-w-[60px] min-h-[60px] min-w-[60px] rounded-full cursor-pointer bg-white border-2 border-gray-70 group flex items-center justify-center',
          ''
        )}
        onClick={handleMicToggle}
      >
        <FontAwesomeIcon
          icon="fa-microphone"
          size="28px"
          className="block! group-hover:hidden!"
        />
        <FontAwesomeIcon
          icon={
            microphoneState === MicrophoneState.Open ? 'fa-pause' : 'fa-play'
          }
          size="28px"
          className="hidden! group-hover:block!"
        />
      </button>
    </>
  );
};
