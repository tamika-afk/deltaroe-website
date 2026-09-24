---
name: crm-data-hygiene
description: >
  Audit and clean CRM data against the ERP customer master: duplicates, ownership gaps, missing
  ship-to and parent links, stale contacts, stage-definition drift, and ERP-versus-CRM customer
  reconciliation, ending in a prioritized fix list and a prevention rule set. Use this skill
  whenever reports disagree with the ERP, reps do not trust the CRM, a territory or CRM
  migration is coming, or a pipeline review keeps tripping on bad records. Trigger on "clean up
  the CRM," "why doesn't the CRM match the ERP," "duplicate accounts," "who owns this account,"
  "CRM audit." Pairs with [[crm-pipeline-review]] and [[territory-design]], which both depend on
  clean ownership.
---

# CRM Data Hygiene Audit

A CRM that disagrees with the ERP is a CRM nobody uses. Reps stop logging, managers stop
trusting, and within a year the pipeline lives in spreadsheets again. The trap is cleaning
records without changing the rules that produced them; the duplicates come back in a quarter.
Done means a scored audit, a fix list with owners, a reconciled account-to-ERP mapping, and a
short set of validation rules that stop the same defects from being recreated.

## Inputs
- CRM exports: accounts (id, name, address, phone, domain, owner, parent id, external or ERP
  id, created and last-modified dates), contacts (id, account id, name, email, title, last
  activity, email bounce status), opportunities (id, account, stage, amount, close date, owner).
- ERP customer master, read-only (Infor Syteline/CloudSuite, Epicor P21 or Eclipse, NetSuite,
  Acumatica): customer number, bill-to name and address, ship-to list with numbers, salesperson
  code, credit status, last invoice date, trailing 12-month sales.
- Salesperson code to rep or agency roster, with active flag and territory.
- Written stage definitions. If none exist, the audit produces the first draft.
- Acceptable substitutes: if ship-tos are not exported separately, invoice headers carry the
  ship-to number; if there is no ERP id field in the CRM, match on normalized name plus state
  and flag the match confidence.

## Process

### 1. Inventory and profile
- Counts per object, fill rate per required field (owner, phone, address, ERP id, industry).
  Fill rate below 80 percent on a field the business claims to use is a finding by itself.
- Age profile: accounts and contacts by last activity in buckets 0 to 6, 6 to 18, 18 plus months.

### 2. Duplicate detection
- Normalize names: uppercase, strip punctuation, strip legal suffixes (INC, LLC, CORP, CO, LTD),
  collapse whitespace, expand common abbreviations (MFG, MACH, ENG).
- Candidate pairs where any of: normalized name equal within the same state; email domain equal
  (exclude gmail, yahoo, outlook, and similar); phone digits equal; street number plus zip equal.
- Score the pair: exact normalized name 40 points, same domain 30, same phone 20, same street
  and zip 20. Default threshold 60 to call it a duplicate, 40 to 59 for human review.
- Survivor rule: keep the record with the ERP id; if both or neither, keep the one with the most
  activity in 12 months. Merge, never delete, and export the merge map before executing.

### 3. Ownership gaps
- No owner, owner inactive, owner not on the roster, or owner does not match the ERP salesperson
  code for that customer's ship-tos. Territory mismatch: account state or zip falls outside the
  owner's territory per [[territory-design]].
- Report the count and dollar weight: `orphaned revenue = Σ trailing-12-month sales of accounts
  with an ownership defect`.

### 4. Parent and ship-to linkage
- The ERP hierarchy (bill-to with N ship-tos) is the truth for account structure. Each CRM account
  should carry the ERP customer number; ship-tos are either child accounts or a ship-to list on
  the parent, but one model only.
- Defects: CRM account with no ERP id but closed-won opportunities; ERP customer with sales in
  the last 12 months and no CRM account; child ship-to with no parent; parent linked to a
  different customer number than its children.

### 5. Stale contacts
- Stale if: no activity in 18 months, hard-bounced email, title contains "former", or the
  account is closed in the ERP. Default action: mark inactive, do not delete (history matters).
- Single-threaded accounts: active customers with fewer than 2 active contacts. That is a
  retention risk, list them separately.

### 6. Stage definition drift
- Write the exit criteria for each stage if missing. Compare stated stage probability to the
  actual 12-month conversion from that stage to closed-won; a gap over 15 points is drift.
- Count deals that skipped stages, deals created directly at Proposal, and deals closed-won from
  a stage before Proposal. Each is a sign the stages describe paperwork, not buyer progress.

### 7. ERP-versus-CRM reconciliation
- Match accounts to ERP customers by ERP id, then by normalized name plus state. Produce four
  lists: matched, CRM-only with revenue claims, ERP-only with revenue, ambiguous.
- Revenue check: for matched accounts, compare CRM closed-won in the last 12 months to ERP
  invoiced sales. Flag variance over 25 percent for review; the ERP figure wins.

### 8. Fix list and prevention rules
- Rank fixes by revenue at stake, then by count. Assign an owner and a target date to each batch.
- Prevention rules (implement as CRM validation, not policy memos): required fields on create;
  duplicate check on name plus state and on domain at create; ERP id required before an
  opportunity can reach Proposal; owner must be an active roster member; nightly job that flags
  new ERP customers with no CRM account; quarterly stale-contact sweep.

## Output format

ALWAYS structure as:
1. **Health scorecard** — one table: object, record count, fill rate on required fields,
   duplicate rate, ownership-defect rate, stale rate, reconciliation match rate, with a
   red/amber/green per row (defaults: green over 95 percent clean, amber 85 to 95, red under 85).
2. **Duplicates** — candidate pairs over threshold with score, survivor recommendation, and
   the merge map file path.
3. **Ownership and territory gaps** — accounts, owner, defect type, trailing-12-month sales.
4. **Hierarchy and reconciliation** — the four match lists with counts and the top 25 by revenue.
5. **Stale contacts and single-threaded accounts** — counts and the top accounts by revenue.
6. **Stage definitions** — proposed exit criteria per stage, stated versus actual probability.
7. **Fix list** — batches with owner, date, record count, revenue at stake, method (merge, reassign,
   link, inactivate).
8. **Prevention rules** — the validation rules to implement, each with the defect it prevents.

## Guardrails
- Never delete records. Merge or inactivate, and export a reversal map before any bulk change.
- Bulk changes run on a sandbox or a small batch first (default 25 records), then a read-back
  confirms the result before the rest runs.
- The ERP is read-only. Customer master corrections go to the ERP owner as a list, not as writes.
- Do not export contact data outside the company's systems; personal email addresses and phone
  numbers stay in the CRM, the audit reports counts and record ids.
- Ownership changes are recommendations for the sales manager; reassigning accounts affects
  commission and needs a human sign-off.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the CRM's native dedupe tooling (Salesforce Duplicate Rules, HubSpot duplicate management) plus DemandTools or Insycle (paid) for scored merging at scale; ZoomInfo or Apollo (paid) for contact verification and "left company" signals; the ERP's customer-ship-to table as the hierarchy authority. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
