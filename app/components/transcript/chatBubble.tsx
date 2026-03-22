'use client';

import { FC } from 'react';
import { type SpeakerColor } from '@/app/types';

type Props = {
  text: string;
  speakerIndex: number;
  speakerColor: SpeakerColor;
  totalSpeakers: number;
  isInterim?: boolean;
};

/**
 * Returns a margin-left percentage that spreads speakers across the width.
 * Bubbles are a fixed 65% width, offset slides within the remaining 35%.
 *
 * 2 speakers: 0 → right (35%), 1 → left (0%)
 * 4 speakers: 0 → right (35%), 1 → (~23%), 2 → (~12%), 3 → left (0%)
 */
function getAlignmentPercent(
  speakerIndex: number,
  totalSpeakers: number,
): number {
  if (totalSpeakers <= 1) return 0;
  const maxOffset = 35;
  const position = (totalSpeakers - 1 - speakerIndex) / (totalSpeakers - 1);
  return Math.round(position * maxOffset);
}

export const ChatBubble: FC<Props> = ({
  text,
  speakerIndex,
  speakerColor,
  totalSpeakers,
  isInterim = false,
}) => {
  const alignmentPercent = getAlignmentPercent(speakerIndex, totalSpeakers);

  return (
    <div
      className="flex w-full"
      style={{ paddingLeft: `${alignmentPercent}%` }}
    >
      <div
        className="w-[65%] rounded-xl px-4 py-2 text-sm leading-relaxed"
        style={{
          backgroundColor: isInterim ? 'transparent' : speakerColor.bg,
          color: speakerColor.text,
          border: isInterim
            ? `1px dashed ${speakerColor.bg}`
            : `1px solid ${speakerColor.bg}`,
          opacity: isInterim ? 0.6 : 1,
          fontStyle: isInterim ? 'italic' : 'normal',
        }}
      >
        {text}
      </div>
    </div>
  );
};
