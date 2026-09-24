---
name: frontend-build
description: >
  Build the actual website — modern, fast, responsive front-end code for Crystallume
  (and similar marketing/lead-gen sites). Use this skill whenever implementing pages,
  components, layouts, or styling in code; setting up the project stack; or turning a
  design/wireframe into a working site. Defaults to a modern code stack (Astro or
  Next.js + Tailwind CSS). Trigger when the user says "build the page," "code this,"
  "set up the site," "make it responsive," or implements any UI/UX or design spec.
---

# Front-End Build

This skill turns designs into clean, fast, maintainable, accessible code. The site's
job is brand awareness and lead generation, so the build priorities are, in order:
**(1) loads fast, (2) looks premium on every device, (3) easy to update, (4) ranks
well.** Beautiful code that loads slowly fails the business goal — see
[[web-performance]].

Always implement against the [[brand-guidelines]] tokens and the structure from
[[uiux-design]]. Don't invent colors, spacing, or copy here — pull them from those.

## Recommended stack

For a graphics-heavy marketing site that must be fast and SEO-friendly, default to:

- **Astro** (preferred for a mostly-static marketing site) — ships zero JS by default,
  excellent performance and SEO, great for content-driven pages. Use "islands" for the
  few interactive bits (nav, forms, sliders).
- **Next.js** is the alternative if the site needs heavier app-like interactivity or a
  team already knows React. Use static/SSG rendering for marketing pages.
- **Tailwind CSS** for styling — fast, consistent, and easy to encode brand tokens.
- **TypeScript** for safety on anything non-trivial.

Confirm the choice with the user if they have a hosting or team constraint. If unsure,
**Astro + Tailwind + TypeScript, deployed on a static/edge host** (Netlify, Vercel,
or Cloudflare Pages) is the right default for this project.

## Setup conventions

1. Encode brand tokens once, centrally:
   - Tailwind `theme.extend` for colors, fonts, spacing, radius, shadows — mirror the
     [[brand-guidelines]] palette and type scale exactly. Everything else references
     these, so a brand tweak is a one-line change.
   - Self-host or properly preload web fonts with `font-display: swap` to avoid layout
     shift and slow first paint.
2. Build a small **component library** first (Button, Section, Card, Nav, Footer,
   Hero, CTA band, Form). Compose pages from these so the site stays consistent and
   fast to extend. This is the design system in code.
3. Use a content layer (Astro content collections / MDX) so non-code content
   (services, industries, FAQ) can be edited without touching layout.

## Code quality principles

- **Semantic, accessible HTML** — real `<header>`, `<nav>`, `<main>`, `<h1>`–`<h6>`
  hierarchy, labeled forms, alt text. This serves both screen readers and SEO. Pair
  with [[accessibility-audit]].
- **Responsive by default** — mobile-first, fluid type and spacing, test at common
  breakpoints. No horizontal scroll, no tap targets under ~44px.
- **Performance built in, not bolted on:**
  - Serve images in modern formats (AVIF/WebP), correctly sized, lazy-loaded below the
    fold, with explicit width/height to prevent layout shift.
  - Minimize JS; prefer CSS for animation; defer non-critical scripts.
  - Aim for green Core Web Vitals (see [[web-performance]]).
- **Maintainable** — small focused components, no copy-pasted markup, consistent
  naming, comments only where intent isn't obvious.
- **SEO-ready markup** — one `<h1>` per page, meta tags, Open Graph, structured data
  hooks (see [[seo-optimization]]).

## Forms & conversion plumbing

The quote/contact form is the revenue path — build it carefully:
- Accessible labels, inline validation, clear success + error states.
- Spam protection (honeypot or hCaptcha) without harming UX.
- Wire submissions to a real destination (email/CRM/form service) and a
  thank-you state. Fire a conversion event for [[web-analytics]].
- Keep fields minimal — see [[conversion-optimization]].

## Workflow

1. Confirm/scaffold the stack.
2. Encode brand tokens and base components.
3. Build page by page from the [[uiux-design]] page briefs, dropping in copy from
   [[conversion-copywriting]] and assets from [[web-graphics]].
4. Run [[accessibility-audit]] and [[web-performance]] before considering a page done.
5. Verify in a browser with [[webapp-testing]].

## Definition of done for a page

Renders correctly mobile + desktop, no console errors, no layout shift, images
optimized, semantic and accessible, brand tokens used (no hardcoded one-off styles),
and the primary CTA works end to end.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** the project's existing components and tokens first — extend the system, don't fork it; verify in the running preview before calling it done. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

