import { createServer } from 'node:http';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { WebSocketServer, WebSocket } from 'ws';

const host = '127.0.0.1';
const port = 3001;
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

if (!process.env.DEEPGRAM_API_KEY) {
  console.error('1Password did not provide DEEPGRAM_API_KEY.');
  process.exit(1);
}

const server = createServer((_request, response) => {
  response.writeHead(404);
  response.end();
});
const sockets = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024 });

function reject(socket, status, reason) {
  socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
}

server.on('upgrade', async (request, socket, head) => {
  if (request.url !== '/live' || !allowedOrigins.has(request.headers.origin)) {
    reject(socket, 403, 'Forbidden');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:3000/api/auth', {
      headers: { cookie: request.headers.cookie ?? '' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok || !(await response.json()).authenticated) {
      reject(socket, 401, 'Unauthorized');
      return;
    }
  } catch {
    reject(socket, 503, 'Service Unavailable');
    return;
  }

  sockets.handleUpgrade(request, socket, head, (client) => {
    sockets.emit('connection', client, request);
  });
});

sockets.on('connection', (browser) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY).listen.live({
    model: 'nova-3',
    language: 'en',
    smart_format: true,
    interim_results: true,
    diarize: true,
    endpointing: 300,
    utterance_end_ms: 1000,
    vad_events: true,
  });

  function send(message) {
    if (browser.readyState === WebSocket.OPEN) {
      browser.send(JSON.stringify(message));
    }
  }

  deepgram.on(LiveTranscriptionEvents.Open, () => send({ type: 'Ready' }));
  deepgram.on(LiveTranscriptionEvents.Transcript, (result) => send(result));
  deepgram.on(LiveTranscriptionEvents.UtteranceEnd, (result) => send(result));
  deepgram.on(LiveTranscriptionEvents.Error, () => {
    send({ type: 'Error', message: 'The Deepgram connection failed.' });
    browser.close(1011);
  });
  deepgram.on(LiveTranscriptionEvents.Close, () => browser.close(1000));

  browser.on('message', (data, isBinary) => {
    if (isBinary) {
      if (deepgram.getReadyState() === WebSocket.OPEN) deepgram.send(data);
      return;
    }
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch {
      browser.close(1003);
      return;
    }
    if (message.type === 'Finalize') deepgram.finalize();
    if (message.type === 'CloseStream') deepgram.requestClose();
  });

  browser.on('close', () => deepgram.disconnect());
  browser.on('error', () => deepgram.disconnect());
});

server.listen(port, host, () => {
  console.log(`Live transcript relay ready at ws://${host}:${port}/live`);
});
