import * as v from 'valibot';

export const interpretationDecisionSchema = v.strictObject({
  action: v.picklist(['none', 'create', 'revise']),
  targetCardId: v.nullable(v.pipe(v.string(), v.maxLength(64))),
  speakerIndex: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0))),
  kind: v.picklist(['claim', 'question', 'report', 'concession']),
  text: v.pipe(v.string(), v.maxLength(400)),
  sourceIds: v.pipe(v.array(v.pipe(v.string(), v.maxLength(64))), v.maxLength(12)),
});

export const interpretationCardSchema = v.strictObject({
  id: v.pipe(v.string(), v.maxLength(64)),
  speakerIndex: v.pipe(v.number(), v.integer(), v.minValue(0)),
  kind: v.picklist(['claim', 'question', 'report', 'concession']),
  text: v.pipe(v.string(), v.minLength(1), v.maxLength(400)),
  sourceIds: v.pipe(v.array(v.pipe(v.string(), v.minLength(1), v.maxLength(64))), v.minLength(1), v.maxLength(12)),
  revisedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const interpretationMessageSchema = v.strictObject({
  type: v.literal('InterpretationUpsert'),
  card: interpretationCardSchema,
});
