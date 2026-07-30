---
description: Change the price of a service, membership, or program — everywhere at once
---

The owner wants to change a price. Ask which service/membership/program and the new
price if not given in: $ARGUMENTS

Then update it EVERYWHERE it appears, in one pass (per CLAUDE.md rule 7):
1. `lib/services.ts` (or the memberships/soulful-journey page for programs)
2. Any homepage mention
3. `lib/faqs.ts` answers that state the price
4. `lib/roe-kb.ts` answers that state the price
5. `public/llms.txt`

Keep services sorted lowest → highest price. Run `npm run kb:check` and fix any
failures. Then commit, push to main, wait for the Vercel deploy, and verify the new
price on the live site. Show the owner before/after in plain language.

Remind the owner: the price clients actually PAY lives in Square (or Shopify for shop
items) — she should change it there too if she hasn't already.
