# Debate display: current decisions and next tests

This document records decisions after the long three-person debate review.
The page is a static replay demo. This plan does not require live processing.

## Changes in this pass

- A current card can use an empty adjacent lane. Older two-card rows also use the empty lane.
- Each speaker keeps a stable side of the row. Separate cards keep a visible gap.
- The middle card stops before either outside edge, even when an outside lane is empty.
- Left and right cards stop before the center. Lone outside cards grow to that limit in current and older rows.
- A lone middle card grows around the center in both current and older rows.
- Each current card shows a small speaker name. The page does not add large speaker headers.
- Selected topic headings ask a neutral central question. The question helps viewers see the disagreement.

## Display refinements

- The transcript opens below the selected card. The page moves the card into view when needed.
- The closed transcript shows a clear label. It does not show a broken speech fragment.
- A top fade shows that earlier meanings remain above the visible area.
- Older paired cards use a small vertical offset to show speech order.
- Shorter sentences help viewers read several science cards from a distance.

## Meaning text rules

- Give a new claim or question a new card. Revise a card only when speech changes the same point.
- Keep earlier points in the list when the speaker moves to a related point.
- Keep a speaker's uncertainty and limits. Do not turn a report of other people's views into that speaker's belief.
- Show an important spoken concession when the speaker makes it, even if a longer explanation follows later.

## Direct questions and broader answers

The page must keep a direct question distinct from the other speaker's belief.
If a speaker gives a broader answer, the page must show that answer as spoken.
The page must not make the broader answer look like a direct answer to a specific rule question.

For example, Konstantin asks who can qualify for a female shortlist under the current rule.
Neil discusses how to remove the need for such shortlists.
Both items can stay visible together. The page does not label Neil's answer as an evasion.
It also does not add the sentence, “I am not giving a direct rule,” to Neil's belief.
Neil did not say those words.
The question remains a separate card after Konstantin makes a later point about present costs.

The static demo shows this pair at `live-stage.html?debate=science&moment=shortlist`.

If Konstantin explicitly says that the question remains unanswered, the page can show a short temporary note beside his question.
It must link the note to his speech. Silence does not show agreement or rejection.

## Future test: attached reflection

After one speaker explicitly restates another speaker's view, the page can attach a small reflection to the target card.
The reflection must identify the speaker who made the restatement.
It must link to the exact transcript lines that support it.

If the target speaker explicitly accepts, corrects, or rejects the restatement, the page can update the reflection.
Silence must not count as acceptance.
The reflection can leave the current view after a short time, but viewers can find its source in the transcript.
The speakers do not need to click, label, or pause.

Test this with the explicit restatement near 44:14 in the science debate.
Do not show a reflection when the speech is too weak to support one.

## Later work

- Test separate stage and operator presets only if the change stays small.
- Keep all transcript evidence that contributes to a meaning. Do not reduce this evidence only to make a shorter filter.
- Let speakers correct their names by speech in a future product. The static demo does not need this.
- Update a meaning when speech changes it. Do not update it only because time passes.
