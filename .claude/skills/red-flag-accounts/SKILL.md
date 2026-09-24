---
name: red-flag-accounts
description: >
  From shipment or invoice history, flag lost, declining, gone-quiet, fast-growing and new
  accounts with defensible thresholds, pace-adjust open periods, and give the rep one
  talking point per flag. Use this skill whenever someone asks who we are losing, who
  stopped ordering, which accounts are taking off, or wants a call list built from the
  numbers. Trigger on "who did we lose," "which accounts are down," "who went quiet,"
  "build the red-flag report," "give the reps a call list." Pairs with
  [[distributor-scorecard]] for the tiered view and [[itr-trend-analysis]] for whether
  the decline is the account or the market.
---

# Red-Flag Account Report

Every sales manager knows the top ten accounts by heart. Nobody knows the forty
mid-sized accounts that quietly stopped ordering eight months ago, and by the time the
annual comparison shows it, the competitor has been in there for a year. The trap is a
report that is either so sensitive every rep gets 200 flags and ignores them, or so
blunt it only catches losses that are already old news. Done means: a short list per rep,
each flag with the dollars behind it and one specific thing to say on the call.

## Inputs
- Shipment lines by customer × ship-to × month, 24+ months (36 preferred), at sales
  dollars, from the ERP read-only (Infor Syteline/CloudSuite `SLCoShips`-style views,
  Epicor P21 invoice history, NetSuite transaction lines). If only invoices exist, use
  invoice date and say so. Drop returns and credits into their own column.
- Account master: bill-to, ship-to, rep or territory code, distributor vs end-user flag,
  parent account (national chains roll up).
- Open orders and backlog by customer, if available, so a "quiet" account with a big
  open order is not flagged.
- Comparison-period definition: trailing 12 vs prior 12 by default; fiscal YTD vs prior
  YTD when the user is a manager working a fiscal year.
- CRM notes or last-touch dates if the CRM (HubSpot, Salesforce, Dynamics 365, Zoho,
  Pipedrive) is accessible; optional but it improves the talking points.
- Distributor channel context: which accounts are distributors, which are end-users
  buying through a distributor, which are drop-ships attributed to a territory.

## Process

### 1. Build the account × period matrix
- Roll ship-tos up to the account level a rep actually calls on. Keep the ship-to detail
  for the talking point ("the Dayton plant stopped, Columbus is still buying").
- Attribute drop-ships to the territory of the ship-to state, not the distributor's
  warehouse, or a rep will be flagged for a decline in a warehouse that never was theirs.
- Compute for every account: trailing-12 dollars (T12), prior-12 dollars (P12), months
  with a shipment in each, first-ship date, last-ship date, median gap between shipments
  (in days, over the last 8 shipments), open-order dollars.

### 2. Pace-adjust any open period
- If the current period is open (fiscal YTD, current quarter), compare to the same
  elapsed window of the prior period, not the full prior period:
  `prior comparable = prior-period dollars through the same day-of-period`.
- Where a full-period estimate is wanted:
  `pace = period-to-date × (business days in period / business days elapsed)`.
  Mark paced values in every table. Never flag "declining" on a paced number alone
  without the elapsed-window comparison agreeing.

### 3. Apply the flag rules with defaults (all tunable, all printed in the report)
- Account floor: P12 or T12 ≥ $2,500 (or the account is in the top 80% of revenue).
  Below the floor, accounts go to a separate "small" tally so the count is known but the
  reps are not flooded.
- Lost: P12 ≥ floor, zero shipments in the last 6 months, and days since last shipment
  > 2 × the account's median gap. Dollars at risk = P12.
- Declining: T12 vs P12 down ≥ 25% AND down ≥ $1,000. Dollars at risk = P12 − T12.
- Gone quiet (not yet lost): shipped in the last 12 months, days since last shipment >
  2 × median gap (minimum 60 days), and no open orders. This is the early-warning flag
  and the most valuable one.
- Fast growing: T12 vs P12 up ≥ 25% AND up ≥ $1,000. Opportunity = T12 − P12.
- New: first shipment inside the current period and T12 ≥ $500.
- Single-invoice accounts (one shipment ever) are listed once as "project or trial," not
  as lost the next year.
- Rank within each flag by dollars, then by recency. Cap the per-rep list at 25 flags;
  spill the rest into an appendix.

### 4. Separate the account from the market
- Compare each declining account's change to the family or territory 12/12 from
  [[itr-trend-analysis]]. An account down 20% in a family down 22% is holding share; the
  talking point is different from an account down 20% in a family up 10%.
- For distributors, check whether the decline is one branch or all branches, and whether
  a competing line was added (ask the rep; do not assume).

### 5. Write one talking point per flag
- Lost: "You bought $X of [top family] through [month]. What changed, and what would it
  take to earn a test order back?" Include the last three items bought.
- Declining: name the family or ship-to that dropped, the dollars, and one adjacent
  product or program to offer. If the account is on an expiring contract price, say so
  (see [[contract-pricing-review]]).
- Gone quiet: "Your usual cadence is every N weeks; it has been M. Are you stocked, or
  did something change?" Attach any open quote.
- Fast growing: thank them, ask what is driving it, propose a stocking program or a
  volume tier before a competitor does.
- New: confirm they found what they needed, set up the second order, introduce the
  distributor if they came in through the website.
- Never write a talking point that suggests an end-user buy direct instead of through
  their distributor. Channel conflict is a flag, not a play.

### 6. Package by rep and by manager
- Rep view: their accounts only, sorted by flag then dollars, with the talking points.
- Manager view: counts and dollars per flag per rep, the top 20 by dollars across the
  company, and the accounts flagged two runs in a row with no CRM touch logged.
- Store the run: date, thresholds used, and the flag list, so the next run can show
  which flags were worked and which resolved.

## Output format
ALWAYS structure as:
1. Summary — counts and dollars by flag, thresholds used, period and pace treatment.
2. Lost accounts — table: account, rep, P12, last ship date, months silent, top
   family, talking point.
3. Declining accounts — table: account, rep, P12, T12, change $, change %, market
   context, talking point.
4. Gone-quiet accounts — table: account, rep, T12, usual gap, days since last, open
   orders, talking point.
5. Fast-growing and new accounts — two tables with opportunity dollars and the
   offer to make.
6. Repeat flags — accounts flagged on the prior run and still unworked.
7. Data notes — source, pull date, exclusions, small-account tally.

## Guardrails
- Every dollar figure is read from the shipment or invoice source named in the data
  notes; nothing is estimated from memory.
- The ERP and CRM are read-only for this skill. It produces a list; it does not create
  tasks, update accounts, or send anything.
- Never send a talking point to a customer. The rep says it; the report is internal.
- Never propose a price concession as the response to a decline. Pricing changes go
  through [[price-list-management]] with human approval.
- Customer names and dollar figures stay inside the company; a rep sees only their
  territory unless the manager grants more.
- Distributor ethics: no talking point routes an end-user around its distributor.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the CRM's activity log (HubSpot, Salesforce, Dynamics 365) to show which flags already have a touch; distributor POS or sell-through feeds (via the distributor's portal or an EDI 867) to see whether the end-user or the distributor stopped; ZoomInfo or D&B (paid) for ownership changes and plant closures behind a sudden loss. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
