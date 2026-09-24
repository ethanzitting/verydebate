import { afterEach, describe, expect, it, vi } from 'vitest';
import * as v from 'valibot';
import { interpretationDecisionSchema } from './schema.mjs';
import { createInterpretationSession } from './session.mjs';

function result(text, speaker = 0, speechFinal = true) {
  return {
    is_final: true,
    speech_final: speechFinal,
    channel: { alternatives: [{ words: text.split(' ').map((word) => ({ word, punctuated_word: word, speaker })) }] },
  };
}

afterEach(() => vi.useRealTimers());

describe('interpretation session', () => {
  it('waits for final transcript words and sends a valid card', async () => {
    vi.useFakeTimers();
    const send = vi.fn();
    const model = vi.fn(async () => ({
      action: 'create', targetCardId: null, speakerIndex: 0, kind: 'claim',
      text: 'The speaker supports the proposal.', sourceIds: ['segment-1'],
    }));
    const session = createInterpretationSession({ model, send, now: () => Date.now() });
    session.accept({ ...result('I support the proposal'), is_final: false });
    expect(model).not.toHaveBeenCalled();
    session.accept(result('I support the proposal because the cost is lower'));
    await vi.advanceTimersByTimeAsync(1200);
    expect(model).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledWith({
      type: 'InterpretationUpsert',
      card: expect.objectContaining({ id: 'card-1', text: 'The speaker supports the proposal.', sourceIds: ['segment-1'] }),
    });
    session.dispose();
  });

  it('rejects malformed JSON and sources from another speaker', async () => {
    const send = vi.fn();
    const model = vi.fn()
      .mockResolvedValueOnce({ action: 'create', targetCardId: null, speakerIndex: 0, kind: 'claim', text: 'Bad', sourceIds: ['segment-1'], extra: true })
      .mockResolvedValueOnce({ action: 'create', targetCardId: null, speakerIndex: 1, kind: 'claim', text: 'Wrong speaker', sourceIds: ['segment-1'] });
    const session = createInterpretationSession({ model, send });
    session.accept(result('One two three four five six', 0));
    await session.finish();
    expect(send).not.toHaveBeenCalled();

    const second = createInterpretationSession({ model, send });
    second.accept(result('One two three four five six', 0));
    second.accept(result('Seven eight nine ten eleven twelve', 1));
    await second.finish();
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects extra properties at the Valibot boundary', () => {
    expect(v.safeParse(interpretationDecisionSchema, {
      action: 'none', targetCardId: null, speakerIndex: null,
      kind: 'claim', text: '', sourceIds: [], unsafe: 'data',
    }).success).toBe(false);
  });

  it('revises the same card and keeps transcript sources', async () => {
    vi.useFakeTimers();
    const send = vi.fn();
    const model = vi.fn()
      .mockResolvedValueOnce({ action: 'create', targetCardId: null, speakerIndex: 0, kind: 'claim', text: 'The speaker supports the proposal.', sourceIds: ['segment-1'] })
      .mockResolvedValueOnce({ action: 'revise', targetCardId: 'card-1', speakerIndex: 0, kind: 'claim', text: 'The speaker supports the proposal if its cost falls.', sourceIds: ['segment-2'] });
    const session = createInterpretationSession({ model, send, now: () => Date.now() });
    session.accept(result('One two three four five six', 0));
    await vi.advanceTimersByTimeAsync(1200);
    session.accept(result('Seven eight nine ten eleven twelve', 0));
    await session.finish();
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].card).toMatchObject({
      id: 'card-1',
      text: 'The speaker supports the proposal if its cost falls.',
      sourceIds: ['segment-1', 'segment-2'],
    });
  });

  it('does not send a result from a session before a clear', async () => {
    let resolve;
    const send = vi.fn();
    const model = () => new Promise((done) => { resolve = done; });
    const session = createInterpretationSession({ model, send });
    session.accept(result('One two three four five six'));
    const ending = session.finish();
    await Promise.resolve();
    session.reset();
    resolve({ action: 'create', targetCardId: null, speakerIndex: 0, kind: 'claim', text: 'Old', sourceIds: ['segment-1'] });
    await ending;
    expect(send).not.toHaveBeenCalled();
  });
});
