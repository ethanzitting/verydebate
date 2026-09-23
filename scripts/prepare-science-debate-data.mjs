import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'concepts/data/science-debate-batch-raw.json';
const outputPath = 'concepts/data/science-debate-view.json';
const browserPath = 'concepts/data/science-debate-view.js';
const transcriptPath = 'concepts/data/science-debate-transcript.md';
const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const words = source.results?.channels?.[0]?.alternatives?.[0]?.words;
if (!Array.isArray(words) || words.length === 0) throw new Error('No word-level transcript was found.');

const speakerNames = { 0: 'Neil', 1: 'Konstantin', 2: 'Francis' };
const inserts = [
  { start: 0, end: 69.9, kind: 'preview', label: 'Opening preview' },
  { start: 1292.9, end: 1356.8, kind: 'sponsor', label: 'Sponsored break' },
];
const textFor = (items) => items.map((word) => word.punctuated_word || word.word).join(' ');
const mean = (items, key) => items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / items.length;
const clock = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
const insertFor = (word) => inserts.find((insert) => word.start >= insert.start && word.start < insert.end);

const runs = [];
for (const word of words) {
  const insert = insertFor(word);
  const previous = runs.at(-1);
  const sameSection = previous?.kind === (insert?.kind || 'speech');
  const sameSpeaker = previous?.speaker === word.speaker;
  const shortGap = previous && word.start - previous.words.at(-1).end < 2.2;
  if (!previous || !sameSection || !sameSpeaker || !shortGap) {
    runs.push({ kind: insert?.kind || 'speech', label: insert?.label, speaker: word.speaker, words: [word] });
  } else {
    previous.words.push(word);
  }
}

const chunks = [];
for (const run of runs) {
  if (run.kind !== 'speech') {
    const prior = chunks.at(-1);
    if (prior?.kind === run.kind && prior.label === run.label) prior.words.push(...run.words);
    else chunks.push({ ...run, words: [...run.words] });
    continue;
  }
  let part = [];
  for (const word of run.words) {
    part.push(word);
    const span = word.end - part[0].start;
    const sentenceEnd = /[.!?]["']?$/.test(word.punctuated_word || word.word);
    if ((part.length >= 14 && span >= 10 && sentenceEnd) || part.length >= 44 || span >= 18) {
      chunks.push({ kind: 'speech', speaker: run.speaker, words: part });
      part = [];
    }
  }
  if (part.length) chunks.push({ kind: 'speech', speaker: run.speaker, words: part });
}

const segments = chunks.map((chunk, index) => {
  const speakerConfidence = mean(chunk.words, 'speaker_confidence');
  const text = textFor(chunk.words);
  const identityUncertain = chunk.kind === 'speech' && (
    speakerConfidence < 0.65 ||
    (chunk.speaker === 0 && /^(Neil[, ]|Neil\b)/i.test(text))
  );
  return {
    id: `s${String(index + 1).padStart(4, '0')}`,
    kind: chunk.kind,
    label: chunk.label,
    start: Number(chunk.words[0].start.toFixed(2)),
    end: Number(chunk.words.at(-1).end.toFixed(2)),
    speaker: chunk.speaker,
    deepgramSpeaker: chunk.speaker,
    speakerConfidence: Number(speakerConfidence.toFixed(3)),
    wordConfidence: Number(mean(chunk.words, 'confidence').toFixed(3)),
    identityUncertain,
    text,
    words: chunk.words.map((word) => ({
      start: Number(word.start.toFixed(2)),
      end: Number(word.end.toFixed(2)),
      text: word.punctuated_word || word.word,
      confidence: Number(word.confidence.toFixed(3)),
      speaker: word.speaker,
      deepgramSpeaker: word.speaker,
      speakerConfidence: Number((word.speaker_confidence ?? 0).toFixed(3)),
    })),
  };
});

const modelKey = Object.keys(source.metadata?.model_info || {})[0];
const view = {
  source: {
    audio: 'Have We Lost Trust in Science - Neil deGrasse Tyson.mp3',
    duration: Number(source.metadata.duration.toFixed(2)),
    model: source.metadata?.model_info?.[modelKey]?.name || 'unknown',
    diarizer: source.metadata?.diarize_info?.arch || 'unknown',
    requestId: source.metadata.request_id,
  },
  speakerNames,
  method: 'Deepgram batch transcript with three display names. The names follow the broad voice pattern. Brief overlap can have the wrong speaker ID.',
  segments,
};

writeFileSync(outputPath, `${JSON.stringify(view)}\n`);
writeFileSync(browserPath, `window.DEBATE_DATA = ${JSON.stringify(view)};\n`);

const lines = [
  '# Science debate transcript',
  '',
  `Source: ${view.source.audio}`,
  `Length: ${clock(view.source.duration)}`,
  `Service: Deepgram ${view.source.model}; diarizer ${view.source.diarizer}.`,
  '',
  'The display maps the three main Deepgram IDs to Neil, Konstantin, and Francis.',
  'Brief overlap can have the wrong speaker ID. The transcript can also contain wrong words.',
  '',
];
for (const segment of segments) {
  const label = segment.kind === 'speech' ? speakerNames[segment.speaker] : segment.label;
  lines.push(`**${clock(segment.start)} ${label}:** ${segment.text}`, '');
}
writeFileSync(transcriptPath, `${lines.join('\n')}\n`);
console.log(`Saved ${segments.length} display segments and ${words.length} words.`);
console.log(`The transcript includes ${segments.filter((segment) => segment.kind !== 'speech').length} recorded inserts.`);
