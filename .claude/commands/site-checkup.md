---
description: Full health check of the live website — run monthly or when something seems off
---

Run a checkup on the live site (the vercel.app URL until deltaroe.com is cut over;
after cutover, check deltaroe.com):

1. Fetch every main page (home, all 10 services, sound-chakras, the-clearing,
   memberships, shop, events, about, intake, faq, journal, reviews, gift-cards,
   corporate-wellness, contact) — confirm each returns 200 and looks right.
2. Confirm the booking link in `lib/site.ts` still points at the current scheduler
   and loads.
3. Run `npm run kb:check` for KB/FAQ coverage.
4. Check Vercel deploy status — the latest deploy should be green.
5. Check the intake form's delivery config: `RESEND_API_KEY` present in Vercel env;
   scan recent function logs for "[intake] SEND FAILED" lines.
6. Check `/api/chat-log` MISS lines — list any questions Roe couldn't answer and
   offer to teach her (see /teach-roe).
7. Report results in plain language: what's healthy, what needs attention, what you
   recommend doing next. Fix anything broken (with the owner's OK if it changes
   content).
