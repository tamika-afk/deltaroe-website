---
name: distributor-scorecard
description: >
  Score distributors or customers on growth, breadth of families bought, order frequency,
  margin, payment behavior, and share of wallet, tier them, assign the action per tier,
  and build the annual line-review pack. Use this skill whenever someone asks which
  distributors deserve more attention, who should be on a stocking program, whether a
  distributor is worth the discount they get, or needs a line-review presentation.
  Trigger on "score our distributors," "who are our A accounts," "build the line review,"
  "which distributors are worth it," "rank the channel." Pairs with
  [[red-flag-accounts]] for month-to-month movement and [[margin-leakage-audit]] for
  the true margin behind each discount.
---

# Distributor and Customer Scorecard

Distributors are graded on volume in most companies, which is why the biggest
distributor with the deepest discount, slowest payment, and narrowest product mix keeps
getting the best treatment. A scorecard puts six things on the table at once so the
tiering reflects what the account is worth, not just what it ships. The trap is a
scoring model nobody can explain to the distributor; if a principal cannot say in one
sentence why an account is a B, the tier will be argued out of existence. Done means:
a score with the six components visible, a tier, an action per tier, and a line-review
pack that a rep can present in 20 minutes.

## Inputs
- Shipment or invoice lines by customer × item × month, 24+ months, read-only from the
  ERP (Infor Syteline/CloudSuite, Epicor P21/Eclipse, NetSuite, Acumatica). Invoice
  date is an acceptable substitute for ship date.
- Item master with product family and product code, so breadth can be counted.
- Cost by item (standard or average) and the discount matrix or contract price per
  customer, to compute margin. If cost is not available, use list-price discount depth
  as the margin proxy and label it.
- AR history: invoice date, due date, paid date, terms, for the payment score. If only
  aging snapshots exist, use average days past due from the snapshots.
- Share-of-wallet evidence: distributor's reported total category purchases, POS data,
  branch count, or a manager's estimate per account. When nothing exists, use the
  company's share of the distributor's estimated category spend from an industry rule
  of thumb and mark the score as estimated.
- Account master: rep, territory, distributor vs end-user, parent chain roll-up.

## Process

### 1. Build the account base and the period
- Roll ship-tos and branches up to the buying entity that negotiates terms. Keep branch
  detail for the breadth and frequency components and for the line-review pack.
- Default period: trailing 12 months vs the prior 12. Exclude accounts below $2,500 T12
  from scoring (they go on a "develop or drop" list with their count and dollars).

### 2. Compute the six components
- Growth: `12/12 ROC = (T12 / P12 − 1) × 100` (see [[itr-trend-analysis]]). Cap at ±100%
  for scoring so one small account growing 800% does not dominate.
- Breadth: `families bought = count of product families with ≥ $500 in T12`, divided by
  the families the company sells. Also list the families NOT bought; that list is the
  line-review opportunity.
- Frequency: `orders per month = distinct order count in T12 / 12`, plus the trend vs
  P12. Frequency falling while dollars hold means consolidation into fewer, larger
  orders or a stocking change; both are worth a question.
- Margin: `pocket margin % = (net sales − COGS − freight absorbed − rebates − co-op) /
  net sales`. If only invoice margin is available, use it and note that rebates and
  freight are not in it (see [[margin-leakage-audit]]).
- Payment: `average days to pay − terms days` (positive is late) and `% of invoices paid
  more than 10 days past terms`. Default weights inside the component: 70% average
  lateness, 30% late-invoice share.
- Share of wallet: `SoW = our T12 / distributor's estimated category purchases`. Mark
  the source of the denominator on every row.

### 3. Score and weight
- Scale each component to 0 to 100 by percentile rank within the scored population
  (ties share rank). Percentile scaling keeps one outlier from compressing everyone
  else.
- Default weights: growth 25, margin 20, share of wallet 20, breadth 15, frequency 10,
  payment 10. Print the weights in the output; if the user changes them, print both the
  old and new and the tier changes that result.
- `Score = Σ (component percentile × weight) / 100`.
- Also carry the raw dollars. A score without the T12 next to it will be misread.

### 4. Tier and assign the action
- A: top 20% by score AND T12 ≥ the company's A floor (default: the T12 level that
  captures the top 50% of revenue). Action: joint business plan, stocking program,
  co-op and training budget, quarterly business review, protect from any territory
  change.
- B: next 30%. Action: breadth push on the families not bought, a volume tier or growth
  rebate with a target, semi-annual review.
- C: next 30%. Action: fix the weak component (late payment gets a terms conversation;
  low breadth gets a sample program), annual review, no new discount depth.
- D: bottom 20% or negative pocket margin or chronic late payment. Action: line review
  with minimum order and freight terms, move to standard matrix pricing at renewal, or
  a planned exit with the rep's input.
- Never tier a distributor by score alone if a manager knows a reason the data misses
  (a new branch, a lost buyer). Record the override and the reason next to the tier.

### 5. Build the annual line-review pack per A and B account
- 12-month performance vs prior year, by family and by branch.
- Breadth map: families bought vs not, with the top three items to add and the reason
  (adjacent to what they already stock).
- Stocking recommendation: the top 20 items by their velocity that they do not stock,
  with suggested min/max (see [[reorder-point-optimizer]]).
- Programs: rebate tier status (earned vs target), co-op balance, promotions planned,
  training dates.
- Service metrics from our side: fill rate to them, on-time ship, back-orders, so the
  review is two-way.
- One page. Charts where they help. The rep presents it; it is not sent cold.

### 6. Flag channel and margin risks
- Any distributor whose pocket margin is below the company floor, or whose discount is
  deeper than its tier justifies, goes on the pricing-review list for
  [[contract-pricing-review]].
- Any end-user account scoring A that buys through a distributor stays attributed to
  the distributor; the action is to strengthen that pair, never to route around it.

## Output format
ALWAYS structure as:
1. Summary — accounts scored, weights used, tier counts and dollars per tier.
2. Scorecard table — account, rep, T12, P12, growth %, breadth (n of N), orders/mo,
   pocket margin %, days late, SoW %, score, tier, override note.
3. Tier actions — the action list per tier with owner role and due quarter.
4. Movers — accounts that changed tier since the last run, with the component that
   moved them.
5. Line-review packs — one per A and B account (or the top N requested), in the
   one-page format from step 5.
6. Risk list — margin-below-floor and discount-deeper-than-tier accounts for pricing
   review.
7. Data notes — sources, pull date, estimated SoW denominators, exclusions.

## Guardrails
- Every figure is read from the named source; SoW denominators that are estimates are
  marked as estimates on every row that uses them.
- The ERP, CRM, and AR systems are read-only for this skill.
- Tiers and actions are recommendations. A human (sales manager or principal) approves
  the tier list before any distributor sees a change in program or pricing.
- Never propose that an end-user buy direct, and never propose pulling an account from a
  distributor as a "tier D" action without the channel manager's decision.
- Payment behavior and margin data are confidential; the line-review pack shows the
  distributor its own performance, never another distributor's.
- Any pricing change that follows a tier review goes through [[price-list-management]]
  with a logged old/new/reason.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** distributor POS/sell-through data (EDI 867 or the distributor's supplier portal) for a real share-of-wallet denominator; the Industrial Supply Association or NAW benchmarking studies (paid) for typical distributor margin and turn benchmarks; a credit bureau feed (D&B, Creditsafe, paid) for payment-behavior context outside our own AR. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
