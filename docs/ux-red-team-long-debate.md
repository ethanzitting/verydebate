# Red-team review: long three-person debate

The decisions after this review are in [the next-pass plan](ux-next-pass.md). This report keeps the original review points.

## Scope

This review uses the 77-minute discussion with Neil, Konstantin, and Francis.

The source has 483 speech segments and 33 uncertain speaker segments. The prototype has 30 meaning cards and 49 card versions.

Neil has 16 final cards. Konstantin and Francis each have seven final cards.

The average final card has 21 words. A final card uses nine transcript segments on average.

## Verdict

The interface is now a good public summary screen. It is not yet a shared-understanding instrument.

The page shows a strong version of each position. It does not show how each person understands the other positions.

The long recording exposes three critical problems:

1. The meaning stream can remain stale for several minutes.
2. A steelman can hide an evasion or add strength that the speaker did not supply.
3. Three fixed lanes waste space when participation is unequal.

## Critical findings

### 1. The update rate is too slow

The first meaning appears almost seven minutes after the discussion starts.

One gender explanation receives no new meaning for more than eleven minutes. A later explanation receives no update for more than five minutes.

The screen will look broken or stale during these gaps. A live audience cannot know if the system still listens.

The system should update after each complete rhetorical unit. The target interval should usually be 20 to 60 seconds.

The system must not replace a stable belief after every speech fragment. It can update a temporary current thought instead.

Use two internal states:

- A current thought changes after a complete local point.
- A durable view changes only when later speech changes the position.

The public screen can show one card. The system can use both states to control that card.

### 2. The interface does not show mutual understanding

The system currently answers this question: “What does each person probably mean?”

It does not answer this question: “What does each person think the other person means?”

This difference is central to the product goal.

The recording contains several valuable sync events:

- At 44:14, Konstantin asks Neil to correct his summary.
- Neil says the summary is not wrong, but it lacks context.
- At 56:35, Konstantin rejects the claim that critics want to control personal dress.
- At 66:40, Konstantin says Neil did not answer the direct shortlist question.
- At 68:46, Francis restates the concern about lost opportunities for women.

The interface updates individual cards after some of these events. It does not show the change in shared understanding.

A small attached reflection can solve this problem. It should appear only after an explicit restatement.

Examples include:

- “Konstantin heard Neil as: personal expression should remain free.”
- “Neil accepted the words, but said that context was missing.”
- “Konstantin rejected this reading: critics want to control clothing.”

Silence must never count as acceptance.

### 3. A steelman can become too generous

The system must improve clarity without adding missing evidence or a missing answer.

At 66:44, Konstantin asks a direct eligibility question about female shortlists. Neil answers with a deeper argument about underrepresentation.

The current Neil card makes the answer sound complete. It does not show that Neil changed the level of the question.

A faithful strong reading should say:

> I would remove the need for female shortlists by fixing underrepresentation. I am not giving a direct eligibility rule here.

This version preserves the strong argument and the missing direct answer.

The same risk appears in the mask discussion. The summary can clarify Neil’s method claim. It must not make that method more valid than his speech supports.

The rule should be strict:

- Improve structure and wording.
- Preserve stated reasons and limits.
- Do not add a new premise.
- Do not add evidence.
- Do not convert an analogy into proof.
- Do not convert a different-level answer into a direct answer.

## Summary fidelity findings

### Questions, beliefs, and reports remain mixed

The current system separates questions from beliefs. That change works well.

The long debate adds a third type: a speaker can report another group’s concern.

Francis says that many people see women lose opportunities. The current card can look like Francis states his own complete position.

The card should keep the report visible in the sentence:

> I think critics see women lose present opportunities and unfair competition.

This wording does not require another permanent label.

### One card can hide the argument structure

Neil’s final gender card compresses almost seven minutes of source speech into 30 words.

The card contains two different claims:

- Biological sex is usually binary.
- Social gender signals permit varied personal expression.

The current card joins them correctly. However, it hides the reason that connects them.

A slightly longer card can preserve the argument:

> Biological sex is usually binary. People usually identify gender through learned visual signals. A free society should let people combine those signals.

This structure is easier to inspect and correct.

### Evidence filters become too large

One meaning opens 33 transcript segments. Another meaning opens 29 segments.

These filters are not quick evidence views. They are short transcript chapters.

The first view should show decisive lines only. A second action can show the full contributing context.

The evidence model needs three roles:

- The statement supplies the position.
- The statement supplies a reason or limit.
- The statement changes the interpretation.

### Some entries combine separate questions

Francis asks two space questions about four minutes apart. One meaning entry treats them as versions of one question.

The first question concerns excitement about current spaceflight. The second question concerns the practical value of exploration.

These are related but separate questions. The interface should not replace the first question with the second question.

## Layout findings

### Fixed lanes waste large areas

Neil supplies 338 speech segments. Konstantin supplies 118 segments. Francis supplies 27 segments.

Equal lanes imply equal participation. The data does not support that implication.

The screenshot shows a full empty center lane during the final subject. Another subject uses only the left lane.

Keep stable speaker anchors, but let an active card use nearby empty space. The card can grow toward the center without changing its anchor.

The system should keep the lane position stable. The card width can change with the number of active speakers.

### The maximum width wastes a very large display

The meaning list stops at 1,740 pixels. A 4K display leaves large unused margins.

The line length needs a limit, but the full composition should still scale. Increase type and gaps after the content reaches its line-length limit.

Use the complete display area for scale, not for longer text lines.

### Three lanes reduce distance readability

The three-speaker mode reduces current text to approximately 25 to 34 pixels in the tested viewport.

This size can fail on an outdoor or distant public screen. The earlier two-speaker mode permits larger type.

The stage mode should set a minimum physical target. Test it from the expected viewing distance.

### The initial viewport clips old cards

The latest view can show the bottom half of old cards at the top edge. These cards look damaged instead of historical.

The automatic scroll should align a topic boundary near the top. A top fade can cover any remaining partial card.

### Horizontal alignment can hide time order

Francis asks the final question in the right lane. Neil answers later in the left lane.

Both cards share one row. A viewer can read the left answer before the right question.

Use a small vertical offset within the row. The earlier card should sit higher than the later card.

Do not add a required connector. Position alone can show the sequence.

### Fixed card heights add empty space

Short questions and long positions use the same minimum card height. This creates large empty areas inside short cards.

Keep aligned bottoms when two cards share an exchange. Let single cards use content-based height.

## Public-screen findings

### “Show speech” is repeated stage clutter

Every card shows the same action. A public audience usually cannot use it.

The repeated text consumes a full line and competes with the meaning.

Hide this action in stage mode. Keep the full card selectable for an operator.

### The transcript strip conflicts with prior decisions

The collapsed transcript shows a timestamp. The project already established that timestamps have little live value.

The strip also truncates the sentence. It supplies neither a useful transcript nor a useful status.

In stage mode, show one or two recent transcript lines without a timestamp. Dim them as planned.

In review mode, restore timestamps and full transcript controls.

### Prototype controls consume prime space

The recording selector, replay button, footer, and ID control help development. They do not help a live audience.

Create two modes:

- Stage mode shows meanings and a small recent transcript.
- Operator mode shows the selector, replay, filters, IDs, and full transcript.

This split removes clutter without removing useful tools.

### Speaker identity is weak for late viewers

Position alone works after a viewer learns the lanes. It fails when a viewer arrives during the debate.

Three lanes make this problem larger. A small name on each current card can solve it.

The name should not become a large speaker header. It can sit at the card edge or in the card footer.

### The screen does not show system freshness

An audience cannot tell the difference between thoughtful delay and failed processing.

Do not use a technical status panel. Use a small passive state near the topic heading.

Examples include “Listening” and “Updating after this thought.” Remove the state when the card updates.

## Information architecture findings

### Topic names do not expose the root disagreement

The headings name the subject. They do not always name the conflict.

For example, “Protected opportunities for women” does not show the central split.

A stronger heading is:

> Protect current categories or redesign the rules?

This heading explains the disagreement without a separate relation sentence.

Other useful headings include:

- Trust the consensus or preserve more room for dissent?
- Solve immediate unfairness or remove its deeper cause?
- Use sex categories or new measures of competitive advantage?

These headings can meet the rejected relation-line need. They use one compact question instead.

### The system loses macro-topic structure

The gender discussion has several headings. They appear as separate subjects, but they form one long argument.

Use one quiet macro-topic marker with changing subtopic questions. Do not add another large header.

Example:

> Gender and public rules / Sport categories

This structure helps the audience follow a long return to one central dispute.

### The screen does not show explicit agreement

Francis says “Completely agreed” before he changes the question. The interface loses that shared position.

Show agreement only after explicit words. A brief shared edge or small shared marker is sufficient.

Do not infer agreement from silence, topic change, or lack of correction.

## Diarization findings

Deepgram marks 33 display segments as uncertain. Many segments are one-word interruptions.

The raw transcript shows short speaker changes such as “Yes,” “And,” or one part of a broken sentence.

These changes create visual noise and can assign support to the wrong person.

The preparation pipeline should:

1. Merge low-confidence one-word fragments into the surrounding turn when voice continuity supports the merge.
2. Keep uncertain fragments as context, not as position evidence.
3. Delay a summary when its speaker identity remains uncertain.
4. Revise the summary if later voice evidence changes the identity.

One current meaning uses two uncertain agreement fragments. They add little evidence and should not support that meaning.

## Recommended next prototype

The next prototype should test six changes only:

1. Add stage mode and operator mode.
2. Remove repeated “Show speech” text from stage mode.
3. Update a current thought every 20 to 60 seconds.
4. Add an attached reflection after an explicit restatement or correction.
5. Rewrite topic headings as the central disagreement question.
6. Let active cards expand into empty lanes while their speaker anchors stay fixed.

Do not add a permanent relationship sentence yet. The disagreement question and attached reflections provide a smaller test.

## Success test

Use five-minute debate samples with known misunderstandings.

After each sample, ask each speaker and several viewers these questions:

1. What does each person believe?
2. What is the strongest reason for each belief?
3. What does each person think the other person believes?
4. Where do the people actually disagree?
5. Which displayed statement would each speaker correct?

The interface succeeds only if these answers improve over the raw debate video.
