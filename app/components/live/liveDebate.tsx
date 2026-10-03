'use client';

import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { displayLines } from './transcript';
import { useLiveTranscription, type LiveStatus } from './useLiveTranscription';

const STATUS_TEXT: Record<LiveStatus, string> = {
  idle: 'Ready to record',
  requesting: 'Waiting for microphone',
  connecting: 'Connecting to transcript service',
  recording: 'Live transcript',
  stopping: 'Finishing transcript and interpretation',
  error: 'Needs attention',
};

const KIND_TEXT = {
  claim: 'Claim',
  question: 'Question',
  report: 'Reported view',
  concession: 'Concession',
} as const;

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
  const { transcript, interpretations, interpretationError, status, error, start, stop, clear } = useLiveTranscription();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCard = interpretations.find((card) => card.id === selectedCardId) ?? null;
  const allDisplayed = displayLines(transcript);
  const selectedSources = new Set(selectedCard?.sourceIds ?? []);
  const displayed = selectedCard
    ? displayLines({
        ...transcript,
        lines: transcript.lines.filter((line) => line.sourceIds.some((id) => selectedSources.has(id))),
        bufferedWords: [],
        interimWords: [],
      })
    : allDisplayed;
  const speakerIndices = new Set<number>();
  for (const line of allDisplayed) {
    if (line.speakerIndex !== null) speakerIndices.add(line.speakerIndex);
  }
  const speakers = [...speakerIndices].sort((a, b) => a - b);
  const scrollRef = useRef<HTMLDivElement>(null);
  const meaningScrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const dragRef = useRef<{ startY: number; startHeight: number; moved: boolean } | null>(null);
  const ignoreGripClickRef = useRef(false);
  const [showLatest, setShowLatest] = useState(false);
  const [transcriptHeight, setTranscriptHeight] = useState(82);

  const contentKey = `${transcript.lines.length}:${displayed.at(-1)?.previewText ?? ''}`;
  useEffect(() => {
    if (followRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contentKey]);

  const meaningKey = `${interpretations.length}:${interpretations.at(-1)?.revisedAt ?? 0}`;
  useEffect(() => {
    if (meaningScrollRef.current) {
      meaningScrollRef.current.scrollTop = meaningScrollRef.current.scrollHeight;
    }
  }, [meaningKey]);

  useEffect(() => {
    if (selectedCardId && !interpretations.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(null);
    }
  }, [interpretations, selectedCardId]);

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

  const maximumTranscriptHeight = () => Math.max(220, (bodyRef.current?.clientHeight ?? 600) * 0.78);
  const changeTranscriptHeight = (height: number) => {
    const next = Math.max(82, Math.min(Math.round(height), maximumTranscriptHeight()));
    setTranscriptHeight(next <= 116 ? 82 : next);
  };
  const openTranscript = () => {
    const bodyHeight = bodyRef.current?.clientHeight ?? 600;
    changeTranscriptHeight(Math.max(260, bodyHeight * 0.42));
  };
  const toggleTranscript = () => {
    if (transcriptHeight > 116) setTranscriptHeight(82);
    else openTranscript();
  };
  const handleGripPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragRef.current = { startY: event.clientY, startHeight: transcriptHeight, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleGripPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const distance = drag.startY - event.clientY;
    if (Math.abs(distance) > 4) drag.moved = true;
    if (drag.moved) changeTranscriptHeight(drag.startHeight + distance);
  };
  const handleGripPointerEnd = () => {
    ignoreGripClickRef.current = Boolean(dragRef.current?.moved);
    dragRef.current = null;
  };
  const handleGripClick = () => {
    if (ignoreGripClickRef.current) {
      ignoreGripClickRef.current = false;
      return;
    }
    toggleTranscript();
  };
  const handleGripKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    changeTranscriptHeight(transcriptHeight + (event.key === 'ArrowUp' ? 80 : -80));
  };
  const selectMeaning = (cardId: string) => {
    const willSelect = selectedCardId !== cardId;
    setSelectedCardId(willSelect ? cardId : null);
    if (willSelect && transcriptHeight <= 116) openTranscript();
  };
  const clearTranscript = () => {
    setSelectedCardId(null);
    clear();
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
          <nav className="live-demo-nav" aria-label="Conversation mode">
            <Link className="is-current" href="/" aria-current="page">Live</Link>
            <a href="/demos/live-stage.html?debate=science">Science demo</a>
            <a href="/demos/live-stage.html?debate=abortion">Abortion demo</a>
          </nav>
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

        <div className="live-body" ref={bodyRef}>
          <section className="meaning-stage" aria-label="Meaning stream">
            <div className="meaning-stage-heading">
              <h2>What they likely mean</h2>
              <span>Live interpretation · Not a quote</span>
            </div>
            <div className="meaning-scroll" ref={meaningScrollRef}>
              {interpretations.length === 0 ? (
                <div className="meaning-empty">
                  <span className="meaning-empty-rule" aria-hidden="true" />
                  <p>{active ? 'Listening for a complete point.' : 'No interpretations yet.'}</p>
                  <span>The transcript below shows the speakers&apos; words.</span>
                </div>
              ) : (
                <ol className="meaning-cards" aria-live="polite">
                  {interpretations.map((card, index) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        className={`meaning-card meaning-speaker-${card.speakerIndex % 4}${selectedCardId === card.id ? ' is-selected' : ''}`}
                        aria-pressed={selectedCardId === card.id}
                        onClick={() => selectMeaning(card.id)}
                      >
                        <span className="meaning-card-meta">
                          <span>{index === interpretations.length - 1 ? 'Current thought' : 'Earlier point'}</span>
                          <span>{speakerName(card.speakerIndex)} · {KIND_TEXT[card.kind]}</span>
                        </span>
                        <span className="meaning-card-text">{card.text}</span>
                        <span className="meaning-card-source">
                          {selectedCardId === card.id ? 'Showing source transcript' : 'Show source transcript'}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}
              {interpretationError && <p className="meaning-error" role="status">{interpretationError}</p>}
            </div>
          </section>

          <section
            className={`live-transcript${transcriptHeight <= 116 ? ' is-collapsed' : ''}${selectedCard ? ' has-filter' : ''}`}
            aria-label="Live transcript"
            style={{ '--transcript-height': `${transcriptHeight}px` } as CSSProperties}
          >
            <button
              type="button"
              className="live-transcript-grip"
              aria-expanded={transcriptHeight > 116}
              aria-label={transcriptHeight > 116 ? 'Drag down or select to close the transcript' : 'Drag up or select to open the transcript'}
              onPointerDown={handleGripPointerDown}
              onPointerMove={handleGripPointerMove}
              onPointerUp={handleGripPointerEnd}
              onPointerCancel={handleGripPointerEnd}
              onClick={handleGripClick}
              onKeyDown={handleGripKeyDown}
            >
              <span aria-hidden="true" />
            </button>
            <div className="live-transcript-heading">
              <div>
                <h2>Transcript</h2>
                <span>
                  {selectedCard
                    ? `Speech behind ${speakerName(selectedCard.speakerIndex)}’s meaning`
                    : speakers.length > 0
                    ? `${speakers.length} ${speakers.length === 1 ? 'speaker' : 'speakers'} detected`
                    : 'Automatic speech transcript'}
                </span>
              </div>
              <div className="transcript-actions">
                {selectedCard && (
                  <button type="button" onClick={() => setSelectedCardId(null)}>Show all speech</button>
                )}
                {showLatest && (
                  <button type="button" onClick={returnToLatest}>Return to latest</button>
                )}
                <button
                  type="button"
                  onClick={clearTranscript}
                  disabled={allDisplayed.length === 0}
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
                    <strong>{selectedCard ? 'No linked transcript is available.' : busy ? STATUS_TEXT[status] : 'The transcript is empty.'}</strong>
                    <span>{selectedCard ? 'Show all speech, or select another meaning.' : 'Start recording and speak into the microphone.'}</span>
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
