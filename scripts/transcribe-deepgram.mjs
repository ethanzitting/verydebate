import { execFileSync } from 'node:child_process';
import { createWriteStream, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { once } from 'node:events';

const [audioPath, outputPath, secondsArg = 'all', speedArg = '4'] = process.argv.slice(2);
if (!audioPath || !outputPath) {
  console.error('Usage: node scripts/transcribe-deepgram.mjs AUDIO.mp3 OUTPUT.jsonl [SECONDS|all] [SPEED]');
  process.exit(2);
}

const item = JSON.parse(execFileSync('op', [
  'item', 'get', 'DEEPGRAM_API_KEY', '--vault', 'ai.assistant', '--format=json',
], { encoding: 'utf8' }));
const key = item.fields?.find((field) => field.id === 'notesPlain')?.value?.trim();
if (!key || !/^[a-f0-9]{40}$/i.test(key)) throw new Error('The Deepgram key item has an unexpected value.');

const media = JSON.parse(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', audioPath,
], { encoding: 'utf8' }));
const duration = Number(media.format.duration);
const seconds = secondsArg === 'all' ? duration : Math.min(duration, Number(secondsArg));
const speed = Number(speedArg);
if (!Number.isFinite(seconds) || seconds <= 0 || !Number.isFinite(speed) || speed <= 0) {
  throw new Error('SECONDS and SPEED must be positive numbers.');
}

const audio = readFileSync(audioPath);
const limit = Math.min(audio.length, Math.ceil(audio.length * seconds / duration));
const bytesPerSecond = audio.length / duration;
const chunkSize = 4096;
const delayMs = chunkSize / bytesPerSecond * 1000 / speed;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const params = new URLSearchParams({
  model: 'nova-3',
  language: 'en',
  diarize_model: 'latest',
  interim_results: 'true',
  punctuate: 'true',
  smart_format: 'true',
  endpointing: '300',
});
const url = `wss://api.deepgram.com/v1/listen?${params}`;

mkdirSync(dirname(outputPath), { recursive: true });
const output = createWriteStream(outputPath, { flags: 'w', mode: 0o600 });
const socket = new WebSocket(url, ['token', key]);
let eventCount = 0;
let finalCount = 0;
let gotMetadata = false;
let socketError;

socket.addEventListener('message', (event) => {
  try {
    const message = JSON.parse(String(event.data));
    output.write(`${JSON.stringify(message)}\n`);
    eventCount += 1;
    if (message.type === 'Results' && message.is_final) finalCount += 1;
    if (message.type === 'Metadata') gotMetadata = true;
  } catch (error) {
    socketError = error;
  }
});
socket.addEventListener('error', (event) => {
  socketError = event.error || new Error('The Deepgram WebSocket failed.');
});

await Promise.race([
  once(socket, 'open'),
  once(socket, 'error').then(() => { throw socketError; }),
]);
console.log(`Connected. Sending ${seconds.toFixed(1)} seconds of audio at ${speed}x speed.`);

let nextReport = 30;
for (let offset = 0; offset < limit; offset += chunkSize) {
  if (socketError) throw socketError;
  if (socket.readyState !== WebSocket.OPEN) throw new Error('The Deepgram WebSocket closed before all audio was sent.');
  socket.send(audio.subarray(offset, Math.min(offset + chunkSize, limit)));
  const sentSeconds = Math.min((offset + chunkSize) / bytesPerSecond, seconds);
  if (sentSeconds >= nextReport) {
    console.log(`Sent ${Math.round(sentSeconds)} of ${Math.round(seconds)} audio seconds; ${finalCount} final events.`);
    nextReport += 30;
  }
  while (socket.bufferedAmount > 256_000) await sleep(20);
  await sleep(delayMs);
}

socket.send(JSON.stringify({ type: 'CloseStream' }));
await Promise.race([
  once(socket, 'close'),
  sleep(45_000).then(() => { throw new Error('Deepgram did not close the stream after CloseStream.'); }),
]);
output.end();
await once(output, 'finish');
if (socketError) throw socketError;
if (!gotMetadata) console.warn('No Metadata event arrived. Check the final audio span.');
console.log(`Saved ${eventCount} raw events, including ${finalCount} final Results events, to ${outputPath}.`);
