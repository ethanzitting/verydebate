import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';

const [audioPath, outputPath] = process.argv.slice(2);
if (!audioPath || !outputPath) {
  console.error('Usage: node scripts/transcribe-deepgram-batch.mjs AUDIO.mp3 OUTPUT.json');
  process.exit(2);
}

const item = JSON.parse(execFileSync('op', [
  'item', 'get', 'DEEPGRAM_API_KEY', '--vault', 'ai.assistant', '--format=json',
], { encoding: 'utf8' }));
const key = item.fields?.find((field) => field.id === 'notesPlain')?.value?.trim();
if (!key || !/^[a-f0-9]{40}$/i.test(key)) throw new Error('The Deepgram key item has an unexpected value.');

const params = new URLSearchParams({
  model: 'nova-3',
  language: 'en',
  diarize_model: 'latest',
  utterances: 'true',
  punctuate: 'true',
  smart_format: 'true',
});
const audio = readFileSync(audioPath);
console.log(`Sending ${(audio.length / 1_000_000).toFixed(1)} MB to Deepgram.`);
const response = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
  method: 'POST',
  headers: { Authorization: `Token ${key}`, 'Content-Type': 'audio/mpeg' },
  body: audio,
  signal: AbortSignal.timeout(600_000),
});
const body = await response.text();
if (!response.ok) throw new Error(`Deepgram returned HTTP ${response.status}: ${body.slice(0, 500)}`);
const result = JSON.parse(body);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(result)}\n`, { mode: 0o600 });
chmodSync(outputPath, 0o600);
console.log(`Saved ${result.results?.utterances?.length ?? 0} utterances to ${outputPath}.`);
