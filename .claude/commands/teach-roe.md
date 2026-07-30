---
description: Teach Roe (the website chat bubble) a new question and answer
---

The owner wants Roe to know something new: $ARGUMENTS

1. If the question or the answer is missing, ask for both — the answer should be in
   Tamika's own words where possible.
2. Add the entry to `lib/roe-kb.ts`, matching the existing entry format and voice:
   warm, direct, empowering, gender-neutral ("friend", never "queen"), honest
   complementary-wellness language, gently pointing toward self-care and booking.
3. If it's a question the public FAQ should also answer, add it to `lib/faqs.ts` too.
4. Run `npm run kb:check` — it must pass or the deploy will fail.
5. Commit, push, verify live, then show the owner exactly what Roe will now say.

Tip for the owner: to find questions Roe couldn't answer, check the chat log MISS
lines (Vercel → project → Logs, filter "MISS").
