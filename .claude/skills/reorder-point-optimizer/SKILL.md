---
name: reorder-point-optimizer
description: >
  Compute min/max (reorder point and order-up-to) and safety stock per item from demand
  history and lead time at a chosen service level, with the formulas written out, normal
  and intermittent demand handled separately, exception lists, and a change log the buyer
  approves before anything is loaded into the ERP. Use this skill whenever someone wants
  to set or reset reorder points, asks why an item keeps stocking out or overstocking,
  or wants safety stock justified. Trigger on "set the min/max," "recalculate reorder
  points," "how much safety stock," "we keep running out of," "optimize the stocking
  levels." Pairs with [[inventory-health-audit]] for the diagnosis and
  [[supplier-scorecard]] for the lead-time inputs.
---

# Reorder Point and Min/Max Optimizer

Most min/max values in an ERP were typed in years ago by someone who left, and they are
wrong in both directions: too high on items whose demand faded and too low on items that
grew. The optimizer recomputes them from the demand and lead-time history at a service
level the business chooses, and shows its work so a buyer can argue with a number instead
of a black box. The trap is applying one formula to every item; intermittent demand
(a few hits a year) breaks the normal-distribution math and produces reorder points that
either never trigger or never stop. Done means: a proposed min/max per item with the
inputs and formula beside it, the exceptions the math cannot settle, the inventory-dollar
impact of the change, and a change log the buyer signs before anyone loads it.

## Inputs
- Demand by item × month (or week for fast movers), 24+ months, in units, read-only
  from the ERP. Use shipments for finished goods, issues/consumption for raw stock, and
  include back-ordered demand as demand (a stockout that suppressed orders makes the
  history look calmer than it was).
- Lead time per item: PO history with order date and receipt date (last 8 to 12
  receipts) to compute mean and standard deviation. If no history, the supplier's quoted
  lead time, marked as quoted.
- Current min/max or ROP and order quantity per item, unit cost, supplier, MOQ, pack
  size, review cycle (daily continuous review vs weekly periodic).
- Target service level by ABC class (defaults below) or a company rule.
- Ordering cost per PO line (default $25) and carrying rate (default 22%/year), for EOQ.
- Known future changes: promotions, a customer's new blanket order, an item being
  superseded, a supplier switch with a different lead time.

## Process

### 1. Clean and classify the demand
- Remove obvious data errors (a 10,000-unit month on an item averaging 30; confirm with
  the buyer before removing; keep a list). Add back known stockout months if usage was
  suppressed.
- Compute per item: mean monthly demand `d̄`, standard deviation `σd`, coefficient of
  variation `CV = σd / d̄`, average demand interval `ADI = months in history / months
  with demand > 0`.
- Classify (Syntetos-Boylan): smooth (ADI ≤ 1.32 and CV² ≤ 0.49), erratic (ADI ≤ 1.32,
  CV² > 0.49), intermittent (ADI > 1.32, CV² ≤ 0.49), lumpy (ADI > 1.32, CV² > 0.49).
  Smooth and erratic use the normal model; intermittent and lumpy use the intermittent
  model.
- Trend check: compare the last 6 months' mean to the prior 18. If the change is more
  than ±30%, weight recent history (exponential smoothing, α = 0.3) and flag the item.

### 2. Compute lead time statistics
- From receipts: `L̄ = mean lead time`, `σL = standard deviation`, in the same time unit
  as demand (convert days to months by dividing by 30.4, or run everything in weeks).
- Drop receipts that were expedited or partial if they are flagged; otherwise keep them,
  since real lead time includes real supplier behavior.
- Lead-time stability is a supplier metric; hand high-σL suppliers to
  [[supplier-scorecard]].

### 3. Set the service level
- Defaults by ABC class (from [[inventory-health-audit]] or computed here by dollars):
  A 98% (z = 2.05), B 95% (z = 1.65), C 90% (z = 1.28). Other z values: 97.5% = 1.96,
  99% = 2.33, 99.5% = 2.58.
- These are cycle service levels (probability of no stockout per replenishment cycle).
  If the business wants fill rate (fraction of units served), say so and use the
  expected-shortage formulation; do not mix the two definitions.

### 4. Normal-demand items: safety stock, ROP, order quantity, max
- `Safety stock SS = z × sqrt( L̄ × σd² + d̄² × σL² )`
  (demand and lead time both variable). If lead time is fixed, the second term is zero.
- `Reorder point ROP (min) = d̄ × L̄ + SS`.
- `EOQ = sqrt( 2 × D × S / H )` where D = annual demand units, S = ordering cost per
  line, H = unit cost × carrying rate. Round up to the pack size and to the MOQ.
- `Max (order-up-to) = ROP + EOQ` for continuous review. For periodic review with review
  period R: `Max = d̄ × (L̄ + R) + z × sqrt( (L̄ + R) × σd² + d̄² × σL² )`.
- Print the inputs beside every result: d̄, σd, L̄, σL, z, SS, EOQ.

### 5. Intermittent-demand items
- Do not use the normal formula; it produces reorder points that exceed a year's demand
  or fall below one typical order.
- Forecast the demand rate with Croston's method or the Syntetos-Boylan approximation
  (SBA): forecast demand size `ẑ` and interval `p̂` separately with exponential smoothing
  (α = 0.1 to 0.2), and `demand rate = (1 − α/2) × ẑ / p̂` (SBA bias correction).
- Build the lead-time demand distribution empirically: bootstrap by sampling historical
  months with replacement over the lead time (1,000 draws) and take the quantile at the
  service level as the ROP. `SS = ROP − expected lead-time demand`.
- Order quantity: the larger of the typical order size and the MOQ; max = ROP + that.
  For lumpy C items, consider "stock zero, buy to order" and list them for the buyer.

### 6. Exceptions, impact, and the change log
- Exception lists (the math is not the decision): no demand history (< 6 months), no
  lead time, lead time > 6 months, supplier MOQ > 6 months of demand, proposed change
  > ±50% from current (cap the applied change at ±50% per cycle unless the buyer
  overrides), superseded or end-of-life items, items with a known future change.
- Inventory impact: `Δ average inventory $ = Σ ( (new SS + new EOQ/2) − (old SS + old
  EOQ/2) ) × cost` by item, family, and supplier. Show the total up and the total down
  separately.
- Change log, one row per item: date, batch id, item, warehouse, old min, old max, new
  min, new max, method (normal/SBA/bootstrap), service level, d̄, L̄, reason code
  (demand up/down, lead time changed, class changed, exception override), approver,
  approval date.
- The buyer reviews and approves the log. Only approved rows are loaded, by the company's
  own tested import path, and after loading, a read-back of the ERP values is compared
  to the approved log row by row.

## Output format
ALWAYS structure as:
1. Summary — items reviewed, method counts, service levels used, inventory $ impact
   (up, down, net), exception count.
2. Proposed min/max table — item, warehouse, class, method, d̄, σd, L̄, σL, z, SS, ROP,
   EOQ, max, current min/max, change %, Δ inventory $.
3. Exception list — item, reason, current values, what the buyer must decide.
4. Supplier and lead-time notes — suppliers with unstable lead times and the items
   affected.
5. Change log — the approval-ready table from step 6, with blank approver columns.
6. Load and verify procedure — the steps to load approved rows and the read-back
   check.
7. Data notes — sources, pull date, cleaned data points, assumptions.

## Guardrails
- The ERP is read-only for this skill. It proposes values; it never writes min/max,
  ROP, or safety stock. Loading happens only through the company's tested import path
  after the buyer signs the change log, and the result is verified by reading the ERP
  back, not by the import's success message.
- Every proposed value shows its inputs and formula; a number without its d̄, L̄, and z
  is not a proposal.
- Changes larger than ±50% are capped and listed as exceptions unless a human overrides
  with a reason in the log.
- Never remove a demand data point without a buyer's confirmation; list every removal.
- Never set a stocking level from a quoted lead time when receipt history exists; the
  history wins, and the discrepancy goes to the supplier review.
- Demand data by customer stays internal; supplier-facing versions show only aggregate
  volumes.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the ERP's replenishment module (Epicor P21 Advanced Demand Forecasting, Infor Syteline/CloudSuite Inventory Planning, NetSuite Demand Planning) to run the approved parameters natively instead of by import; a dedicated planning tool (Netstock, Slimstock, SmartForecasts, paid) when item count exceeds what a buyer can review by hand; supplier lead-time confirmations from the last three POs to replace a quoted lead time. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
