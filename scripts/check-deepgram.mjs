import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

function canOpenLiveConnection(apiKey) {
  return new Promise((resolve) => {
    const connection = createClient(apiKey).listen.live({ model: 'nova-3' });
    let settled = false;
    const timer = setTimeout(() => finish(false), 8000);

    function finish(opened) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      connection.disconnect();
      resolve(opened);
    }

    connection.on(LiveTranscriptionEvents.Open, () => finish(true));
    connection.on(LiveTranscriptionEvents.Error, () => finish(false));
    connection.on(LiveTranscriptionEvents.Close, () => finish(false));
  });
}

const apiKey = process.env.DEEPGRAM_API_KEY;
if (!apiKey) {
  console.error('1Password did not provide DEEPGRAM_API_KEY.');
  process.exitCode = 1;
} else {
  try {
    const canStream = await canOpenLiveConnection(apiKey);
    if (!canStream) {
      console.error('Deepgram rejected the 1Password key for live transcription.');
      process.exitCode = 1;
    } else {
      console.log('Deepgram accepted the 1Password key for live transcription.');
    }
  } catch {
    console.error('The Deepgram token check failed.');
    process.exitCode = 1;
  }
}
