---
name: webapp-testing
description: >
  Verify the website actually works — drive it in a real browser to check pages render,
  links and navigation work, forms submit, layouts hold across devices, and nothing is
  broken. Use this skill whenever the user wants to test the site, check it works,
  catch bugs, verify a page or form before launch, take screenshots for review, or
  reproduce an issue. Trigger on "test the site," "does the form work," "check it on
  mobile," "make sure nothing's broken," "screenshot the homepage," or before shipping
  any page.
---

# Web App / Site Testing

A world-class site that has a broken contact form or a layout that collapses on mobile
loses customers silently. This skill drives the real site in a browser to catch
problems before visitors (and lost leads) do. The conversion path — especially the
quote/contact form — is the highest-priority thing to verify, because a broken form
means lost revenue with no error message to the business.

## Tools

Use the available browser-automation tools to interact with the running site:
- The **Claude Preview** MCP (`mcp__Claude_Preview__*`) for starting and driving a
  local dev preview — navigate, screenshot, click, fill, inspect, read console logs.
- The **Claude-in-Chrome** MCP (`mcp__Claude_in_Chrome__*`) for driving a real browser
  against a live or staged URL.
Load these via ToolSearch if they aren't already available. Take screenshots at desktop
and mobile widths so the user can see results.

## What to test

### 1. Rendering & layout
- Each page renders fully, no missing assets, no console errors.
- Layout holds at mobile, tablet, and desktop widths — no overflow, overlap, cut-off
  text, or broken images. Resize the viewport and screenshot each breakpoint.
- Images load and are correctly sized (no giant downloads, no layout shift).

### 2. Navigation & links
- Every nav item, button, and link goes where it should — no 404s or dead ends.
- Logo links home; footer links work; breadcrumbs correct.
- Active states and hover/focus states behave.

### 3. Forms (highest priority — the revenue path)
- The quote/contact form submits successfully and the data reaches its destination.
- Validation works: required fields enforced, bad input caught, helpful errors shown.
- Success state appears; user knows what happens next.
- File/photo upload (if present) works.
- Test on mobile too, including tap-to-call links.

### 4. Cross-cutting checks
- Page load feels fast (flag slow pages for [[web-performance]]).
- No accessibility blockers surface (hand details to [[accessibility-audit]]).
- Works in more than one browser if feasible.

## Workflow

1. Get the site running (local preview or staged URL).
2. Walk the primary visitor journey end to end: land → explore a service → reach the
   quote form → submit. This is the path that earns revenue, so it gets the most care.
3. Then sweep the remaining pages for rendering/link/responsive issues.
4. Capture screenshots and console output as evidence.

## Output

Report findings as a clear pass/fail list grouped by severity, each with: what you did,
what happened, what you expected, and a screenshot or console snippet as proof. Lead
with anything that breaks the conversion path or a core page. Be honest — if something
failed, say so plainly with the evidence; don't report success you didn't observe. End
with a go/no-go read for launching the tested pages.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** Playwright (free, in-stack) for scripted browser truth; BrowserStack (paid) for real-device coverage when it matters. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

