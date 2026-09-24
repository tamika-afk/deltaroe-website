---
name: web-analytics
description: >
  Set up measurement so the business can see what's working — analytics (GA4),
  conversion and event tracking for quote/contact submissions, phone-call and form
  tracking, search visibility (Search Console), and reporting that ties traffic to
  leads. Use this skill whenever the user wants to track results, measure leads, know
  where customers come from, set up Google Analytics/Tag Manager/Search Console, define
  conversion events, or report on site performance. Trigger on "track conversions,"
  "set up analytics," "where are leads coming from," "is the site working," "measure ROI."
---

# Web Analytics & Conversion Tracking

You can't improve what you don't measure. The business goal is brand awareness and new
customers, so the site must report on the things that map to revenue: how many people
arrive, where from, and — most importantly — **how many become leads**. Without this,
[[conversion-optimization]] is guessing and the user can't tell if the new site is
paying off.

Keep tracking lightweight so it doesn't hurt [[web-performance]], and handle data
responsibly (privacy/consent where required).

## What to set up

### 1. Core analytics — GA4
- Install Google Analytics 4 (ideally via Google Tag Manager so tags can be managed
  without code changes). Load it efficiently to protect performance.
- Confirm baseline reporting works: traffic, sources/medium, top pages, devices,
  geography.

### 2. Conversion events (the part that matters)
Define and track the actions that represent business value, mapped to
[[conversion-optimization]]'s funnel:
- **Primary:** quote/contact form submission — mark as a key conversion event. Capture
  enough to know which page/source drove it.
- **Secondary:** phone-number clicks (tap-to-call), email clicks, resource/guide
  downloads, newsletter signups.
- **Micro-steps:** form starts (to spot abandonment), CTA clicks, key page views.
Tracking form *starts vs completions* reveals where leads are lost — gold for CRO.

### 3. Call & form tracking
- Track tap-to-call clicks; if the user wants attribution on actual phone calls,
  consider a call-tracking service. Many B2B leads come by phone — don't leave that
  invisible.
- Ensure form submissions fire a reliable event even with the [[frontend-build]] form
  setup (test it via [[webapp-testing]]).

### 4. Search visibility — Google Search Console
- Verify the site, submit the sitemap (from [[seo-optimization]]), and monitor which
  queries bring people in, impressions, click-through, and indexing issues. This closes
  the loop with SEO.

### 5. Privacy & consent
- Add a privacy policy and, where required (e.g., EU visitors), a consent mechanism.
- Avoid collecting more personal data than needed; respect Do Not Track / consent state.

## Reporting

Set up (or describe) a simple dashboard answering the questions the owner actually
cares about:
- How many leads (form + call) this period, and the trend?
- Which channels and pages produce leads (not just traffic)?
- What's the visitor→lead conversion rate, and where do people drop off?
- Which search terms and pages drive qualified visits?

Translate numbers into plain language and next actions — e.g., "the DLC page gets
traffic but few quotes; tighten its CTA and proof" — feeding [[conversion-optimization]]
and [[conversion-copywriting]]. Numbers are only useful when they drive a decision.

## Output

A setup checklist (what to install and how), a defined list of events/conversions to
track, and a reporting template. When reporting on real data, lead with leads and
conversion rate, then explain what to do about it.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** GA4 + GTM + Search Console (free core stack); Looker Studio (free) for reporting; server-side tagging when ad blockers matter. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

