'use client';

import { FC } from 'react';

type Props = {
  onClick: () => void;
};

export const ScrollToBottomButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-neutral-700 px-4 py-2 text-xs text-white shadow-md transition-opacity hover:bg-neutral-600 cursor-pointer"
    >
      ↓ New messages
    </button>
  );
};
