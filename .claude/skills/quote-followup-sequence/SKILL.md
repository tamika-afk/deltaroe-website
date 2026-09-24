---
name: quote-followup-sequence
description: >
  The follow-up cadence for open quotes (day 1, 3, 7, 14, 30) with email and call scripts,
  the rules for when to stop, and how to log the outcome as won, lost, or no-decision with a
  coded reason. Use this skill whenever open quotes are sitting without a touch, a desk or rep
  needs a repeatable follow-up routine, or a manager wants quote-to-order conversion measured.
  Trigger on "follow up on open quotes," "quote follow-up," "what happened to that quote,"
  "quotes with no response," "quote conversion." Pairs with [[win-loss-analysis]], which
  depends on the outcome codes this skill writes, and [[objection-handling-playbook]] for the
  day-7 conversation.
---

# Quote Follow-Up Sequence

Most quotes are never followed up, and most of the ones that are get one "just checking in"
email. A quote is an opening, not an ending: the day-3 call finds the missing spec, the day-7
call surfaces the competitor, the day-14 call catches the budget freeze, and the day-30 close
turns a maybe into a coded outcome the business can learn from. The trap is nagging without
new information. Done means every open quote has a next touch dated, every touch adds
something, and every quote ends in one of three coded outcomes.

## Inputs
- The open-quote list from the ERP or quote engine, read-only: quote number, date, customer
  (and distributor if quoted through one), contact, items, quantities, total, validity date,
  rep or desk owner, last touch date and channel, outcome field.
- CRM activity for each quote if the CRM links quotes; otherwise the desk's follow-up log.
- Stock and lead-time status for the quoted items (a real reason to call).
- The company's price-validity rule (default 30 days) and its policy on requotes.
- If quotes have no outcome field, create the log as a separate sheet keyed by quote number
  and flag that the ERP or CRM needs the field.

## Process

### 1. Triage the open list
- Default scope: all open quotes with total at or above the desk threshold (default: the 40th
  percentile of quote value in the last 90 days). Smaller quotes get the email-only track.
- Rank by value × age. Anything past validity with no touch in 14 days goes to the day-30
  step immediately.
- Distributor quotes: the follow-up goes to the distributor's inside sales or rep, never to the
  end customer, unless the distributor asked for a joint call.

### 2. The cadence
- **Day 1, email.** Confirm receipt, restate what was quoted in one line, ask one question that
  was open on the request (quantity, delivery need, material). Attach nothing new.
- **Day 3, call, then email if no answer.** "Did the quote match what you needed?" Listen for a
  spec gap, a quantity change, a delivery date. Offer stock status as the reason for the call.
- **Day 7, call.** The decision question: "Where does this sit against what you have today?"
  This is where the objection surfaces; use [[objection-handling-playbook]]. Offer a trial or
  a sample if there is a technical doubt.
- **Day 14, email with something new.** A relevant proof point, an application note, a lead-time
  improvement, or a reminder of the validity date. One paragraph.
- **Day 30, close the loop.** Call or email: "I'd rather know than guess. Did this go another
  way, or is it parked?" Log the outcome. If still undecided and validity has passed, offer a
  requote only if the customer asks; do not extend pricing unasked.
- Timing defaults shift to business days; skip a touch if the customer replied since the last
  one and set the next touch from their reply.

### 3. Scripts
- Every message: subject line carries the quote number and the customer's part or job name;
  first line references their situation, not ours; one question; a sentence at most on us.
  No "just checking in", no "circling back", no attachments after day 1 unless requested.
- Call opener: name, company, quote number, the one reason for the call (stock, spec, date),
  then the question. Under 90 seconds if they are busy.

### 4. When to stop
- Stop and log after the day-30 touch with no reply. Stop earlier if the customer says lost,
  says no decision this year, or asks to stop. Never more than five touches per quote, never
  two in the same 48 hours.
- Do not restart a sequence on a requote unless the requote changed something material.

### 5. Log the outcome
- One of three: **Won** (order number, date, amount ordered versus quoted), **Lost** (reason
  code from: price, incumbent, lead time, spec or fit, went with distributor stock, no budget,
  project cancelled, other with text; competitor if known), **No decision** (reason: parked,
  no response, project delayed; revisit date).
- Log the touch history: date, channel, who, one line. This is the dataset
  [[win-loss-analysis]] runs on; missing codes make that analysis blind.

### 6. Measure
- `Quote-to-order conversion = won quotes ÷ closed quotes (won + lost + no decision)` by count
  and by dollars, per rep, per product family, per distributor, monthly.
- `Median days to decision` from quote date to outcome date.
- `Touch compliance = quotes that received the day-3 and day-7 touch on time ÷ quotes in scope`.
  Default target 90 percent.

## Output format

ALWAYS structure as:
1. **Today's follow-up list** — quote, customer or distributor, contact, value, age, last
   touch, which step is due, the one reason for the touch, the script variant.
2. **Overdue and past-validity** — quotes needing the day-30 close now.
3. **Scripts** — the email and call scripts for each step, personalized with quote and job
   references, ready to send after the rep reads them.
4. **Outcome log entries** — the quotes closed this cycle with code, reason, and evidence.
5. **Conversion scoreboard** — conversion by count and dollars, median days to decision, touch
   compliance, by rep and family.
6. **Data gaps** — quotes with no contact, no outcome field, no distributor recorded.

## Guardrails
- No email or call is sent by the skill; every message is drafted for a human to send, and the
  outcome is logged from what the customer actually said.
- Never lower a price, extend validity, or offer a discount inside the sequence; pricing changes
  go to the pricing owner and are logged (old, new, reason, date, batch).
- Never contact a distributor's end customer directly; the sequence runs through the distributor.
- Outcome codes come from the customer's words; "lost on price" without a stated comparison is
  coded "no response" or "other" with the note.
- The ERP is read-only; outcome logging happens in the CRM or the follow-up sheet.
- Honor unsubscribe and do-not-contact flags; the day-14 email is a one-to-one message, not a
  marketing send.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** the ERP quote header and open-order tables to see whether a quote already became an order before anyone calls; HubSpot Sequences or Salesforce Sales Engagement (paid) to schedule the cadence and log touches automatically; live stock and lead-time from the ERP as the reason for every call. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
