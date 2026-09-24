---
name: erp-selection-scorecard
description: >
  Compare two or more ERPs or distribution platforms for a manufacturer or distributor
  using the bulletproof vendor rubric (functionality fit, ease of use for users and admin,
  reliability, security, data ownership and exit path, longevity, maintenance burden,
  then cost) plus the distribution-specific requirements (matrix pricing, SPAs and
  rebates, EDI and punchout, lot and serial control, MRP, e-commerce), with reference-check
  questions and a five-year total cost. Use this skill whenever the company is choosing,
  replacing, upgrading, or renewing its ERP, or when someone asks whether to move to the
  cloud version. Trigger on "which ERP," "compare ERPs," "P21 vs NetSuite," "should we
  upgrade Syteline," "ERP scorecard," "ERP selection." Pairs with [[edi-punchout-checklist]]
  for the integration requirements and [[reorder-point-optimizer]] and
  [[price-list-management]] for the functional tests.
---

# ERP Selection Scorecard

An ERP decision lasts ten to fifteen years and touches every order, every price, and
every inventory count. Companies pick badly in two ways: they score on a demo the vendor
scripted, or they pick the cheapest quote and pay the difference in customizations and
consultants for a decade. The rubric scores what matters in the order it matters, with
cost last, and forces the scripted demo to run the company's own ugliest transactions.
The trap is a requirements list of 400 checkboxes every vendor ticks; the differentiators
in distribution are a dozen hard things, and those get weighted. Done means: two or more
real candidates scored on the same evidence, a five-year cost each, reference calls made
with the same questions, and a recommendation with the conditions attached.

## Inputs
- The company profile: manufacturer, distributor, or both; revenue and order volume
  (orders per day, lines per order, SKUs active, customers active, warehouses); channels
  (distributors, national accounts, e-commerce, direct); current ERP and version,
  what is customized, what is integrated (CRM, e-commerce, EDI, WMS, shipping, quoting).
- The pain list from the users: order entry, purchasing, warehouse, accounting, sales,
  IT, each with their top five problems and the one thing they refuse to lose.
- The candidate list. If none, propose from the common set by segment: Infor
  CloudSuite Industrial (Syteline) and CloudSuite Distribution (SX.e), Epicor Prophet
  21, Epicor Eclipse, Epicor Kinetic, NetSuite, Acumatica, Microsoft Dynamics 365
  Business Central, SAP Business One, DDI Inform, Infor M3 for larger process
  manufacturers.
- Budget range and timeline, the integration inventory (every system that talks to the
  ERP today), and the data to migrate (item, customer, vendor, open orders, history
  years).
- Sample transactions for the scripted demo: the ten hardest real orders, quotes, POs,
  and month-end steps the company runs, with their data.

## Process

### 1. Write the must-haves and the differentiators
- Must-haves (pass/fail, no score): multi-warehouse, standard cost and average cost,
  lot or serial where the products need it, sales-tax engine (Avalara or Vertex
  integration), audit trail on price and inventory changes, role-based security with
  field-level control on price and cost, open API or documented integration layer,
  full data export in a documented format.
- Distribution differentiators (scored): matrix pricing (customer × product group ×
  quantity, with effective dates), contract/SPA pricing with expiry and attainment
  tracking, rebates (customer and vendor, accrual and settlement), EDI (850/855/856/810
  native or via a certified partner) and punchout (cXML/OCI), MRP or DRP with min/max
  and forecast replenishment, kitting and light assembly, e-commerce integration with
  live inventory and customer-specific pricing, RF/barcode warehouse, landed cost,
  drop-ship and direct-ship flows, customer part-number cross-reference, quote-to-order
  with approvals, commissions by ship-to or rep.
- Manufacturer additions: multi-level BOM and routing, job costing, shop floor data
  collection, engineering change control, quality/NCR, capacity planning.

### 2. Score with the bulletproof rubric, cost last
- Dimensions and default weights: functionality fit 25, ease of use (users 10 + admin
  5) 15, reliability and track record 12, security posture 10, data ownership and exit
  path 10, longevity of vendor and product line 10, maintenance burden 8, cost 10.
- Each dimension 1 to 5 with a written evidence line (demo step, reference quote,
  document). A score without evidence is blank, not a 3.
- `Weighted score = Σ (dimension score × weight) / Σ weights × 20` (0 to 100 scale).
- Data exit path is scored on: can the company export every table in a documented
  schema without vendor help; what does the contract say about data on termination;
  is the database accessible (on-prem SQL, or a cloud with SQL access vs API-only).
- Longevity is scored on: product roadmap investment (release cadence, R&D signals),
  the vendor's history of sunsetting products, installed base in the company's segment,
  partner ecosystem depth.

### 3. Run the scripted demo on the company's own data
- Each vendor gets the same script and the same sample data: the ten hard transactions,
  a matrix price with a contract override and a quantity break, a rebate accrual, an
  EDI 850 with a customer part number, a lot-traced return, a min/max recalculation, a
  drop-ship order with commission, month-end close steps.
- Score what was shown live, not what was described. "Configurable" means "not shown";
  "via partner" means an extra vendor to score.
- Record the number of clicks and screens to enter a standard 5-line order and a PO;
  ease of use is measured, not felt.

### 4. Reference checks with the same questions
- Three references per vendor, same segment and size, at least one the vendor did not
  supply (user groups, LinkedIn, the partner's other clients).
- Questions: what did implementation cost vs the quote; how long; what broke at go-live;
  what did you customize and do you regret it; how is support (response time on a
  down system); what does the annual increase look like; what would you do differently;
  what does the product not do that you expected; would you choose it again.
- Record answers verbatim where they are load-bearing.

### 5. Five-year total cost of ownership per candidate
- `TCO5 = software (license or subscription × 5, with the contractual escalator) +
  implementation (partner services; sanity range 1× to 2× first-year software for
  distribution, more with heavy customization) + data migration + integrations (EDI,
  e-commerce, CRM, shipping, tax) + customizations + training + hosting/infrastructure
  (on-prem hardware and DBA, or cloud fees) + upgrades (on-prem major upgrade every
  3 to 5 years) + internal staff time (project team FTE-months × loaded rate) +
  contingency (20% of implementation)`.
- Show each line per vendor, the assumption behind it, and the source (quote, reference,
  benchmark). Costs from a vendor's proposal are labeled as proposal; costs from
  references are labeled as reference.
- Add the cost of staying: the current system's five-year cost, so the decision is
  against a real alternative.

### 6. Recommend with conditions
- The recommendation names the candidate, the score, the TCO5, and the conditions:
  contract terms to get (data export clause, price escalator cap, support SLA), the
  partner to use, the phasing (what goes live first), and the three risks with their
  mitigations.
- Note channel and integration dependencies: the e-commerce and punchout catalogs, the
  distributor price-file formats, and the EDI partners that must be re-tested (hand to
  [[edi-punchout-checklist]]).

## Output format
ALWAYS structure as:
1. Summary — candidates, weighted scores, TCO5 each, recommendation with conditions.
2. Must-have gate — pass/fail table with evidence.
3. Scorecard — dimensions × candidates, each cell with score and evidence line, weights
   shown, weighted totals.
4. Distribution differentiators — the feature table with what was demonstrated live vs
   described vs partner-supplied.
5. Scripted demo results — transaction by transaction, per vendor, clicks and screens
   measured.
6. Reference-check summary — questions × references, verbatim where load-bearing.
7. Five-year TCO — line items per candidate with source labels, plus the cost of staying.
8. Recommendation, conditions, risks, and phasing — with the open questions for the
   vendors.

## Guardrails
- Scores rest on evidence the team saw (demo on company data, documents, reference
  calls); a vendor's claim without a demonstration is not evidence.
- Costs are labeled by source (proposal, reference, benchmark); no number is presented as
  the price until a written quote exists.
- The selection is a management decision. This skill recommends; the leadership team
  decides, and the contract is reviewed by counsel before signing.
- Never let cost be the first filter; the cheapest candidate that fails a must-have or
  the data-exit test is removed before cost is compared.
- Company data given to vendors for the demo is scrubbed of customer names and costs
  where the NDA does not cover them.
- No production system is changed during evaluation; sandboxes only.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** independent ERP analyst reports and user reviews (Gartner Peer Insights, G2, Software Advice; Panorama Consulting's ERP report, paid) for satisfaction and failure patterns by product; the vendors' user-group communities (Infor Communities, P21WWUG, NetSuite user groups) for unfiltered reference candidates; an independent ERP selection consultant (paid) when the team has never run a selection, mainly for contract negotiation leverage. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
