// Roe chat telemetry: every question lands in the Vercel function logs
// (filter on "[roe-chat]"). MISS lines are the training backlog — questions
// visitors asked that the knowledge base couldn't answer.
//
// Rate limiting added 8/4/2026. This endpoint is public and unauthenticated,
// and its whole job is to write to the log. Unthrottled that is a free way for
// anyone to flood the function logs — which both buries the genuine MISS lines
// this exists to collect and eats log quota. A real visitor asks a handful of
// questions in a sitting, so the ceiling is generous.
//
// ⚠️ Same caveat as the intake limiter: the counter lives in instance memory
// and resets on cold start, so it is a speed bump rather than a guarantee.
// Durable limiting would mean Vercel KV/Upstash — extra cost, not taken on a
// Hobby plan. The response is 204 either way, so a flooder learns nothing.
const MAX_PER_WINDOW = 40;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function overLimit(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  const rec = hits.get(ip);
  if (!rec || rec.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  // Silently drop once over the ceiling: still 204, so the beacon never shows
  // an error to a real visitor and a flooder gets no signal to adapt.
  if (overLimit(ip)) return new Response(null, { status: 204 });

  try {
    const body = await req.json();
    const q = typeof body?.q === "string" ? body.q.slice(0, 300).replace(/\s+/g, " ").trim() : "";
    if (q) {
      console.log(`[roe-chat] ${body?.matched ? "HIT " : "MISS"} ${q}`);
    }
  } catch {
    // malformed beacon — nothing to log
  }
  return new Response(null, { status: 204 });
}
