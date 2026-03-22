'use client';

import { FC } from 'react';
import { MicControlButton } from '@/app/components/microphone/micControlButton';
import { TranscriptView } from '@/app/components/transcript/transcriptView';
import { ResetButton } from '@/app/components/debate/resetButton';
import { useDebateSession } from '@/app/components/debate/debateSessionContext';

export const HomePage: FC = () => {
  const { utterances, speakers, palette, interimPreview } = useDebateSession();

  return (
    <div className="flex h-full w-full flex-col bg-neutral-50">
      <div className="flex items-center justify-center gap-4 border-b border-neutral-200 py-4">
        <MicControlButton />
        <ResetButton />
      </div>
      <div className="min-h-0 flex-1">
        <TranscriptView
          utterances={utterances}
          palette={palette}
          totalSpeakers={speakers.length}
          interimPreview={interimPreview}
        />
      </div>
    </div>
  );
};
