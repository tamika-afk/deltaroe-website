---
name: price-list-management
description: >
  Run a list price adjustment end to end: verify the sources are the newest, apply the
  pricing rules (rounding, option and coating adders, size and spec ladders, quantity-break
  structures written atomically), run sanity checks, write the change log (date, batch,
  part, old, new, reason), build the ERP import file to the file rules, and lay out the
  communication plan. Use this skill whenever a price list is being raised, lowered,
  corrected, or extended to new items. Trigger on "price increase," "reprice the line,"
  "update the price list," "build the price import," "fix these prices," "add pricing
  for the new items." Pairs with [[price-increase-communication]] for the customer
  package, [[margin-leakage-audit]] for what the list price actually yields, and
  [[contract-pricing-review]] for the contract prices the list change does not touch.
---

# Price List Management

A price change is a data operation with a business decision in the middle. Most of the
damage in pricing comes from the data side: a change applied from a stale source, a
headline price updated while the quantity breaks kept the old values, a coated option
priced below its uncoated base, an import file that wiped a field the ERP required.
This skill is the procedure that makes those failure modes impossible to repeat. Done
means: every price on the list obeys every rule, every change is logged with its reason,
the import file passes the file rules, a human has approved the batch, and the customers
hear about it on a schedule instead of at order entry.

## Inputs
- The current price list from the system of record, pulled read-only at the start of the
  session (ERP item price table: Infor Syteline/CloudSuite `item price`/`SLItemPrices`,
  Epicor P21 `inv_mast` list price and price pages, NetSuite price levels). Never from a
  spreadsheet someone emailed unless it is the declared master, and then check its date
  against the ERP.
- The basis for the change: a cost file (raw material, purchased components, labor rate)
  with effective dates, a target margin, or a flat percentage from management. Cost values
  come from the ERP or a supplier document, never inferred from a pattern.
- The company's pricing rules, written down or extracted from the current list:
  rounding rule, option adders (coating, thru-coolant, special length, finish), size and
  spec ladders, quantity-break structure (which tiers exist and how each relates to the
  headline), floors and twins (a variant that may never price below its base).
- The change log file (running CSV or table) and the last batch id, so this batch
  continues the sequence.
- ERP import file specification: required columns, field lengths, which fields the
  import wipes if omitted, filename convention, and who loads it.
- Customer and channel context: which accounts are on contract prices, notice period
  promised to distributors, quote validity rules.

## Process

### 1. Freshness gate
- Pull the live list and record: source, table, row count, pull timestamp, and the
  latest existing change-log batch. If a newer batch exists than the one this session
  knows about, stop and reconcile before computing anything.
- Confirm the cost basis is the newest on disk or in the ERP by effective date. A
  cost older than 6 months is untrusted regardless of how stable it looks; cross-check
  against its size neighbors' movement.

### 2. Compute the new prices from the basis, never as deltas off deltas
- Cost pass-through: `new price = old price + Δcost × pass-through multiplier` where the
  multiplier covers the margin structure (illustrative: at a 40% gross margin, a $1.00
  cost rise needs $1.67 to hold the margin percent, or $1.00 to hold margin dollars;
  state which the business chose).
- Flat increases: `new price = old price × (1 + pct)`.
- Recompute from each item's recorded basis, not from the current price plus a delta,
  or two adjustments compound errors.
- Rounding: apply the company rule last, after all adders (default: ceiling to the
  nearest $0.05 under $100, nearest $0.50 to $1,000, nearest $1 above). Ceiling, not
  nearest, so rounding never gives back margin.

### 3. Apply the structural rules as a fixpoint
- Option adders: `option price = base price + adder from the adder chart`, per option
  type. The chart is a data file with an effective date, never a constant in a script.
- Size ladder: within a family and spec, a larger size never prices below a smaller one;
  a longer length never prices below a shorter one; a variant with an added feature never
  prices below the variant without it (twins). Where a violation appears, raise the
  lower price to the floor and record reason "floor".
- Quantity breaks: every tier is written together with the headline, atomically. Tier
  relationships are a rule (`tier n = headline × (1 − discount n)` or a fixed schedule);
  recompute all tiers from the new headline. A headline change without its tiers is a
  defect, never a partial success.
- Run the rules repeatedly until no rule changes any price (fixpoint), since a floor
  raise can trigger a twin raise which can trigger a ladder raise.

### 4. Sanity checks before anything is called a price list
- Headline equals the first quantity tier on every item.
- No coated or optioned price below its base; no larger size below smaller within spec;
  no TC/optioned twin below its plain twin at any tier.
- Change distribution: list the items with the 20 largest and 20 smallest percent
  changes; anything over 2× the batch's median change gets a human look.
- Margin check against current cost for every item with a cost; list anything below the
  floor margin.
- Count check: items in, items out, items unchanged, items new, items missing a price.
  Nothing is skipped silently; every item with no computable price is listed with why.
- Cross-check a sample of 20 items by hand against the rules.

### 5. Write the change log and the approval packet
- Append one row per changed item: date, batch id, part, old price, new price, reason
  code (cost, flat, floor, twin, correction, new item), and the tiers old/new where they
  changed. Never overwrite a prior row.
- Approval packet for the pricing owner: summary (items changed, average and median %,
  revenue-weighted %), the outlier lists, the margin exceptions, the unpriced items,
  and the full log as an attachment. The human approves the batch id, not the concept.

### 6. Build the ERP import file to the file rules
- Every required column on every row (an import that treats a blank as "clear this field"
  will wipe data; confirm which fields behave that way and always fill them).
- Numeric columns are numbers, one column per tier, no formulas (`=`) in any cell, no
  merged cells, no trailing spaces in part numbers.
- Versioned filename with date and batch (RevA, RevB...) when a prior file was delivered;
  never overwrite a delivered file.
- Scan the file after saving (for xlsx, inspect the sheet XML for `<f>` tags) and read a
  sample of rows back from the saved file, not from the dataframe that wrote it.
- Contract prices are NOT touched by the list change; hand the affected agreements to
  [[contract-pricing-review]].

### 7. Communicate and verify after load
- Communication plan: distributors get written notice (default 30 to 60 days before
  effective date), reps get the FAQ and talking points from
  [[price-increase-communication]], the website, quote tool, and any punchout or EDI 832
  catalogs are updated on the effective date, and open quotes are honored to their
  expiry.
- After the human loads the file, read the ERP back and compare every changed item and
  tier to the approved log. The import's success message is not verification.

## Output format
ALWAYS structure as:
1. Batch summary — batch id, source and pull time, basis and its date, items changed,
   average/median/revenue-weighted change, effective date.
2. Rule results — floors applied, twins raised, tiers recomputed, rounding applied,
   fixpoint iterations.
3. Sanity check results — each check with pass/fail and the exception rows.
4. Outliers and exceptions — largest/smallest changes, margin exceptions, unpriced items
   with reasons.
5. Change log — the appended rows (date, batch, part, old, new, reason, tiers).
6. Import file — path, filename version, row count, columns, the post-save scan result.
7. Communication plan — who is told what, when, in which format; the post-load
   read-back checklist.

## Guardrails
- Prices come from the live system of record pulled this session; cost values come from
  the ERP or a supplier document; nothing is inferred from a pattern or typed from
  memory.
- The ERP is read-only for this skill. The import file is loaded by a human through the
  company's tested path, and the load is verified by reading the ERP back row by row.
- A human approves the batch before the import file leaves the session, and before any
  customer communication goes out. Every change is logged with old, new, reason, date,
  and batch; a change not in the log did not happen.
- Headline and all quantity tiers are always written together. A partial apply is a
  defect to be repaired, never shipped.
- No item is skipped silently. Items the rules cannot price are listed with the reason.
- Never communicate a price change to customers or distributors without the approved
  effective date and order-protection rules; never suggest a customer buy direct to
  avoid a distributor's markup.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the ERP's price-import utility and its documented field behavior (Infor Syteline Item Price import, P21 Item Price Pages import) so the file is built to the loader, not to a guess; a raw-material price index feed (Fastmarkets, MetalMiner, or the supplier's published surcharge, paid where applicable) to time and size cost pass-through; a pricing-software trial (Pricefx, Zilliant, Vendavo, paid, for larger catalogs) when the rule set outgrows spreadsheets. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
