---
name: web-performance
description: >
  Make the site fast — optimize Core Web Vitals (LCP, INP, CLS), image and font
  delivery, JavaScript/CSS weight, caching, and load behavior. Use this skill whenever
  the user cares about speed, page load, performance scores, Lighthouse/PageSpeed, "the
  site feels slow," or before launch — especially important because this site is
  graphics-heavy. Trigger on "make it faster," "improve load time," "Core Web Vitals,"
  "Lighthouse score," "optimize images," "why is the page slow." Speed affects both
  conversions and SEO ranking.
---

# Web Performance

Speed is not optional for this project: it's a Google ranking factor (helps
[[seo-optimization]]) and directly affects conversions — every extra second of load
loses visitors before they ever see the quote form. And because the site is deliberately
graphics-heavy (see [[web-graphics]]), performance must be engineered, not assumed.
Target **green Core Web Vitals** and a fast experience on a mid-range phone over typical
mobile network conditions, not just on a fast desktop.

## The metrics that matter (Core Web Vitals)

- **LCP (Largest Contentful Paint)** — load speed; the main content/hero should appear
  quickly. Target < 2.5s.
- **INP (Interaction to Next Paint)** — responsiveness to input. Target < 200ms.
- **CLS (Cumulative Layout Shift)** — visual stability; nothing should jump as it loads.
  Target < 0.1.
Also watch total page weight, time to first byte, and number of requests.

## Highest-leverage optimizations (roughly in order)

### 1. Images (usually the biggest win on a visual site)
- Serve **AVIF/WebP**, correctly sized for the slot, with responsive `srcset`.
- **Lazy-load** below-the-fold images; **preload** the LCP hero image.
- Always set explicit `width`/`height` (or aspect-ratio) to prevent layout shift (CLS).
- Compress aggressively without visible quality loss. Coordinate with [[web-graphics]]
  on export settings.

### 2. Fonts
- Self-host or preconnect; preload key fonts; use `font-display: swap`.
- Subset to needed characters; limit the number of weights/faces.
- Avoid invisible-text flashes and font-driven layout shift.

### 3. JavaScript & CSS
- Ship as little JS as possible — this is why [[frontend-build]] defaults to Astro
  (zero-JS by default). Defer/async non-critical scripts.
- Remove unused CSS/JS; minify and compress (gzip/brotli).
- Inline critical CSS for above-the-fold; load the rest after.
- Be ruthless about third-party scripts (chat widgets, trackers) — they're common
  performance killers. Load analytics/tags efficiently (see [[web-analytics]]).

### 4. Delivery & caching
- Use a CDN/edge host; enable compression and long-lived caching for static assets.
- Prefer static generation (SSG) for marketing pages so they serve instantly.

## How to measure

- Run **Lighthouse** and **PageSpeed Insights** (test mobile, not just desktop).
- Use real field data (Core Web Vitals report) where available, plus lab tests.
- Profile in the browser to find what's actually slow before optimizing — measure,
  don't guess. Use the browser tools from [[webapp-testing]] to capture metrics.

## Output

Report current vs target metrics, then a prioritized list of fixes (biggest impact
first) with the specific change and its expected effect. Re-measure after changes and
report the before/after. Don't claim an improvement you haven't measured. End with a
verdict on whether the page meets the performance bar for launch.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** Lighthouse + CrUX field data (free), WebPageTest (free) for waterfalls; DebugBear/SpeedCurve (paid) for continuous monitoring. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

