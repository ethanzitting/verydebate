import * as v from 'valibot';
import { interpretationDecisionSchema, interpretationMessageSchema } from './schema.mjs';

function segmentsFromResult(result, nextId) {
  const alternative = result.channel?.alternatives?.[0];
  if (!alternative) return [];
  const words = alternative.words?.length
    ? alternative.words.map((word) => ({
        text: (word.punctuated_word || word.word || '').trim(),
        speakerIndex: Number.isInteger(word.speaker) ? word.speaker : null,
      })).filter((word) => word.text)
    : [{ text: alternative.transcript?.trim() ?? '', speakerIndex: null }];

  const groups = [];
  for (const word of words) {
    if (!word.text) continue;
    const last = groups.at(-1);
    if (last?.speakerIndex === word.speakerIndex) {
      last.text += ` ${word.text}`;
      last.wordCount += 1;
    } else {
      groups.push({ id: nextId(), speakerIndex: word.speakerIndex, text: word.text, wordCount: 1 });
    }
  }
  return groups;
}

export function createInterpretationSession({ model, send, now = Date.now, delay = setTimeout, cancel = clearTimeout }) {
  let segments = [];
  let cards = [];
  let nextSegment = 0;
  let nextCard = 0;
  let analyzedCount = 0;
  let lastCallAt = null;
  let generation = 0;
  let timer = null;
  let inFlight = null;
  let closed = false;

  const pending = () => segments.slice(analyzedCount);
  const pendingWordCount = () => pending().reduce((sum, segment) => sum + segment.wordCount, 0);

  function applyDecision(raw, window, newIds) {
    // Models in tests and future providers must pass the same validation boundary.
    const checked = v.safeParse(interpretationDecisionSchema, raw);
    if (!checked.success) return;
    const decision = checked.output;
    if (decision.action === 'none') return;

    const sources = decision.sourceIds.map((id) => window.find((segment) => segment.id === id));
    if (!decision.text.trim() || sources.length === 0 || sources.some((source) => !source)) return;
    if (!sources.some((source) => newIds.includes(source.id))) return;
    if (decision.speakerIndex === null || sources.some((source) => source.speakerIndex !== decision.speakerIndex)) return;

    let card;
    if (decision.action === 'revise') {
      const existing = cards.find((item) => item.id === decision.targetCardId);
      if (!existing || existing.speakerIndex !== decision.speakerIndex) return;
      card = {
        ...existing,
        kind: decision.kind,
        text: decision.text.trim(),
        sourceIds: [...new Set([...existing.sourceIds, ...decision.sourceIds])].slice(-12),
        revisedAt: now(),
      };
      cards = cards.map((item) => item.id === card.id ? card : item);
    } else {
      if (decision.targetCardId !== null) return;
      card = { id: `card-${++nextCard}`, speakerIndex: decision.speakerIndex, kind: decision.kind, text: decision.text.trim(), sourceIds: [...new Set(decision.sourceIds)], revisedAt: now() };
      cards.push(card);
    }
    const message = { type: 'InterpretationUpsert', card };
    const validated = v.safeParse(interpretationMessageSchema, message);
    if (validated.success) send(validated.output);
  }

  function run(force = false) {
    if (!model || inFlight || (!force && pendingWordCount() < 6) || pending().length === 0) return inFlight ?? Promise.resolve();
    if (timer !== null) { cancel(timer); timer = null; }
    const end = segments.length;
    const runGeneration = generation;
    const window = segments.slice(Math.max(0, end - 50), end);
    const newIds = segments.slice(analyzedCount, end).map((segment) => segment.id);
    const input = {
      segments: window.map(({ id, speakerIndex, text }) => ({ id, speakerIndex, text })),
      cards: cards.slice(-8).map(({ id, speakerIndex, kind, text }) => ({ id, speakerIndex, kind, text })),
      pendingIds: newIds,
    };
    analyzedCount = end;
    lastCallAt = now();
    inFlight = Promise.resolve().then(() => model(input)).then((decision) => {
      if (runGeneration === generation) applyDecision(decision, window, newIds);
    }).catch(() => {
      if (runGeneration === generation) {
        send({ type: 'InterpretationError', message: 'The meaning service could not make a card.' });
      }
    }).finally(() => {
      inFlight = null;
      if (!closed && pendingWordCount() >= 6) schedule(false);
    });
    return inFlight;
  }

  function schedule(endpoint) {
    if (!model || inFlight || timer !== null) return;
    const count = pendingWordCount();
    if (count < 14 && (!endpoint || count < 6)) return;
    const wait = lastCallAt === null
      ? (endpoint ? 1200 : 500)
      : Math.max(endpoint ? 1200 : 500, 6000 - (now() - lastCallAt));
    timer = delay(() => { timer = null; void run(); }, wait);
  }

  return {
    accept(result) {
      if (closed || !result?.is_final) return [];
      const next = segmentsFromResult(result, () => `segment-${++nextSegment}`);
      if (next.length === 0) return [];
      segments.push(...next);
      if (segments.length > 120) {
        const excess = segments.length - 120;
        segments = segments.slice(excess);
        analyzedCount = Math.max(0, analyzedCount - excess);
      }
      schedule(Boolean(result.speech_final));
      return next.map(({ id, speakerIndex, text }) => ({ id, speakerIndex, text }));
    },
    endpoint() { if (!closed) schedule(true); },
    reset() {
      generation += 1;
      if (timer !== null) { cancel(timer); timer = null; }
      segments = [];
      cards = [];
      analyzedCount = 0;
      lastCallAt = null;
    },
    async finish() {
      closed = true;
      if (timer !== null) { cancel(timer); timer = null; }
      if (inFlight) await inFlight;
      if (pendingWordCount() >= 3) await run(true);
    },
    dispose() {
      closed = true;
      if (timer !== null) cancel(timer);
    },
  };
}
