---
name: inventory-health-audit
description: >
  Audit an inventory for turns, GMROI, fill rate, dead and slow stock, overstock dollars,
  ABC/XYZ classification and stockouts, then produce a ranked disposition list (return,
  promote, liquidate, write down) with the dollar impact of each. Use this skill whenever
  someone asks how healthy the inventory is, why cash is tied up, what to do with the
  dead stock, or before a year-end reserve decision. Trigger on "inventory audit," "what
  is our dead stock," "how are our turns," "GMROI by line," "what should we liquidate,"
  "why is inventory up." Pairs with [[reorder-point-optimizer]] to fix the cause and
  [[supplier-scorecard]] when returns to vendor are on the table.
---

# Inventory Health Audit

Inventory is where a distributor's or manufacturer's cash hides, and the balance sheet
only shows the total. The audit breaks it into what is working (fast, profitable stock
that should never run out) and what is not (dead, slow, overbought, obsolete), and turns
the second pile into decisions with dollar values. The trap is stopping at "we have $1.2M
of dead stock" without a disposition per item, or doing the disposition without fixing
the min/max that created it. Done means: the health metrics tied to the GL, every item
classified, a ranked disposition list a buyer can start on Monday, and the root causes
handed to [[reorder-point-optimizer]].

## Inputs
- Item master with on-hand quantity, unit cost (standard or average, state which),
  product family, supplier, min/max or reorder point, warehouse, read-only from the ERP
  (Infor Syteline/CloudSuite `item`/`itemwhse`, Epicor P21 `inv_mast`/`inv_loc`,
  NetSuite item records). Multi-warehouse: keep the warehouse dimension.
- Usage or sales by item × month, 24+ months, in units and dollars. If only shipments
  exist, use them; if only issues/consumption exist (a manufacturer's raw stock), use
  those.
- COGS for the trailing 12 months by item or family, to compute turns and GMROI. If only
  a family total exists, allocate by sales and say so.
- Receipt history: last receipt date, quantity, and PO cost, for age and for the
  return-to-vendor window.
- Backorder or stockout history: lines back-ordered, lines lost, expedite freight, if
  tracked. If not tracked, say so and use "days at zero on-hand" as the proxy.
- Supplier return policies (window in days, restocking fee %), and any existing reserve
  for excess and obsolete (E&O) from accounting.
- The GL inventory balance at the audit date, so the item-level total can be reconciled.

## Process

### 1. Reconcile and clean
- Sum on-hand × cost across items and reconcile to the GL inventory balance. A gap over
  2% needs an explanation (WIP, in-transit, consignment, costing method) before any
  metric is published.
- Flag items with zero or negative cost, negative on-hand, or on-hand with no item
  master record. These are data problems, not inventory decisions; list them separately.

### 2. Compute the health metrics (total, by family, by supplier, by warehouse)
- `Turns = COGS (T12) / average inventory at cost` (average of 13 month-end balances if
  available; otherwise the average of opening and closing, labeled as such).
- `Gross margin % = (sales − COGS) / sales`.
- `GMROI = gross margin $ (T12) / average inventory at cost`, expressed as dollars of
  margin per dollar of inventory (a 1.8 means $1.80 earned per $1.00 invested).
- `Turn-and-earn = turns × gross margin %` (the classic distributor index).
- `Fill rate = lines shipped complete from stock on first pass / lines ordered`.
- `Months of supply = on-hand units / average monthly usage (last 12 months)`.
- `Carrying cost $ = average inventory × carrying rate` (default 22% per year: capital,
  space, insurance, shrink, obsolescence; print the rate).
- Typical ranges for industrial distribution: turns 3 to 6, GMROI 1.5 to 2.5, fill rate
  95% to 98% on A items. For a manufacturer's finished goods, turns 4 to 8. Use these
  as context, not targets, and say the source is a general benchmark.

### 3. Classify every item
- ABC by annual sales dollars (or usage dollars): sort descending, A = items making the
  first 80% of dollars, B = next 15%, C = last 5%. Report counts; A is usually 10% to
  20% of items.
- XYZ by demand variability: `CV = standard deviation of monthly usage / mean monthly
  usage` over 12 months. X < 0.5 (steady), Y 0.5 to 1.0 (variable), Z > 1.0 (lumpy or
  intermittent). Items with usage in fewer than 4 of 12 months are Z regardless of CV.
- Dead: zero usage in the last 12 months and on-hand > 0. Age it by last receipt date.
- Slow: usage > 0 and months of supply > 12 (default; 18 for a manufacturer with long
  raw-material lead times).
- Overstock: `overstock units = on-hand − max (or − 2 × ROP if no max)` where positive;
  `overstock $ = overstock units × cost`. Report by item, family, and buyer.
- Stockouts: from the backorder log, or count of days with on-hand ≤ 0 on items with
  usage; list A and B items with any stockout in the last 90 days.

### 4. Find the causes before the cures
- For each overstock or dead item, note the likely cause from the data: min/max set
  above usage, a supplier MOQ far above usage, a one-time customer order that was
  overbought, a superseded item (ECO) with the old one still stocked, a forecast pushed
  in and never removed, a price-buy ahead of an increase.
- Group causes by count and dollars. A buyer fixes causes; a liquidator handles
  symptoms.

### 5. Build the ranked disposition list
- Return to vendor: items inside the supplier's return window (default 90 to 180 days
  from receipt, check the actual policy), restocking fee ≤ 20%, in saleable condition.
  `Recovery = on-hand × cost × (1 − restock fee %)`.
- Promote: A and B items that are slow but not dead, sellable through the channel at a
  time-boxed discount. `Expected recovery = units × (list × (1 − promo discount))`;
  never below cost without a human ruling.
- Transfer: multi-warehouse imbalance, when another warehouse has usage. `Saving =
  avoided purchase at the receiving warehouse`.
- Liquidate: dead items with no return path, via surplus channels (Liquidity Services,
  industrial surplus dealers, an auction house). Assume 10% to 30% of cost; label it
  an estimate until a quote exists.
- Write down: items with no realistic recovery. `Reserve = on-hand × cost × (1 −
  expected recovery %)`. This is an accounting decision; the skill proposes the reserve
  and accounting approves.
- Rank by net cash impact (recovery + carrying cost avoided − fees), then by ease.
  Show the running total so a manager can pick the top N.

### 6. Set the follow-through
- Hand the min/max causes to [[reorder-point-optimizer]] with the item list.
- Hand supplier-caused items (MOQ, lead-time creep, quality returns) to
  [[supplier-scorecard]].
- Schedule the re-audit (quarterly for distribution, monthly on A items) and store the
  metrics so the trend is visible next time.

## Output format
ALWAYS structure as:
1. Summary — inventory $ (reconciled to GL), turns, GMROI, turn-and-earn, fill rate,
   dead $, slow $, overstock $, carrying cost $, with the prior audit's values if any.
2. Metrics by family, supplier, and warehouse — table with the same columns.
3. Classification — ABC × XYZ matrix with item counts and dollars in each cell.
4. Stockout list — A and B items with stockouts, days at zero, lost lines or expedite
   cost.
5. Disposition list — ranked table: item, family, supplier, on-hand, cost $, cause,
   action, recovery $, carrying cost avoided $, fee $, net impact $, owner.
6. Cause summary — causes by count and dollars, with the fix per cause.
7. Data notes — sources, pull date, costing method, reconciliation gap, exclusions.

## Guardrails
- The inventory total is reconciled to the GL before any metric is published; numbers
  come from the pulled data, never from a prior report.
- The ERP is read-only. This skill never adjusts on-hand, cost, min/max, or reserves.
- Every disposition is a proposal; the buyer approves returns and promotions, accounting
  approves write-downs, and each approved action is logged (item, action, qty, $,
  approver, date).
- Never propose selling below cost or through a channel that undercuts the company's
  distributors without a human ruling; liquidation goes through surplus channels, not
  through the distributor's customers.
- Liquidation recovery percentages are estimates until a buyer's quote exists; label
  them.
- Supplier and cost data stay internal; a version shared with a supplier shows only
  their items.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the ERP's own inventory analytics module (Epicor P21 Inventory Analytics, Infor Birst, NetSuite SuiteAnalytics) for month-end balance history without a custom extract; a surplus marketplace or broker quote (Liquidity Services, local industrial surplus dealers) to replace the liquidation estimate with a real number; NAW or ISA distributor benchmarks (paid) for turns and GMROI by line of trade. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
