---
description: Full health check of the live website — run monthly or when something seems off
---

Run a checkup on **https://deltaroe.com** — the domain went live on 8/4/2026 and is
now the real site. (The `*.vercel.app` URLs still work but are not what clients see;
`deltaroe-website.vercel.app` in particular is a stale, different project — never
judge the site by it.)

1. Fetch every main page (home, all 10 services, sound-chakras, the-clearing,
   memberships, shop, events, about, intake, faq, journal, reviews, gift-cards,
   corporate-wellness, contact, policies) — confirm each returns 200 and looks right.
   Also confirm `www.deltaroe.com` still redirects (308) to the apex.
2. Confirm the booking link in `lib/site.ts` still points at the current scheduler
   and loads.
3. Run `npm run kb:check` for KB/FAQ coverage.
4. Check Vercel deploy status — the latest deploy should be green.
5. Check the intake form's delivery config. Since 8/4/2026 it sends over **Google
   Workspace SMTP**, not Resend: confirm **both** `SMTP_USER` and `SMTP_PASS` are
   present in Vercel env — with only one set, the route silently falls back to
   Resend and 502s. Scan recent function logs for `[intake] sent via smtp` (healthy)
   and `[intake] SMTP SEND FAILED` / `[intake] SEND FAILED` (not).
   ⚠️ Do NOT "fix" this by going back to Resend. Resend cannot verify this domain
   while DNS is at Wix — it needs an MX on a subdomain, and Wix allows no subdomain
   MX, no nameserver change, and no NS records. That is settled; see CLAUDE.md.
   ⚠️ Known quirk, not a fault: intake mail is sent from tamika@deltaroe.com to
   Info@deltaroe.com, which is an alias onto the same mailbox — so Google files it
   under **Sent**, not Inbox. Delivery is fine; visibility is the open issue.
6. Check the security headers on the live site — `X-Frame-Options`,
   `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
   `Strict-Transport-Security` and both `Content-Security-Policy` headers should all
   be present. Run `npm audit` and report anything high severity.
7. Check `/api/chat-log` MISS lines — list any questions Roe couldn't answer and
   offer to teach her (see /teach-roe).
8. Report results in plain language: what's healthy, what needs attention, what you
   recommend doing next. Fix anything broken (with the owner's OK if it changes
   content).
