---
name: objection-handling-playbook
description: >
  Build or refresh an objection-handling playbook from real lost-deal notes, quote outcomes, and
  call records: the top objections ranked by frequency and dollars, the honest response to each,
  the proof to bring, and what never to say. Use this skill whenever reps keep losing on the same
  things, a new rep needs the answers the veterans carry in their heads, or a manager wants
  consistent responses across the team and the distributor channel. Trigger on "objection
  handling," "how do we answer the price objection," "why do we keep losing," "sales playbook,"
  "what do I say when they say." Pairs with [[win-loss-analysis]] for the numbers behind the
  objections and [[discovery-call-guide]] for preventing them earlier.
---

# Objection-Handling Playbook

Objections are the buyer telling you what the proposal did not answer. A playbook built from
real lost deals answers them before they are raised and gives every rep, and every distributor
rep who carries the line, the same honest response. The trap is a playbook written from
imagination: clever rebuttals to objections nobody actually raises, and silence on the one that
loses a third of the deals. Done means a ranked list from real data, one page per objection,
proof assets that exist, and a refresh date.

## Inputs
- Lost-deal notes from the CRM for 12 to 24 months: reason code, free-text reason, stage lost,
  amount, competitor if known, product family, rep, distributor.
- Quote log from the ERP or quote engine with outcome (won, lost, no decision) and any loss
  reason captured by the desk. Read-only.
- Call recordings or transcripts if the company has them (Gong, Chorus, Fireflies); otherwise
  20-minute interviews with the three most and three least successful reps and two distributor
  inside-sales people.
- Win notes too: what the winning reps said when the same objection came up.
- Proof assets that exist: test reports, cycle-time studies, cost-per-part calculators, case
  studies, references willing to take a call, certifications, stock and lead-time data.
- If lost-deal notes are thin (fewer than 30 coded losses), say so, run the interviews, and mark
  the frequencies as interview-based until data accumulates.

## Process

### 1. Harvest and code
- Pull every lost and no-decision record. Code each to one primary objection and up to one
  secondary, using this taxonomy (extend only with evidence): price too high; incumbent
  relationship; no need or not now; lead time or availability; technical fit or spec; risk of
  changing; budget frozen; no authority; brand unknown; distributor loyalty to another line;
  minimum order or packaging; service or support doubt.
- Coding rule: the objection is what the buyer said, not what the rep concluded. "Lost on
  price" with no price comparison in the note is coded "unknown, rep attributed to price".

### 2. Rank
- For each objection: count, share of losses, dollars lost, median deal size, stage where it
  appears most, product families and segments where it concentrates, reps or distributors where
  it concentrates.
- `Priority = share of losses × 0.5 + share of dollars lost × 0.5`. Default: the playbook covers
  every objection above 5 percent priority, minimum six, maximum twelve.

### 3. Diagnose each objection
- Is it a real objection or a symptom of weak discovery (price objections at Proposal usually
  mean the cost of the problem was never quantified)? Note the prevention point from
  [[discovery-call-guide]].
- Compare win notes: what did winning reps do differently against the same objection?

### 4. Write the response page
- **Acknowledge and isolate.** One sentence that shows you heard it, then a question that
  isolates whether it is the only thing standing in the way.
- **The honest response.** Plain English. If the product costs more per piece, say so, then move
  the comparison to cost per part, cost per hole, tool changes per shift, or scrap. Show the
  arithmetic: `cost per part = (tool price ÷ parts per tool) + (cycle minutes × machine rate ÷
  60)`. Never claim what the data does not support.
- **Proof to bring.** The specific asset: a named test report, the calculator with the
  customer's numbers, a reference customer in the same industry, live stock and lead-time data,
  a trial offer with defined success criteria.
- **What NOT to say.** Always: never lead with a discount (price-first teaches the buyer that
  waiting gets a better price); never bad-mouth the incumbent or a competitor by name; never
  promise a delivery date the ERP does not support; never guess at a technical claim; never
  suggest buying direct to an account a distributor serves.
- **If it still stands.** The walk-away or park move: a dated follow-up, a trial, or a
  respectful close-lost with the reason logged.

### 5. Validate with the people who use it
- Read each page to two reps and one distributor rep. Anything they would not say out loud gets
  rewritten. Role-play the top three objections and record the version that sounds human.

### 6. Set the refresh
- Quarterly, rerun steps 1 and 2 from new losses. An objection whose share doubles or a new one
  above 5 percent triggers a page. Record the data window on the cover.

## Output format

ALWAYS structure as:
1. **Objection ranking** — table: objection, count, share of losses, dollars lost, stage,
   where it concentrates, priority score, data window.
2. **Diagnosis** — for each ranked objection, real versus symptom, prevention point, what
   winners did differently.
3. **Response pages** — one per objection: acknowledge and isolate, honest response with the
   arithmetic, proof to bring (named asset and where it lives), what not to say, if it still
   stands.
4. **Universal rules** — the never-say list in one place, for the distributor channel too.
5. **Proof asset gaps** — assets referenced that do not yet exist, with an owner to build each.
6. **Refresh plan** — cadence, trigger thresholds, who owns the playbook.
7. **Assumptions** — coding decisions, thin-data caveats, interview-based frequencies.

## Guardrails
- Frequencies and dollars come from the coded records read in this session; interview-based
  figures are labeled as such.
- No response may include a price, discount level, or margin figure; pricing responses point to
  the cost-per-part method and to a human-approved quote.
- Technical claims in responses must trace to a test report or the application engineering
  team; do not invent tool-life or cycle-time numbers.
- Never write a response that disparages a named competitor, an incumbent, or a distributor.
- Distributor-served accounts: every response that involves price or delivery runs through the
  distributor; the playbook never coaches going around them.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** Gong, Chorus, or Fireflies (paid) for objection frequency measured from real calls rather than memory; the company's cost-per-part or machining-cost calculator as the proof asset behind every price objection; the win-loss dataset from [[win-loss-analysis]] for the numbers; Highspot or Showpad (paid) to put the pages where reps and distributors actually look. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
