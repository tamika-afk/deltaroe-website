---
name: compliance-calendar
description: >
  Build or rebuild the California and federal compliance calendar for a small business
  (single-member LLC by default) from a config file of dates and facts, producing a
  deadline table, a phone-ready .ics calendar with two alarms per deadline, and an HTML
  calendar report. Use this skill whenever a business is formed, a formation or trademark
  date becomes known, an address or agent changes, a trigger event happens (first
  contractor, first employee, revenue threshold), or the calendar looks stale. Trigger on
  "build the compliance calendar," "what's due this year," "add the trademark dates,"
  "the LLC was filed on," "regenerate the reminders." Pairs with [[compliance-review]]
  for the monthly check and [[annual-llc-consent]] for the January record-book session.
---

# Compliance Calendar

A compliance obligation that is not on a calendar with a reminder will be missed. The trap
is a one-time checklist: the first year has different due dates from every later year, and
growth adds duties nobody scheduled. Done means: a config file that holds the facts, a
generated calendar that holds every date for the next 24 months, an .ics the owner imported
to their phone, and a report a person can read in two minutes.

## Inputs
- The config file: `F:\Dropbox\Precision Tolerance AI\compliance\compliance-config.json`
  for Precision Tolerance AI LLC, or the same shape for any other business. Fields:
  entity name, state, formation date (null until filed; the generator then marks every
  date PROVISIONAL from an assumed date), fiscal year end, tax classification, city,
  agent renewal date, insurance expiry, domain renewals, trademark serial and Notice of
  Allowance date (null until issued), employees (bool), contractors (bool), tangible
  products (bool), revenue run-rate.
- The generator: `build-compliance-calendar.mjs` in the same folder. Node 18 or later.
- If the config does not exist, create it from the template in the generator's header,
  fill what is known, and leave the rest null. Never invent a formation date.

## Process

### 1. Refresh the facts
- Read the config. Ask for, or look up, any null field that has become knowable: the
  filed Articles give the formation date; the USPTO TSDR page gives the Notice of
  Allowance date; the registrar gives domain renewals.
- Verify fees and rules against the source pages once per quarter (sos.ca.gov,
  ftb.ca.gov, irs.gov, uspto.gov). Record `rulesVerifiedOn` in the config with the date.

### 2. Generate
```bash
node "F:\Dropbox\Precision Tolerance AI\compliance\build-compliance-calendar.mjs"
```
- Writes, in the same folder: `compliance-calendar.json` (every deadline for the next
  24 months, with rule, place, amount, owner, status), `compliance-calendar.ics`
  (one event per deadline, alarms 14 days and 3 days before), and
  `Compliance-Calendar-<date>.html` (the readable report).
- The generator computes: first-year FTB $800 (15th day of 4th month after formation),
  Statement of Information (formation + 90 days, then every 2 years by month end),
  April 15 annual tax and Form 568, June 15 LLC-fee estimate when revenue may exceed
  $250,000, federal and California estimated-tax dates, 1099-NEC January 31 when
  contractors are true, city license renewal, insurance and domain renewals, agent
  renewal, trademark Statement of Use (NOA + 6 months) and later Section 8 windows when
  a registration date exists, the January record-book session, and the annual FinCEN
  BOI re-check.

### 3. Read the output like the owner will
- Open the HTML report. Every row must show date, what, where, amount, owner.
- Anything marked PROVISIONAL must say why (formation date not yet known).
- Sort check: the first item due must be the nearest date, not the first rule.

### 4. Deliver the reminders
- Copy the .ics and the HTML report to the three deliverable locations (repo exports,
  Dropbox project folder, OneDrive Documents) with the dated filename.
- Tell the owner to import the .ics into the calendar on their phone (Outlook: File,
  Open and Export, Import; Google Calendar: Settings, Import; iPhone: open the file from
  Mail or Files and tap Add All). Alarms fire at 14 days and 3 days before each deadline.

### 5. Re-run on every change
- Formation date known, agent or address changed, trademark NOA received, first
  contractor or employee, revenue crossing $250,000: update the config and re-run.
  Re-importing the .ics replaces events with the same UID, so duplicates do not pile up.

## Output format
ALWAYS structure as:
1. **Facts used** — the config values, with nulls listed as unknown.
2. **Next 90 days** — table: date, item, where, amount, owner.
3. **Full 24-month calendar** — the same table, complete.
4. **Provisional and missing** — what will change once a null is filled.
5. **Files written** — the three paths, and the .ics import instruction.

## Guardrails
- Never invent a formation date, serial number or NOA date; leave null and mark
  provisional.
- Fees and rules come from the agency page read this quarter, never from memory alone.
- The generator only writes files in its own folder and the deliverable locations; it
  never touches the ERP, the bank, or any agency site.
- A deadline is marked done only when the owner confirms with the confirmation number or
  receipt filed in the record book, never by assumption.
- Keep the company's compliance files in the company's own Dropbox folder, separate
  from any other company's repositories.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live agency page, real files, or actual data.
- **Force multipliers:** MyFTB and USPTO TSDR (free) for live status of the entity and the mark; the registrar's account for domain dates; a CPA for the estimated-tax numbers. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
