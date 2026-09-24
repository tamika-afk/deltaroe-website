---
name: web-graphics
description: >
  Create and art-direct the visual assets that make a site stunning — hero imagery,
  process and technical diagrams, icons, before/after visuals, backgrounds, and
  social/OG images. Use this skill whenever the user needs graphics, illustrations,
  diagrams, image generation, image editing/optimization, or art direction for the
  Crystallume PVD/DLC site (or any site). Trigger on "make a hero image," "we need a
  diagram of the coating process," "design an icon set," "this needs visuals," or when
  a page is text-heavy and needs imagery to feel premium.
---

# Web Graphics & Visual Assets

Imagery is what separates a merely competent site from a stunning one. For a coatings
company this is a gift: coated parts are genuinely beautiful — iridescent, jewel-like,
engineered. The visual strategy is to **let the product be the hero** and support it
with crisp, branded technical graphics.

All assets must obey the [[brand-guidelines]] palette, and ship optimized for
[[web-performance]] and accessible per [[accessibility-audit]].

## Asset types and how to approach each

### 1. Hero & section photography (the coatings themselves)
- The single most valuable asset class. Macro shots of coated parts — the surface
  catching light, dramatic but honest. Dark backgrounds make coatings glow (ties to the
  graphite brand base).
- If the user has real parts, direct a photo shoot: matte black or seamless background,
  raking light to show the surface, shallow depth of field, several materials/colors
  (TiN gold, DLC black, etc.). Real beats rendered.
- When generating or sourcing imagery, keep a consistent treatment (lighting, color
  grade, framing) across the whole site so it feels like one body of work.
- Never use cliché stock (handshakes, generic "tech" abstractions, gear clip-art).

### 2. Technical & process diagrams
- Explain PVD and DLC visually: the deposition process, coating layers/structure,
  performance comparisons (hardness, wear, friction, temperature). A clear diagram
  builds authority faster than paragraphs.
- Style: clean, minimal, branded accent color, consistent stroke weight, labeled
  clearly. Build as **SVG** where possible — sharp at any size, tiny file, accessible.
- Use these to make complex expertise feel approachable — that supports the "experts
  who solve your problem" pillar from [[brand-guidelines]].

### 3. Icon set
- One cohesive set (consistent grid, stroke, corner style) for services, benefits, and
  feature lists. SVG. Don't mix icon styles — that's an instant "amateur" tell.

### 4. Before/after & proof visuals
- Show wear resistance, finish quality, problem-solved cases. Powerful trust builders;
  place near related claims (see [[uiux-design]]).

### 5. Backgrounds, textures, social/OG images
- Subtle engineered textures (brushed metal, fine grain) at low contrast — never
  competing with content. Branded Open Graph images so shared links look premium.

## Production standards

- **Format:** SVG for diagrams/icons/logos; AVIF or WebP for photos (with fallback).
- **Optimization:** export at the right dimensions for their slot (don't ship a 4000px
  image into a 600px box), compress, and provide responsive sizes. Hand to
  [[frontend-build]] with width/height so there's no layout shift.
- **Accessibility:** every meaningful image needs alt text; decorative images marked
  as such. Don't encode information in color alone.
- **Consistency:** lock a treatment (color grade, lighting, icon style) early and apply
  it everywhere. Consistency is the luxury signal.

## When generating images with AI tools

If using image generation: write detailed prompts specifying subject, lighting,
background, mood, and camera framing aligned to the brand. Generate variations, then
curate hard — pick the few that look genuinely premium and on-brand, and discard the
rest. Always sanity-check that generated technical content is accurate; never imply a
spec or process detail that isn't true. Real product photography is preferred over
generated imagery whenever the user can supply parts.

## Deliverable checklist

Before handing assets off: on-brand color/treatment, correct format, optimized file
size, responsive sizes provided, alt text written, and consistent with the rest of the
site's visual language.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live site, real code, or actual data.
- **Force multipliers:** image-generation APIs (paid) with precise art direction; licensed stock (paid); SVG/CSS first for crispness and weight. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.

