---
name: itr-trend-analysis
description: >
  Compute 12/12, 3/12 and 1/12 rates of change on any monthly series (company shipments,
  a product family, a territory, a customer, or a macro indicator), identify the
  business-cycle phase (A/B/C/D), compare against leading indicators, and produce the
  phase playbook and a 12-month outlook with confidence notes. Use this skill whenever
  someone asks where the business is in the cycle, whether a slowdown is real, what
  next year looks like, or how to read a monthly trend. Trigger on "where are we in the
  cycle," "is this a real slowdown," "run the rates of change," "what's the 12/12 doing,"
  "give me a 12-month outlook." Pairs with [[red-flag-accounts]] for the account-level
  view and [[price-list-management]] for phase-timed pricing moves.
---

# ITR-Style Rate-of-Change Trend Analysis

Monthly sales numbers lie. A good month after two bad ones feels like a recovery; a
down month in a growth year feels like a cliff. Rates of change strip out the noise and
tell you the direction and the momentum of the trend, which is what a decision needs.
The trap is reading raw months, or reading only the 12/12, which turns late. Done means:
three rates of change on a clean series, a phase call with the evidence for it, a
comparison to at least one leading indicator, and a playbook someone can act on this
quarter.

## Inputs
- A monthly series, 36+ months, ideally 48 (24 months is the minimum to compute a 12/12
  at all, and it gives a single point, not a trend). Shipments or invoices at sales
  dollars; use units too if price changes were large.
- The source: ERP shipment or invoice history (Infor Syteline/CloudSuite, Epicor P21 or
  Eclipse, NetSuite, Acumatica) pulled read-only. If only invoices exist, use invoice date
  and say so. If only a GL revenue line exists, use it and flag that returns and
  adjustments are mixed in.
- Which series: total company, product family, territory, customer, or an external
  indicator. Segment definitions (what is in "family X") from the item master.
- Price-change dates and sizes, so nominal growth can be split into price and volume.
- One or more leading indicators for the market served: ISM Manufacturing PMI, US
  Industrial Production (Fed G.17), Durable Goods New Orders, the US Cutting Tool
  Consumption report (USCTI/AMT), housing starts, oil rig count, whichever leads the
  customer base. Monthly, 5+ years, from FRED or the publishing body.
- Known distortions: acquisitions, a lost or gained national account, a price-increase
  pre-buy, a fiscal-year calendar, a plant shutdown.

## Process

### 1. Clean the series before computing anything
- Reconcile the monthly totals to the GL or the standard sales report. A series that does
  not tie to a number management already trusts will be argued about, not used.
- Fix partial months. If the current month is open, drop it from all rate calculations
  or pace it: `paced month = month-to-date × (business days in month / business days
  elapsed)`. Label paced values as estimates in every output.
- Remove one-time distortions only with a note. A single $400k project order in one month
  can flip the 3/12 sign. Show the series both ways when a distortion is material (>10%
  of the month).
- Split price and volume where price changes were >5%: deflate dollars by the cumulative
  price index for the segment, or run the analysis in units alongside dollars.

### 2. Compute the moving totals and the three rates of change
- `12MMT = sum of the last 12 months` (12-month moving total). `3MMT = sum of the last 3
  months`.
- `12/12 ROC = (12MMT this month / 12MMT same month last year − 1) × 100`
- `3/12 ROC = (3MMT this month / 3MMT same 3 months last year − 1) × 100`
- `1/12 ROC = (this month / same month last year − 1) × 100`
- Compute every month across the whole history, not just the latest point. The shape of
  the 12/12 line is the analysis; the latest value alone is a headline.
- Sanity checks: 1/12 is the noisiest and should bounce; 3/12 should cross the 12/12
  before the 12/12 changes direction; 12/12 should be smooth. If the 12/12 is jagged, the
  series has data problems (posting-date shifts, month-end cutoffs). Go back to step 1.

### 3. Call the phase
- Phase A, Recovery: 12/12 is below zero and rising (3/12 has crossed above it).
- Phase B, Accelerating growth: 12/12 is above zero and rising.
- Phase C, Slowing growth: 12/12 is above zero and falling (3/12 is below the 12/12).
- Phase D, Recession: 12/12 is below zero and falling.
- The 3/12 crossing the 12/12 is the leading signal of a phase change; a 1/12 crossing the
  3/12 is the earliest and least reliable. Require two consecutive months of the 3/12 on
  the new side of the 12/12 before declaring a turn. State the number of months the
  current phase has run and the typical duration (an industrial B or C phase commonly runs
  12 to 24 months).

### 4. Compare to the market and the leading indicators
- Run the same three rates of change on each leading indicator. Overlay the 12/12 of the
  indicator with the company 12/12 and measure the lead in months by shifting the
  indicator until the correlation peaks (test leads of 0 to 12 months; report the best
  and its correlation coefficient; below 0.5 is not a usable lead).
- Market share read: `share trend = company 12/12 − industry 12/12`. A company growing 4%
  in a market growing 9% is losing share, whatever the raw number looks like.
- If the company series and the indicator disagree in phase, say which to trust and why
  (a single-customer distortion vs a genuine decoupling).

### 5. Build the 12-month outlook
- Extend the 12MMT: apply the expected 12/12 path (from the leading indicator's own
  12/12, shifted by its lead) to the current 12MMT month by month. `Forecast 12MMT(t+n) =
  12MMT same month last year × (1 + expected 12/12(t+n)/100)`. Monthly values follow
  from the differences of consecutive 12MMTs.
- Give three cases: base (indicator-implied), high, low, each with the assumption named.
  Attach a confidence note: how long the indicator's lead has held, how many months of
  clean data exist, and the size of any distortion removed.
- Illustrative math is labeled illustrative. Never present a forecast month as if it were
  a booked number.

### 6. Write the phase playbook
- Phase A: hire ahead of the curve, rebuild inventory of A items before lead times
  stretch, lock supplier pricing, restart marketing spend, avoid cutting price to win the
  first orders back.
- Phase B: raise prices (see [[price-list-management]]), add capacity, build the backlog,
  tighten credit terms while everyone is flush, stop taking every order at any margin.
- Phase C: protect margin, cut costs quietly and early, slow inventory builds, get
  aggressive on receivables, prepare the Phase D cash plan while the numbers still look
  fine to the board.
- Phase D: sell into the segments still in growth, protect cash, buy talent and
  competitors, train, keep the sales force in front of customers, do not chase volume
  with price.
- Tie each play to the segments: a company in C with one family in A gets two plans.

## Output format
ALWAYS structure as:
1. Headline — the phase, the latest 12/12, 3/12, 1/12, and the one-sentence read.
2. Rate-of-change table — last 24 months: month, actual, 12MMT, 12/12, 3/12, 1/12,
   with paced or adjusted values marked.
3. Chart description or chart — the 12/12 and 3/12 lines with the phase bands marked.
4. Leading-indicator comparison — indicator, lead in months, correlation, what it says
   about the next two quarters.
5. Segment view — the same phase call per family, territory, or top customer, in a
   table, with segments out of phase with the total called out.
6. 12-month outlook — base, high, low with assumptions and the confidence note.
7. Phase playbook — five to eight actions for this quarter, each with an owner role and a
   trigger to reverse it.
8. Data notes — source, pull date, distortions removed, open period treatment.

## Guardrails
- Every number in the table comes from the series the skill actually read; the source
  system, table, and pull date are stated. No number is typed from memory.
- The ERP is read-only. This skill never posts, adjusts, or writes anything back.
- Never declare a phase change on one month of data. Two consecutive months on the new
  side of the crossing, minimum.
- Label paced, deflated, or distortion-adjusted values in every place they appear. A
  reader must never mistake an estimate for a booked number.
- Do not present a forecast as a commitment. The outlook is a planning input; the
  confidence note travels with it.
- Segment data that identifies individual customers stays inside the company; strip
  customer names when the output goes to a distributor or rep audience.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** FRED (free) for Industrial Production, PMI proxies, durable goods and housing series with a stable API; ITR Economics Trends Report (paid) for their leading indicator and phase calls on 50+ markets, which is worth it for a company that plans capacity a year out; USCTI/AMT Cutting Tool Consumption (paid membership) for a direct market series in metalworking. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
