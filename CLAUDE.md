# Delta Roe Website — Complete Project Knowledge

Luxury black+gold Next.js site for **Delta Roe** — Tamika Banks' reiki / sound bath /
chakra / life-coaching studio at 9075 Elk Grove Blvd, Suite 220A, Elk Grove CA 95624
(historic Old Town). This file is the complete, self-contained knowledge base for the
project: every rule, decision, and piece of context lives here so ANY Claude session —
on any machine — can maintain the site correctly.

## Who you are working for

The site owner is **Tamika Banks** (tamika@deltaroe.com). She is the founder, a
Certified Reiki Master & Empowerment Life Coach, and she may have little or no
technical experience. When working with her:

- Explain everything in plain language — no jargon, no assumed git/terminal knowledge.
- Do the technical work yourself end-to-end (edit → check → commit → push → verify
  live). Never hand her a manual technical step if you can do it for her.
- Confirm before anything destructive or hard to undo. Small content edits: just do
  them and show her the result.
- Never ask her for passwords, API keys, or payment details, and never display secret
  values back in chat.
- Every change is reversible — the site keeps full git history. If something breaks,
  reassure her and revert.
- The step-by-step owner documentation lives in `docs/` (Owner's Manual + Takeover
  Guide). Keep those documents updated when anything they describe changes.

## Live URLs & deploy model

- **Live site:** https://deltaroe-website.vercel.app — pushing to `main` on GitHub
  auto-deploys via Vercel (about 1–2 minutes).
- **deltaroe.com** still points at the old Wix site until the DNS cutover (see Launch
  checklist below). Until then, verify all work on the vercel.app URL.
- Booking CTAs point at the existing Wix scheduler (`https://www.deltaroe.com/book-online`)
  until Square Appointments is set up — the URL lives in `lib/site.ts` (`bookingUrl`).
- Publishing a change = commit + push to `main`, then verify the live page after the
  deploy finishes. If the deploy fails, the site stays on the previous version (safe).

## Architecture

Next.js 15 App Router, hand-rolled CSS (**no Tailwind — never add it**), all pages
static. Content lives in data files — most requests are edits to these:

| File | What it controls |
|---|---|
| `lib/site.ts` | Business facts: address, phone, email, hours, booking URL, nav, review link |
| `lib/services.ts` | The 10 service pages (`/services/[slug]`), prices, descriptions, per-service FAQs |
| `lib/products.ts` | Apothecary demo-store SKUs (shop is preview-only, noindex, demo cart) |
| `lib/faqs.ts` | 36-question FAQ page (FAQPage schema) |
| `lib/roe-kb.ts` | "Roe" chatbot knowledge base (client-side retrieval — zero API cost) |
| `lib/journal.ts` | Journal articles |
| `lib/chakras.ts` | Chakra data for the sound-chakras page |
| `lib/bowl-audio.ts` | Shared bowl/glass audio synthesis — used by BOTH `/sound-chakras` and `/the-clearing`; test both pages after touching it |
| `public/llms.txt` | AI-search business summary — keep in sync with any pricing/service/membership change |
| `app/api/intake/route.ts` | New-client intake form email delivery (Resend) |
| `app/api/chat-log/route.ts` | Roe chat logging; MISS lines = questions Roe couldn't answer = training backlog |

## Non-negotiable rules

1. **Tamika is African American.** Never use stock imagery with visible skin that
   misrepresents her. No stock faces at all — hands-only imagery is OK (current
   about.jpg = a Black woman's hands with candle, Pexels). Photos: Pexels (free
   commercial license, no attribution).
2. **Gender-neutral visitor address (ruling 7/20/2026 — supersedes earlier "queen"
   addressing):** clients include men. Never call the visitor "queen"; the approved
   endearment is **"friend."** References to Tamika's book *FLY Queen: First Love
   Yourself* stay (it's a title, not an address). Voice remains warm, direct,
   empowering — modeled on her books *FLY Queen* and *The Last Greyhound*. Every Roe
   answer points gently toward self-care and booking.
3. **Chakra colors are ceremonial** — they appear only where they mean something
   (chakra page, The Clearing, Sound of Paint, bracelet art). Everywhere else:
   midnight black `#0C0A08`, antique gold `#C9A464`, champagne `#E6CD95`, cream text.
4. **Honest wellness language everywhere:** reiki/energy/sound work is complementary
   wellness, never a substitute for medical care. Keep the not-therapy framing and the
   988 crisis line in the intake. Never add medical claims.
5. **Services are always sorted lowest → highest price** (enforced in `lib/services.ts`).
6. **After ANY edit to `lib/services.ts`, `lib/faqs.ts`, or `lib/roe-kb.ts`, run
   `npx tsx scripts/roe-kb-check.mts`** (also `npm run kb:check`). It is a prebuild
   gate — if it fails, the Vercel deploy fails. Fix coverage before pushing.
7. **Pricing/membership changes must be updated everywhere at once:** the service or
   program page, `lib/services.ts`, memberships page, homepage mentions, `lib/faqs.ts`,
   `lib/roe-kb.ts`, and `public/llms.txt`. (Precedent: the 7/21 Soulful Journey
   revision touched 7 places.)
8. **Don't run `npm run build` while the dev server is running** — it corrupts
   `.next` (fix: stop server, delete `.next`, restart). Local dev port is **3210**
   (`.claude/launch.json`, `deltaroe-dev`). Local preview is optional — Vercel
   deploys are the source of truth for verification.
9. **Every form that gets emailed to the studio must arrive formatted for easy
   reading (Tamika's standing rule, 8/1/2026)** — never a wall of plain text.
   Tamika reads these on a phone, often minutes before a client walks in, so the
   email has to be scannable at a glance. The pattern is set by
   `app/api/intake/route.ts`, and any new emailed form should follow it:
   - Send `html` **and** `text` to Resend, and render both from one shared data
     array so the two can never drift apart.
   - Lead with who it's from; make phone/email tappable (`tel:` / `mailto:`).
   - Anything urgent or safety-related goes in a coloured banner near the top,
     and into the subject line — never buried mid-body.
   - Group into labelled sections; give long free-text answers their own block.
   - Show unanswered questions as "not answered" rather than dropping the row —
     on an intake form, a blank is information.
   - Studio palette (midnight `#14100a`, gold `#c9a464`, champagne `#e6cd95`) on
     a light readable body; table-based layout with inline styles, since email
     clients ignore modern CSS. Always escape user input into the HTML.

## Business facts (mirror of lib/site.ts — that file is authoritative)

Phone (916) 206-1752 · Info@deltaroe.com · Hours: **Tue–Sat 11am–9pm, closed Sun &
Mon** (changed 8/1/2026 from the old Mon–Wed 9–9 / Thu 9–5 / Fri 1–3 / Sat 11–3
pattern). Founder: Tamika Banks. Programs: Sanctuary Circle $33/mo (virtual),
Ritual Membership $129/mo (studio), Soulful Journey $399/mo.

**Hours live in seven places** — changing them means all of: `lib/site.ts` (the
authoritative array), `lib/faqs.ts`, `lib/roe-kb.ts` (two entries: the booking
answer and the hours answer), `public/llms.txt`, `docs/gbp-kit.md`, the
`openingHoursSpecification` structured data in `app/layout.tsx` (this is what
Google reads — easy to miss), and this file. Google Business Profile has to be
updated by hand as well; it is not part of the repo.

**Soulful Journey (revised to Tamika's spec 7/21/2026):** $399/mo = 3 private 30-min
sessions (coaching or wellness) + personalized monthly wellness plan + guided journal +
full premium library + priority messaging (business hours) + 15% off + early access.
12-month container framing + optional $399 Roadmap intensive stay. Do NOT re-add the
removed items (master classes, 4th session, bi-weekly coaching, quarterly panels).

## The interactive pieces

- **Roe (chat bubble):** client-side retrieval from `lib/roe-kb.ts` — not connected to
  any AI service, can never go off-script, costs $0. Teach her new answers by adding
  KB entries; check `/api/chat-log` MISS lines for questions she couldn't answer.
- **/sound-chakras:** modal bowl-synthesis audio (real crystal-bowl physics), lotus
  chakra symbols (shared component), 10s cycle, "Hear your chakras" button.
- **/the-clearing:** therapeutic mini-game — 7 rounds root→crown, shatter dark
  word-shards, gather golden word-motes into a singing bowl, chain-break finale with
  ascending chakra tones. No timer, no score, nothing ever lost. Reduced-motion +
  keyboard accessible. Uses "friend" endearment.
- **/intake:** 5-step new-client form → `/api/intake` → email to Info@deltaroe.com via
  Resend (`RESEND_API_KEY` env var in Vercel). Reply-to = the client; ⚠ in the subject
  when safety flags are checked. Includes consent/scope/cancellation/18+/e-signature
  clauses and points at the live menu instead of hard-coding fees. There is also a
  print-blank version for the studio clipboard.
  **Sender (handed over 8/1/2026):** `web@mail.deltaroe.com`, sent through Tamika's
  own Resend account. Only **DKIM** is verified on that domain — Wix's DNS cannot
  host an MX record on a subdomain, so Resend's bounce-feedback MX was deliberately
  skipped and the domain shows "pending" for SPF/MX in the Resend dashboard. That is
  expected, not a bug: sending works, but bounce/complaint feedback is not collected.
  If DNS ever moves off Wix (e.g. to Cloudflare at the deltaroe.com cutover), add the
  MX record `send.mail` → `feedback-smtp.us-east-1.amazonses.com` to complete it.

## Launch checklist (state as of late July 2026)

**Signed off by Tamika 8/1/2026** — prices, membership tiers, and "The Delta Roe
Method" framing were reviewed item by item and approved as they stand. The approved
menu is: Discovery Call free · Sound Bath $77 · Diet & Nutrition Coaching $88 ·
Chakra Alignment $120 · Reiki Healing $144 · Reiki & Chakra Alignment $144 · Chakra
Alignment + Sound Bath $177 · Fascia Flow Reset $188 · Reiki + Sound Bath $188 · Life
Coaching $250; memberships Sanctuary Circle $33/mo · Ritual $129/mo · Soulful Journey
$399/mo. **These prices are the source of truth for the Square Appointments setup** —
if they change in Square, they must change here too (see rule 7).

"The Delta Roe Method" (Ground → Align → Restore → Integrate → Transform) is blessed
and lives in exactly one place: the "How healing happens here" section of
`app/page.tsx`. It is not echoed elsewhere, so it is a single-file edit if ever revised.

Then, in order:
1. **Vagaro** setup (booking, deposits, gift cards, memberships). **Square is dead —
   do not revisit it.** Square declined the merchant account after review (fallout
   from a stolen card, unresolved actions). Fresha was considered and dropped: its
   free tier ended in early 2025. Vagaro was chosen 8/1/2026 for its membership
   handling and, crucially, an **embeddable booking widget** so clients book without
   leaving deltaroe.com.
2. Swap `bookingUrl` in `lib/site.ts` from the Wix scheduler to Vagaro, and build the
   Vagaro embed widget into the site. `bookingUrl` is referenced in 12+ components but
   they all read that one constant, so it is a single edit.
3. **DNS cutover** deltaroe.com → Vercel. Capture/save the legacy Wix pages FIRST —
   they die at cutover.
4. ⚠️ **AT GO-LIVE, change the post-booking redirect inside Vagaro** from
   `https://deltaroe-website.vercel.app/booked` to `https://deltaroe.com/booked`.
   This lives in **Vagaro's own settings, not in this repo** — nothing in the codebase
   will flag it, and grepping for `vercel.app` finds nothing. If it is missed, every
   client who books gets bounced to the old preview domain after paying. Re-check any
   other absolute URL saved inside Vagaro at the same time.
5. **Google Business Profile**: flip website link, finish verification, get the real
   review short-link ("Ask for reviews" in GBP) and put it in `REVIEW_URL` in
   `lib/site.ts` (currently a REPLACE_ME placeholder; see `docs/gbp-kit.md` §8).
   Also correct the **hours** there — they still show the pre-8/1/2026 schedule.
   Add GA4 (`NEXT_PUBLIC_GA_ID`) + Search Console. Vercel Web Analytics already live.
6. Cancel Wix. 🎉

**/booked** is the post-booking landing page (noindex, deliberately absent from
`app/sitemap.ts`). Its job is to catch new clients at their most engaged moment and
send them to the intake form before their first visit.

**Review engine already built:** `/review` funnel page, `docs/gbp-kit.md`, printable
review card (`docs/review-card.html`), reply templates (`docs/review-templates.md`).

## The Apothecary shop (separate track, ~4–6 weeks, independent of launch)

Shop page is currently a noindex demo. Real store = **Shopify Basic** with a verified
zero-inventory private-label vendor stack (researched July 2026):
- **Candle Builders** — private-label candles, $0 fees (Shopify)
- **Blanka** — private-label body/massage oils, zero MOQ
- **Enchanted Soul** — crystals/sage/ritual kits, blind dropship (Shopify Collective)
- **Printful** — apparel on Bella+Canvas/AS Colour
- Add-ons: Dripshipper (private-label tea), Faire (net-60 wholesale), Get Grounded
  Shop affiliate. Grounding footwear = affiliate only (no wholesale programs exist).
Sequence: order samples (1–3 wk lead) → Tamika approves → Shopify + vendors → open.

## Running costs (told to Tamika)

~$21/mo at launch (Vercel Pro $20 + domain ~$15–20/yr) · ~$55–65/mo once the shop
opens (+ card fees on sales). Roe chatbot / databases / storage: $0.

## Handover / ownership

Ownership transfers to Tamika's own accounts: GitHub repo, Vercel project, Resend
(intake email), Square, Shopify, GBP, GA4. The full non-technical instructions are in
**`docs/Delta-Roe-Takeover-Guide.html`** (+ Owner's Manual v1 in the same folder).
Ready-made task commands for the most common jobs live in `.claude/commands/`
(type `/` in Claude Code to see them).

## Assets

- Logo source: `deltaroelogo.PNG`; crops in `public/`: `emblem.png` (square, no
  wordmark), `emblem-transparent.png`, `logo.png` (full).
- `public/audio/sound-bath-sample.mp3`: synthesized 60s 432 Hz binaural bowls.
- Product-label compositing was done with PowerShell GDI+ (PS 5.1 needs `[single]`
  casts on Font/RectangleF constructors) — only relevant if remaking labels.
