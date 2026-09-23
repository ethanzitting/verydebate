# Real-Time Debate Intelligence Ecosystem

## Overview

The emerging ecosystem around AI-assisted debate analysis is fragmented across several categories:

1. **Live fact-checking**
2. **Debate analysis and scoring**
3. **Argument mapping**
4. **Question-dodge and response detection**
5. **Meeting / conversation intelligence**
6. **Post-hoc debate analysis**

No clear market leader currently combines all of these into a polished, spectator-first system that continuously tracks:

- What each participant said
- What claims were made
- Which claims were challenged
- Which challenges were answered
- Which points remain unresolved
- Which questions were answered, partially answered, or dodged
- Which factual claims are supported by external evidence

The strongest potential product category is therefore a **real-time discourse intelligence layer** rather than simply an AI fact-checker or AI debate judge.

---

# Providers and Projects

## Khaos Live

**Category:** Live debate analysis / AI judging

**Primary service:**
Khaos Live analyzes debates as they happen. It consumes live captions or speech and attempts to identify claims, rebuttals, responses, and dodged questions.

**Capabilities:**

- Live debate ingestion
- Speaker tracking
- Claim detection
- Rebuttal detection
- Question-dodge detection
- Live scoring
- Audience-facing interface
- Debate/tournament support

**Positioning:**

Primarily positioned as an **AI debate judge**.

The product appears designed around answering questions such as:

- Who is winning?
- Who responded effectively?
- Who dodged questions?
- How should each participant be scored?

**Overlap with proposed system:** Very high.

**Key difference:**

A discourse-intelligence product could avoid making a final judgment about who "won" and instead expose the underlying argument structure for the viewer.

---

## Deliberate

**Category:** Live argument mapping

**Origin:** Berkeley AI Hackathon project

**Primary service:**

Deliberate listens to a live conversation or debate and dynamically constructs an argument map.

**Capabilities:**

- Live audio processing
- Transcript generation
- Claim extraction
- Argument mapping
- Pro/con relationships
- Evidence relationships
- Links between summarized arguments and original transcript
- Timestamped source material

**Positioning:**

Focused on helping people understand the **structure of an argument** rather than merely summarizing the conversation.

**Overlap with proposed system:** Very high conceptually.

**Key difference:**

Deliberate emphasizes visual argument maps. A broader debate-intelligence system could add:

- unanswered-point tracking
- question-answer relationships
- dodge detection
- fact-checking
- chronological debate state
- spectator-oriented UX

---

## Premis

**Category:** AI debate analysis

**Primary service:**

Premis takes debates and automatically reconstructs their argument structure.

**Capabilities:**

- Transcription
- Claim extraction
- Premise identification
- Conclusion identification
- Rebuttal mapping
- Logical fallacy detection
- Fact-checking
- Question-dodge detection
- Identifying who responded to whom

**Current workflow:**

Primarily post-hoc analysis of uploaded content or YouTube debates rather than continuous live analysis.

**Overlap with proposed system:** Extremely high.

**Key difference:**

Premis currently appears oriented around analyzing a completed debate instead of maintaining a live state model while the debate unfolds.

---

## DebateMeter

**Category:** Post-debate AI analysis

**Primary service:**

DebateMeter analyzes recorded debates and provides structured assessments of participant behavior.

**Capabilities include tracking:**

- Questions dodged
- Questions answered
- Points left unanswered
- False claims
- Interruptions
- Logical fallacies
- Participant behavior
- Timestamped debate events

**Input:**

Primarily YouTube or recorded debates.

**Overlap with proposed system:** High.

**Key difference:**

The analysis happens after the fact rather than being continuously available to a live viewer.

---

# Live Fact-Checking Providers

## Factiverse Live

**Category:** Professional live fact-checking

**Primary service:**

Factiverse provides real-time claim detection and verification for live events, including political debates.

**Capabilities:**

- Live transcription
- Speaker identification
- Claim extraction
- Detection of checkable claims
- Evidence retrieval
- Source search
- Claim verification
- Real-time fact-check output

**Users / market:**

Primarily positioned toward:

- news organizations
- broadcasters
- journalists
- election coverage
- professional fact-checking organizations

**Notable characteristic:**

Factiverse demonstrates that a live pipeline of:

`audio → transcript → claim detection → evidence retrieval → verification`

can operate fast enough for live broadcast environments.

**Overlap with proposed system:** High on the fact-checking layer.

**Missing relative to proposed system:**

- argument state
- rebuttal mapping
- unanswered-point tracking
- question-response relationships
- debate narrative structure

---

## DebateGuard

**Category:** Live fact-checking

**Primary service:**

DebateGuard listens to live speech and attempts to identify and verify factual claims.

**Capabilities:**

- Microphone/audio ingestion
- Real-time transcription
- Claim extraction
- Fact verification
- Evidence retrieval
- Source presentation

**Typical use case:**

A user can run DebateGuard while listening to:

- debates
- interviews
- discussions
- political events

**Overlap with proposed system:** Moderate to high.

**Primary difference:**

DebateGuard focuses on whether statements are factually correct rather than maintaining the logical structure of the debate.

---

## InTruth

**Category:** Browser-based political fact-checking

**Form factor:** Chrome extension

**Primary service:**

InTruth analyzes political videos, debates, interviews, and speeches while the user watches them.

**Capabilities:**

- Audio analysis
- Live transcription
- Claim extraction
- Fact-checking
- Evidence sourcing
- Political-content analysis

**Potential use cases:**

- presidential debates
- interviews
- press conferences
- YouTube videos
- political broadcasts

**Overlap with proposed system:** Moderate.

**Key distinction:**

Its primary unit of analysis is the **individual factual claim**, not the evolving relationship between arguments.

---

## FactFlow

**Category:** Real-time political fact-checking

**Primary service:**

FactFlow is aimed at verifying political statements and debate claims using authoritative and government data.

**Capabilities / positioning:**

- Real-time claim verification
- Political debate analysis
- Government-source checking
- Evidence presentation

**Overlap with proposed system:** Primarily the fact-checking layer.

---

# Adjacent Conversation-Intelligence Products

## Frank

**Category:** Meeting / conversation analysis

**Primary service:**

Frank monitors business meetings and flags conversational problems while they happen.

**Platforms:**

- Zoom
- Google Meet
- Microsoft Teams

**Capabilities include detecting:**

- contradictions
- unsupported claims
- hedged answers
- repeated unanswered questions
- explicit question dodges
- failure to address earlier questions

Example type of event:

> A participant asks a specific question. Another participant speaks for several minutes but never answers it. Frank flags the unanswered question.

**Overlap with proposed system:** Very high at the reasoning layer.

**Importance:**

Frank demonstrates that the underlying product category extends beyond formal debates.

The same system could potentially analyze:

- meetings
- interviews
- hearings
- sales calls
- negotiations
- press conferences
- podcasts

---

## NoBS

**Category:** Experimental live conversation analysis

**Origin:** Hackathon project

**Primary service:**

NoBS analyzes conversations in real time for questionable reasoning or statements.

**Capabilities:**

- Live transcription
- Speaker identification
- Contradiction detection
- Factual-claim analysis
- Logical-fallacy detection
- Near-real-time feedback

**Overlap with proposed system:** Moderate to high.

**Status:**

More of a prototype / experimental implementation than an established commercial competitor.

---

## inLie

**Category:** Political rhetoric analysis

**Form factor:** Browser extension

**Primary service:**

inLie analyzes political video content and attempts to identify rhetorical techniques and evasive behavior.

**Capabilities include identifying:**

- dodged questions
- whataboutism
- emotional appeals
- contradictions
- rhetorical manipulation

**Overlap with proposed system:** Moderate.

**Primary distinction:**

Focused more heavily on rhetorical manipulation and political communication than explicit argument-state tracking.

---

# Historical / Research Precedent

## Argunet

**Category:** Argument mapping

Argunet is part of a longer history of attempts to represent debates as structured argument graphs.

Researchers experimented with **live argument reconstruction**, where teams of human analysts listened to debates and constructed argument maps during the conversation.

Typical structure:

```text
Claim A
├── Supporting argument A1
├── Supporting argument A2
└── Rebuttal B1
    └── Counter-rebuttal A3
```

The major limitation historically was labor.

Maintaining accurate argument maps in real time could require multiple trained analysts.

Modern speech recognition and LLMs potentially remove much of that bottleneck.

---

# Market Structure

The current ecosystem can roughly be represented as:

```text
                         LIVE DISCOURSE ANALYSIS

                              ┌──────────────┐
                              │ Live Speech  │
                              └──────┬───────┘
                                     │
                               Transcription
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
               ▼                     ▼                     ▼

        FACT CHECKING          ARGUMENT MAPPING       CONVERSATION
                                                     BEHAVIOR ANALYSIS

        Factiverse             Deliberate             Frank
        DebateGuard            Premis                 inLie
        InTruth                Argunet                 NoBS
        FactFlow
               │                     │                     │
               └─────────────────────┼─────────────────────┘
                                     │
                                     ▼

                       POTENTIAL UNIFIED PRODUCT

                 Real-Time Discourse Intelligence
```

---

# Potential Product White Space

The apparent opportunity is not simply:

> "Use AI to fact-check a debate."

That category already exists.

The more differentiated system would maintain a continuously updating **state model of the argument**.

For example:

```text
Moderator Question Q1
"What would you do about the federal deficit?"

A answers:
├── A1: Spending is the primary cause of the deficit.
├── A2: Taxes should not be increased.
└── A3: Program X should be cut.

B responds:
├── challenges A1
├── ignores A2
└── responds to A3

Status:

Q1       → partially answered by A
A1       → challenged by B
A2       → unanswered by B
A3       → rebutted by B
B rebuttal → awaiting response from A
```

Later:

```text
A1
├── A asserts claim
├── B challenges
├── A responds
├── external factual evidence retrieved
└── claim remains disputed
```

The software therefore maintains an **argument ledger** rather than merely generating a transcript.

---

# Potential Core Data Model

Conceptually, the system could represent discourse using entities such as:

```text
Speaker
Question
Claim
Argument
Evidence
Response
Rebuttal
Counter-Rebuttal
Fact Check
Source
Topic
```

And relationships such as:

```text
ASKS
ANSWERS
PARTIALLY_ANSWERS
DODGES
SUPPORTS
CONTRADICTS
CHALLENGES
REBUTS
RESPONDS_TO
IGNORES
CLARIFIES
RETRACTS
FACT_CHECKS
EVIDENCED_BY
```

This effectively converts a linear conversation into a graph.

---

# Example Live Interface

A spectator could see three synchronized views.

## Transcript

```text
A: Inflation increased because of X.

B: That's not correct. Inflation was already increasing before X.

A: But X accelerated the increase.
```

## Debate State

```text
A1: X caused inflation to increase.

B1 → challenges A1
A2 → responds to B1

STATUS:
Active dispute
```

## Evidence

```text
Claim A1

Checkability: Factual
Confidence: High

Evidence:
[Source 1]
[Source 2]
[Source 3]

Assessment:
Available evidence partially supports the claim.
```

---

# Major Differentiator

Many existing products ultimately attempt to produce:

```text
Person A: 78
Person B: 71

Winner: Person A
```

A potentially stronger approach would avoid making the software the final arbiter.

Instead:

> **Don't tell the viewer who won. Make the debate legible.**

The system exposes:

- what was said
- what was claimed
- what was challenged
- what was answered
- what was ignored
- what evidence exists

The viewer makes the final judgment.

---

# Broader Market

Although political debates provide an obvious demonstration, the underlying technology applies to many forms of adversarial or structured conversation.

Potential markets include:

- Political debates
- Presidential debates
- Congressional hearings
- Legislative hearings
- Press conferences
- Candidate interviews
- Journalism
- Podcasts
- YouTube debates
- Academic debates
- Courtroom proceedings
- Legal depositions
- Business negotiations
- Board meetings
- Sales calls
- Investor calls
- Technical architecture discussions
- Public forums
- Town halls

The broader product category could therefore be described as:

**Real-Time Discourse Intelligence**

or:

**Real-Time Argument Intelligence**

rather than simply a debate application.
