'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const STORAGE_KEY = 'verydebate-session';
const DEBOUNCE_DELAY_MS = 1000;

type PersistedSession = {
  id: string;
  startedAtMs: number;
  speakers: Speaker[];
  utterances: Utterance[];
  palette: SpeakerColor[];
};

function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

function saveSession(session: PersistedSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

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

  const handleReset = useCallback(() => {
    clearSession();
    setSessionKey((k) => k + 1);
  }, []);

  return (
    <DebateSessionInner key={sessionKey} onReset={handleReset}>
      {children}
    </DebateSessionInner>
  );
};

const DebateSessionInner: FC<
  PropsWithChildren<{ onReset: () => void }>
> = ({ children, onReset }) => {
  const [restored] = useState<PersistedSession | null>(() => loadSession());
  const [palette] = useState<SpeakerColor[]>(
    () => restored?.palette ?? createShuffledPalette(),
  );
  const [sessionId] = useState(() => restored?.id ?? crypto.randomUUID());
  const [startedAtMs] = useState(() => restored?.startedAtMs ?? Date.now());

  const processor = useTranscriptProcessor({
    palette,
    initialUtterances: restored?.utterances,
    initialSpeakers: restored?.speakers,
  });

  // Debounced localStorage persistence
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utterancesRef = useRef(processor.utterances);
  const speakersRef = useRef(processor.speakers);
  utterancesRef.current = processor.utterances;
  speakersRef.current = processor.speakers;

  useEffect(() => {
    if (processor.utterances.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveSession({
        id: sessionId,
        startedAtMs,
        speakers: speakersRef.current,
        utterances: utterancesRef.current,
        palette,
      });
    }, DEBOUNCE_DELAY_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [processor.utterances, sessionId, startedAtMs, palette]);

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
