---
name: uiux-design
description: >
  Senior UI/UX strategy for web — information architecture, user flows, page layout,
  navigation, conversion-focused wireframes, and interaction design. Use this skill
  whenever planning a site's structure, designing or critiquing a page layout, deciding
  what goes where, mapping the visitor journey, or improving usability — especially for
  the Crystallume PVD/DLC site. Trigger it before front-end build so structure is
  decided before code. Use even if the user just says "design this page," "what should
  the homepage have," or "make this easier to use."
---

# UI/UX Design (Pro)

Great UX for a B2B lead-gen site is not about clever interactions — it's about getting
a skeptical professional from "who are these people?" to "I trust them, here's my part
to quote" with as little friction and doubt as possible. Every layout decision answers
one question: **does this move the visitor one step closer to contacting us, while
building credibility?**

Always consult the [[brand-guidelines]] skill for the visual language before laying
things out. This skill decides *structure and flow*; that one decides *look*.

## The method

### 1. Start from the visitor, not the page
For Crystallume's audience (engineers, buyers, shop owners — see [[brand-guidelines]]),
map the jobs-to-be-done:
- "Can they coat *my* specific part/material?"
- "Are they good — will they fix my problem and not ruin my parts?"
- "How do I get a quote and what's the lead time?"

Design so each of these is answered within a scroll or two of where the visitor lands.

### 2. Define the information architecture first
Propose a sitemap before any page design. A strong B2B coatings IA usually includes:
- **Home** — positioning, proof, primary CTA.
- **Coatings / Services** — PVD coatings, DLC coatings (one strong page each, or a
  hub + detail pages). Include applications, materials, benefits, specs.
- **Industries** — aerospace, medical, tooling, automotive, etc. (lets a visitor
  self-identify; great for SEO and relevance).
- **Why Crystallume** — equipment, expertise, the care/handling promise, process.
- **Resources** — FAQ, coating selection guidance, technical notes (builds authority
  + SEO).
- **About / Contact / Request a Quote.**
Keep top-nav to ~5–7 items. Depth lives in well-organized sub-pages, not a crowded bar.

### 3. Page-level layout principles
- **One primary goal per page.** Decide it, then make the primary CTA obvious and
  repeated (top, mid, bottom). The main CTA across the site is "Request a Quote."
- **Above the fold:** a clear value proposition (what + for whom + why you), a strong
  visual (a coated part), and the primary CTA. A visitor should grasp what Crystallume
  does in 5 seconds.
- **F-pattern / scan-friendly:** short headings, scannable bullets, generous whitespace.
  Technical readers skim first, then dig in.
- **Proof near every claim:** specs, certifications, logos of industries served,
  before/after, testimonials. B2B trust is built with evidence adjacent to the claim.
- **Reduce friction on conversion:** short forms, clear next step, multiple contact
  paths (form, phone, email). Ask only for what's needed to start a quote.

### 4. Navigation & wayfinding
- Persistent header with logo (home link), main nav, and a visually distinct
  "Request a Quote" button.
- Footer as a sitemap: contact info, key pages, certifications, location.
- Breadcrumbs on deep pages. Clear active states. Nothing should feel like a dead end —
  every page ends with a logical next step.

### 5. Interaction & states
Specify hover, focus, active, loading, empty, and error states for interactive
elements. Motion should be subtle and purposeful (reveal, emphasis) — never decorative
jank. Respect `prefers-reduced-motion`.

### 6. Responsive thinking
Design mobile and desktop intent together. Many buyers browse on phones, then convert
on desktop. Priority content and the primary CTA must be effortless on a small screen;
never hide the path to contact behind a hamburger with no visible CTA.

## Deliverables this skill produces

Depending on the ask, output one or more of:
- **Sitemap** (the page tree + purpose of each page).
- **Page brief** — for a given page: goal, audience, sections in order, the key
  message and CTA of each section, and what proof appears where. This is the bridge
  to the [[frontend-build]] and [[conversion-copywriting]] skills.
- **Low-fi wireframe** — described in structured text or simple HTML blocks, focused
  on hierarchy and flow, not visual polish.
- **UX critique** — when reviewing an existing page, evaluate against the principles
  above and give prioritized, specific fixes (pair with [[design-auditor]] for visual
  issues and [[conversion-optimization]] for funnel issues).

## Quality bar

Before calling a layout done, check: Is the page's single goal obvious? Can a visitor
find proof for every claim? Is the next step always clear? Would a busy engineer
understand the value in one scan? If any answer is "no," the structure isn't finished.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** real user evidence when it exists (analytics, session replays, support tickets) — structure decisions grounded in behavior beat opinion. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

