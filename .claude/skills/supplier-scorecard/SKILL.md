---
name: supplier-scorecard
description: >
  Score suppliers on on-time delivery, quality (PPM and rejects), lead-time stability,
  price trend, responsiveness and risk (single source, geography, tariff exposure,
  financial health), produce the quarterly supplier review pack, and maintain the
  dual-source watch list. Use this skill whenever purchasing wants to rank suppliers,
  a supplier's performance is in question, a quarterly business review is due, or the
  company is deciding where a second source is needed. Trigger on "score our
  suppliers," "supplier scorecard," "who is late," "supplier review," "do we need a
  second source," "tariff exposure by supplier." Pairs with [[reorder-point-optimizer]]
  which consumes the lead-time statistics, and [[inventory-health-audit]] for the
  supplier-caused excess.
---

# Supplier Scorecard and Risk Review

Suppliers are judged by the last problem, and the loudest one gets the attention while
the quietly deteriorating one gets the next big PO. A scorecard puts every supplier on
the same six measures from the same data, so the review is about the numbers and the
conversation with the supplier is about fixing them. The trap is scoring only delivery
and price; the supplier that is on time and cheap and the only source on the planet for
an A item is the biggest risk in the building. Done means: a score per supplier with
the six components visible, a quarterly pack purchasing can present to the supplier, and
a dual-source watch list with the dollars exposed and the next action.

## Inputs
- PO history, 24+ months, read-only from the ERP: supplier, item, PO date, promised
  date (original and any revised), quantity ordered, receipt date, quantity received,
  unit price, currency (Infor Syteline/CloudSuite PO and receipt tables, Epicor P21
  `po_hdr`/`po_line`/`inv_receipts`, NetSuite purchase transactions).
- Receiving inspection and quality records: units inspected, units rejected, reason,
  NCR or SCAR numbers, corrective-action open and close dates. If inspection is not
  tracked, use returns to vendor and credits as the proxy and say so.
- Item master: supplier by item, approved alternate suppliers, country of origin, HTS
  code, ABC class or annual spend.
- AP data for spend by supplier and payment terms; supplier master for address, country,
  incoterms, and any financial-risk score already purchased.
- Responsiveness evidence: RFQ sent and quote received dates, corrective-action response
  times, from the purchasing inbox or CRM if tracked; otherwise a buyer's rating with
  the reason.
- Tariff schedule exposure: current duty rates by HTS and country (Section 232, 301,
  AD/CVD where relevant) from the company's customs broker or CBP.

## Process

### 1. Build the supplier × period base
- Default period: trailing 12 months, with the prior 12 for trend and the last quarter
  for the review pack. Roll up supplier locations to the negotiating entity; keep the
  plant detail where quality differs by plant.
- Spend per supplier and share of total spend; ABC the suppliers (A = first 80% of
  spend). Score everyone, review A and B quarterly, C annually.

### 2. Compute the six components
- On-time delivery: `OTD % = receipt lines received on or before the promised date +
  grace / lines received`. Default grace: 0 days early limit of 7, late limit of 2
  (state the window). Measure against the ORIGINAL promise date; a supplier that
  revises dates to hit 100% gets a second line, `OTD to original promise %`, and the
  gap is the finding.
- Quality: `PPM = units rejected / units received × 1,000,000`; `reject rate % = lines
  with any rejection / lines received`; `corrective action closure days = average days
  from SCAR issue to accepted close`. Typical: under 500 PPM good for machined
  components, under 5,000 acceptable for commodity stock; cite as general benchmarks.
- Lead-time stability: from PO date to receipt date, `mean lead time`, `standard
  deviation`, `CV = σ / mean`, and `promised vs actual = mean(actual − quoted)`. CV under
  0.25 is stable; over 0.5 is a planning problem. Hand mean and σ per item to
  [[reorder-point-optimizer]].
- Price trend: `price index = Σ (current unit price × T12 quantity) / Σ (prior-year unit
  price × T12 quantity)` (a Laspeyres-style index on the current basket). Compare to
  the relevant commodity index; a supplier rising faster than the market is a
  negotiation, one rising slower is a partner.
- Responsiveness: `RFQ turnaround days`, `SCAR response days`, and the buyer rating 1 to
  5 with a written reason. Default weights within the component: 40/30/30.
- Risk: a 0 to 100 sub-score from: single source (no approved alternate on A items,
  +40), geography (one country with a concentration over 50% of that supplier's items,
  +20; the country's trade or logistics risk, +0 to 20), tariff exposure (`exposed $ =
  T12 spend × duty rate`, +0 to 20 scaled), financial health (D&B or Creditsafe score,
  or late-shipment plus price-increase pattern as a proxy, +0 to 20). Print each
  contributor.

### 3. Score and weight
- Scale each component to 0 to 100 (OTD and quality directly; lead-time stability and
  price trend by percentile within the population; risk inverted so lower risk scores
  higher).
- Default weights: OTD 25, quality 25, lead-time stability 15, price trend 10,
  responsiveness 10, risk 15. Print the weights; if changed, show both and the rank
  changes.
- `Score = Σ (component score × weight) / 100`. Rate: 85+ preferred, 70 to 84
  approved, 55 to 69 conditional (improvement plan required), under 55 probation
  (no new awards until improved).

### 4. Build the dual-source watch list
- Every A-class item (by spend or by criticality flag) with exactly one approved
  supplier goes on the list, with: T12 spend, on-hand months of supply, supplier score,
  supplier risk sub-score, `exposure $ = T12 spend + expedite premium estimate`, and
  the candidate second sources known (from the item master alternates, prior RFQs, or
  a note that none are identified).
- Rank by exposure × risk. The top 10 get an action: qualify a second source (RFQ and
  first-article plan), increase safety stock as a bridge (send to
  [[reorder-point-optimizer]]), or accept the risk with a named approver and a review
  date.
- Add items where the single supplier is in a country with active or proposed tariff
  changes, whatever the item class.

### 5. Build the quarterly review pack per A and B supplier
- One page per supplier: score and rating with the trend (last 4 quarters), the six
  components with the numbers behind them, the top five late or rejected POs with
  dates, open corrective actions, price index vs market, the watch-list items they
  supply, and the three asks for next quarter with dates.
- The pack goes to the supplier through the buyer; the supplier sees only their own
  data and never another supplier's.
- Internal page: spend concentration, risk map, the probation list, and the savings or
  cost-avoidance from the quarter's actions.

### 6. Feed the other processes
- Lead-time statistics to [[reorder-point-optimizer]] by item.
- Supplier-caused excess (MOQ, over-shipment, quality holds) to
  [[inventory-health-audit]].
- Cost changes with effective dates to [[price-list-management]] as the basis for any
  pass-through.
- Store the quarter's scores so the trend line exists next quarter.

## Output format
ALWAYS structure as:
1. Summary — suppliers scored, spend covered, rating counts, movers since last
   quarter, watch-list exposure $.
2. Scorecard table — supplier, class, T12 spend, OTD % (window and original-promise),
   PPM, reject %, SCAR close days, lead time mean/σ/CV, price index vs market,
   responsiveness, risk sub-score with contributors, score, rating, trend.
3. Dual-source watch list — item, supplier, spend, months on hand, exposure $, risk,
   candidates, action, owner, date.
4. Quarterly review packs — one page per A and B supplier in the step 5 format.
5. Tariff and geography exposure — spend by country and HTS with current duty and
   exposed dollars.
6. Actions — probation and conditional suppliers with their improvement plans, RFQs to
   issue, safety-stock bridges proposed.
7. Data notes — sources, pull date, grace window, proxies used, benchmarks cited.

## Guardrails
- Every metric comes from the PO, receipt, and inspection records pulled this session;
  buyer ratings are labeled as ratings with their reason.
- The ERP is read-only. Supplier status changes (approved, conditional, probation),
  alternate-supplier assignments, and safety-stock changes are made by a human through
  the company's process, and each is logged (supplier or item, old, new, reason,
  approver, date).
- OTD is always shown against the original promise date alongside the revised one; a
  scorecard on revised dates alone is not published.
- Never share one supplier's data, pricing, or score with another supplier; the review
  pack is per supplier.
- A probation or exit recommendation on a single-source supplier is not made without
  the bridge plan (second source or safety stock) beside it.
- Tariff rates are read from the broker or CBP source with the date; never from memory,
  since they change without notice.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** a supplier financial-risk feed (D&B, Creditsafe, RapidRatings, paid) for the financial-health component instead of a proxy; the customs broker's entry data or ACE reports (free with the broker relationship) for exact duty paid by supplier and HTS; a commodity index subscription (Fastmarkets, MetalMiner, paid) to judge price trend against the market rather than in isolation. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
