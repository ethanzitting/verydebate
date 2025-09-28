'use client';

import { FC } from 'react';
import { useAudioTranscriptionHandler } from '../transcription/useAudioTranscriptionHandler';
import { MicControlButton } from '@/app/components/microphone/micControlButton';

export const HomePage: FC = () => {
  const { caption } = useAudioTranscriptionHandler();

  return (
    <div className="h-full w-full bg-amber-50 flex flex-col gap-6">
      <MicControlButton />
      {caption && <span className="p-8">{caption}</span>}
    </div>
  );
};
