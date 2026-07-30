---
description: Add or update an event (Sound of Paint, workshops, group sound baths)
---

The owner wants to add or change an event: $ARGUMENTS

1. Gather (ask only for what's missing): event name, date & time, price, what happens,
   how to book (default: the site's booking link).
2. Update the events page (`app/events/page.tsx`). Match the existing tone and the
   black/gold styling; chakra colors only if the event is genuinely chakra-themed.
3. If the event is worth Roe knowing about, add a short entry to `lib/roe-kb.ts`
   (then run `npm run kb:check`).
4. Commit, push, verify the live events page, and show the owner.
5. If the event has passed its date, offer to remove or archive it in the same pass.
