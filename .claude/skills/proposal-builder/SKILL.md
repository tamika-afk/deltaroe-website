---
name: proposal-builder
description: >
  Produce a client-ready proposal packet (cover, opportunity, what you get, proof, tiered
  options, add-ons, roadmap, ROI, FAQ, acceptance page) as print-ready HTML rendered to PDF,
  with the page-overflow check and the rule that every page is looked at before it ships. Use
  this skill whenever a quote needs to become a proposal, a program or stocking agreement needs
  a document, or a deal is big enough that a price on a form will not carry it. Trigger on
  "build the proposal," "turn this quote into a proposal," "proposal packet," "we need something
  to send them," "make it look professional." Pairs with [[account-plan]] for the opportunity
  content and [[objection-handling-playbook]] for the FAQ.
---

# Proposal Builder

A proposal is a decision document for someone who was not on the calls. It restates their
problem in their numbers, shows what they get, proves it, prices it in tiers so the
conversation is "which one" not "whether", and ends on a page they can sign. The trap is a
pretty PDF with a stale price and a table cut in half at a page break, sent without anyone
opening it. Done means human-approved pricing, every number sourced, a PDF whose page count
matches the plan, every page looked at, and sign-off recorded before it leaves.

## Inputs
- The opportunity brief: account, contacts and titles, the problem in their words, the
  quantified pain (from [[discovery-call-guide]] or [[account-plan]]), timeline, decision
  criteria, competitor situation, channel (direct or through a named distributor).
- Approved pricing for every tier and add-on, from the quote engine or the pricing owner, with
  the approver's name and date. No proposal is built on unapproved numbers.
- Proof assets: test data, case studies, references, certifications, stock and lead-time data
  from the ERP (read-only), warranty and terms.
- Brand tokens: logo files, colors, fonts, legal entity name, address, the standard terms page.
- Page plan: which of the sections below are in scope. Default full packet is 8 to 12 pages.

## Process

### 1. Brief and page plan
- Write the page plan with the expected page count per section before writing prose. Record it;
  step 7 checks against it.
- Confirm the recipient's channel: a proposal to an end customer served by a distributor is
  co-branded with, and delivered through, the distributor.

### 2. Write the content, in the buyer's numbers
- **Cover:** their company, the proposal title as an outcome ("Cutting cost per part on the
  housing line"), date, validity date, our contact, proposal number.
- **The opportunity:** their situation and pain in two paragraphs using the numbers they gave
  (volume, scrap, cycle time, current cost). Every number cites its source (call date, their
  email, their data).
- **What you get:** the scope in plain terms: products, quantities, services (trials,
  application support, stocking, training), service levels, what is excluded.
- **Proof:** two or three items maximum, each with a specific result and a source.
- **Options:** three tiers (default names Standard, Preferred, Program), each a complete
  package with price and what changes between tiers. The middle tier is the recommended one and
  says so. Anchor high, never pad the low tier.
- **Add-ons:** priced individually, optional, never bundled silently.
- **Roadmap:** dated first 90 days: trial, approval, first stocking order, review.
- **ROI:** the arithmetic shown. `annual savings = (current cost per part − proposed cost per
  part) × annual parts`, with `cost per part = tool price ÷ parts per tool + cycle minutes ×
  machine rate ÷ 60`. Inputs table with source per input; illustrative inputs labeled illustrative.
- **FAQ:** six to eight questions taken from [[objection-handling-playbook]] and the calls.
- **Acceptance:** tier selected, add-ons, price, validity, terms reference, signature and date
  lines for both parties, PO instructions.

### 3. Build the HTML for print
- One HTML file, embedded CSS, no external dependencies at render time. `@page { size: Letter;
  margin: 0.75in }` (A4 where the recipient is outside North America). Fixed header and footer
  with proposal number, page x of y, confidentiality line.
- Page-break rules: each top-level section starts on a new page (`break-before: page`);
  tables, figures, and the acceptance block are `break-inside: avoid`; headings carry
  `break-after: avoid`; long tables repeat the header row (`thead { display: table-header-group }`).
- Body type at 10.5 to 11 point, tables at 9.5 point minimum, brand colors for headings only.
  Images embedded as data URIs or local files with known dimensions.

### 4. Render to PDF
- Render with a headless browser (Playwright or Puppeteer `page.pdf` with `printBackground:
  true`, or a print-CSS engine such as WeasyPrint or Prince). Record the engine and version.

### 5. The page-overflow check
- Count the PDF pages. It must equal the page plan; a mismatch of even one page is investigated,
  never accepted.
- Rasterize every page to an image and look at each one: no heading orphaned at a page bottom,
  no table split without its header repeated, no text overflowing a box, no image clipped, the
  footer page numbers sequential, the acceptance page whole.
- Search the PDF text for placeholders: brackets, "TBD", "lorem", "XX", "$0.00", the template's
  sample company name. Any hit stops the build.

### 6. Verify the numbers
- Rebuild the pricing table from the approved source and diff it against the PDF text. Rebuild
  the ROI from the inputs table and compare to the printed result.

### 7. Sign-off and send
- The rep or manager confirms the PDF (not the HTML) by opening it. Record approver, date,
  version. File the PDF with the version in the filename; a revision is a new version, never an
  overwrite. Delivery is by a human, through the distributor where one owns the account.

## Output format

ALWAYS structure as:
1. **Proposal PDF** — the file path, version, page count, render engine.
2. **Page plan versus actual** — planned pages per section, actual pages, any variance explained.
3. **Visual check log** — one line per page: what was checked, pass or fix.
4. **Number verification** — pricing diff result, ROI recomputation result, source per input.
5. **Approvals** — pricing approver and date, content sign-off and date, channel routing.
6. **Open items** — anything the customer must confirm before acceptance.
7. **Assumptions** — illustrative inputs, tier logic, validity window.

## Guardrails
- Never build on a price that has not been approved by the pricing owner; the approval name and
  date go in the log.
- Never send to a customer without a human opening the PDF and signing off in the same session
  the file was built.
- No figure appears in the proposal that was not read from a source; illustrative math is
  labeled on the page.
- Never overwrite a delivered version; every revision gets a new version number and filename.
- Channel: proposals for distributor-served accounts carry the distributor and go through them.
- Cost, margin, and other customers' pricing never appear anywhere in the file, including
  hidden HTML comments or metadata.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** Playwright or Puppeteer for deterministic PDF rendering and per-page screenshots; PandaDoc or DocuSign (paid) for tracked delivery, e-signature, and knowing when the buyer opened page 6; the company's quote engine or approved price list as the only pricing source; the cost-per-part calculator for the ROI page. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
