import { createServer } from 'node:http';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { WebSocketServer, WebSocket } from 'ws';
import { createInterpretationModel } from './interpretation/model.mjs';
import { createInterpretationSession } from './interpretation/session.mjs';

const host = '127.0.0.1';
const appPort = Number(process.env.LIVE_APP_PORT || 3000);
const port = Number(process.env.LIVE_RELAY_PORT || 3001);
const allowedOrigins = new Set([
  `http://localhost:${appPort}`,
  `http://127.0.0.1:${appPort}`,
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
const interpretationModel = createInterpretationModel();

function reject(socket, status, reason) {
  socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
}

server.on('upgrade', (request, socket, head) => {
  if (request.url !== '/live' || !allowedOrigins.has(request.headers.origin)) {
    reject(socket, 403, 'Forbidden');
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

  const interpretation = createInterpretationSession({ model: interpretationModel, send });

  deepgram.on(LiveTranscriptionEvents.Open, () => {
    send({ type: 'Ready' });
    if (!interpretationModel) {
      send({ type: 'InterpretationError', message: 'Add the Grok key to enable meaning cards.' });
    }
  });
  deepgram.on(LiveTranscriptionEvents.Transcript, (result) => {
    const sourceSegments = interpretation.accept(result);
    send(sourceSegments.length > 0
      ? { ...result, source_segments: sourceSegments }
      : result);
  });
  deepgram.on(LiveTranscriptionEvents.UtteranceEnd, (result) => {
    send(result);
    interpretation.endpoint();
  });
  deepgram.on(LiveTranscriptionEvents.Error, () => {
    send({ type: 'Error', message: 'The Deepgram connection failed.' });
    browser.close(1011);
  });
  deepgram.on(LiveTranscriptionEvents.Close, () => {
    void interpretation.finish().finally(() => browser.close(1000));
  });

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
    if (message.type === 'ClearSession') interpretation.reset();
  });

  browser.on('close', () => { interpretation.dispose(); deepgram.disconnect(); });
  browser.on('error', () => { interpretation.dispose(); deepgram.disconnect(); });
});

server.listen(port, host, () => {
  console.log(`Live transcript relay ready at ws://${host}:${port}/live`);
});
