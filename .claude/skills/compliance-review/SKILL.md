---
name: compliance-review
description: >
  Run the monthly California and federal compliance review for a small business: read the
  compliance calendar, verify what was completed, list what is overdue and what is due in
  the next 30, 60 and 90 days, watch for trigger events that add new duties, check the
  record book, and write a one-page status report the owner can act on in ten minutes.
  Use this skill on the monthly schedule or whenever the owner asks "are we compliant,"
  "what's due," "did we miss anything," "what changed when I hired someone," or before
  any filing season. Trigger on "compliance review," "compliance check," "anything overdue,"
  "what do I owe the state." Pairs with [[compliance-calendar]], which it depends on, and
  [[annual-llc-consent]] each January.
---

# Compliance Review

The monthly review is the difference between a calendar and compliance. The trap is
reading the calendar and reporting it back; the review must find what changed in the
business since last month, because growth adds duties the calendar does not yet know about.
Done means: a status line the owner trusts, a short list of actions with dates and links,
and the calendar updated for anything completed or newly triggered.

## Inputs
- `F:\Dropbox\Precision Tolerance AI\compliance\compliance-config.json` and
  `compliance-calendar.json` (built by [[compliance-calendar]]). If the calendar is older
  than the config, rebuild it first.
- `compliance-log.json` in the same folder: each completed item with date, confirmation
  number, and where the receipt is filed. Create it if missing.
- The record book (PTAI-Company-Record-Book) for Tab 7 consents, Tab 8 checklist, Tab 9
  contracts register.
- Optional: bank or bookkeeping export for the trailing 12 months, to detect trigger
  events (payments to contractors, revenue run-rate).
- `startup-expense-ledger.csv` in the company folder (one level above the compliance
  folder): every pre-formation and launch fee with its tax category. The review reports
  the ledger total, flags rows with no receipt filed, and reminds the owner that
  personally-paid rows are capital contributions until reimbursed from the company
  account. Pre-formation fees are Section 195 startup or Section 248 organizational
  costs ($5,000 first-year deduction each, remainder amortized over 180 months).

## Process

### 1. Establish the date and the horizon
- Run `date`. Horizon = today through today + 90 days. Overdue = any calendar item with
  a due date before today and no entry in the log.

### 2. Reconcile the calendar to the log
- For each calendar item due in the past 60 days, look for a log entry. Missing entry and
  past due = OVERDUE with the penalty from the rule text. Missing entry but the owner
  reports done = ask for the confirmation number, then log it; never log on hearsay.

### 3. List what is coming
- Due in 30 days: action items with the exact place (URL), amount, and who does it.
- Due in 60 and 90 days: heads-up rows.
- Estimated-tax quarters: compute the suggested payment from the year-to-date profit if a
  bookkeeping export is available (federal: profit × roughly 25 to 30 percent as a working
  estimate for income plus self-employment tax; California: profit × 6 to 9 percent), and
  say the CPA sets the final number.

### 4. Watch for trigger events
- Check the config booleans and the trailing-12-month data for changes: any contractor
  paid $600 or more (1099-NEC due January 31, W-9 first); any employee (EDD registration
  within 15 days, workers' compensation immediately, new-hire report within 20 days);
  any tangible product shipped (seller's permit); revenue on pace to exceed $250,000
  (June 15 LLC-fee estimate); net profit on pace to exceed $80,000 (model the S-corp
  election before March 15); any change of address, agent, or manager (updated Statement
  of Information now, not at the biennial); a USPTO Notice of Allowance received
  (Statement of Use within 6 months); insurance, domain, agent renewals inside 60 days.
- Any triggered duty not yet on the calendar: add it to the config, re-run the generator,
  and say so in the report.

### 5. Check the rules once a quarter
- In January, April, July and October, re-read the fee and deadline pages for the SOS,
  FTB, IRS, USPTO and FinCEN BOI status. Update `rulesVerifiedOn` and any changed amount.
  Report every change with the source URL.

### 6. Check the record book
- Tab 7 annual consent for the prior year exists by January 31.
- Tab 8 separateness checklist completed for the prior year.
- Tab 9 register lists every active client agreement, license, policy, and registration.
- Tab 10 holds the prior year's financial statements and tax return by the filing date.

### 7. Write the report and file it
- Write `Compliance-Review-<date>.html` in the compliance folder, copy to the three
  deliverable locations, and record the run in `compliance-log.json` as a review entry.
- If the run is a scheduled task, the report path and the status line are the output.

## Output format
ALWAYS structure as:
1. **Status line** — COMPLIANT, AT RISK (something due inside 30 days and not started),
   or OVERDUE, with the single most urgent item and its date.
2. **Overdue** — item, due date, penalty exposure, the cure, the link.
3. **Due in 30 days** — table: date, item, where (URL), amount, owner.
4. **Due in 60 and 90 days** — same columns, brief.
5. **Trigger events found** — what changed, the duty it adds, what was added to the
   calendar.
6. **Rules changed** — only in a quarterly-check month, with sources.
7. **Record book** — gaps found, if any.
8. **Logged this run** — items marked done with confirmation numbers.

## Guardrails
- Never mark an item complete without a confirmation number or filed receipt.
- Never state a fee, date or threshold from memory; read it from the calendar (which was
  built from the source pages) or the source page itself.
- The review reads files; it never files, pays, or submits anything. The owner does every
  filing personally, with the report's links.
- Company financial data used to estimate taxes stays in the company's own folder and is
  never copied into another company's repository or shared drive.
- If the calendar is provisional (formation date unknown), the status line says so first.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live agency page, real files, or actual data.
- **Force multipliers:** MyFTB and USPTO TSDR (free) for live status; the bookkeeping export for trigger detection; a CPA for the estimated-tax numbers and the S-corp model. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
