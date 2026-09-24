---
name: territory-design
description: >
  Balance sales territories by potential and workload: score accounts, assign ZIPs or counties,
  write the border rules (ship-to decides, drop-ship handling, house accounts), split rep-agency
  coverage, plan the transition with commission protection, and run fairness checks. Use this
  skill whenever territories are being drawn, redrawn, or disputed, a rep or agency is added or
  leaves, or someone asks whether the map is fair. Trigger on "redraw the territories," "who
  covers this ZIP," "is the territory split fair," "new rep territory," "rep agency
  boundaries." Pairs with [[crm-data-hygiene]] for ownership integrity and [[sales-forecast]]
  for quota that follows the new lines.
---

# Territory Design

A territory is a promise: this potential, this workload, this commission, these borders. The
trap is drawing lines by current revenue, which rewards the rep who inherited the big account
and starves the rep sitting on untouched potential. Done means every ZIP or county assigned
exactly once, potential and workload within tolerance across reps, written border rules that
settle disputes without a meeting, a transition plan that does not cost anyone their income
overnight, and the fairness numbers shown.

## Inputs
- Invoice lines by ship-to for 24 to 36 months from the ERP, read-only: ship-to number, name,
  address with ZIP, salesperson code, product family, sales. Ship-to is the geographic unit;
  bill-to is never used for territory.
- The current assignment: salesperson code to rep or agency, and any existing ZIP, county, or
  state table. If territories live only in people's heads, build the current map from the
  salesperson code on invoices and flag it as inferred.
- Potential data by geography: counts of target establishments (NAICS codes for the industries
  served) by ZIP or county from the Census County Business Patterns, D&B, or a purchased list;
  if unavailable, use the company's own top-quartile account spend as the potential proxy.
- Rep roster: employees versus independent agencies, home base, capacity (default 8 to 12
  in-person visits per week for an outside rep), house accounts and national accounts excluded
  from territory.
- Commission plan basics: what is paid on, and whether it is paid on ship-to.

## Process

### 1. Score every account and every geography
- Account score components: T12 sales, `12/12 ROC`, product-family breadth, and estimated
  potential (from [[account-plan]] wallet-share method, or the establishment-size proxy).
  `Potential score = potential $ (or proxy) normalized 0 to 100`.
- Geography potential per ZIP or county = Σ account potential + prospect potential from
  establishment counts × average spend per establishment (state the average and its source).

### 2. Compute workload
- `Workload hours per account per year = visit frequency × (visit hours + travel hours)`.
  Default visit frequency by tier: A monthly, B quarterly, C twice a year, prospects above the
  potential threshold twice a year. Travel from the rep's base by road distance, not straight
  line, where a routing tool is available.
- `Rep capacity = weeks worked (default 46) × visits per week × average visit hours`.
  `Utilization = assigned workload ÷ capacity`. Default target 75 to 90 percent.

### 3. Assign geographies
- Unit of assignment: ZIP (dense metro) or county (rural). Every unit assigned to exactly one
  rep or agency; the table is the authority, not a drawn map. Start from contiguity around each
  rep's base, then move border units to balance. Never split a ZIP between two reps.
- Balance targets: potential per rep within ±15 percent of the mean, workload utilization within
  the target band, current revenue within ±25 percent (revenue is a constraint, not the
  objective). Report `coefficient of variation = standard deviation ÷ mean` for potential and
  workload; default acceptance CV under 0.15.

### 4. Border rules (written, and applied by the CRM and ERP)
- The ship-to address determines the territory. Bill-to, headquarters, and purchasing location
  do not.
- Drop-ship orders credit the ship-to territory; if the company pays on the selling rep instead,
  say so in the plan and apply the split rule below.
- Multi-plant accounts: each plant sits in its ship-to territory; a named account lead
  coordinates and the plan says who.
- House and national accounts: listed by ship-to, excluded from territory potential and
  workload, reviewed annually.
- Distributor branches: assigned by branch ship-to; a distributor's end customer in another
  territory stays the distributor's account, and any rep involvement there is coordinated through
  the distributor.

### 5. Rep-agency splits
- Agencies get whole states or whole metro areas where possible; split commissions only where a
  ship-to and the specifying influence are in different territories. Default split for a
  documented specify-and-ship case: 50/50 for the first 12 months, then 100 percent to ship-to.
  Every split is a listed exception with an expiry date.

### 6. Transition plan
- Effective date at a fiscal period boundary. Moved accounts get a joint visit within 60 days.
  Commission protection: the losing rep keeps a declining share on moved accounts (default 50
  percent for two quarters, 25 percent for the next two, then zero). Quota is rebased to the
  new potential from [[sales-forecast]]. CRM and ERP ownership updates happen once, from the
  assignment table, by the system owner, after a sandbox run and read-back ([[crm-data-hygiene]]).

### 7. Fairness checks
- Potential, workload utilization, revenue, A-account count, and drive time per rep, all with
  CV and min-max. Anything outside tolerance is fixed or written up as an accepted exception.

## Output format

ALWAYS structure as:
1. **Territory summary table** — rep or agency, states or metros, units assigned, accounts by
   tier, T12 revenue, potential, workload hours, utilization, drive time.
2. **Fairness check** — CV and min-max for potential, workload, revenue, A-account count; pass
   or exception per metric.
3. **Assignment table** — every ZIP or county with rep, agency, effective date, source of
   potential figure; the file path of the table.
4. **Border rules** — the written rules from step 4, numbered.
5. **Exceptions register** — splits, house accounts, national accounts, multi-plant leads, each
   with an owner and expiry.
6. **Transition plan** — moved accounts by rep with revenue, joint-visit dates, commission
   protection schedule, system update steps and read-back.
7. **Assumptions** — potential proxies, visit-frequency defaults, capacity assumptions, inferred
   current map.

## Guardrails
- Every revenue and account figure is computed from the ship-to invoice extract read in this
  session; never from a rep's list of "my accounts".
- Territory and commission changes are proposals; the sales leader and finance approve, and the
  plan records who and when.
- ERP salesperson codes and CRM owners are updated by the system owner from the table, never by
  the skill, and never without a sandbox run and read-back.
- Never assign a distributor's end customers to a direct rep or design a territory that invites
  selling around the distributor.
- Individual commission figures stay with finance and the sales leader; the shared plan shows
  potential and workload, not pay.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** Census County Business Patterns (free) and D&B Hoovers or ZoomInfo (paid) for establishment counts by NAICS and ZIP as the potential base; a routing API (Google Maps Distance Matrix, paid) for real drive times in the workload model; Xactly or CaptivateIQ (paid) if commission splits and protection schedules need to be administered rather than tracked in a sheet. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
