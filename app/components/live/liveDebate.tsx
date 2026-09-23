'use client';

import { useEffect, useRef, useState } from 'react';
import { displayLines } from './transcript';
import { useLiveTranscription, type LiveStatus } from './useLiveTranscription';

const STATUS_TEXT: Record<LiveStatus, string> = {
  idle: 'Ready to record',
  requesting: 'Waiting for microphone',
  connecting: 'Connecting to transcript service',
  recording: 'Live transcript',
  stopping: 'Finishing transcript',
  error: 'Needs attention',
};

function speakerName(index: number | null): string {
  return index === null ? 'Speaker unknown' : `Speaker ${index + 1}`;
}

function messageClass(index: number | null, count: number): string {
  if (index === null) return 'message message-unknown';
  if (count >= 3 && index === 1) return 'message message-center message-speaker-1';
  return `message ${index % 2 === 0 ? 'message-left' : 'message-right'} message-speaker-${index % 4}`;
}

function timeLabel(timeMs: number): string {
  return new Date(timeMs).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function LiveDebate() {
  const { transcript, status, error, start, stop, clear } = useLiveTranscription();
  const displayed = displayLines(transcript);
  const speakerIndices = new Set<number>();
  for (const line of displayed) {
    if (line.speakerIndex !== null) speakerIndices.add(line.speakerIndex);
  }
  const speakers = [...speakerIndices].sort((a, b) => a - b);
  const scrollRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const [showLatest, setShowLatest] = useState(false);

  const contentKey = `${transcript.lines.length}:${displayed.at(-1)?.previewText ?? ''}`;
  useEffect(() => {
    if (followRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contentKey]);

  const updateFollow = () => {
    const element = scrollRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    followRef.current = distance < 80;
    setShowLatest(!followRef.current);
  };

  const returnToLatest = () => {
    followRef.current = true;
    setShowLatest(false);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const active = status === 'recording';
  const busy = status === 'requesting' || status === 'connecting' || status === 'stopping';
  const canStop = active || status === 'requesting' || status === 'connecting';

  return (
    <main className="live-page">
      <section className="live-app" aria-label="VeryDebate live debate">
        <header className="live-header">
          <div className="live-brand">
            <span className="live-brand-mark">verydebate<span>.</span></span>
            <h1>Live debate</h1>
          </div>
          <div className="live-actions">
            <span className="live-status" role="status">
              <i className={active ? 'status-dot is-live' : 'status-dot'} aria-hidden="true" />
              {STATUS_TEXT[status]}
            </span>
            <button
              type="button"
              className={active ? 'record-button is-recording' : 'record-button'}
              onClick={canStop ? stop : start}
              disabled={status === 'stopping'}
            >
              {canStop ? 'Stop recording' : 'Start recording'}
            </button>
          </div>
        </header>

        <div className="live-body">
          <section className="meaning-stage" aria-label="Meaning stream">
            <div className="meaning-stage-heading">
              <h2>What they likely mean</h2>
              <span>Meaning analysis comes later</span>
            </div>
            <div className="meaning-empty">
              <span className="meaning-empty-rule" aria-hidden="true" />
              <p>No interpretations yet.</p>
              <span>The transcript below shows the speakers&apos; words.</span>
            </div>
          </section>

          <section className="live-transcript" aria-label="Live transcript">
            <div className="live-transcript-heading">
              <div>
                <h2>Transcript</h2>
                <span>
                  {speakers.length > 0
                    ? `${speakers.length} ${speakers.length === 1 ? 'speaker' : 'speakers'} detected`
                    : 'Automatic speech transcript'}
                </span>
              </div>
              <div className="transcript-actions">
                {showLatest && (
                  <button type="button" onClick={returnToLatest}>Return to latest</button>
                )}
                <button
                  type="button"
                  onClick={clear}
                  disabled={displayed.length === 0}
                >
                  Clear transcript
                </button>
              </div>
            </div>

            {error && <p className="live-error" role="alert">{error}</p>}
            <div className="live-scroll" ref={scrollRef} onScroll={updateFollow}>
              <ol className="live-messages" aria-live="polite">
                {displayed.length === 0 && (
                  <li className="transcript-empty">
                    <strong>{busy ? STATUS_TEXT[status] : 'The transcript is empty.'}</strong>
                    <span>Start recording and speak into the microphone.</span>
                  </li>
                )}
                {displayed.map((line) => (
                  <li
                    key={line.id}
                    className={`${messageClass(line.speakerIndex, speakers.length)}${line.text ? '' : ' message-preview'}`}
                  >
                    <div className="message-meta">
                      <strong>{speakerName(line.speakerIndex)}</strong>
                      {line.previewText ? (
                        <span>Live</span>
                      ) : line.timeMs !== null ? (
                        <time dateTime={new Date(line.timeMs).toISOString()}>
                          {timeLabel(line.timeMs)}
                        </time>
                      ) : null}
                    </div>
                    <div className="bubble">
                      {line.text}
                      {line.previewText && (
                        <span className="bubble-preview">
                          {line.text ? ' ' : ''}{line.previewText}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <footer className="live-footer">
          <span>{active ? 'Microphone on' : 'Microphone off'}</span>
          <span>Deepgram transcript · Speaker IDs are automatic</span>
        </footer>
      </section>
    </main>
  );
}
