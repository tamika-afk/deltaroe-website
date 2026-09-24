---
name: learn
description: Route a lesson, correction, or ruling into the tool that should get smarter from it — an agent definition, a skill, a standing law, a validator/drill, or memory. Use IMMEDIATELY whenever Mike corrects output, reverses a decision, fixes a fact, or edits a deliverable ("that's a chamfer cutter", "wrong phone number", "don't show distributors"), whenever a session discovers a trap the hard way, and whenever the user says "/learn", "remember this for the agent", "make the agents learn this", or "teach X that Y". A correction that only lives in the conversation is a lesson lost.
---

# /learn — route a lesson to the brain that produced (or will repeat) the error

Agents and skills get smarter one way: the lesson becomes part of what they
LOAD. An agent's .md body is its system prompt — a lesson appended there is
active on every future spawn, in every project. This skill decides WHERE a
lesson goes and writes it, following the knowledge-persistence tiering
(LAW 12): the more binding and machine-checkable, the higher the tier.

## Step 1 — capture the lesson precisely
One or two sentences: WHAT went wrong (or was ruled), the CORRECT behavior,
and WHY (when known). If Mike ruled it, keep his words verbatim in quotes —
paraphrase drifts. Date it (run `date` first).

## Step 2 — route it (multiple destinations often apply; write ALL that do)

| The lesson is… | Destination |
|---|---|
| Domain/judgment knowledge a SPECIALIST agent should apply forever (machining fact, channel rule, brand fact, design taste Mike expressed, analysis method) | `C:\Users\macarthurm\.claude\agents\<agent>.md` → "## Lessons learned" section (create before any closing boilerplate if absent). One dated bullet. |
| A better way to run a repeatable WORKFLOW (step order, a trap in a tool, a check that was missing) | The matching skill's SKILL.md (`~\.claude\skills\<name>\` or the project's `.claude\skills\<name>\`) — edit the step itself when small, else a "## Lessons learned" section. |
| A non-negotiable ruling for THIS project ("never X", "always Y") | The project's AGENTS.md law section (new law line or amendment) + memory detail file — the full LAW 12 treatment. |
| Machine-checkable (a value, format, or relationship that can be asserted) | A drill/validator (the audit-price-sanity / test-*.ts pattern) so regressions FAIL loudly — plus the prose tier above. |
| Context that only future SESSIONS need (state, gotchas, who-said-what) | Project memory file + MEMORY.md index line (existing memory rules). |

Route to EVERY agent whose work the lesson touches (a brand fact belongs in
copywriter, seo-specialist, AND application-engineer). When unsure which
agent, grep `~\.claude\agents\` descriptions for the topic.

## Step 3 — write it as a lesson, not a story
Format inside "## Lessons learned":
`- (2026-09-21) <correct behavior>. <Why / Mike's verbatim ruling when it is one.>`
Bullets state the RULE, not the anecdote. Never delete existing lessons here
— consolidation is the monthly review's job (Step 5).

## Step 4 — confirm
Tell Mike in one line per destination: what was taught to whom
("Taught application-engineer: DLC = Crystallume PVD, never Crystallume").

## Step 5 — growth cap (bulletproof: no unbounded context)
A "Lessons learned" section holds at most ~25 bullets. At 25+, do NOT stop
adding — add the new one, then fold the oldest/most-settled lessons into the
agent's main body where they belong (a lesson mature enough to be permanent
belongs in the prose, not the appendix). The monthly `agents-skills-review`
also does this consolidation and mines transcripts for corrections nobody
routed — but the standing rule is route AT THE MOMENT; the review is the
backstop, not the mechanism.

## Guardrails
- Additive lesson appends need no approval (LAW 28 autonomy). REWRITING an
  agent's core behavior, tools, or description = propose to Mike first.
- Conflicts (Mike 9/21: "the newest rule wins… use the one that happened
  later in time on the same day"): when two of MIKE'S rulings on the same
  subject disagree, the one with the LATER FULL TIMESTAMP wins automatically
  — same-day conflicts resolve by time of day (pull the message timestamps
  from the source transcripts). Replace the older lesson and note the
  supersession ("supersedes the <date/time> form"), never keep both. Only a
  truly indeterminate ordering goes to Mike. A session's mere observation/
  inference NEVER overturns something Mike explicitly ruled — that mismatch
  still goes to him as a decision.
- Global laws (brand facts, phone numbers, channel rules) still bind every
  agent; teaching them to specific agents is reinforcement for cross-project
  spawns, not a replacement for the law.

## Known trap: in-session verification
Agent definitions are CACHED AT SESSION START — a spawn from the session
that edited an agent file will NOT see the edit (proven 9/21 with a
sentinel test). Verify a lesson landed by grepping the file, not by
spawning the agent in the same session; live-behavior proof belongs to the
next session (the Monday runs, or any fresh session).
