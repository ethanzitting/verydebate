import { spawn } from 'node:child_process';

const children = [
  spawn('./node_modules/.bin/next', ['dev', '--turbopack', '--hostname', '127.0.0.1'], {
    stdio: 'inherit',
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
