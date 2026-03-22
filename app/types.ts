export type Utterance = {
  id: string;
  speakerIndex: number;
  text: string;
  timestampMs: number;
};

export type Speaker = {
  index: number;
  name: string | null;
  color: string;
};

export type DebateSession = {
  id: string;
  startedAtMs: number;
  speakers: Speaker[];
  utterances: Utterance[];
};

export type PendingSegment = {
  words: Array<{ word: string; speaker: number }>;
};

export type InterimPreview = {
  text: string;
  speakerIndex: number | null;
};

// Stately, subtle palette for speaker bubbles
const SPEAKER_PALETTE = [
  { bg: '#E8E0D8', text: '#5C4F42' }, // warm taupe
  { bg: '#D8E2E8', text: '#3E5060' }, // muted slate blue
  { bg: '#DDE5D8', text: '#4A5C42' }, // sage green
  { bg: '#E8D8E0', text: '#604A56' }, // dusty rose
];

export type SpeakerColor = { bg: string; text: string };

export function createShuffledPalette(): SpeakerColor[] {
  const palette = [...SPEAKER_PALETTE];
  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }
  return palette;
}

export function createSpeaker(
  index: number,
  palette: SpeakerColor[],
): Speaker {
  return {
    index,
    name: null,
    color: palette[index % palette.length].bg,
  };
}

export function getSpeakerColor(
  speakerIndex: number,
  palette: SpeakerColor[],
): SpeakerColor {
  return palette[speakerIndex % palette.length];
}
