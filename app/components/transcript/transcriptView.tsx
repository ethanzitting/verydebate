'use client';

import { FC } from 'react';
import { ChatBubble } from '@/app/components/transcript/chatBubble';
import {
  type Utterance,
  type InterimPreview,
  type SpeakerColor,
  getSpeakerColor,
} from '@/app/types';

type Props = {
  utterances: Utterance[];
  palette: SpeakerColor[];
  totalSpeakers: number;
  interimPreview?: InterimPreview | null;
};

export const TranscriptView: FC<Props> = ({
  utterances,
  palette,
  totalSpeakers,
  interimPreview,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {utterances.map((utterance) => (
        <ChatBubble
          key={utterance.id}
          text={utterance.text}
          speakerIndex={utterance.speakerIndex}
          speakerColor={getSpeakerColor(utterance.speakerIndex, palette)}
          totalSpeakers={totalSpeakers}
        />
      ))}
      {interimPreview?.text && (
        <ChatBubble
          text={interimPreview.text}
          speakerIndex={interimPreview.speakerIndex ?? 0}
          speakerColor={getSpeakerColor(
            interimPreview.speakerIndex ?? 0,
            palette,
          )}
          totalSpeakers={totalSpeakers}
          isInterim
        />
      )}
    </div>
  );
};
