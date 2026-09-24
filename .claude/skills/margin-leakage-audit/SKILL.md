---
name: margin-leakage-audit
description: >
  Build the price waterfall from list price to pocket margin (on-invoice discounts,
  off-invoice rebates and co-op, freight, terms and cash discounts, returns, small-order
  and expedite costs), find where margin leaks by customer, rep, and product, and rank
  the fixes by dollar impact. Use this skill whenever gross margin percent is drifting
  down while list prices hold, someone asks what a customer really pays, or a discount
  structure is being reviewed. Trigger on "where is margin going," "price waterfall,"
  "what do we really make on this account," "pocket margin," "why is margin down with
  prices up." Pairs with [[distributor-scorecard]] for the account view,
  [[contract-pricing-review]] for the agreements behind the discounts, and
  [[price-list-management]] to act on the findings.
---

# Margin Leakage Audit

List price is what the catalog says. Invoice price is after the matrix discount and any
contract price. Pocket price is after everything that happens off the invoice: rebates,
co-op, freight the company ate, the 2% cash discount taken on day 35, the return that
came back used, the $40 order that cost $65 to pick and ship. Most companies manage the
first two numbers and never see the third, and that is where the margin goes. The trap
is a total-company waterfall with no dimensions; leakage is never even, and the fix is
always specific to a customer, a rep habit, or a product. Done means: a waterfall the
CFO ties to the GL, a pocket-price band that shows the spread, the top leaks by
customer, rep, and product with dollars, and a ranked fix list with owners.

## Inputs
- Invoice lines, 12+ months (24 preferred), read-only from the ERP: customer, ship-to,
  rep, item, quantity, list price at the time, invoice unit price, extended price,
  cost, freight billed, order number, invoice date (Infor Syteline/CloudSuite invoice
  and order line tables, Epicor P21 `invoice_line`/`oe_line`, NetSuite transaction
  lines).
- Off-invoice items from the GL or subledgers: rebate accruals and payments by customer,
  co-op and marketing development funds, freight expense by shipment or as an allocated
  total, cash discounts taken (AP/AR), returns and credit memos by customer and item,
  warranty and free goods, sales commissions if they vary by deal.
- Contract and special pricing agreements (SPAs) per customer, with their prices and
  terms (see [[contract-pricing-review]]).
- Cost-to-serve inputs: average pick/pack/ship labor per order line, handling per order,
  expedite freight premiums, small-order policy (threshold and fee, if any).
- AR terms per customer and actual days to pay.
- Freight policy: prepaid thresholds, freight allowances, who pays on drop-ships.

## Process

### 1. Reconcile the base
- Sum invoice extended price and COGS; tie to the GL net sales and COGS for the period
  within 1%. Explain any gap (intercompany, freight revenue posting, credit timing)
  before going on. A waterfall that does not tie is a debate, not a finding.

### 2. Build the waterfall per invoice line, then aggregate
- `List revenue = quantity × list price at the time of invoice`.
- `On-invoice discount = list revenue − invoice extended price` (matrix, SPA, promo,
  manual override; split by type when the ERP records the reason, and flag manual
  overrides separately, they are the rep-habit leak).
- `Invoice price = extended price`.
- Off-invoice deductions, allocated to line by revenue share when they are not tracked
  at the line: rebates earned, co-op/MDF, freight absorbed (`freight cost − freight
  billed` when positive), cash discount taken (`invoice × discount % where taken`),
  returns and credits, free goods, other allowances.
- `Pocket price = invoice price − off-invoice deductions`.
- `Pocket margin = pocket price − COGS − cost to serve` where `cost to serve = handling
  per order (allocated by lines) + pick/pack per line + expedite premium on that order`.
- Express every step as a percent of list revenue; that is the waterfall chart.

### 3. Compute the leak metrics
- Pocket price ratio: `pocket price / list revenue` per customer, product, and rep.
- Pocket price band: sort customers by pocket price ratio and plot against their
  volume. A wide band at the same volume (e.g., 62% to 88% of list among similar-sized
  accounts) is the largest single finding in most audits.
- Freight recovery: `freight billed / freight cost`. Below 70% is a policy problem.
- Cash discount abuse: `discounts taken on invoices paid after the discount date / total
  discounts taken`. Anything over 20% is money given away.
- Small orders: count and revenue of orders below the cost-to-serve breakeven (`breakeven
  order $ = handling cost per order / gross margin %`; illustrative: $35 / 0.35 = $100).
  Sum the margin lost on those orders.
- Returns rate by customer and item: `credit memo $ / invoice $`. Over 3% gets a look.
- Manual override rate by rep: `lines with a manual price below the matrix / lines`.
- Rebate effectiveness: rebates paid on customers whose volume did not grow vs the prior
  year.

### 4. Locate the leaks by dimension
- By customer: the 20 accounts with the lowest pocket margin dollars relative to
  revenue, and the 20 largest total deductions. Note tier from
  [[distributor-scorecard]]: a D-tier account at a top-tier pocket price ratio is a
  finding.
- By rep: override rate, freight waived, small-order share, pocket price ratio vs the
  rep's peers on similar accounts.
- By product: families and items where pocket margin is below the company floor, and
  items whose list price has not moved while cost has (feed
  [[price-list-management]]).
- By channel: distributor vs end-user vs national account, so the fix respects the
  channel structure.

### 5. Rank the fixes
- For each leak, propose the fix, the dollar impact at current volumes, the ease (policy
  change, system setting, conversation), and the risk (customer reaction, channel
  conflict).
- Typical fixes with how to size them: freight policy tightening (`freight absorbed −
  target absorbed`), small-order minimum or fee (`orders below threshold × fee` or
  `margin recovered by consolidation`), cash-discount enforcement (`discounts taken
  late`), override approval rules (`override $ × expected reduction`), SPA cleanup
  (`agreements below floor × volume × (floor − current)`), rebate restructure to
  growth-based (`rebates paid on flat accounts`), returns policy (`credits on used or
  out-of-window returns`).
- Rank by impact × ease. Show the cumulative dollars so a manager can pick the top
  five and know what they are worth.

### 6. Set up the monitoring
- Define the monthly pocket-margin report: waterfall, band, and the five metrics from
  step 3, by rep and customer, with thresholds that trigger a review.
- Store this audit's numbers as the baseline so the next run shows movement.

## Output format
ALWAYS structure as:
1. Summary — list revenue, on-invoice discount, pocket price, pocket margin (each in
   dollars and percent of list), tie-out to GL, period.
2. Waterfall — the step table and chart for the total company, then by channel.
3. Pocket price band — table or chart: customers by volume and pocket price ratio,
   with the band width and the outliers named.
4. Leak metrics — freight recovery, cash discount abuse, small orders, returns,
   overrides, rebate effectiveness, each with the dollars.
5. Leaks by dimension — the customer, rep, and product tables from step 4.
6. Ranked fix list — fix, dollars, ease, risk, owner, cumulative dollars.
7. Monitoring plan and data notes — the monthly report definition, sources, pull date,
   allocation methods, assumptions.

## Guardrails
- The waterfall ties to the GL before anything is published; allocated deductions are
  labeled as allocated with the method stated.
- The ERP, GL, and AR are read-only for this skill.
- Every fix is a proposal. Pricing, freight, terms, and rebate policy changes are
  business decisions a human approves, and any price change goes through
  [[price-list-management]] with its log.
- Never propose fixing a distributor's pocket margin by selling around the distributor
  or by raising an end-user's price to steer it direct; channel conflict is listed as a
  risk on any fix that touches distributor pricing.
- Rep-level findings are coaching data for the sales manager, not a scorecard to
  circulate; keep them in the manager's section.
- Customer-level pocket margin is confidential and never appears in a customer-facing
  document.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the freight carrier's invoice detail (UPS/FedEx/LTL billing files or a freight audit service such as Intelligent Audit, paid) to replace allocated freight with actual per-shipment cost; the ERP's price-override reason codes (turn them on if they are off; it costs nothing); a pricing analytics tool (Pricefx, Zilliant, Vendavo, paid) when the company wants the waterfall live rather than quarterly. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
