---
name: account-plan
description: >
  Build a strategic account plan for a key customer or distributor: account profile from invoice
  history, wallet-share estimate, stakeholder map, whitespace by product family and ship-to,
  risks, a 90-day action plan, and a QBR agenda. Use this skill whenever a rep or manager needs
  to grow, defend, or understand a named account, prepare a quarterly business review, or decide
  where the next dollar of effort goes. Trigger on "account plan," "how do we grow this account,"
  "QBR prep," "what else could they buy from us," "key account review." Pairs with
  [[sales-call-prep]] for individual visits and [[win-loss-analysis]] for the competitive read.
---

# Strategic Account Plan

An account plan is a bet about where the next dollar comes from at one customer, with the
evidence for the bet and the plays to collect it. The trap is writing a profile and calling it
a plan: forty facts about the account and no decision. Done means a wallet-share estimate with
its method shown, a whitespace grid the rep can point at, named stakeholders with a stance,
three to five dated plays with owners, and an agenda the customer would actually sit through.

## Inputs
- Invoice lines for the whole account family (bill-to parent and every ship-to), 24 to 36
  months, from the ERP (read-only): date, ship-to, item, product family, quantity, price, cost
  if permitted, salesperson code. If only monthly summaries exist, use them and note that
  product-family whitespace will be coarse.
- Open quotes, open orders, backorders, returns, and credit or AR status for the account.
- CRM contacts, notes, and activity for 12 months. If sparse, say so; the stakeholder map
  will be built from interviews with the rep.
- The product-family list the company sells and, where they exist, the distributor's
  point-of-sale or end-customer data for a distributor account.
- External facts: company website, locations, headcount, industries served, recent news,
  parent company. Verify from the source, do not recall.
- Competitor intel from lost quotes and rep notes.

## Process

### 1. Account profile
- Roll all ship-tos to the parent. Compute per account and per ship-to: trailing 12-month sales
  (T12), prior 12 months (P12), `12/12 ROC = (T12 ÷ P12 − 1) × 100`, `3/12 ROC = (last 3
  months ÷ same 3 months a year ago − 1) × 100`, order count, average order value, average
  days between orders, days since last order, gross margin percent if cost is permitted.
- Product families bought in T12, bought in P12 but not T12 (dropped), never bought.
- Distributor accounts: add POS-based end-customer concentration if the data exists.

### 2. Wallet-share estimate
- Choose the method and show it. Method A (declared): the customer or distributor states annual
  spend in the category; `wallet share = T12 ÷ declared spend`. Method B (activity-based):
  `potential = machines or operators × annual spend per machine benchmark` (state the benchmark
  and its source). Method C (peer-based): median T12 of the top-quartile accounts with the same
  industry and size band. Use the best available and mark the confidence low, medium, or high.
- Report the gap in dollars: `headroom = potential − T12`. The plan is sized against headroom,
  not against last year's growth.

### 3. Stakeholder map
- Roles: economic buyer, technical evaluator, day-to-day user, purchasing, champion, blocker.
  For each: name, title, stance (advocate, neutral, opposed, unknown), what they care about,
  last contact date, who on our side owns the relationship.
- Single-thread flag: fewer than two active advocates at the account is a risk in section 5.
- For a distributor account, map both the distributor's people (branch manager, inside sales,
  outside reps who sell our line) and the two or three largest end customers they serve.

### 4. Whitespace grid
- Rows: product families. Columns: ship-tos (or end customers for a distributor). Cell values:
  Buying (T12 sales), Lapsed (P12 only), Never. Add a fourth state, Competitor known, when
  intel says who has it.
- Rank whitespace cells by `expected value = estimated cell potential × fit probability`, where
  fit probability defaults to 0.6 for Lapsed, 0.3 for Never with a matching application, 0.1
  for Never with no evidence of the application.

### 5. Risks
- Concentration (this account over 10 percent of the territory or company), contract or
  agreement expiry, single-threaded contacts, declining 3/12 while 12/12 is still positive
  (the early warning), open quality or delivery complaints, competitor conversion attempts,
  credit hold, channel conflict (a manufacturer account served by a distributor, or two
  distributors on the same end customer).

### 6. 90-day action plan
- Three to five plays. Each play: the whitespace cell or risk it addresses, the action, the
  owner, the date, the measurable result (a trial order, a spec approval, a second contact
  added), and the resource needed (samples, a test, a joint call with the distributor).
- Sequence by expected value and by what the customer is ready for. Never more than five.

### 7. QBR agenda
- 45 minutes: their results with us (performance, service levels, on-time, quality),
  what changed at their business, what we are proposing (the plays), what we need from them,
  next review date. The customer's numbers come first, ours second.

## Output format

ALWAYS structure as:
1. **Account summary** — parent and ship-tos, T12, 12/12 and 3/12 ROC, margin if permitted,
   days since last order, wallet share with method and confidence, headroom in dollars.
2. **Trend and mix** — table of product families by T12, P12, change, and status
   (growing, flat, declining, dropped).
3. **Stakeholder map** — the table from step 3, with the single-thread flag.
4. **Whitespace grid** — families × ship-tos with the four states, ranked target cells with
   expected value.
5. **Risks** — each with likelihood, impact, and the mitigating play.
6. **90-day plan** — the play table with owner, date, metric.
7. **QBR agenda** — timed, with the customer's data first.
8. **Assumptions and gaps** — benchmarks used, missing data, intel that is unverified.

## Guardrails
- All sales, margin, and order figures come from the invoice-line extract read in this session;
  never from a rep's recollection or a prior plan.
- Cost and margin appear only if the requester is permitted to see them; otherwise report sales
  and say margin was withheld.
- For accounts served through a distributor, every play runs with or through the distributor.
  Never plan direct sales to a distributor's end customer.
- Contact details stay in the CRM; the plan names roles and names, not personal phone numbers or
  emails.
- Pricing plays propose; a human approves any price or contract change and it is logged.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** distributor POS or end-customer reports for true sell-through; D&B Hoovers or ZoomInfo (paid) for headcount, locations, and org charts behind the stakeholder map; Google Alerts or a news API on the account name for triggers; the company's own quote engine or quote log for what has been quoted and never ordered. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
