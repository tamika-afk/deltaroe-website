---
name: win-loss-analysis
description: >
  Run the quarterly win/loss analysis from CRM opportunities and quote outcomes: win rates by
  rep, product family, segment, and distributor, loss reasons coded and ranked, a price-versus-
  value diagnosis, and three actions with owners. Use this skill whenever a manager wants to know
  why deals are won or lost, whether price is really the problem, or which segment to stop
  chasing. Trigger on "win/loss," "why are we losing," "what's our win rate," "are we losing on
  price," "quarterly sales review." Pairs with [[quote-followup-sequence]], which produces the
  outcome codes, and [[objection-handling-playbook]], which consumes the findings.
---

# Win/Loss Analysis

Win/loss answers one question the pipeline cannot: what actually decides the deal. The trap is
believing the reps' loss reasons at face value; "price" is the most common code and the least
often true, because it is the reason the buyer gives when they do not want a conversation. Done
means win rates cut by the dimensions that matter with sample sizes shown, loss reasons
re-coded from evidence, a diagnosis of whether price or value is the lever, and three actions
the team will actually take this quarter.

## Inputs
- Closed opportunities from the CRM for the quarter and the same quarter last year: id,
  account, owner, distributor, stage reached, amount, product family, segment or industry,
  source, created and closed dates, outcome, loss reason code and text, competitor.
- Quote outcomes from the ERP or quote engine (read-only) for the same windows: quote,
  customer, items, quoted price, list price, discount depth, outcome, reason.
- Invoice lines to confirm "won" quotes actually shipped and at what amount versus quoted.
- Buyer interviews: five to eight per quarter, split across wins and losses, 15 minutes each,
  done by someone other than the rep. If none exist, run them; the analysis is labeled
  rep-reported until they do.
- Minimum sample: a cut with fewer than 20 closed deals is reported with a "small sample" flag
  and no action is based on it alone.

## Process

### 1. Assemble the closed set
- Union CRM outcomes and quote outcomes on account and date; where both exist for a deal, the
  order or invoice record wins. Exclude open and no-decision from the win-rate denominator but
  report them separately: `no-decision rate = no decision ÷ (won + lost + no decision)`.

### 2. Win rates
- `Win rate (count) = won ÷ (won + lost)`; `win rate ($) = won $ ÷ (won $ + lost $)`.
- Cut by rep, product family, segment, distributor, source, deal-size band (quartiles), stage
  reached, and competitor. Show n for every cut. Compare to the same quarter last year and to the
  trailing four quarters.
- `Median days to decision` per cut. A lengthening median with a flat win rate usually means
  weakening qualification, not competition.

### 3. Re-code the loss reasons
- Taxonomy: price, incumbent relationship, lead time or availability, spec or technical fit,
  no budget or project cancelled, brand or trust, distributor loyalty, service or support,
  unknown. One primary code per loss.
- Evidence rule: a loss is coded "price" only when a competitor's price or a stated delta exists
  in the notes, the interview, or the quote log. Otherwise it is "unknown, rep-attributed
  price". Report both the rep-reported and the evidence-based distribution side by side; the gap
  between them is a finding.

### 4. Price-versus-value diagnosis
- Bucket closed quotes by discount depth from list (0, 1 to 5, 6 to 10, 11 to 20, over 20
  percent). Compute win rate per bucket. If win rate does not rise materially with discount
  depth (default: less than 10 points from the shallowest to the deepest bucket), price is not
  the lever, and deeper discounts are giving away margin for nothing.
- Compare won and lost deals on the value signals: number of contacts engaged, trial or sample
  run, technical support involved, days from first contact to quote. Wins with more of these and
  losses with fewer point to a process gap, not a price gap.
- Competitive: where a competitor is named, win rate against that competitor and the family
  where they win most.

### 5. Segment decisions
- For each segment and family: win rate, average deal size, days to decision, margin if
  permitted. Classify: **invest** (win rate above the company median and size above median),
  **fix** (size above, win rate below), **harvest** (win rate above, size below), **stop
  chasing** (both below, n at least 20).

### 6. Three actions
- Exactly three, each tied to a finding with its numbers, with an owner, a date, and the metric
  that will show it worked next quarter. Typical shapes: a qualification rule, a proof asset,
  a discount guardrail, a segment focus change, a distributor enablement.

## Output format

ALWAYS structure as:
1. **Headline** — win rate by count and dollars versus last year and trailing four quarters,
   no-decision rate, median days to decision, the single biggest finding.
2. **Win-rate cuts** — tables by rep, family, segment, distributor, source, size band, stage
   reached, each with n and the small-sample flag.
3. **Loss reasons** — rep-reported versus evidence-based distributions, dollars per reason, the
   top three with example deals.
4. **Price-versus-value diagnosis** — win rate by discount bucket, the value-signal comparison,
   the verdict in one sentence.
5. **Competitor view** — win rate by named competitor and where they win.
6. **Segment classification** — invest, fix, harvest, stop chasing, with the numbers.
7. **Three actions** — finding, action, owner, date, success metric.
8. **Data quality and assumptions** — uncoded losses, missing quotes, interview count, sample
   flags.

## Guardrails
- All rates come from the closed set assembled in this session; never from a dashboard figure
  or last quarter's deck.
- Never recommend a price change from this analysis alone; a discount guardrail or list change
  is proposed to the pricing owner, approved by a human, and logged.
- Individual rep win rates go to the sales manager, not the whole team; the shared version
  aggregates.
- Buyer interview notes are stored in the CRM on the opportunity; quotes from buyers are
  anonymized in the shared report.
- Where a distributor lost the deal, the finding is about enablement (stock, training, proof),
  never a recommendation to sell around them.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the quote log with list, quoted price, and outcome for the discount-bucket analysis; Clozd or Primary Intelligence (paid) for third-party buyer interviews that reps cannot bias; Gong or Chorus (paid) to check what was actually said on lost deals; the invoice-line table to confirm wins shipped at the quoted amount. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
