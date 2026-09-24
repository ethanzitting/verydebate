import { createXai } from '@ai-sdk/xai';
import { valibotSchema } from '@ai-sdk/valibot';
import { generateText, Output } from 'ai';
import * as v from 'valibot';
import { interpretationDecisionSchema } from './schema.mjs';

// Keep the provider and model choice in one place.
export const INTERPRETATION_MODEL = 'grok-4.20-0309-non-reasoning';

const system = `You describe what a speaker appears to mean in a live debate.
Use only the supplied final transcript segments. Never add facts, reasons, intentions, or certainty.
Preserve uncertainty, negation, and whether a speaker reports another person's view.
Choose "none" if there is no clear complete thought yet.
Choose "revise" only when new words change or extend the same point on an existing card.
Choose "create" for a new point. A new question is a new point.
Keep text short and plain. Do not evaluate truth or take a side.
For create or revise, give the IDs of the transcript segments that support the full text.
Use a numeric speakerIndex from those segments. Never infer a speaker from context.
For none, use null targetCardId and speakerIndex, empty text, and no sourceIds.
For create, use null targetCardId. For revise, use an existing card ID.`;

export function createInterpretationModel(apiKey = process.env.XAI_API_KEY) {
  if (!apiKey) return null;
  const xai = createXai({ apiKey });

  return async ({ segments, cards, pendingIds }) => {
    const { output } = await generateText({
      model: xai(INTERPRETATION_MODEL),
      system,
      prompt: JSON.stringify({
        transcriptSegments: segments,
        existingCards: cards,
        newSegmentIds: pendingIds,
      }),
      output: Output.object({ schema: valibotSchema(interpretationDecisionSchema) }),
      maxOutputTokens: 300,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(9000),
    });

    // The SDK checks its output. This explicit check guards the relay boundary too.
    const checked = v.safeParse(interpretationDecisionSchema, output);
    if (!checked.success) throw new Error('The interpretation failed validation.');
    return checked.output;
  };
}
