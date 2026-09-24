---
name: sales-call-prep
description: >
  Produce a one-page pre-call brief for a customer or distributor visit from CRM notes, 24-month
  purchase history, open quotes and orders, red flags, and recent news, ending with three
  questions to ask and a post-call log template. Use this skill whenever a rep is about to
  visit or phone an account, a manager is riding along, or someone asks "what should I know
  before I walk in." Trigger on "prep me for the call," "what's going on at this account,"
  "pre-call brief," "I'm seeing them Tuesday," "call sheet." Pairs with [[account-plan]] for the
  long-range view and [[red-flag-accounts]] for the flags it pulls in.
---

# Sales Call Prep

A rep with a one-page brief walks in knowing what the customer bought, what they stopped
buying, what is open, and what has changed since the last visit. A rep without one asks "how's
business" and hears "fine." The trap is a data dump: five pages of history nobody reads in the
parking lot. Done means one page, three numbers the customer will recognize, three questions
that move something, and a log template that captures the outcome in the CRM within the hour.

## Inputs
- The account (parent and ship-tos) and the person or people being met.
- Invoice lines for 24 months from the ERP, read-only: date, ship-to, item, product family,
  quantity, price. If only 12 months exist, the trend section reports 3/12 only and says so.
- Open quotes (with quote date and follow-up status), open orders, backorders, recent returns,
  and AR or credit status.
- CRM activity and notes for 12 months, the last three logged visits in full, and any open
  cases or complaints.
- The current red-flag list from [[red-flag-accounts]] if it exists; otherwise compute the flags
  in step 3.
- Website activity if tracked (pages viewed, quote requests), and a news check on the company
  name from the source, not recall.

## Process

### 1. Pull and freeze
- Record the as-of date. Save the extracts. Every number on the page traces to them.

### 2. The numbers the customer will recognize
- `T12 = trailing 12-month sales`, `P12 = prior 12`, `12/12 ROC = (T12 ÷ P12 − 1) × 100`,
  `3/12 ROC = (last 3 months ÷ same 3 months last year − 1) × 100`.
- Top three product families by T12 with their change versus P12.
- Dropped families: bought in P12, zero in T12. Lapsed items: any item with 3 or more orders in
  P12 and zero in T12. These are the first questions.
- Order cadence: `average interval = days between orders over 24 months`;
  `overdue ratio = days since last order ÷ average interval`. Default flag at 1.5 or higher.
- Price context: the customer's contract or SPA level if visible to the rep, last price change
  date, any open pricing dispute. Never expose cost.

### 3. Open business and red flags
- Open quotes older than 7 days with no logged follow-up. Open orders past promise date.
  Backorders and their new promise dates. Returns or complaints in 90 days. AR past 30 days.
- Flags: Declining (3/12 under minus 15 percent while 12/12 is still above minus 15: early
  warning), Lost (no orders in 2 times the average interval and over 90 days), Fast-growing
  (3/12 over plus 25 percent: ask what changed so it can be repeated), New (first order within
  6 months), Gone quiet (overdue ratio over 1.5).
- Distributor account: add sell-through if POS exists, and the largest end customers the branch
  serves.

### 4. What changed since the last visit
- Summarize the last three visit notes in two lines each: what was promised, by whom, and
  whether it happened. Unkept promises from our side go at the top of the page in plain words.
- News and triggers: new plant, new machine, leadership change, acquisition, layoff, big
  contract. One line each with the source and date.

### 5. Three questions
- Question 1 targets the largest dropped or lapsed family or item ("You were running our
  X through last spring, what replaced it?").
- Question 2 targets open business or a flag (the stale quote, the overdue order, the fast
  growth).
- Question 3 targets whitespace or the future (a new machine, a new part, a second contact).
- Each question is open, specific, and answerable in one sentence. No question that a look at
  the ERP could answer.

### 6. The brief and the log
- Fit everything on one page in the order below. The rep should read it in two minutes.
- The post-call log is pre-filled with the account, contacts, and the three questions so the
  rep only writes answers, next step, and date.

## Output format

ALWAYS structure as:
1. **Header** — account, ship-to being visited, contacts and titles, date, rep, as-of date.
2. **Three numbers** — T12 with 12/12 and 3/12 ROC, top three families with change, days since
   last order with overdue ratio.
3. **Watch list** — dropped families, lapsed items, red flags with one-line talking points.
4. **Open business** — quotes, orders, backorders, returns, AR, each with age and status.
5. **Since last visit** — promises made and kept or not, two lines per visit, plus news triggers.
6. **Three questions** — numbered, one line each, with why it matters in brackets.
7. **Post-call log template** — who attended, answers to the three questions, what they need,
   competitor mentioned, next step with date and owner, opportunity created (yes or no, amount),
   CRM record updated (yes or no).
8. **Assumptions** — data windows used, anything unavailable.

## Guardrails
- Every figure comes from the extract read in this session. If history is missing, print
  "no data" in that slot; never fill it from memory or a prior brief.
- Never show cost, margin, or another customer's pricing on a page a customer might see.
- Distributor-owned accounts: the brief is for a joint call or for the distributor's benefit.
  Never recommend the rep pursue the distributor's end customer directly.
- The post-call log goes into the CRM by the rep, or with the rep's confirmation; the skill
  does not write CRM records on its own.
- Personal contact details stay in the CRM; the brief carries names and titles only.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the ERP's invoice-line and open-order tables (Syteline `SLItems`/shipment views, P21 invoice lines) for the numbers; ZoomInfo or LinkedIn Sales Navigator (paid) for who is new at the account; website analytics (GA4 or HubSpot tracking) for what the account looked at this month; the red-flag report for pre-computed flags. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
