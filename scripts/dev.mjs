import { spawn } from 'node:child_process';

const appPort = process.env.LIVE_APP_PORT || '3000';
const relayPort = process.env.LIVE_RELAY_PORT || '3001';
const nextEnv = { ...process.env };
delete nextEnv.XAI_API_KEY;
nextEnv.NEXT_PUBLIC_LIVE_RELAY_PORT = relayPort;

const children = [
  spawn('./node_modules/.bin/next', ['dev', '--turbopack', '--hostname', '127.0.0.1', '--port', appPort], {
    stdio: 'inherit',
    env: nextEnv,
  }),
  spawn(process.execPath, ['scripts/live-proxy.mjs'], { stdio: 'inherit' }),
];

let stopping = false;
function stop(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill(signal);
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error.message);
    stop();
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    if (!stopping) {
      stop();
      process.exitCode = code || 1;
    }
  });
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
