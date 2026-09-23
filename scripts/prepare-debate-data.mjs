import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = 'concepts/data/debate-batch-raw.json';
const outputPath = 'concepts/data/debate-view.json';
const browserPath = 'concepts/data/debate-view.js';
const transcriptPath = 'concepts/data/debate-transcript.md';
const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const words = source.results?.channels?.[0]?.alternatives?.[0]?.words;
if (!Array.isArray(words) || words.length === 0) throw new Error('No word-level transcript was found.');

const textFor = (items) => items.map((word) => word.punctuated_word || word.word).join(' ');
const mean = (items, key) => items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / items.length;
const clock = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
const displaySpeaker = (speaker) => speaker === 2 ? 1 : speaker;
const speakerNames = { 0: 'Sarah', 1: 'Charlie' };

const runs = [];
for (const word of words) {
  const previous = runs.at(-1);
  if (!previous || previous.speaker !== word.speaker || word.start - previous.words.at(-1).end > 2.2) {
    runs.push({ speaker: word.speaker, words: [word] });
  } else {
    previous.words.push(word);
  }
}

const chunks = [];
for (const run of runs) {
  const runText = textFor(run.words);
  if (run.speaker === 2 && run.words.at(-1).end - run.words[0].start > 60 && /sponsored by/i.test(runText)) {
    chunks.push({ kind: 'sponsor', speaker: run.speaker, words: run.words });
    continue;
  }
  let part = [];
  for (const word of run.words) {
    part.push(word);
    const span = word.end - part[0].start;
    const sentenceEnd = /[.!?]["']?$/.test(word.punctuated_word || word.word);
    if ((part.length >= 16 && span >= 12 && sentenceEnd) || part.length >= 48 || span >= 19) {
      chunks.push({ kind: 'speech', speaker: run.speaker, words: part });
      part = [];
    }
  }
  if (part.length) chunks.push({ kind: 'speech', speaker: run.speaker, words: part });
}

const segments = chunks.map((chunk, index) => ({
  id: `s${String(index + 1).padStart(3, '0')}`,
  kind: chunk.kind,
  start: Number(chunk.words[0].start.toFixed(2)),
  end: Number(chunk.words.at(-1).end.toFixed(2)),
  speaker: displaySpeaker(chunk.speaker),
  deepgramSpeaker: chunk.speaker,
  speakerConfidence: Number(mean(chunk.words, 'speaker_confidence').toFixed(3)),
  wordConfidence: Number(mean(chunk.words, 'confidence').toFixed(3)),
  identityUncertain: false,
  text: textFor(chunk.words),
  words: chunk.words.map((word) => ({
    start: Number(word.start.toFixed(2)),
    end: Number(word.end.toFixed(2)),
    text: word.punctuated_word || word.word,
    confidence: Number(word.confidence.toFixed(3)),
    speaker: displaySpeaker(word.speaker),
    deepgramSpeaker: word.speaker,
    speakerConfidence: Number((word.speaker_confidence ?? 0).toFixed(3)),
  })),
}));

const view = {
  source: {
    audio: "Charlie Kirk's GREATEST Debate Yet Defending the Unborn.mp3",
    duration: Number(source.metadata.duration.toFixed(2)),
    model: source.metadata.model_info[Object.keys(source.metadata.model_info)[0]].name,
    diarizer: source.metadata.diarize_info.arch,
    requestId: source.metadata.request_id,
  },
  speakerNames,
  method: 'Deepgram batch transcript. The display names ID 0 Sarah and combines Deepgram IDs 1 and 2 as Charlie at the user’s direction. Deepgram IDs remain in deepgramSpeaker fields. Speaker confidence describes the original Deepgram ID.',
  segments,
};
writeFileSync(outputPath, `${JSON.stringify(view)}\n`);
writeFileSync(browserPath, `window.DEBATE_DATA = ${JSON.stringify(view)};\n`);

const lines = [
  '# Debate transcript',
  '',
  `Source: ${view.source.audio}`,
  `Length: ${clock(view.source.duration)}`,
  `Service: Deepgram ${view.source.model}; diarizer ${view.source.diarizer}.`,
  '',
  'The display names Deepgram ID 0 Sarah and combines IDs 1 and 2 as Charlie. The raw response keeps the original IDs.',
  'The transcript can contain errors, especially where people speak at the same time.',
  '',
];
for (const segment of segments) {
  const label = segment.kind === 'sponsor' ? 'Sponsored segment, Charlie' : speakerNames[segment.speaker];
  lines.push(`**${clock(segment.start)} ${label}:** ${segment.text}`, '');
}
writeFileSync(transcriptPath, `${lines.join('\n')}\n`);
console.log(`Saved ${segments.length} display segments and ${words.length} words.`);
console.log(`The transcript includes ${segments.filter((segment) => segment.kind === 'sponsor').length} sponsored segment.`);
