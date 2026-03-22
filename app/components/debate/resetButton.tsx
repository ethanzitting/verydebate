'use client';

import { FC, useCallback, useState } from 'react';
import { useDebateSession } from '@/app/components/debate/debateSessionContext';

export const ResetButton: FC = () => {
  const { reset, utterances } = useDebateSession();
  const [confirming, setConfirming] = useState(false);

  const handleClick = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    reset();
    setConfirming(false);
  }, [confirming, reset]);

  // Don't show if there's nothing to reset
  if (utterances.length === 0 && !confirming) return null;

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-red-300 hover:text-red-600 cursor-pointer"
    >
      {confirming ? 'Confirm reset?' : 'Reset'}
    </button>
  );
};
