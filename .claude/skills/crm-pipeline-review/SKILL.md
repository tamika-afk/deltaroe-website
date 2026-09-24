---
name: crm-pipeline-review
description: >
  Run the weekly sales pipeline review the same way every week: stage-by-stage aging, stalled
  and zombie deals, next-step hygiene, forecast-category roll-up against quota, rep-by-rep
  coaching notes, and a one-page manager output. Use this skill whenever a sales manager wants
  to inspect the pipeline, prepare for the Monday pipeline call, find what is stuck, or check
  whether the forecast categories are honest. Trigger on "pipeline review," "what's stuck in
  the pipeline," "prep the Monday sales call," "is our commit real." Pairs with [[sales-forecast]]
  for the number and [[crm-data-hygiene]] when the review keeps tripping on bad records.
---

# Weekly Pipeline Review

The goal of a pipeline review is not to read deals aloud. It is to find the deals that will
not close on their own, decide what happens to each one this week, and make the forecast
categories mean something. The trap is reviewing by amount: the big deals get discussed, the
aging pattern that is quietly killing the quarter never gets seen. Done means every open deal
over the size threshold has a dated next step, every stalled deal has a decision (push,
downgrade, or close-lost), and the manager holds one page that says what changed since last week.

## Inputs
- Open opportunity export from the CRM (HubSpot, Salesforce, Dynamics 365, Zoho, Pipedrive,
  or the ERP's CRM module such as Epicor P21) with: opportunity id, account, owner, stage,
  amount, expected close date, created date, stage-entry date (or last modified), last activity
  date, next step text, next step date, forecast category, source, product family.
- Stage definitions with written exit criteria. If none exist, write draft criteria from how the
  reps actually use the stages and flag that as a finding.
- Quota or target by rep for the current period, and the same export from last week (the
  snapshot). If there is no prior snapshot, save this one and note that slippage math starts
  next week.
- If there is no CRM, use the quote log from the ERP or quote engine: each open quote is a deal
  at the "Proposal" stage, quote date is the created date, and follow-up date is the next step.
  The ERP is read-only; nothing here writes back.

## Process

### 1. Freeze the snapshot
- Record the as-of timestamp and save the raw export unmodified. Every number in the output
  is reproducible from this file.
- Compute basic counts: open deals, total open amount, blank amounts, close dates in the past
  (the last two go straight to the hygiene list). Default minimum deal size for line-by-line
  review: the 60th percentile of open deal amounts; smaller deals are reviewed in aggregate.

### 2. Stage aging
- `Days in stage = as-of date − stage-entry date`. If the CRM has no stage history, use last
  modified date and state that the aging is understated.
- Compute the median days-in-stage for deals that closed-won in the last 12 months, per stage.
  That median is the benchmark. Default benchmarks if there is not enough history (fewer than 20
  won deals): Qualify 14 days, Discovery 21, Proposal or Quote 30, Negotiation 21, Verbal or
  PO pending 10.
- Flag any deal at more than 1.5 times its stage benchmark. Flag any deal at more than 3 times
  as "aged out": it is reviewed for close-lost, not for a push.
- Build the stage table: count, amount, median age, count flagged, amount flagged.

### 3. Stalled and zombie deals
- Stalled if any of: no logged activity in 14 days, next step blank, next step date in the past,
  or expected close date in the past.
- Zombie if the close date has been pushed three or more times (compare snapshots; if only one
  snapshot exists, use CRM field history where available) or the deal is over 2 times the
  full-cycle median age from created date.
- Each stalled deal gets one of three decisions in the review: push with a dated next step,
  downgrade the forecast category, or close-lost with a coded reason. No fourth option.

### 4. Next-step hygiene score
- Per rep: `Hygiene % = deals with a specific, future-dated next step ÷ open deals × 100`.
  "Specific" means a verb and a person ("send revised quote to plant manager Tues"), not
  "follow up".
- Default target 90 percent. Below 70 percent is a coaching item, not a data item.
- Also report per rep: deals with blank amount, deals past close date, deals with no activity in
  30 days.

### 5. Forecast category roll-up
- Categories: Commit, Best Case, Pipeline, Omitted. Roll each up by rep and in total.
- `Coverage = open pipeline amount ÷ remaining quota`. Default healthy coverage is 3.0 times for
  a 60 to 90 day sales cycle; under 2.0 times means the period is at risk regardless of what
  Commit says.
- `Weighted pipeline = Σ (amount × stage win probability)`, where stage probability is the
  historical closed-won rate for deals that reached that stage, computed from the last 12 months.
  If there is no history, use defaults 10 / 25 / 50 / 75 / 90 percent for the five stages above
  and label them as defaults.
- Commit test: last quarter's Commit at this same point versus what actually closed. If Commit
  landed under 80 percent, the category is being used as "hopeful", say so in the coaching notes.
- Slippage since last snapshot: deals whose close date moved out of the period, deals added, deals
  won, deals lost, net change in Commit.

### 6. Rep-by-rep coaching notes
- Three notes per rep, each tied to a named deal or a measured pattern (aging concentration in
  one stage, low hygiene, Commit inflation). Say what to do, not what is wrong. Distributor-sold
  deals: note when the next step belongs to the distributor and the rep's job is to enable it.

### 7. The one-page manager output
- Assemble the sections below. The top block must be readable in 30 seconds.

## Output format

ALWAYS structure as:
1. **Headline block** — as-of date, remaining quota, Commit, Best Case, weighted pipeline,
   coverage ratio, net change since last week, number of deals needing a decision today.
2. **Stage aging table** — stage, count, amount, benchmark days, median days, flagged count and
   amount.
3. **Decisions needed** — every stalled or zombie deal over the size threshold: account, owner,
   amount, stage, days in stage, what is wrong, recommended decision (push / downgrade / lost).
4. **Forecast category roll-up** — by rep: quota, Commit, Best Case, coverage, last-quarter
   Commit accuracy.
5. **Hygiene scoreboard** — by rep: hygiene %, blank amounts, past close dates, 30-day silent.
6. **Coaching notes** — three per rep, deal-specific.
7. **Data problems found** — records to fix, handed to [[crm-data-hygiene]].
8. **Assumptions** — defaults used, missing history, snapshot caveats.

## Guardrails
- Every number is computed from the saved export. Never state a pipeline figure from memory or
  from a dashboard screenshot when the export is available.
- The skill proposes decisions; the rep and manager make them in the call. Never change stages,
  amounts, or close dates in the CRM on the rep's behalf.
- A quote issued is not automatically an opportunity in Commit. Quote-derived pipelines default to
  the Pipeline category until a human upgrades them.
- Do not include compensation, commission, or individual performance rankings in the shared
  output; coaching notes go to the manager only.
- Distributor deals: never recommend contacting the end customer directly where a distributor
  owns the account. Channel conflict is a risk to flag, not a tactic.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the CRM's native snapshot or field-history reporting (Salesforce Opportunity History, HubSpot deal-stage history) for true days-in-stage; Clari, Gong Forecast, or BoostUp (paid) for automated slippage and Commit-accuracy tracking; the ERP open-quote and open-order tables to reconcile Commit against what has actually been quoted. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
