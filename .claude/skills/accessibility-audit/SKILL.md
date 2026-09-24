---
name: accessibility-audit
description: >
  Audit and fix web accessibility against WCAG 2.1/2.2 AA — color contrast, keyboard
  navigation, screen-reader semantics, alt text, form labels, focus management, and
  reduced motion. Use this skill whenever the user wants the site to be accessible,
  asks about WCAG/ADA/508 compliance, wants to reach more users, or before launching
  any page. Trigger on "is this accessible," "WCAG," "screen reader," "contrast check,"
  "ADA compliance," "can everyone use this." Accessibility also improves SEO and overall
  usability, so apply it during build, not as an afterthought.
---

# Accessibility Audit (WCAG AA)

Accessibility is the right thing to do, reduces legal risk (ADA/Section 508), widens the
audience, and overlaps heavily with SEO and good UX (semantic markup, alt text, and
contrast help everyone and every search engine). Target **WCAG 2.1/2.2 Level AA** as the
standard. Build it in via [[frontend-build]]; auditing late is far costlier than doing
it right.

## What to check

### 1. Perceivable
- **Color contrast:** text vs background meets AA — 4.5:1 for normal text, 3:1 for large
  text and meaningful UI/icons. Check the brand accent on its intended backgrounds (flag
  any [[brand-guidelines]] combos that fail and propose adjusted tokens).
- **Don't rely on color alone** to convey meaning (e.g., error states need text/icon too).
- **Alt text:** every meaningful image has a concise, descriptive alt; decorative images
  use empty alt (`alt=""`) so screen readers skip them. (Coordinate with [[web-graphics]].)
- **Text resizes** cleanly to 200% without breaking layout.

### 2. Operable
- **Full keyboard access:** every interactive element reachable and usable by keyboard
  in a logical order; no keyboard traps.
- **Visible focus indicator** on all focusable elements — never remove outlines without
  a clear replacement.
- **Tap/click targets** large enough (~44px) and not too close together.
- **Respect `prefers-reduced-motion`** — disable non-essential animation for users who
  ask for it.
- **Skip-to-content** link for keyboard/screen-reader users.

### 3. Understandable
- **Semantic structure:** correct landmarks (`header/nav/main/footer`), one logical
  `<h1>` and an ordered heading hierarchy (also good for SEO).
- **Forms:** every input has an associated `<label>`; required fields and errors are
  programmatically conveyed, not just visual; error messages are clear and specific.
- **Consistent, predictable navigation** across pages.
- Set the page `lang` attribute.

### 4. Robust
- Valid, semantic HTML; ARIA only where native elements can't do the job (and used
  correctly — wrong ARIA is worse than none).
- Works with assistive tech; dynamic content changes are announced appropriately.

## How to run it

- Review the code/markup for semantics, labels, and ARIA.
- Use the browser tools (see [[webapp-testing]]) to tab through the page and confirm
  keyboard order and focus visibility.
- Check contrast on actual color pairs.
- Run an automated checker (e.g., axe) for coverage, but don't rely on it alone —
  automated tools catch ~30–40% of issues; the rest need human judgment (alt text
  quality, logical focus order, meaningful labels).

## Output

A prioritized findings list: each item with severity (blocker/serious/minor), the
specific WCAG criterion, where it occurs, why it matters for real users, and the exact
fix (markup, attribute, or token change). Lead with blockers on the conversion path —
an inaccessible quote form excludes potential customers. End with an overall AA
readiness verdict.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** axe-core + Lighthouse (free) for automated passes, then a manual keyboard + screen-reader (NVDA/VoiceOver) pass — automation catches ~40% of WCAG issues at best. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

