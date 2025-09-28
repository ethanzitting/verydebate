'use client';

import { FC } from 'react';
import { useAccessTranscriptStream } from '../transcription/useAccessTranscriptStream';
import { MicControlButton } from '@/app/components/microphone/micControlButton';

export const HomePage: FC = () => {
  const { paragraphs, currentParagraph } = useAccessTranscriptStream();

  return (
    <div className="h-full w-full items-center justify-center bg-amber-50 flex flex-col gap-6">
      <MicControlButton />
      {paragraphs.map((paragraph, index) => (
        <div className="p-8" key={index}>
          {paragraph}
        </div>
      ))}
      <div className="p-8">{currentParagraph}</div>
    </div>
  );
};
