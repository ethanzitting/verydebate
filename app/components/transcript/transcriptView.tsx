'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubble } from '@/app/components/transcript/chatBubble';
import { ScrollToBottomButton } from '@/app/components/transcript/scrollToBottomButton';
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

const SCROLL_THRESHOLD_PX = 40;

export const TranscriptView: FC<Props> = ({
  utterances,
  palette,
  totalSpeakers,
  interimPreview,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const checkIfNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsNearBottom(distanceFromBottom <= SCROLL_THRESHOLD_PX);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsNearBottom(true);
  }, []);

  // Auto-scroll when new content arrives and user is near bottom
  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [utterances, interimPreview, isNearBottom]);

  return (
    <div className="relative h-full">
      <div
        ref={scrollContainerRef}
        className="flex h-full flex-col gap-2 overflow-y-auto p-4"
        onScroll={checkIfNearBottom}
      >
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
        <div ref={bottomRef} />
      </div>
      {!isNearBottom && <ScrollToBottomButton onClick={scrollToBottom} />}
    </div>
  );
};
