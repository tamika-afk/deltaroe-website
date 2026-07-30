---
description: Publish all pending changes to the live website and verify them
---

Publish the current work:

1. Show the owner a plain-language summary of what's about to go live (no diffs or
   jargon — "the Reiki price changes from $111 to $122 on 3 pages").
2. If `lib/services.ts`, `lib/faqs.ts`, or `lib/roe-kb.ts` changed, run
   `npm run kb:check` first — it must pass.
3. Commit with a clear message and push to `main`.
4. Wait for the Vercel deploy (~1–2 min), then load the changed pages on the live
   site and confirm the changes are visible. If working in Claude Code on the web,
   create the pull request and tell the owner exactly where to click Merge, then
   verify after merge.
5. If the deploy fails, the live site is untouched — read the build log, fix, retry.
   Never leave the owner with a broken deploy without explaining what happened.
