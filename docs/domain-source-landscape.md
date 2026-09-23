# Domain and Source Landscape

## Purpose

This document records the source-provider research for the first Epistemic API domain.

The research had these goals:

- Find domains with abundant evidence.
- Compare the cost of available source providers.
- Identify licensing and operational risks.
- Select a narrow domain for the MVP.
- Define tests that can show success or infeasibility.

Provider prices in this document are a snapshot from September 16, 2026. Providers can change prices, limits, and terms.

## Main conclusion

The first domain should be official statistical claims.

The initial scope should include United States labor, population, prices, and national accounts.

The MVP should verify claims with this form:

> A named measure had value X for geography Y during period Z.

Examples include:

- The United States unemployment rate was 4.3% in August 2026.
- Texas had 29.1 million residents in the 2020 census.
- United States real GDP grew by 2.1% in a specified quarter.
- The CPI increased by X% during a specified period.

These claims have useful properties:

- Primary sources publish structured data.
- Most source APIs are free.
- The system can reproduce each result.
- Units, dates, and populations are explicit.
- Some providers preserve historical revisions.
- The project can create strong test labels.
- Expert review is usually unnecessary.

This scope tests claim parsing, source routing, evidence lineage, caching, version control, and explanations.

This scope does not test difficult evidence synthesis. A later domain must test that problem.

## Product scope principle

The product does not need to evaluate every factual claim.

A selective verifier can still provide substantial value. It can verify claims that have clear definitions, suitable sources, and tractable evidence.

The system should identify claims that exceed its capability. It should return an explicit abstention instead of a weak conclusion.

Useful result classes include:

```text
supported
contradicted
insufficient_evidence
ambiguous_claim
out_of_scope
```

The product can expand its supported claim classes after each class meets its quality target.

This design changes the primary optimization target. The project should maximize reliability for accepted claims, subject to useful coverage and cost.

The project should measure:

- Accepted-claim accuracy
- Claim coverage
- Abstention accuracy
- Calibration within each claim class
- Explanation traceability
- Cost per accepted claim

A low coverage value does not make the product useless. Low accuracy for accepted claims creates the greater product risk.

The product should publish its supported claim classes. It should also explain why it rejected an unsupported claim.

## Selection principle

Evidence volume is not the correct optimization target.

The project must optimize the total cost of a reliable conclusion. This cost includes:

- Source discovery
- Document access
- Text extraction
- Claim interpretation
- Evidence evaluation
- Duplicate detection
- Source-lineage analysis
- Model inference
- Human review
- Licensing and compliance

Medical research has abundant and inexpensive metadata. However, medical conclusions require difficult and expensive judgments.

Official statistics have inexpensive access and comparatively simple judgments. This combination makes them a better first domain.

## Source-provider categories

The source ecosystem has two main layers.

1. Discovery providers find candidate sources.
2. Domain providers supply authoritative records and structured evidence.

The system should prefer a domain provider when one is available.

## General web discovery and extraction

These providers find candidate sources. They do not establish source authority.

The prices below exclude model, storage, and engineering costs.

| Provider | Approximate list cost | Useful properties | Applicable domains |
| --- | ---: | --- | --- |
| [Parallel Search](https://parallel.ai/products/search) | $1-$5 per 1,000 searches | Compressed passages, domain filters, low price | General web, current events, company research |
| [You.com](https://about.you.com/pricing) | $5 per 1,000 searches; $1 per 1,000 pages | Up to 100 results, news, page content | General web, news, broad research |
| [Brave Search](https://brave.com/search/api/) | $5 per 1,000 searches | Independent index, news, images, custom ranking | General web, current events |
| [Exa](https://exa.ai/pricing) | $7 per 1,000 searches; $1 per 1,000 pages | Semantic search, passages, page text, domain filters | Research, companies, technical subjects |
| [Perplexity Search](https://docs.perplexity.ai/docs/getting-started/pricing) | $5 per 1,000 raw searches | Multiple queries per request, filters | General web, current information |
| [Linkup](https://www.linkup.so/pricing) | $5-$6 per 1,000 searches | Search, fetch, and research modes | General web, legal, company research |
| [Tavily](https://www.tavily.com/pricing) | $8 per 1,000 credits | Search, extract, crawl, and research | General agent research |
| [Serper](https://serper.dev/) | $1 per 1,000 searches at the entry purchase | Google results, news, Scholar, patents | Broad discovery, localized search |
| [SerpAPI](https://serpapi.com/pricing) | From $25 monthly for 1,000 searches | Many engines and specialized result types | Search-result data, local results |
| [Firecrawl](https://www.firecrawl.dev/pricing) | $16 yearly plan rate for 5,000 credits | Search, crawl, extraction, browser support | Difficult pages, complete websites |
| [Jina Reader](https://jina.ai/reader/) | Free basic use; token-based paid use | Model-ready page text | Page extraction after discovery |
| [Common Crawl](https://commoncrawl.org/get-started) | Data access is free | Large historical web corpus | Archives, historical web claims, bulk research |

### Assessment

Exa is a reasonable candidate. It combines semantic discovery with page extraction and passages.

You.com and Parallel currently publish lower list prices. Brave provides useful index diversity.

The project should test Exa, You.com, Parallel, and Brave against the same claim set.

The test should measure:

- Recall of authoritative sources
- Recall of contradictory sources
- Passage quality
- Duplicate rate
- Source-domain controls
- Latency
- Provider cost
- Content-storage rights
- Failure behavior

Marketing benchmarks cannot replace this test.

The final system should not use a deep-research response as its evidence graph. Such responses combine retrieval, selection, and synthesis.

That combination reduces auditability and makes systematic errors difficult to locate.

## Scientific and medical sources

Scientific source discovery is inexpensive. The judgment layer remains difficult.

| Provider | Cost | Provides |
| --- | ---: | --- |
| [PubMed and NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25497/) | Free | Biomedical citations, abstracts, PubMed Central links |
| [ClinicalTrials.gov](https://clinicaltrials.gov/data-api) | Free | Trial protocols, status, outcomes, result records |
| [OpenAlex](https://help.openalex.org/access/pricing/) | $1 daily free use; search is $1 per 1,000 calls | Research graph, metadata, citations, some open full text |
| [Semantic Scholar](https://www.semanticscholar.org/product/api) | Free with limits | Papers, citations, recommendations, abstracts, PDF links |
| [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/access-and-authentication/) | Free public and polite pools | DOI and publication metadata |
| [CORE](https://core.ac.uk/services/api) | Free low-rate access | Open-access metadata and full text |
| [Unpaywall](https://data.unpaywall.org/products/api) | Free | Legal open-access locations for papers |
| Europe PMC | Free | Biomedical metadata, citations, open full text |
| arXiv and bioRxiv | Free | Preprints and full text |
| openFDA and WHO | Free | Regulatory and public-health data |

### Strengths

- The ecosystem has broad metadata coverage.
- Citation graphs can support source discovery.
- Trial registries provide structured study records.
- Open-access services reduce full-text cost.
- Bulk datasets can reduce repeated API costs.

### Risks

- Most treatment claims require causal analysis.
- Study populations can differ from the claim population.
- Outcome definitions can differ across studies.
- Publication bias can distort the visible evidence.
- A review and its included studies are not independent evidence.
- Many papers remain behind paywalls.
- Abstracts can omit important limitations.
- Medical errors create a high user risk.

PubMed notes that publishers can hold copyright in abstracts. The product needs a storage and display policy for this content.

### Assessment

Do not use general medical treatment claims as the first domain.

Use medical claims as a later stress test. Start that test with systematic reviews and registered clinical trials.

## Official statistical sources

Official statistics provide the best first-domain ecosystem.

| Provider | Cost | Best use |
| --- | ---: | --- |
| [FRED](https://fred.stlouisfed.org/docs/api/fred/) | Free; API key required | Series discovery, economic data, release metadata |
| [BLS](https://www.bls.gov/developers/api_FAQs.htm) | Free | Employment, unemployment, wages, prices |
| [Census Data API](https://www.census.gov/data/developers/guidance/api-user-guide.API_Key.html) | Free | Population, housing, business, geography |
| [BEA](https://apps.bea.gov/api/) | Free | GDP, income, trade, industry accounts |
| [World Bank](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392) | Free; no authentication | Nearly 16,000 global indicator series |
| [OECD](https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html) | Free | Cross-country economic and social statistics |
| [Eurostat](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction) | Free | European official statistics |
| [IMF](https://data.imf.org/en/Resource-Pages/IMF-API) | Free access | Macroeconomic and financial data |
| [Our World in Data](https://docs.owid.io/projects/etl/api/chart-api/) | Free, CC BY 4.0 | Normalized data with source metadata |

BLS permits 500 registered queries each day. FRED permits up to 120 requests each minute.

These limits are sufficient for an MVP. Bulk downloads and caching can support later scale.

### Evidence-lineage requirement

FRED often republishes another agency's data. The evidence graph must not count FRED and the primary agency as independent evidence.

The graph should preserve this relationship:

```text
Claim
  -> BLS observation
      -> BLS series
      -> BLS release
  -> FRED copy
      -> same BLS series
```

The graph must identify replicas, transformations, and original publishers.

### Revision requirement

Official statistics can change after their first publication.

The system must preserve:

- Observation period
- Release date
- Retrieval date
- Data vintage
- Revision status
- Unit
- Seasonal adjustment
- Geography
- Population definition

A result without a data vintage is not fully reproducible.

## Government, legal, and company sources

These sources are inexpensive and authoritative. Interpretation can still be difficult.

| Provider | Cost | Best use |
| --- | ---: | --- |
| [SEC EDGAR](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) | Free | Filings, company facts, XBRL financial data |
| [Federal Register](https://www.federalregister.gov/developers/documentation/api/v1) | Free, no key | United States rules, notices, executive documents |
| [Congress.gov](https://api.congress.gov/) | Free key | Bills, votes, actions, members |
| [CourtListener](https://www.courtlistener.com/help/api/rest/) | Free low-rate access | Cases, opinions, citations, RECAP records |
| GovInfo | Free | Official United States publications |
| State legislative APIs | Usually free | State bills and legislative action |

SEC filing claims are a strong second-domain candidate. Filings are primary, structured, public, and versioned.

Legal claims are harder. A document can exist without supporting the user's interpretation of the law.

## News and current-event sources

| Provider | Cost | Notes |
| --- | ---: | --- |
| [GDELT](https://gdeltproject.org/data.html) | Free | Large event and news metadata corpus |
| [NewsAPI.org](https://newsapi.org/pricing) | $449 monthly for production | Search metadata; no full article text |
| [NewsAPI.ai](https://newsapi.ai/plans) | $90 monthly for 5,000 searches | Full content and enriched article data |
| [Guardian Open Platform](https://open-platform.theguardian.com/access/) | Free for non-commercial use | Full Guardian archive and article text |
| General search APIs | About $1-$7 per 1,000 searches | Usually sufficient for an MVP |

### Risks

- Many articles repeat one wire report.
- Many articles repeat one press release.
- Publication count does not measure evidence independence.
- Headlines can overstate the source text.
- Articles can change after publication.
- Full-text licenses can prohibit storage or redistribution.
- Current-event conclusions can change rapidly.

News should not be the first domain.

## General knowledge and popular-culture sources

| Provider | Cost | Main limitation |
| --- | ---: | --- |
| Wikipedia and Wikidata | Free with limits | Community data is not always a primary source |
| [Wikimedia Enterprise](https://enterprise.wikimedia.com/blog/enhanced-free-api/) | 50,000 free requests monthly | Higher production access can require payment |
| [TMDB](https://developer.themoviedb.org/docs/faq) | Free for non-commercial use | Commercial and AI use requires an agreement |
| [MusicBrainz](https://musicbrainz.org/doc/MusicBrainz_API) | Free; one request each second | Community data and limited request rate |
| [Open Library](https://openlibrary.org/developers/api) | Free; one or three requests each second | Not intended as a commercial bulk backend |
| Google Fact Check Tools API | Free quota | Returns prior fact checks, not ground truth |

This domain looks easy but has weak authority rules. It also contains many harmless but ambiguous claims.

The product can use these sources for entity resolution and context. It should not treat them as universal ground truth.

## Web archives

| Provider | Cost | Best use |
| --- | ---: | --- |
| [Common Crawl](https://commoncrawl.org/get-started) | Free data access | Historical pages and bulk web analysis |
| Internet Archive and Wayback Machine | Free public access with limits | Historical versions of known pages |

Archives help with claims about previous web content. They are less useful for complete source discovery.

Archive processing can create substantial compute and engineering costs despite free data access.

## Domain comparison

| Domain | Source cost | Source structure | Judgment difficulty | License risk | MVP value |
| --- | --- | --- | --- | --- | --- |
| Official statistics | Very low | Excellent | Low to medium | Low | Best |
| SEC and company filings | Very low | Good | Medium | Low | Strong second choice |
| Bibliographic claims | Very low | Excellent | Low | Low | Good but narrow |
| Medical treatment effects | Low retrieval cost | Good metadata | Very high | Medium | Later stress test |
| Law and regulation | Very low | Good | High | Low | Later |
| Popular culture | Low | Mixed | Medium | Medium | Weak |
| News and current events | Medium | Mixed | High | High | Weak |
| General web claims | Low per request | Poor | Very high | High | Do not start here |

## Recommended MVP source stack

The system should use this source order:

1. Parse the claim into a structured observation.
2. Query the primary agency API.
3. Use FRED to find series and release metadata.
4. Confirm the original publisher and source lineage.
5. Use general web search when structured lookup fails.
6. Store the data vintage and retrieval time.
7. Return a categorical result before a probability.

Useful initial result classes are:

```text
matches_official_data
does_not_match_official_data
ambiguous_measure
ambiguous_timeframe
data_not_available
superseded_by_revision
```

The structured claim should include these fields:

```json
{
  "measure": "civilian unemployment rate",
  "value": 4.3,
  "unit": "percent",
  "geography": "United States",
  "period": "2026-08",
  "seasonalAdjustment": "seasonally adjusted",
  "evidenceVintage": "2026-09-16"
}
```

The result should separate interpretation confidence from data agreement.

For example, the system can have high data agreement and low interpretation confidence. This occurs when the claim omits seasonal adjustment.

## Expected source cost

A normal statistical verification can use only free public APIs. Its direct source cost can approach zero.

One fallback web search usually costs between $0.001 and $0.007. Page extraction usually adds about $0.001 per page.

For 10,000 claims, one search for each claim has this approximate cost:

- Parallel: $10-$50
- You.com or Brave: about $50
- Exa: about $70
- Serper: about $10 after its minimum purchase

Model inference will probably cost more than source access. Human review will cost much more than both.

The project must measure the full cost for each completed verification. A low search price can hide high token and review costs.

## Licensing and storage risks

The proposed architecture caches source documents, passages, judgments, and results. Provider terms can conflict with this design.

The project must check these rights before production use:

- Search-result storage
- Full-page storage
- Passage display
- Commercial use
- Model input use
- Training or evaluation use
- Redistribution
- Required attribution
- Required deletion after contract termination

Brave states that result storage requires a plan with storage rights. TMDB requires a commercial agreement for commercial and AI uses.

Semantic Scholar can require an expanded license for commercial dataset use. PubMed does not grant copyright rights for publisher abstracts.

Provider price alone is therefore not a sufficient selection criterion.

## Provider evaluation plan

The project should create a fixed test set before it selects a general search provider.

Use at least 200 claims across the planned domains. Include true, false, ambiguous, and outdated claims.

For each provider, measure:

- Authoritative-source recall at 5, 10, and 20 results
- Contradictory-source recall
- Passage support accuracy
- Duplicate-source rate
- Original-source discovery rate
- Publication-date accuracy
- Full-text extraction success
- Latency
- Direct provider cost
- Downstream token cost
- License compatibility

Run each query more than once. This test identifies result instability.

Do not use one provider as both the research system and the evaluation judge.

## Feasibility gates

The project needs two gates.

### Gate 1: official statistics

Verify 1,000 official statistical claims with known labels.

Measure:

- Claim-interpretation accuracy
- Correct series selection
- Exact value agreement
- Unit agreement
- Geography agreement
- Time-period agreement
- Revision handling
- Explanation traceability
- Cost per claim

Stop or redesign the project if this gate cannot produce high accuracy and stable explanations.

### Gate 2: bounded medical claims

Verify 200 medical claims through systematic reviews and registered trial records.

Limit the claim form, population, intervention, comparator, and outcome.

Measure:

- Study-selection recall
- Evidence-dependence detection
- Scope-match accuracy
- Causal-language accuracy
- Calibration
- Expert disagreement
- Cost per claim

If Gate 1 succeeds and Gate 2 fails, the project can still support domain-specific verification.

That result would not support a general Epistemic API.

## Final decision

Build the first vertical around official United States statistics.

Use BLS, Census, and BEA as primary sources. Use FRED for discovery and release metadata.

Add World Bank, OECD, Eurostat, and IMF after the United States vertical works.

Use general web search only as a fallback during the first vertical.

Run a separate comparison of Exa, You.com, Parallel, and Brave before the project selects one discovery provider.

Use SEC filings as the likely second operational domain. Use bounded medical claims as the first difficult synthesis test.
