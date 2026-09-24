---
name: crm-selection-scorecard
description: >
  Compare two or more CRMs for an industrial manufacturer or distributor using the bulletproof
  vendor rubric (fit, ease for reps and admin, reliability, security, data exit path, longevity,
  maintenance, then cost) with ERP-integration questions specific to distribution. Use this skill
  whenever the company is choosing, replacing, or renewing a CRM, or when someone asks "should we
  just use HubSpot." Trigger on "which CRM," "compare CRMs," "Salesforce vs HubSpot," "does it
  integrate with our ERP," "CRM scorecard." Pairs with [[crm-data-hygiene]] for the migration
  plan and [[territory-design]] for the ownership model the CRM has to support.
---

# CRM Selection Scorecard

Most CRM selections fail in month nine, not in the demo. The rep who covers 300 accounts from a
truck cannot use it on a phone, the ERP sync was "on the roadmap", and the admin left. The trap
is scoring features and price; the things that kill adoption are ease for the field rep, the
direction of truth between CRM and ERP, and whether the data can leave when the contract ends.
Done means a weighted scorecard on at least two real options, a five-year total cost, the
integration questions answered by the vendor in writing, and one recommendation.

## Inputs
- Users by role and count: outside reps (employees and independent agencies), inside sales,
  customer service, sales managers, marketing, executives, admin.
- The ERP and version (Infor Syteline or CloudSuite Industrial, Epicor Prophet 21 or Eclipse,
  NetSuite, Acumatica, SAP Business One, Dynamics 365 Business Central) and how customers, ship-tos,
  salesperson codes, quotes, orders, and invoice lines are stored.
- Current tools being replaced and what data must migrate (accounts, contacts, notes, open
  opportunities, activity history).
- Must-have workflows written as a day in the life of each role. If none exist, draft them from
  interviews or from how the current system is used.
- Budget ceiling, contract end dates of the incumbent, and any security requirements (SSO, MFA,
  data residency, SOC 2 report).
- A shortlist. If none, build one from: HubSpot, Salesforce, Dynamics 365 Sales, Zoho CRM,
  Pipedrive, plus distribution-native options such as the ERP's own CRM module, White Cup
  (formerly Tour de Force), and Proton.ai.

## Process

### 1. Requirements from workflows, not feature lists
- For each role, write 5 to 8 tasks they do weekly and what data each task needs. A rep's tasks
  almost always include: see 24-month sales by ship-to on a phone, log a visit in under 60
  seconds, see open quotes and orders, get a red-flag list of declining accounts.
- Tag each requirement Must, Should, or Nice. A vendor that fails any Must is out regardless of
  score.

### 2. Build the comparison set
- Minimum two options, ideally three: one horizontal leader, one distribution-native, one
  low-cost. Confirm edition names and prices from the vendors' pages on the analysis date.

### 3. Score the rubric
- Weights (default, adjust only with a stated reason): functional fit 20, ease for reps 15,
  ease for admin 10, reliability and track record 10, security posture 10, data ownership and
  exit path 10, longevity 10, maintenance burden 5, cost 10. Total 100.
- Score each criterion 1 to 5 with a one-line justification and a source (demo, documentation,
  reference call, trial). `Weighted score = Σ (weight × score ÷ 5)`.
- Ease for reps is scored from a timed trial: a real rep performs the five most common tasks on
  a phone. Record seconds per task. Admin ease is scored the same way for building a report and
  adding a field.
- Exit path scored on: full export of all objects including notes and attachments, documented
  API with rate limits published, no proprietary field formats, contract clause on data return.

### 4. ERP integration questions (ask every vendor in writing)
- Which system is the master for customers and ship-tos? The answer must be the ERP; the CRM
  creates prospects, and conversion to customer happens in the ERP.
- Is the ship-to hierarchy represented (bill-to parent with N ship-tos), and does sales history
  roll up by ship-to and by parent?
- Does invoice-line history sync (item, quantity, price, ship-to, salesperson code, date), or
  only headers? Line level is required for product-family whitespace and red-flag reporting.
- Are open quotes, open orders, backorders, and AR status visible on the account without a
  second login?
- How are salesperson codes and independent rep agencies mapped to CRM owners, including split
  commissions and agency-level visibility that hides other agencies' accounts?
- Contract or SPA pricing: can a rep see the customer's contract price without exposing cost?
- Integration mechanism: native connector, iPaaS (Celigo, Boomi, Workato, Jitterbit), or custom.
  Who owns the field mapping, what is the sync frequency, what happens on a failed sync, and is
  the connector supported through ERP version upgrades?
- Offline or low-signal mobile behavior for reps in plants and on the road.

### 5. Five-year total cost of ownership
- `TCO = licenses × 5 + implementation + integration build + integration maintenance × 5 +
  admin time × 5 + training + migration + exit cost`. Admin time default: 0.25 FTE for under 50
  users, 0.5 FTE for 50 to 200. Show the sensitivity if user count grows 30 percent.

### 6. References and trial
- Two reference calls per finalist with companies of similar size that sell through distribution
  and run the same ERP. Ask what broke in the first year and what they would not buy again.
- A two-week trial with three real reps and one admin using real data (a scrubbed extract).
  Score ease from the trial, not the demo.

### 7. Decide
- Rank by weighted score, then check that the winner passes every Must and every security
  requirement. If the top two are within 5 points, the exit path and integration answers break
  the tie, not price.

## Output format

ALWAYS structure as:
1. **Recommendation** — one option, the weighted score, the two reasons it won, the one risk to
   manage.
2. **Scorecard table** — criteria as rows with weights, options as columns, score and one-line
   justification per cell, weighted totals at the bottom.
3. **Must-have compliance** — the Must list with pass or fail per option and evidence.
4. **ERP integration answers** — the question list above with each vendor's written answer and
   the assessed risk.
5. **Five-year TCO** — the formula filled in per option, with the 30 percent growth sensitivity.
6. **Trial and reference findings** — timed task results, reference quotes, surprises.
7. **Migration and adoption plan** — data to move (from [[crm-data-hygiene]]), cutover order,
   training by role, the adoption metric (default: 90 percent of visits logged within 48 hours by
   week 8).
8. **Assumptions and open questions** — anything scored without evidence.

## Guardrails
- Never adopt or recommend on cost alone; cost is scored last and weighted 10 of 100.
- Every price and edition name comes from the vendor's page or quote on the analysis date, with
  the date recorded.
- Security claims are verified by the vendor's SOC 2 Type II report or equivalent, not a
  marketing page.
- Do not place customer data in a vendor trial without a scrubbed extract and the vendor's DPA.
- Channel model: any CRM configuration that would show one rep agency another agency's accounts,
  or route distributor-owned accounts to direct follow-up, fails the Must list.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** Gartner Peer Insights and G2 for reliability and admin-burden signals from verified users; the ERP vendor's certified-integration marketplace (Infor Marketplace, Epicor Marketplace, SuiteApp) for connectors that survive upgrades; an iPaaS trial (Celigo, Boomi) to prove the ship-to and invoice-line sync before signing. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
