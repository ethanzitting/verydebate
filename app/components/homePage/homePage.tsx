'use client';

import { FC } from 'react';
import { useAudioTranscriptionHandler } from '../transcription/useAudioTranscriptionHandler';
import { useConnectToDeepgramOnMicrophoneReady } from '../transcription/useConnectToDeepgramOnMicrophoneReady';
import { useKeepConnectionLive } from '../transcription/useKeepConnectionAlive';
import { MicControlButton } from '@/app/components/microphone/micControlButton';

export const HomePage: FC = () => {
  useConnectToDeepgramOnMicrophoneReady();
  useKeepConnectionLive();

  const { caption } = useAudioTranscriptionHandler();

  return (
    <div className="h-full w-full bg-amber-50 flex flex-col gap-6">
      <MicControlButton />
      {caption && <span className="p-8">{caption}</span>}
    </div>
  );
};
