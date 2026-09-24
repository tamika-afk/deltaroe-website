---
name: edi-punchout-checklist
description: >
  Implement or troubleshoot EDI (850, 855, 856, 810, 997 and the supporting 832, 846,
  860, 820) and punchout (cXML, OCI) with a national account, distributor, or
  procurement platform: document the partner's requirements, build the mapping table,
  write the test plan, run the cutover, define error handling, and set up monitoring.
  Use this skill whenever a trading partner requires EDI or punchout, an existing
  connection is failing or chargebacks are arriving, or an ERP change means re-testing
  every partner. Trigger on "set up EDI with," "punchout catalog," "the 856 is
  failing," "we got a chargeback," "cXML," "Ariba/Coupa integration," "EDI mapping."
  Pairs with [[erp-selection-scorecard]] for the platform side and
  [[price-list-management]] for keeping the 832 and punchout catalogs current.
---

# EDI and Punchout Implementation Checklist

A national account's EDI requirement is a test of whether the company can be an easy
supplier. Done well, orders arrive without keying errors, invoices get paid on time, and
the buyer's procurement system shows the company's catalog at the buyer's contract price.
Done badly, it is chargebacks for late ASNs, POs rejected for a unit-of-measure mismatch,
and a buyer who quietly moves the business to the supplier whose documents work. The trap
is treating it as an IT project; it is an order-to-cash process with a mapping table in
the middle, and the mapping table is where every failure hides. Done means: the
partner's specification documented in one place, every field mapped with its
transformation, a test plan the partner signed, a cutover with a parallel period, and
alarms that fire before the partner's do.

## Inputs
- The trading partner's EDI or punchout specification: implementation guide per
  document, X12 version (4010, 5010), qualifiers and IDs, test and production
  endpoints, connectivity (VAN, AS2, SFTP, API), and their SLAs (997 within N hours,
  ASN before shipment arrival, invoice within N days).
- For punchout: cXML or OCI specification, the buyer's procurement platform (SAP Ariba,
  Coupa, Jaggaer, Oracle Procurement, Unimarket), catalog rules (customer-specific
  pricing, UNSPSC codes, images), and the PunchOutSetupRequest credentials process.
- The company's ERP EDI capability, read-only: native module (Infor ION/IDM, Epicor
  P21 EDI, NetSuite EDI via partner), or the EDI provider in use (SPS Commerce,
  TrueCommerce, Cleo, OpenText, Kleinschmidt, DiCentral) and its mapping tool.
- Master data: item master with UPC/GTIN, pack and UOM conversions, customer
  part-number cross-references, ship-to and bill-to addresses with the partner's
  location IDs (DUNS+4, GLN, store numbers), contract prices per partner.
- Current order-to-cash process: how orders are entered, acknowledged, picked, shipped
  (carrier, label format, SSCC-18 capability), invoiced.
- Volume expectations: POs per day, lines per PO, peak days, so the design fits the load.

## Process

### 1. Document the requirements in one place
- One requirements sheet per partner: documents required (default set: 850 inbound PO,
  855 PO acknowledgment, 856 advance ship notice, 810 invoice, 997 functional
  acknowledgment both ways; often also 832 price/sales catalog, 846 inventory advice,
  860 PO change, 820 remittance advice), version, connectivity, IDs, SLAs, chargeback
  schedule, test contacts, production contacts, go-live target.
- Read the chargeback schedule first. It tells you which fields the partner actually
  checks (ASN timing, carton labels, invoice matching, UOM) and therefore where to spend
  the testing time.
- Note every place the partner's rules conflict with the company's process (they require
  a 855 within 4 hours but orders are keyed the next morning; they require an ASN per
  carton and the warehouse ships per order).

### 2. Build the mapping table
- One row per field per document: partner segment/element (or cXML path), partner
  description, required/optional, sample value, ERP field, transformation, default
  when absent, validation rule, error action.
- Standard traps to map explicitly: N1 loop qualifiers (ST ship-to, BT bill-to, BY
  buyer, VN vendor) and which ID the partner sends; PO1 product ID qualifiers (BP buyer
  part, VP vendor part, UP UPC, IN item number) and the cross-reference order of
  precedence; unit of measure (EA vs CS vs BX and the pack conversion); price basis (the
  partner sends their contract price; the ERP applies its own; decide which wins and
  what tolerance triggers a hold, default 0.5%); dates (requested delivery vs ship
  date, DTM qualifiers 002/010/017); ship-to with no matching ERP record (hold, never
  auto-create); PO duplicates (same PO number twice: hold, never create two orders).
- For the 856: hierarchical structure (shipment/order/pack/item, HL loops), SSCC-18
  carton IDs, carrier SCAC and tracking, weight and cartons, and the timing rule (sent
  when the truck leaves, not when the order is picked).
- For the 810: invoice number, PO number, line matching to the 850, terms, freight as a
  separate SAC segment, tax handling, and the three-way match rule the partner uses.
- For punchout: PunchOutSetupRequest (authentication, buyer cookie, return URL),
  catalog session with customer-specific pricing pulled live from the ERP (never a
  stale file), PunchOutOrderMessage (cart back to the buyer), OrderRequest (the PO,
  mapped like an 850), and ConfirmationRequest / ShipNoticeRequest / InvoiceDetailRequest
  where the platform supports them.

### 3. Write the test plan and get the partner to sign it
- Test cases per document, minimum: happy path; multi-line with mixed UOM; customer
  part number not on file; price mismatch inside and outside tolerance; ship-to unknown;
  duplicate PO; PO change (860) after acknowledgment; partial shipment and backorder;
  cancel; drop-ship to a third address; multi-carton ASN; invoice with freight and tax;
  997 rejection handling in both directions; punchout session timeout and re-auth.
- Each case: input file or session, expected ERP result, expected outbound documents,
  pass criteria, tester, date, result.
- Run in the partner's test environment against the company's ERP test instance; never
  against production. Keep every test file.

### 4. Cut over with a parallel period
- Go-live checklist: production IDs and endpoints confirmed by both sides, certificates
  installed (AS2) with expiry dates recorded, master data loaded (cross-refs, location
  IDs, prices), the operations team trained on the hold queue, the partner's go-live
  contact on call.
- Parallel period (default 2 weeks or 20 POs, whichever is longer): every EDI order is
  compared to what the partner's buyer sent by email or portal; every ASN and invoice is
  checked against the shipment and the ERP invoice before the partner's match runs.
- Exit criteria: zero unexplained mismatches for 5 consecutive business days.

### 5. Define error handling
- Every inbound failure lands in a hold queue with a reason code and an owner; nothing
  is silently dropped and nothing is auto-created from bad data. Reason codes: unknown
  part, unknown ship-to, price out of tolerance, duplicate PO, missing required
  segment, 997 rejected by partner.
- Outbound failures (997 not received, AS2 MDN failure, partner rejection) retry on a
  schedule (default: 3 retries over 2 hours) and then alert a human.
- Each reason code has a written resolution step and a maximum age before escalation
  (default: 2 business hours for a held PO, 30 minutes for a failed ASN on a shipped
  order).

### 6. Monitor and review
- Daily dashboard or report: documents in and out by type, held count and age, 997
  turnaround (ours and theirs), ASN sent before arrival rate, invoice match rate,
  chargebacks received with reason.
- Alerts: any PO older than the SLA without an 855; any shipment without an ASN within
  1 hour of the carrier pickup scan; any 997 rejection; certificate expiring within 30
  days; a day with zero inbound documents from a partner that usually sends daily.
- Monthly: chargeback review with root cause per chargeback, and a partner scorecard
  (their 997 timeliness, their 820 accuracy, their spec changes).
- Catalog currency: the 832 and punchout catalogs are regenerated from the ERP on every
  approved price batch from [[price-list-management]]; a stale catalog is a price
  mismatch waiting to happen.

## Output format
ALWAYS structure as:
1. Partner requirements sheet — documents, versions, connectivity, IDs, SLAs,
   chargebacks, contacts, target date, process conflicts.
2. Mapping table — per document, the field-level table from step 2.
3. Test plan — cases with pass criteria and the sign-off block.
4. Cutover plan — checklist, parallel-period rules, exit criteria, rollback.
5. Error handling — reason codes, owners, resolution steps, escalation ages.
6. Monitoring — the daily report definition, alert rules, monthly review agenda.
7. Open issues — every conflict or unknown, with who answers it and by when.

## Guardrails
- The ERP is read-only for this skill. Mapping, configuration, and go-live changes are
  made by the EDI administrator through the company's tested path, and every mapping
  change is versioned with date, author, and reason.
- Testing runs only against test environments on both sides; production credentials
  never appear in a document, a test file, or a chat.
- Bad data never auto-creates an order, a customer, an item, or a ship-to; it goes to
  the hold queue for a human.
- Never confirm an 855 or send an ASN the ERP cannot back with a real order or a real
  shipment; a document is a commitment.
- Partner specifications and pricing are confidential; a distributor's punchout catalog
  shows that distributor's price, never another customer's.
- A punchout catalog for an end-user that buys through a distributor is built with the
  distributor, not around it.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** a managed EDI provider with the partner already on its network (SPS Commerce, TrueCommerce, Cleo, paid) which supplies the partner map pre-built and cuts testing weeks; the partner's supplier portal and chargeback reports (free) as the ground truth for what they check; an X12 validator (EDI Notepad, the provider's validator) to catch segment errors before the partner's 997 does. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
