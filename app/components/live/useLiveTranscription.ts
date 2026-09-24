'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { LiveTranscriptionEvent } from '@deepgram/sdk';
import * as v from 'valibot';
import { interpretationMessageSchema } from '@/scripts/interpretation/schema.mjs';
import {
  initialTranscriptState,
  reduceTranscript,
} from '@/app/components/live/transcript';

export type LiveStatus =
  | 'idle'
  | 'requesting'
  | 'connecting'
  | 'recording'
  | 'stopping'
  | 'error';

export type InterpretationCard = v.InferOutput<typeof interpretationMessageSchema>['card'];

type LiveSession = {
  stream: MediaStream;
  recorder: MediaRecorder;
  connection: WebSocket;
  sendQueue: Promise<void>;
  closeTimer: ReturnType<typeof setTimeout> | null;
  stopping: boolean;
  disposed: boolean;
};

function errorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return 'Microphone access was denied. Allow access in the browser, then try again.';
    }
    if (error.name === 'NotFoundError') return 'No microphone was found.';
  }
  return error instanceof Error ? error.message : 'The live transcript could not start.';
}

export function useLiveTranscription() {
  const [transcript, dispatch] = useReducer(
    reduceTranscript,
    initialTranscriptState,
  );
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);
  const [interpretations, setInterpretations] = useState<InterpretationCard[]>([]);
  const statusRef = useRef<LiveStatus>('idle');
  const attemptRef = useRef(0);
  const sessionRef = useRef<LiveSession | null>(null);

  const setStage = useCallback((nextStatus: LiveStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const disposeSession = useCallback(
    (session: LiveSession, nextStatus: LiveStatus, message?: string) => {
      if (session.disposed) return;
      session.disposed = true;
      if (session.closeTimer) clearTimeout(session.closeTimer);
      if (session.recorder.state !== 'inactive') session.recorder.stop();
      session.stream.getTracks().forEach((track) => track.stop());
      session.connection.close();
      if (sessionRef.current === session) sessionRef.current = null;
      dispatch({ type: 'flush', nowMs: Date.now() });
      setError(message ?? null);
      setStage(nextStatus);
    },
    [setStage],
  );

  const start = useCallback(async () => {
    if (
      statusRef.current === 'requesting' ||
      statusRef.current === 'connecting' ||
      statusRef.current === 'recording' ||
      statusRef.current === 'stopping'
    ) {
      return;
    }

    const attempt = ++attemptRef.current;
    let stream: MediaStream | null = null;
    setError(null);
    setStage('requesting');

    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        throw new Error('This browser cannot record microphone audio.');
      }
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (attempt !== attemptRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      setStage('connecting');
      const recorder = new MediaRecorder(stream);
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const relayPort = process.env.NEXT_PUBLIC_LIVE_RELAY_PORT || '3001';
      const connection = new WebSocket(`${protocol}//${window.location.hostname}:${relayPort}/live`);

      const session: LiveSession = {
        stream,
        recorder,
        connection,
        sendQueue: Promise.resolve(),
        closeTimer: null,
        stopping: false,
        disposed: false,
      };
      sessionRef.current = session;

      recorder.addEventListener('dataavailable', (event) => {
        if (session.disposed || event.data.size === 0) return;
        const blob = event.data;
        session.sendQueue = session.sendQueue.then(async () => {
          const audio = await blob.arrayBuffer();
          if (!session.disposed && connection.readyState === WebSocket.OPEN) {
            connection.send(audio);
          }
        }).catch(() => {
          disposeSession(session, 'error', 'The browser could not send microphone audio.');
        });
      });

      recorder.addEventListener('stop', () => {
        if (session.disposed || !session.stopping) return;
        void session.sendQueue.then(() => {
          if (session.disposed || connection.readyState !== WebSocket.OPEN) {
            disposeSession(session, 'idle');
            return;
          }
          connection.send(JSON.stringify({ type: 'Finalize' }));
          session.closeTimer = setTimeout(() => {
            if (session.disposed) return;
            connection.send(JSON.stringify({ type: 'CloseStream' }));
            session.closeTimer = setTimeout(() => {
              if (!session.disposed) disposeSession(session, 'idle');
            }, 24000);
          }, 2000);
        }).catch(() => {
          disposeSession(session, 'error', 'The browser could not finish the audio stream.');
        });
      });

      recorder.addEventListener('error', () => {
        disposeSession(session, 'error', 'The microphone stopped unexpectedly.');
      });

      connection.addEventListener('message', (event) => {
        if (session.disposed) return;
        let message: { type?: string; message?: string };
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }
        if (message.type === 'Ready') {
          if (session.stopping) {
            connection.send(JSON.stringify({ type: 'CloseStream' }));
            return;
          }
          recorder.start(250);
          setStage('recording');
        } else if (message.type === 'Results') {
          dispatch({ type: 'result', result: message as LiveTranscriptionEvent, nowMs: Date.now() });
        } else if (message.type === 'UtteranceEnd') {
          dispatch({ type: 'flush', nowMs: Date.now() });
        } else if (message.type === 'InterpretationUpsert') {
          const checked = v.safeParse(interpretationMessageSchema, message);
          if (checked.success) {
            const card = checked.output.card;
            setInterpretations((current) => {
              const index = current.findIndex((item) => item.id === card.id);
              if (index < 0) return [...current, card];
              return current.map((item) => item.id === card.id ? card : item);
            });
            setInterpretationError(null);
          }
        } else if (message.type === 'InterpretationError') {
          setInterpretationError(message.message ?? 'The meaning service is not available.');
        } else if (message.type === 'Error') {
          disposeSession(session, 'error', message.message ?? 'The Deepgram connection failed.');
        }
      });
      connection.addEventListener('error', () => {
        disposeSession(session, 'error', 'The live transcript relay failed.');
      });
      connection.addEventListener('close', () => {
        if (!session.disposed) {
          disposeSession(
            session,
            session.stopping ? 'idle' : 'error',
            session.stopping ? undefined : 'The live transcript connection closed.',
          );
        }
      });
    } catch (cause) {
      stream?.getTracks().forEach((track) => track.stop());
      if (attempt !== attemptRef.current) return;
      setError(errorMessage(cause));
      setStage('error');
    }
  }, [disposeSession, setStage]);

  const stop = useCallback(() => {
    if (statusRef.current === 'requesting' || (statusRef.current === 'connecting' && !sessionRef.current)) {
      attemptRef.current += 1;
      setStage('idle');
      return;
    }

    const session = sessionRef.current;
    if (!session || session.disposed || session.stopping) return;
    session.stopping = true;
    setStage('stopping');
    session.stream.getTracks().forEach((track) => track.stop());
    if (session.recorder.state !== 'inactive') {
      session.recorder.stop();
    } else if (session.connection.readyState === WebSocket.OPEN) {
      session.connection.send(JSON.stringify({ type: 'CloseStream' }));
    } else {
      disposeSession(session, 'idle');
    }
  }, [disposeSession, setStage]);

  useEffect(() => {
    return () => {
      attemptRef.current += 1;
      const session = sessionRef.current;
      if (!session) return;
      session.disposed = true;
      if (session.closeTimer) clearTimeout(session.closeTimer);
      if (session.recorder.state !== 'inactive') session.recorder.stop();
      session.stream.getTracks().forEach((track) => track.stop());
      session.connection.close();
    };
  }, []);

  return {
    transcript,
    interpretations,
    interpretationError,
    status,
    error,
    start,
    stop,
    clear: () => {
      if (sessionRef.current?.connection.readyState === WebSocket.OPEN) {
        sessionRef.current.connection.send(JSON.stringify({ type: 'ClearSession' }));
      }
      dispatch({ type: 'clear' });
      setInterpretations([]);
      setInterpretationError(null);
    },
  };
}
