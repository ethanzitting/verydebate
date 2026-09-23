# Fact-Check API Provider Landscape

## Purpose

This document records research about services that are similar to the proposed Epistemic API.

The research covers:

- Product scope
- API response structure
- Evidence handling
- Public prices
- Earliest public release evidence
- Product maturity
- Competitive implications
- The decision not to build the Epistemic API now

The research date is September 18, 2026.

Prices and product features can change. Treat each price as a research snapshot, not as a procurement quote.

Vendor performance statements are not independent evidence. A future evaluation must test each service with the same claim set.

## Executive conclusion

The market already contains many fact-check and claim-verification APIs.

Several services return much of the proposed Epistemic API structure. Common fields include verdicts, confidence, citations, and source stances.

[Webcite](https://webcite.co/api-docs) exposes the closest public response schema. It connects claims, citations, source groups, stances, and verdicts.

[TrueSource](https://truesource.app/api) also returns atomic claims, confidence, reasoning, and supporting or opposing evidence.

[Attest](https://www.quorumtech.ch/attest) provides strong evidence provenance. However, the caller must supply the evidence.

No reviewed service exposes all the proposed Epistemic API fields. Falsifiability scores and evidence-completeness estimates remain uncommon.

This remaining difference is not sufficient by itself. A competitor can add response fields more easily than it can prove their quality.

The valuable work is in these areas:

- Calibration
- Reproducibility
- Domain-specific source integration
- Source lineage
- Evidence coverage
- Reliable abstention
- Public evaluation

The project will not build the Epistemic API at this time.

## Provider categories

The services fall into five useful categories.

### Prior fact-check lookup

These services find fact checks that another organization already published.

- Google Fact Check Tools API
- Factiverse FactiSearch

These services do not necessarily evaluate a new claim.

### End-to-end claim verification

These services retrieve evidence and produce a new verdict.

- Factiverse
- TrueSource
- FactLens
- Real-Check
- Webcite
- Lenz
- Veritier
- FactGuard
- Factward

### Corpus-specific verification

These services limit verification to a defined corpus or domain.

- APITube for current news
- Scite for research literature
- citation.is for scientific claims
- Trust Me Bro for research literature

### Evidence-supplied verification

These services judge a claim against evidence from the caller.

- Attest

This model separates retrieval from evidence judgment.

### Workflow components

These services support one part of the process.

- ClaimBuster detects checkable claims.
- Full Fact AI supports professional fact-checking teams.
- Google Fact Check Tools finds prior checks.

## Summary matrix

| Provider | Main function | Best domain | Public price snapshot | Maturity note |
| --- | --- | --- | --- | --- |
| [Google Fact Check Tools](https://developers.google.com/fact-check/tools/api/reference/rest) | Search published fact checks | Public claims and misinformation | No clear public API price | Established lookup service |
| [Factiverse](https://api.factiverse.ai/v1/redoc) | Detect claims, search, and verify | News, politics, climate, health | Trial; current API offer starts near $3,000 monthly | Established company; sales-led API |
| [TrueSource](https://truesource.app/api) | General verification with specialized sources | News, finance, government, politics | Free 100; $299 for 1,000; $799 for 5,000 | New service with conflicting price pages |
| [FactLens](https://api.factlens.pro/docs) | Verify text, images, audio, and video | General internet content | 30 free daily; about $1 per 30 paid checks | New service |
| [Real-Check](https://real-check.org/docs/api) | Verify text, images, and voice | Consumer claims and scams | Free limits; paid API price unclear | New and small service |
| [Webcite](https://webcite.co/api-docs) | Retrieve citations and produce verdicts | Web, news, government, research | 50 free credits; $20 for 500 credits | New service with a rich schema |
| [APITube](https://support.apitube.io/en/articles/use-cases/trust-and-research/fact-check-claim) | Verify against a live news corpus | Current news | From $29 monthly; five points per request | Corpus-limited service |
| [Scite](https://scite.ai/api) | Analyze research citations | Scientific literature | Contact sales | Established research service |
| [citation.is](https://citation.is/developers/) | Verify scientific claims | Scientific literature | Free public API | New service with a public corpus |
| [Attest](https://www.quorumtech.ch/attest) | Judge claims against supplied documents | Private and controlled evidence | $0.01 or $0.02 per claim | New service with strong provenance |
| [ClaimBuster](https://idir.uta.edu/projects/) | Detect checkable claims | Politics and public speech | Academic service | Established research project |
| [Full Fact AI](https://fullfact.org/ai/) | Monitor claims and support fact-checkers | News and elections | Contact Full Fact | Established professional workflow |
| [Lenz](https://lenz.io/developers) | Multi-model verification with an audit trace | AI output and general web claims | Free; $99 and $399 monthly plans | New service with a detailed trace |
| [Veritier](https://veritier.ai/) | Verify claims and block unsupported agent actions | AI agents and documents | Free 25 verifications; paid price unclear | New service |
| [FactGuard](https://www.factguard.org/) | General verification and an MCP service | Consumer and developer use | Early access; 100 calls daily | Early-access service |
| [Factward](https://www.factward.com/pricing) | Verify text, URLs, and PDFs | Publishing workflows | Free; Pro costs $9 monthly | New service with limited public history |
| [Trust Me Bro](https://trustmebro.to/api) | Verify claims against research literature | Scientific claims | Vendor lists fractions of a cent per claim | Prelaunch waitlist |

## Release timeline

Some vendors do not publish a formal release date. The dates below show the earliest verified public evidence.

| Provider | Earliest verified date | Confidence | Evidence |
| --- | ---: | --- | --- |
| Full Fact automation program | 2016 | High | [Full Fact states that its machine-learning work began in 2016](https://fullfact.org/ai/) |
| ClaimBuster API | September 25, 2017 | High | [Duke described active API use](https://reporterslab.org/2017/09/25/tech-check-lab-notes-no-1/) |
| Scite platform | 2018 | High | The platform launched in 2018; commercial API discussion existed by 2020 |
| Google ClaimReview API | March 25, 2019 | High | [Google announced the read and write API](https://datacommons.org/factcheck/blog) |
| Google claim-search API | By June 22, 2020 | High | [Google described an open API](https://blog.google/products-and-platforms/products/search/bringing-fact-check-information-google-images/) |
| Factiverse company | 2021 | High | [Factiverse company history](https://www.factiverse.ai/about-us) |
| Factiverse FactiSearch API | March 24, 2023 | High | [Factiverse product announcement](https://www.factiverse.ai/blog/we-are-excited-to-share-our-latest-feature---factisearch-ai) |
| Webcite | By January 30, 2025 | Medium | [Earliest dated product article found](https://webcite.co/blog/webcite-vs-competitors-fact-checking-citation-api-comparison/) |
| Lenz | April 3, 2026 | High | [Initial public launch record](https://www.producthunt.com/products/lenz-2) |
| Factward | Between March and July 2026 | Low | The domain began in March; the public service appeared later |
| TrueSource | March 2026 | High | [Version 1.0 technical white paper](https://truesource.app/whitepaper) |
| Veritier | By April 2026 | Medium | [Privacy policy dated April 2026](https://veritier.ai/privacy) |
| citation.is API | May 2026 | High | [Changelog identifies the first public release](https://citation.is/developers/) |
| FactGuard | By June 6, 2026 | Medium | [Privacy policy effective date](https://factguard.org/privacy) |
| FactLens | July 3, 2026 | Medium | [Creator described the first public release](https://www.reddit.com/r/chrome_extensions/comments/1umqkqm/i_made_an_extension_that_catches_someone_lying/) |
| APITube fact-check endpoint | July 3, 2026 | High | [Official endpoint documentation](https://support.apitube.io/en/articles/use-cases/trust-and-research/fact-check-claim) |
| Real-Check API | By July 22, 2026 | Medium | [Public API example contains this date](https://real-check.org/docs/api) |
| Attest production API | September 6, 2026 | High | [Production evaluation date](https://www.quorumtech.ch/attest) |

## Relationship to the generative-AI market

Automated fact-checking existed before generative AI.

ClaimBuster, Full Fact, Google, and Scite used conventional machine learning and information retrieval before ChatGPT.

Factiverse also began from research that predates the current generative-AI market.

The current commercial category is much newer. Eleven of the sixteen reviewed services show public product evidence from 2025 or 2026.

The recent services commonly use this process:

```text
claim extraction
  -> web or corpus search
  -> passage selection
  -> LLM evidence judgment
  -> verdict
  -> citations
```

Three changes caused rapid product growth:

- Large language models made claim extraction easier.
- Search APIs made evidence retrieval easier.
- Model hallucinations created demand for verification.

The market is therefore part of the generative-AI expansion. It also rests on older fact-checking research.

## Detailed provider notes

### Google Fact Check Tools API

Google provides a search index for published fact checks that use ClaimReview markup.

Important endpoints include claim search, image search, and ClaimReview page management.

Google does not independently evaluate a new claim. It returns checks that another organization already completed.

Use this API as a prior-check cache or lookup layer. Do not use it as the final verifier for new claims.

The public documentation does not show a clear current price or quota.

### Factiverse

Factiverse provides claim detection, stance detection, claim search, and fact-check endpoints.

The service can use Google, DuckDuckGo, Wikipedia, Semantic Scholar, and an internal fact-check database.

The product works best for English news and well-covered subjects. The vendor names politics, climate, and health as strong areas.

Factiverse states that its system assists research. It does not claim inherent knowledge of truth.

The commercial API is sales-led. The current pricing page shows a trial and a high-cost API plan.

### TrueSource

TrueSource decomposes text into atomic claims. It returns verdicts, confidence, reasoning, and evidence links.

The API documents supporting and opposing evidence. It also gives sources a reliability value.

The vendor claims that it detects copied reporting and counts only independent corroboration.

TrueSource publishes explicit verdict rules. It weights supporting and opposing evidence by reliability and time.

The service has special source paths for finance, government, political funding, and geopolitical events.

Two official pages have shown different prices and limits. Confirm all commercial terms before an evaluation.

### FactLens

FactLens accepts text, images, audio, and video through one verification endpoint.

It extracts distinct claims and verifies each claim separately.

The response includes:

- Verdict
- Explanation
- Confidence band
- Evidence-strength band
- Source links
- Per-claim failures
- Request identifier
- Response time
- Usage

The public schema does not expose detailed evidence passages or a stance for each source.

### Real-Check

Real-Check supports text, image, and voice requests.

It returns a verdict, confidence, summary, warning signals, sources, and a creation date.

The service also detects scams. Its public API history and paid API terms remain limited.

### Webcite

Webcite has the richest public response schema found in this research.

The API can decompose complex claims. It returns results for each atomic claim.

Citation fields can include:

- Title
- URL
- Snippet
- Source type
- Credibility score
- Stance
- Stance confidence
- Stance explanation
- Primary-source status
- Fact-check-site status
- Binding method
- Provenance layer
- Grounding status

Verdict fields can include:

- Result
- Confidence
- Summary
- Stance counts
- Independent-origin count
- Document count
- Key findings
- Corrections

The unified response connects claims, citations, domain groups, and verdicts.

Webcite also distinguishes bound quotations from model-asserted citations. This feature directly overlaps with the proposed evidence graph.

One complete verification can consume four credits. The $20 plan includes 500 credits.

### APITube

APITube checks claims only against its news corpus.

It returns one of eight verdicts:

```text
true
mostly_true
mixed
misleading
mostly_false
false
unverified
outdated
```

Each result includes confidence, an `as_of` date, an explanation, and evidence.

Evidence entries include source authority, publication date, snippet, stance, and relevance.

The limited corpus provides a clear boundary. It also prevents use for many scientific, historical, and private claims.

### Scite

Scite analyzes how research papers cite other papers.

It distinguishes supporting, contrasting, and mentioning citations.

The service provides paper search, citation statements, citation tallies, reference checking, and evidence endpoints.

Scite is a strong research-evidence component. It is not a general web fact-check service.

### citation.is

citation.is provides scientific claim lookup and verification.

It exposes REST, MCP, bulk JSON, and knowledge-graph interfaces.

Its response can include a verdict, confidence, rationale, an evidence URL, and PubMed results.

The service also exposes provenance and contradiction data. It is new and has limited public operational history.

### Attest

Attest checks a claim against documents from the caller.

It does not retrieve evidence or decide truth about the external world.

Its verdicts include:

```text
SUPPORTED
PARTIALLY_SUPPORTED
INSUFFICIENT_EVIDENCE
CONTRADICTED
DISPUTED
```

The response identifies exact supporting and contradicting sentences. It also includes hashes, versions, and audit measurements.

Attest removed its confidence score. The vendor found that its previous confidence values carried little useful information.

Attest provides the strongest reproducibility model found here. Its scope excludes evidence discovery.

### ClaimBuster

ClaimBuster identifies statements that deserve a fact check.

Its main value is claim detection and check-worthiness ranking. It does not provide complete general verification.

The academic project predates the current large-language-model market.

### Full Fact AI

Full Fact AI supports professional fact-checking organizations.

Its tools monitor media, detect checkable claims, match prior checks, and notify teams about repeated claims.

The product keeps humans in the workflow. It does not offer a simple public verification API.

### Lenz

Lenz provides claim extraction, fast assessment, and full verification.

The full pipeline uses research, opposing arguments, and several model reviews.

The response can include:

- Verdict
- Confidence band
- Lenz score
- Key finding
- Sources
- Audit trace

The audit trace includes framing, sources, citations, arguments, and review output.

The public price is $99 monthly for 500 full checks. A $399 plan includes 2,000 full checks.

### Veritier

Veritier extracts verifiable claims from text, PDFs, and images.

It returns verdicts, confidence, explanations, and sources.

Its action-attestation endpoint can block an agent action. The endpoint checks named systems of record.

The free tier includes 25 verifications and 100 extractions. Public paid pricing remains unclear.

### FactGuard

FactGuard provides a live web application and an early-access API.

The API promises structured verdicts, confidence, cited sources, and reasoning.

The free API limit is 100 calls each day. The service remains in early access.

### Factward

Factward verifies text, URLs, and PDFs.

It returns evidence-backed results for each claim. It also supports an insufficient-evidence result.

The Pro plan costs $9 monthly and includes API access. The low price requires confirmation before production use.

The service has little public operating history.

### Trust Me Bro

Trust Me Bro focuses on scientific claims and research papers.

The vendor lists sources such as PubMed, Europe PMC, OpenAlex, Crossref, Semantic Scholar, and arXiv.

Its public price statements have not remained consistent. The API page also directs users to a waitlist.

Treat this service as prelaunch.

## Response-schema comparison

The following table compares important Epistemic API concepts with the reviewed market.

| Capability | Market availability | Examples | Assessment |
| --- | --- | --- | --- |
| Claim decomposition | Common | Webcite, TrueSource, Factiverse, FactLens, Lenz | Not a product distinction |
| Verdict | Common | Most end-to-end services | Not a product distinction |
| Confidence | Common | Webcite, TrueSource, APITube, FactLens, Lenz | Meaning and calibration remain unclear |
| Supporting sources | Common | Webcite, TrueSource, APITube, Lenz | Not a product distinction |
| Contradicting sources | Available | Webcite, TrueSource, APITube, Attest | Not unique |
| Source stance | Available | Webcite, APITube, Factiverse | Not unique |
| Exact evidence passage | Available | Webcite, Attest | Not unique |
| Source quality score | Available | Webcite, TrueSource, APITube | Methods differ |
| Source grouping | Available | Webcite | Close to a small evidence graph |
| Independent-origin count | Limited | Webcite, TrueSource internal process | Public lineage remains incomplete |
| Audit trace | Available | Lenz, Attest | Not unique |
| Reproducibility hashes | Rare | Attest | Valuable but specialized |
| Falsifiability probability | Not found | None in a public response schema | Possible difference, but easy to copy |
| Empirical or normative probability | Not found | Some services filter opinions internally | Possible difference, but easy to copy |
| Ambiguity probability | Not found | Some services flag complex claims | Possible difference, but easy to copy |
| Time-sensitivity probability | Not found | APITube returns dates and `outdated` | Possible difference, but easy to copy |
| Evidence completeness | Not found | Services use insufficient or unverified results | Important unresolved problem |
| Calibrated truth probability | Not demonstrated | Confidence fields are common | Important unresolved problem |
| Full source-lineage graph | Not found for general claims | citation.is has a scientific graph | Important unresolved problem |
| Statistical data vintage | Not found as a general feature | APITube returns `as_of` | Important for official statistics |

## Confidence is not necessarily probability

Most providers return a confidence value. Public documentation rarely defines the value as a calibrated probability.

A confidence field can measure different things:

- Model certainty
- Source agreement
- Evidence quality
- Verdict stability
- A vendor-defined mixture of signals

These meanings are not interchangeable.

A useful probability needs calibration evidence. For example, results at 80% must be correct approximately 80% of the time.

No reviewed general service publishes enough calibration data to establish that interpretation.

Attest provides a useful warning. It removed confidence because nearly all values were between 0.95 and 0.99.

## Provider risks

### Limited independent evaluation

Most services publish product claims but few publish complete benchmark methods and labeled test sets.

A public schema shows integration quality. It does not show factual accuracy.

### Very recent services

Many providers appeared during 2025 or 2026. Their uptime, support, and long-term commercial stability remain unknown.

### Price inconsistency

Some providers publish different prices on different official pages.

TrueSource and Trust Me Bro showed this problem during the research.

### Source duplication

Several articles can copy the same original report. Source counts can therefore overstate independent support.

TrueSource claims to detect this problem. Webcite exposes origin counts and source groups.

Neither public interface proves complete source lineage.

### Search limitations

General web search can miss paywalled, recent, local, or poorly indexed evidence.

APITube returns `unverified` when its news corpus has no matching article. That result does not prove that no evidence exists.

### Model judgment

An LLM can misunderstand a passage even when the citation is real.

Exact passage binding reduces citation fabrication. It does not guarantee correct interpretation.

### Licensing and storage

Providers can return copyrighted text, abstracts, or publisher metadata.

A production service needs clear rules for passage storage, display, and redistribution.

## Competitive implications

The proposed rich return type does not create a durable advantage.

Webcite already provides much of that structure. TrueSource, APITube, Lenz, and Attest provide other substantial parts.

The remaining fields include falsifiability, evidence completeness, and calibrated probability.

These fields create value only when measurements prove their meaning.

The possible durable advantages are:

- Better accepted-claim accuracy
- Better abstention
- Better calibration
- Better primary-source coverage
- Better source-lineage tracking
- Better domain-specific semantics
- Better reproducibility
- Lower total verification cost

Each advantage requires data, tests, and operational work. A larger JSON object does not create the advantage.

## Decision

The project will not build the Epistemic API at the current time.

The main reasons are:

- The market already has several close products.
- The proposed response structure has substantial market overlap.
- Many competitors entered the market recently.
- Search and model orchestration are becoming common capabilities.
- A meaningful difference requires expensive evaluation and source integration.
- The project does not yet have a committed first customer.

The official-statistics MVP remains technically plausible. The related research is in [domain-source-landscape.md](./domain-source-landscape.md).

The project does not currently have enough evidence that this MVP should become a product.

## Conditions for a future review

Review the decision if one or more of these conditions occur:

- A customer requests a specific supported claim class.
- Existing providers fail a controlled quality test.
- A regulated workflow requires reproducible evidence records.
- The project gains unique access to a primary data source.
- A narrow domain creates a clear commercial use case.
- Verification costs decrease substantially.
- A public benchmark exposes a major provider weakness.

## Required test before future implementation

Do not start a broad implementation before a comparative test.

Test at least these providers:

- Webcite
- TrueSource
- Factiverse
- FactLens
- APITube
- Lenz
- Google Fact Check Tools
- Scite for scientific claims

Use the same labeled claim set for every provider.

Measure:

- Accepted-claim accuracy
- Coverage
- Abstention accuracy
- Calibration
- Citation correctness
- Evidence passage correctness
- Source independence
- Latency
- Cost
- Reproducibility
- Error behavior

The test must inspect the cited passages. A matching verdict alone is not sufficient.

## Final lesson

The hard problem is not the API shape.

The hard problem is a reliable connection between a claim, the correct evidence, and a justified conclusion.

Current providers expose increasingly rich structures. Their public material does not yet prove consistent reliability across broad domains.

A future product must compete on measured quality within a declared scope. It must not compete only on response detail.
