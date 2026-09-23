import type { LiveTranscriptionEvent } from '@deepgram/sdk';

export type TranscriptLine = {
  id: string;
  speakerIndex: number | null;
  text: string;
  timeMs: number;
};

export type DisplayLine = {
  id: string;
  speakerIndex: number | null;
  text: string;
  previewText: string;
  timeMs: number | null;
};

type SpokenWord = {
  text: string;
  speakerIndex: number | null;
};

export type TranscriptState = {
  lines: TranscriptLine[];
  bufferedWords: SpokenWord[];
  interimWords: SpokenWord[];
};

export type TranscriptAction =
  | { type: 'result'; result: LiveTranscriptionEvent; nowMs: number }
  | { type: 'flush'; nowMs: number }
  | { type: 'clear' };

export const initialTranscriptState: TranscriptState = {
  lines: [],
  bufferedWords: [],
  interimWords: [],
};

function wordsFromResult(result: LiveTranscriptionEvent): SpokenWord[] {
  const alternative = result.channel?.alternatives?.[0];
  if (!alternative) return [];

  if (alternative.words?.length) {
    return alternative.words
      .map((word) => ({
        text: (word.punctuated_word || word.word).trim(),
        speakerIndex: word.speaker ?? null,
      }))
      .filter((word) => word.text.length > 0);
  }

  const text = alternative.transcript?.trim();
  return text ? [{ text, speakerIndex: null }] : [];
}

function groupWords(words: SpokenWord[]): Array<{
  speakerIndex: number | null;
  text: string;
}> {
  const groups: Array<{ speakerIndex: number | null; text: string }> = [];
  for (const word of words) {
    const last = groups.at(-1);
    if (last?.speakerIndex === word.speakerIndex) {
      last.text += ` ${word.text}`;
    } else {
      groups.push({ speakerIndex: word.speakerIndex, text: word.text });
    }
  }
  return groups;
}

function flush(state: TranscriptState, nowMs: number): TranscriptState {
  if (state.bufferedWords.length === 0) {
    return { ...state, interimWords: [] };
  }

  const lines = groupWords(state.bufferedWords).map((group) => ({
    ...group,
    id: crypto.randomUUID(),
    timeMs: nowMs,
  }));
  return {
    lines: [...state.lines, ...lines],
    bufferedWords: [],
    interimWords: [],
  };
}

export function reduceTranscript(
  state: TranscriptState,
  action: TranscriptAction,
): TranscriptState {
  if (action.type === 'clear') return initialTranscriptState;
  if (action.type === 'flush') return flush(state, action.nowMs);

  const words = wordsFromResult(action.result);
  if (!action.result.is_final) {
    return { ...state, interimWords: words };
  }

  const next = {
    ...state,
    bufferedWords: [...state.bufferedWords, ...words],
    interimWords: [],
  };
  return action.result.speech_final ? flush(next, action.nowMs) : next;
}

export function previewLines(state: TranscriptState) {
  return groupWords([...state.bufferedWords, ...state.interimWords]);
}

function joinText(first: string, second: string): string {
  return first ? `${first} ${second}` : second;
}

export function displayLines(state: TranscriptState): DisplayLine[] {
  const displayed: DisplayLine[] = [];

  // A Deepgram endpoint is not necessarily a change of speaker.
  for (const line of state.lines) {
    const last = displayed.at(-1);
    if (last?.speakerIndex === line.speakerIndex) {
      last.text = joinText(last.text, line.text);
    } else {
      displayed.push({ ...line, previewText: '' });
    }
  }

  for (const [index, preview] of previewLines(state).entries()) {
    const last = displayed.at(-1);
    if (last?.speakerIndex === preview.speakerIndex) {
      last.previewText = joinText(last.previewText, preview.text);
    } else {
      displayed.push({
        id: `preview-${index}`,
        speakerIndex: preview.speakerIndex,
        text: '',
        previewText: preview.text,
        timeMs: null,
      });
    }
  }

  return displayed;
}
