'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useTranscriptProcessor } from '@/app/components/transcription/useTranscriptProcessor';
import {
  type Utterance,
  type Speaker,
  type InterimPreview,
  type SpeakerColor,
  createShuffledPalette,
} from '@/app/types';

interface DebateSessionContextValue {
  utterances: Utterance[];
  speakers: Speaker[];
  palette: SpeakerColor[];
  interimPreview: InterimPreview | null;
  reset: () => void;
}

const debateSessionContext = createContext<DebateSessionContextValue>({
  utterances: [],
  speakers: [],
  palette: [],
  interimPreview: null,
  reset: () => {},
});

export function useDebateSession(): DebateSessionContextValue {
  return useContext(debateSessionContext);
}

/**
 * Supports full reset by remounting the inner provider via key,
 * which resets all hook state (utterances, speakers, palette).
 */
export const DebateSessionResettable: FC<PropsWithChildren> = ({
  children,
}) => {
  const [sessionKey, setSessionKey] = useState(0);

  return (
    <DebateSessionInner
      key={sessionKey}
      onReset={() => setSessionKey((k) => k + 1)}
    >
      {children}
    </DebateSessionInner>
  );
};

const DebateSessionInner: FC<
  PropsWithChildren<{ onReset: () => void }>
> = ({ children, onReset }) => {
  const [palette] = useState<SpeakerColor[]>(createShuffledPalette);
  const processor = useTranscriptProcessor(palette);

  const value = useMemo(
    () => ({
      ...processor,
      reset: onReset,
    }),
    [processor, onReset],
  );

  return (
    <debateSessionContext.Provider value={value}>
      {children}
    </debateSessionContext.Provider>
  );
};
