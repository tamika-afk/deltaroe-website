---
description: Update studio hours, phone, email, or address across the whole site
---

The owner wants to update business facts: $ARGUMENTS

1. Edit `lib/site.ts` — it is the single source of truth (hours, phone, email,
   address, booking URL). The whole site reads from it.
2. Check `public/llms.txt` and `lib/roe-kb.ts` / `lib/faqs.ts` for any hard-coded
   copies of the old value and update those too (run `npm run kb:check` if KB/FAQ
   files changed).
3. Commit, push, verify on the live site.
4. Remind the owner to update the same facts in Google Business Profile and
   Square/Shopify — the website can't change those for her.
