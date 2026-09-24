---
name: price-increase-communication
description: >
  Build the customer and distributor communication package for a price change: notice
  letter (distributor and end-user versions), the rep FAQ, effective-date and
  order-protection rules, talking points, and objection responses, plus the internal
  readiness checklist so every system shows the new price on the same day. Use this skill
  whenever a price increase, decrease, surcharge, or structure change has been approved
  and now has to be announced. Trigger on "announce the price increase," "write the
  price letter," "what do we tell the reps," "how do we handle pushback," "price change
  FAQ." Pairs with [[price-list-management]], which produces the approved batch this
  skill announces, and [[contract-pricing-review]] for the accounts whose contracts
  the letter must not contradict.
---

# Price Increase Communication Package

The increase is decided; now the company has to keep the customers while taking it.
Good communication is early, plain, consistent across every rep and every channel, and
leaves the customer with a clear window to act. The trap is the apologetic letter that
invites negotiation, the effective date that conflicts with a distributor's own price
update cycle, and the rep who never got the FAQ and improvises a discount on the phone.
Done means: a letter a distributor can forward to its own customers, a one-page rep FAQ,
rules for orders and quotes in flight that order entry can apply without asking, and a
day-one checklist confirming the new prices are live everywhere at once.

## Inputs
- The approved price batch from [[price-list-management]]: batch id, effective date,
  average and revenue-weighted change, ranges by family, and any structural changes
  (new surcharge, new break tiers, dropped items).
- The reasons behind the change, in business terms the company is willing to state:
  raw material (with the public index if one exists), labor, freight, tariffs, energy,
  a product improvement.
- Channel map: distributors and their price-file formats (Excel, CSV, EDI 832, punchout
  catalog), national accounts with contract terms, direct end-users, reps and agencies.
- Contract and SPA list with expiry dates and any price-protection clauses (from
  [[contract-pricing-review]]), so the letter does not promise what a contract forbids.
- Company policy on order protection: how long quotes are honored, whether blanket
  orders and releases are protected, the pre-buy rule.
- Prior increase history: dates, sizes, and what went wrong last time (late notices, a
  distributor's system not updated, a customer who claimed no notice).
- Brand voice and letterhead, and who signs (sales VP or president; never the rep).

## Process

### 1. Set the calendar and the rules
- Notice period defaults: distributors 60 days (they need 30 to load their own systems
  and 30 to tell their customers), national accounts per contract (commonly 60 to 90),
  direct end-users 30 days. Increases under 3% can go on 30 days; never less.
- Effective date: first business day of a month, avoiding a distributor's known
  quarter-end price cycle, and not during the company's own year-end close.
- Order protection rules (defaults, adjust to policy):
  - Orders received before the effective date ship at the old price if they ship within
    30 days of the effective date; later ship dates take the new price.
  - Written quotes are honored to their stated expiry, capped at 30 days past the
    effective date.
  - Blanket orders: releases scheduled within 60 days of the effective date are
    protected; later releases move to the new price unless a contract says otherwise.
  - Pre-buys: orders exceeding 2× the account's trailing-3-month average are accepted
    only with a ship date inside the protection window; no stockpiling at old prices.
  - Contract prices follow the contract, not the letter.
- Write the rules as a table order entry can apply mechanically.

### 2. Write the distributor letter
- One page. Structure: what is changing (the number and the effective date in the
  first two sentences), why (one paragraph, factual, one or two named drivers, no
  cost breakdown), what is protected (the rules from step 1 in three or four bullets),
  what they get (the new price file in their format on a stated date, updated catalog
  and portal, rep support for their customer conversations), who to contact, a
  signature from the executive.
- Tone: confident and plain. No apology, no "unfortunately," no hedging. Do not invite
  a negotiation the letter cannot close.
- Include a forwardable version the distributor can send to its own customers with its
  own branding (same facts, distributor's name in the from line).

### 3. Write the end-user and national-account versions
- End-user (direct or where the company communicates directly): same structure, shorter
  reasons, and a line that their distributor will have the updated pricing, so the
  channel stays intact.
- National accounts: per contract. If a contract has price protection or a notice
  clause, the letter cites the clause and the date; if the contract price is unchanged,
  the account still gets a courtesy notice saying so.

### 4. Build the rep FAQ and talking points
- FAQ, one page, twelve to twenty questions: how much, when, why, what is protected, can
  I quote old prices, what about open quotes, what about blankets, can a customer
  pre-buy, what if a competitor did not raise, how do I get an exception, where is the
  new price file, who updates the distributor's system, what about contract accounts,
  what about the website and quote tool.
- Talking points, five to seven: lead with the effective date and the protection window
  (the customer's action item), state the drivers in one sentence, connect to value
  (delivery performance, quality, stocking programs), close on what you will do for them
  (send the file, help update their system, review their stocking levels).
- Exception process: who can approve, what evidence is needed (a documented competitor
  quote, a contract), turnaround time. Reps do not grant exceptions on the phone.

### 5. Write the objection responses
- "Your competitor didn't raise": acknowledge, do not disparage, restate the value and
  the drivers, offer a stocking or consolidation review, escalate for a documented quote.
- "We have a contract": confirm from the contract list; if protected, say so and thank
  them; if expired or silent, explain the notice period and offer a renewal
  conversation (see [[contract-pricing-review]]).
- "Can we get an exception": route to the process; never a phone yes.
- "Can we delay or phase it": the protection window is the phase; hold the date.
- "Let us load up first": explain the pre-buy rule and the window.
- "We'll buy direct from you instead" (from a distributor's customer): the answer is
  always the distributor; the company does not sell around its channel.
- One paragraph each, in the rep's voice.

### 6. Internal readiness and day-one verification
- Checklist with an owner and a date for each: ERP price effective date loaded and
  verified by read-back, quote tool and website updated, distributor portal and
  downloadable price files posted, EDI 832 or punchout catalogs sent to each trading
  partner and acknowledged, customer service briefed on the protection rules, reps
  trained on the FAQ, order entry has the rules table, finance knows the date for
  revenue recognition on protected orders.
- Day-one verification: pull five items from each price surface (ERP, website, portal,
  quote tool, one distributor's system if they will share a screenshot) and confirm
  they match the approved batch. Record the check.

## Output format
ALWAYS structure as:
1. Calendar and rules — notice dates by channel, effective date, the order-protection
   table.
2. Distributor letter — final text, plus the forwardable version.
3. End-user and national-account letters — final text, with the contract-clause
   variants.
4. Rep FAQ — the numbered questions and answers.
5. Talking points and objection responses — the scripts.
6. Internal readiness checklist — owner, date, status per item, and the day-one
   verification results.
7. Notes — sources (batch id, contract list date), assumptions, open decisions.

## Guardrails
- The letter states only the approved batch's numbers and date; nothing is sent
  until a human (sales VP or equivalent) approves the final text and the batch is
  loaded and verified in the ERP.
- Contract accounts are checked against the live contract list before their letter is
  drafted; the letter never contradicts a contract.
- Never disclose cost structure, supplier names, or margin in a customer letter.
- Never suggest that any customer buy direct to avoid a distributor's price; the
  channel is protected in every script.
- Reps do not grant exceptions; the exception process is the only path, and every
  exception is logged (customer, item, price, reason, approver, expiry).
- Customer lists and contact data used for the mailing stay in the company's own
  systems; the send is done by a human through the company's email or mail process.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** a public commodity or PPI series (FRED, BLS PPI for the relevant material) to cite as the driver without exposing internal cost; the distributors' own price-file specifications (most large distributors publish a supplier price-file template) so the file lands loadable on day one; the CRM's email tool (HubSpot, Salesforce, Dynamics 365) for tracked delivery and open confirmation of the notice. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
