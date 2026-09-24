---
name: status-2026-07-29-takeover-packet
description: "7/29: Tamika-takeover packet SHIPPED (commit 70e8e73) — all project knowledge moved into repo CLAUDE.md, 7 owner slash-commands, Takeover Guide HTML+PDF; what remains for the actual transfer"
metadata:
  type: project
---

**7/29/2026 — Tamika is taking ownership of the project.** Packet shipped in commit
`70e8e73` on main:

- **Repo CLAUDE.md is now the complete knowledge base** (supersedes machine-local
  memory as the authority for site rules): house rules incl. the 7/20 gender-neutral
  ruling, launch checklist, Soulful Journey spec, vendor stack, intake/Resend
  handover note, owner-context instructions (explain plainly, do everything
  end-to-end, never ask for passwords). Keep it updated — HER Claude sessions read it.
- **`.claude/commands/`**: change-a-price, teach-roe, update-hours, add-event,
  new-journal-post, publish, site-checkup.
- **`docs/Delta-Roe-Takeover-Guide.html` + .pdf** — zero-experience guide:
  Part A accounts (GitHub, Claude Pro, Vercel — nothing to install; recommended path
  = Claude Code on the web at claude.ai/code), Part B transfer day (GitHub repo
  transfer → she imports into her own Vercel → Resend switch → DNS cutover),
  Parts C–G (Claude daily use + cookbook, house rules, launch checklist, shop track,
  costs ~$40/mo, safety). Render script:
  robbjack-platform/scripts/render-deltaroe-takeover-guide.mjs.
- **PACKAGE SENT 7/29 (Mike's explicit go-ahead):** email to tamika@deltaroe.com
  (cc Mike's gmail, reply-to same; sender Mike MacArthur <web@send.robbjack.com>;
  Resend id d2a1905a-2c4f-43c9-b616-c1dd7fe629a8) with 3 PDFs: Takeover Guide,
  Owner's Manual v1, **Launch Kit** (new — gbp-kit.md + review-templates.md combined,
  render script robbjack-platform/scripts/render-deltaroe-launch-kit.mjs).
- **Launch docs freshened before sending (commit 4a9faaf):** gbp-kit + review
  templates had pre-7/20 "queen" client addressing and the OLD Soulful Journey
  description — both fixed (client address now "friend"/neutral, 👑-at-client → 💛;
  "queenly" describing Tamika herself stays; new SJ spec in GBP services list).

**8/1: GITHUB TRANSFER REQUESTED** — repo transfer monkeymike2023-web/deltaroe-website
→ **tamika-afk** (her account, created 8/1, verified brand-new/empty before sending)
initiated from Mike's browser; awaiting her email acceptance (24h window; if it
lapses, redo: repo Settings → Danger Zone → Transfer). After acceptance: Mike's
local clone remote redirects but his push access ends unless she adds him as
collaborator; HIS Vercel project keeps the site live but loses the GitHub link →
her Vercel import (transfer-day step 2) becomes the deploy path.

**Remaining for actual transfer (needs Mike + Tamika live):** she creates the 3
accounts → transfer-day call (GitHub Settings→Transfer ownership; she accepts within
24h; she imports repo into her Vercel; her own Resend account + change hard-coded
sender in app/api/intake/route.ts; DNS cutover per launch checklist) → Mike removes
his access. Until her Vercel import, the live deploy still runs from Mike's Vercel.

Related: [[status-2026-07-21-launch-state]], [[deltaroe-website-project]].
