---
name: contract-pricing-review
description: >
  Review every special pricing agreement and contract price: expiry dates, margin against
  current cost, volume commitments met or missed, scope creep across ship-tos and items,
  a renewal recommendation per agreement, and the red-flag list of agreements with no
  expiry. Use this skill whenever contract prices are being audited, a list price change
  needs the contract exceptions mapped, a customer asks to renew, or margin on a big
  account looks wrong. Trigger on "review our SPAs," "which contracts expire," "are we
  losing money on this contract," "did they hit their volume," "contract pricing audit."
  Pairs with [[margin-leakage-audit]] for the pocket-margin view and
  [[price-list-management]] for the list changes the contracts sit outside of.
---

# Contract and Special Pricing Review

Contract prices are the pricing a company forgot. They were negotiated for a reason, at
a cost that has since moved, on a volume promise nobody checked, and in an ERP that
will keep applying them forever unless someone puts an end date on them. Every list price
increase makes the gap worse, because the contract accounts sit outside the increase.
The trap is treating the review as a spreadsheet exercise; each agreement is a
relationship, and the recommendation has to fit what the account is worth. Done means:
every agreement listed with its economics, a renewal decision per agreement with the
proposed terms, the no-expiry list handed to management, and the contract-exception map
that [[price-list-management]] needs on its next batch.

## Inputs
- Contract and special price records from the ERP, read-only: customer, ship-to scope,
  item or item group, contract price or discount, start date, end date, minimum
  quantity or dollar commitment, price-protection or escalation clause, who approved
  (Infor Syteline/CloudSuite contract pricing and customer item pricing, Epicor P21
  contract/special pricing pages, NetSuite customer-specific price levels, or a
  spreadsheet the sales team keeps; if the latter, say so, that is a finding).
- The signed agreement documents, where they exist, for terms the ERP does not hold
  (rebates, exclusivity, notice period, most-favored-customer clauses).
- Invoice history by customer × item, 24+ months, to compute actual volume against
  commitments and the share of an account's purchases on contract vs list.
- Current cost per item (standard or average, with date) and the current list price.
- The company margin floor (by family if it varies) and the standard matrix discount
  each customer would get without the contract.
- Account tier from [[distributor-scorecard]] if available.

## Process

### 1. Inventory every agreement
- Pull all active contract price records and any with an end date in the last 12 months
  (expired but possibly still applied by a manual override). Match to signed documents;
  list records with no document and documents with no record.
- Group into agreements: one customer (or buying group) × one document, with its lines.
- Flag immediately: no end date, end date more than 3 years out, end date passed but
  price still applied in the last 90 days, scope of "all items" or "all ship-tos."

### 2. Compute the economics per agreement and per line
- `Contract margin % = (contract price − current cost) / contract price`.
- `Margin gap vs floor = floor % − contract margin %` where positive.
- `Discount vs list = 1 − contract price / current list`; compare to the customer's
  standard matrix discount. `Extra depth = contract discount − matrix discount`.
- `Cost drift since signing = (current cost − cost at start date) / cost at start date`,
  when the start-date cost is available; otherwise use the oldest cost on record and
  label it.
- `Annual $ on contract = trailing-12 invoice dollars on contract lines`.
- `Margin at risk $ = annual $ × margin gap vs floor` where the gap is positive.
- `Give-up vs list $ = annual $ × extra depth` (what the contract costs relative to
  the standard matrix).

### 3. Check the commitments
- `Attainment = actual quantity or dollars in the commitment period / committed amount`.
  Under 80% is missed; 80% to 100% is at risk; over 100% is met.
- For missed commitments, note whether the agreement has a shortfall clause (price reverts,
  rebate not earned) and whether it was enforced. Unenforced clauses are a leak for
  [[margin-leakage-audit]].
- Scope creep: invoice lines at the contract price on ship-tos or items not in the
  agreement. Sum the dollars.
- Unused agreements: lines with zero purchases in 12 months. They are still liabilities
  if the customer comes back after a cost increase.

### 4. Recommend per agreement
- Renew as-is: margin above floor, commitment met, cost drift under 5%, account tier A
  or B.
- Renew with increase: margin below floor or cost drift over 5%. Proposed price =
  the higher of `cost / (1 − floor %)` and `current list × (1 − matrix discount −
  extra depth × retained share)`, rounded by the company rule; state the retained
  share assumption (default: keep half the extra depth for A accounts, none for C/D).
- Renegotiate structure: commitment missed by more than 20%, scope creep, or extra
  depth with no volume behind it. Propose a tiered price tied to attainment or a
  growth rebate instead of a flat discount.
- Let expire: unused, below floor with no strategic reason, or account tier D. Move to
  matrix pricing at expiry with the standard notice.
- Every recommendation names the proposed end date (default 12 months; 24 for A
  accounts with escalation clauses) and the escalation clause to add (a cost-index
  clause or an annual review date).
- Where the account has a national-account or buying-group agreement, the recommendation
  respects that agreement's notice period.

### 5. Build the no-expiry and red-flag list
- Agreements with no end date: list with annual dollars and margin; recommend an end
  date for each. This list goes to management as a standing risk until it is empty.
- Expired-but-applied: list with dollars billed since expiry; recommend correction and a
  customer conversation.
- No document on file: list; sales to locate or re-paper.
- Most-favored-customer or exclusivity clauses: list, since they constrain every other
  pricing decision.

### 6. Produce the list-change exception map
- For [[price-list-management]]: every item × customer combination on an active contract,
  with its price, end date, and whether the contract allows pass-through. The list batch
  must not touch these, and [[price-increase-communication]] must not promise them a
  change.

## Output format
ALWAYS structure as:
1. Summary — agreements active, annual dollars on contract, average contract margin,
   margin at risk $, give-up vs list $, expiring in 90/180/365 days, no-expiry count.
2. Agreement table — customer, tier, document on file, start, end, lines, annual $,
   contract margin %, floor gap, extra depth, attainment, scope creep $, recommendation,
   proposed price/terms, proposed end date.
3. Expiry calendar — agreements by expiry month with the owner and the action date
   (notice period counted back).
4. Red-flag lists — no expiry, expired-but-applied, no document, MFC/exclusivity.
5. Renewal packets — for the top N by dollars: the economics, the proposed terms, and
   the talking points for the rep.
6. List-change exception map — the item × customer table for the next price batch.
7. Data notes — sources, pull date, cost dates, assumptions (retained share, floor).

## Guardrails
- Contract prices, costs, and volumes are read from the ERP and the signed documents this
  session; no term is assumed from a summary or a prior review.
- The ERP is read-only. Contract records are changed only by a human through the
  company's process, after approval, and every change is logged (customer, item, old
  price, new price, old end date, new end date, reason, approver, date).
- Renewal recommendations are proposals; the sales leader and the pricing owner approve
  each agreement's disposition before the customer hears anything.
- Never propose replacing a distributor's contract with a direct end-user agreement;
  where an end-user contract exists through a distributor, the distributor stays in it.
- Signed agreement documents and their terms are confidential; the renewal packet for a
  rep contains only that rep's accounts.
- Never let a contract price be lowered on the basis of a customer's verbal claim about a
  competitor; a documented quote and a human decision are required.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** a contract-lifecycle tool (DocuSign CLM, Ironclad, PandaDoc, paid) so end dates and clauses live in a system with alerts instead of a drawer; the ERP's contract-price expiry report (most have one; turn on the alert); a cost-index clause template from the company's attorney so every renewal carries an escalator. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
