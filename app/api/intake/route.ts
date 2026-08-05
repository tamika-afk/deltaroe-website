// Client intake submissions → emailed to the studio inbox (Info@deltaroe.com)
// with reply-to set to the client. Requires RESEND_API_KEY in the environment;
// without it the route fails safe with a call-the-studio message (and logs the
// submission to the function logs as a last-resort backstop — filter
// "[intake]"). Sends from mail.deltaroe.com, verified in Delta Roe's own
// Resend account. Note: only DKIM is verified there — Wix's DNS can't host an
// MX record on a subdomain, so Resend's bounce-feedback MX was skipped and the
// domain shows "pending" for SPF/MX. Sending is unaffected; bounce/complaint
// feedback is not collected automatically.
//
// The email goes out as HTML with a plain-text alternative. Both are rendered
// from the same `sections` array below, so they can never drift apart — add a
// question to the form, add one row here, and both formats pick it up.

type Row = { label: string; value: string; block?: boolean };
type Section = { title: string; rows: Row[] };

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Palette (mirrors lib/site.ts / globals): midnight, antique gold, champagne.
const INK = "#2a2118";
const MUTED = "#8b8175";
const GOLD = "#c9a464";
const MIDNIGHT = "#14100a";
const CHAMPAGNE = "#e6cd95";
const RULE = "#e7ddc8";

// --- Abuse controls (added 8/4/2026) -----------------------------------------
// This endpoint is public, unauthenticated, and every accepted submission sends
// an email to the studio. Before this, six rapid POSTs were all accepted — so
// anyone could flood Info@deltaroe.com and burn the Resend quota.
//
// Three cheap layers, no new dependencies and no paid infrastructure:
//   1. honeypot  — a field real people never see and bots fill in anyway
//   2. dwell time — this form takes minutes to complete; a sub-3s submit is a script
//   3. IP rate limit — best effort (see caveat below)
//
// ⚠️ The rate limit is PER SERVERLESS INSTANCE and resets on cold start, so it
// is a speed bump, not a guarantee. Vercel may run several instances at once.
// It stops casual/bot flooding, which is the realistic threat; it will not stop
// a determined distributed attacker. Upgrading to durable limiting means Vercel
// KV or Upstash — extra setup and cost, deliberately not taken on a Hobby plan.
// Bots that trip the honeypot get a fake success so they don't learn to adapt.
const RATE_LIMIT_MAX = 5; // submissions per IP...
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes
const MIN_DWELL_MS = 3000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Opportunistic sweep so the Map can't grow without bound on a warm instance.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  const rec = hits.get(ip);
  if (!rec || rec.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT_MAX;
}

export async function POST(req: Request) {
  // Vercel sets x-forwarded-for; take the first (client) hop. Unknown IPs share
  // one bucket, which is acceptable — that bucket is the anonymous overflow.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    console.warn(`[intake] rate limited ${ip}`);
    return Response.json(
      { ok: false, error: "too many submissions — please call the studio" },
      { status: 429, headers: { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000) } },
    );
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed submission" }, { status: 400 });
  }

  // Honeypot: `website` is hidden from humans and left empty by them.
  // Answer 200 so bots record a success and move on rather than retrying.
  if (String(b.website ?? "").trim()) {
    console.warn(`[intake] honeypot tripped ${ip}`);
    return Response.json({ ok: true });
  }

  // Dwell time: the client stamps when the form was opened. Missing or
  // unparseable is tolerated (an old cached page shouldn't lock anyone out) —
  // only an implausibly fast, present value is rejected.
  const openedAt = Number(b.openedAt);
  if (Number.isFinite(openedAt) && Date.now() - openedAt < MIN_DWELL_MS) {
    console.warn(`[intake] submitted too fast ${ip}`);
    return Response.json({ ok: false, error: "Please take a moment and try again" }, { status: 429 });
  }

  const t = (k: string) => String(b[k] ?? "").trim().slice(0, 2000);
  const picked = (k: string) =>
    Object.entries((b[k] as Record<string, boolean>) ?? {})
      .filter(([, v]) => v)
      .map(([n]) => n);
  const checks = (k: string) => picked(k).join(", ") || "—";
  const yn = (v: unknown) => (v ? "YES" : "no");

  const name = t("name");
  const email = t("email");
  const phone = t("phone");
  if (!name || (!email && !phone)) {
    return Response.json({ ok: false, error: "Name and a way to reach you are required" }, { status: 422 });
  }
  if (!b.ackScope || !b.ackPhysician || !b.ackNoGuarantee || !b.ackCancellation || !b.ackAdult || !t("signature")) {
    return Response.json({ ok: false, error: "All consent acknowledgements and signature are required" }, { status: 422 });
  }

  // Real safety flags only. "None of these apply" is an answer, not a flag —
  // and clients sometimes tick it alongside a real one, so filter it out
  // rather than testing the joined string for it.
  const safetyFlags = picked("safety").filter((n) => !/none of these/i.test(n));
  const submitted = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  const emergency =
    [t("emergencyName"), t("emergencyRelationship") && `(${t("emergencyRelationship")})`, t("emergencyPhone")]
      .filter(Boolean)
      .join(" ");

  const sections: Section[] = [
    {
      title: "About",
      rows: [
        { label: "Date of birth", value: t("dob") },
        { label: "Address", value: [t("address"), t("city"), t("state"), t("zip")].filter(Boolean).join(", ") },
        { label: "Prefers to be reached by", value: t("contactPref") },
        { label: "Emergency contact", value: emergency },
      ],
    },
    {
      title: "What brings them in",
      rows: [
        { label: "Goals", value: [checks("goals"), t("goalOther")].filter((v) => v && v !== "—").join("; ") },
        { label: "Success in 3–6 months", value: t("success90"), block: true },
      ],
    },
    {
      title: "Health picture",
      rows: [
        {
          label: "Diagnosed condition(s)",
          value: [t("diagnosed"), t("diagnosedDetail")].filter(Boolean).join(" — "),
        },
        { label: "Under physician care", value: t("underCare") },
        { label: "Treatment plan", value: t("treatmentPlan") },
        { label: "Medications / supplements", value: t("medications"), block: true },
      ],
    },
    {
      title: "Life right now",
      rows: [
        { label: "Nutrition", value: t("nutrition") },
        { label: "Movement", value: t("movement") },
        { label: "Sleep", value: t("sleepHours") ? `${t("sleepHours")} hrs/night` : "" },
        { label: "Stress (1 calm – 5 heavy)", value: t("stress") },
        { label: "Tried before", value: t("tried"), block: true },
        {
          label: "Obstacles",
          value: [checks("obstacles"), t("obstacleOther")].filter((v) => v && v !== "—").join("; "),
        },
        {
          label: "Wants help with",
          value: [checks("helpWith"), t("helpOther")].filter((v) => v && v !== "—").join("; "),
        },
        { label: "Anything else", value: t("anythingElse"), block: true },
      ],
    },
    {
      title: "Consent",
      rows: [
        {
          label: "Acknowledged",
          value: `Scope ${yn(b.ackScope)} · Physician-first ${yn(b.ackPhysician)} · No-guarantees/release ${yn(
            b.ackNoGuarantee,
          )} · Cancellation ${yn(b.ackCancellation)} · 18+ ${yn(b.ackAdult)}`,
        },
        { label: "Email list opt-in", value: yn(b.optEmail) },
        { label: "Testimonial invite ok", value: yn(b.optTestimonial) },
        { label: "Signed (typed)", value: [t("signature"), t("signedDate")].filter(Boolean).join(" — ") },
      ],
    },
  ];

  /* ---------------- plain text ---------------- */
  const textLines = [
    `NEW CLIENT INTAKE — ${name}`,
    `Submitted: ${submitted} (Pacific)`,
    "",
    `Phone: ${phone || "—"}   Email: ${email || "—"}`,
  ];
  if (safetyFlags.length) {
    textLines.push("", `** SAFETY FLAGS: ${safetyFlags.join(", ")} **`);
  } else {
    textLines.push("", "Safety screening: none reported.");
  }
  for (const sec of sections) {
    textLines.push("", `— ${sec.title.toUpperCase()} —`);
    for (const r of sec.rows) textLines.push(`${r.label}: ${r.value || "—"}`);
  }
  const text = textLines.join("\n");

  /* ---------------- html ---------------- */
  const cell = "padding:7px 0;font-size:14px;line-height:1.55;vertical-align:top;";
  const rowHtml = (r: Row) => {
    const v = r.value
      ? `<span style="color:${INK};">${esc(r.value)}</span>`
      : `<span style="color:${MUTED};">not answered</span>`;
    if (r.block) {
      return `<tr><td colspan="2" style="${cell}border-top:1px solid ${RULE};">
        <div style="color:${MUTED};font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">${esc(r.label)}</div>
        <div style="white-space:pre-wrap;">${v}</div></td></tr>`;
    }
    return `<tr>
      <td style="${cell}border-top:1px solid ${RULE};width:38%;color:${MUTED};">${esc(r.label)}</td>
      <td style="${cell}border-top:1px solid ${RULE};">${v}</td></tr>`;
  };

  const sectionHtml = (sec: Section) => `
    <tr><td style="padding:26px 28px 0;">
      <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${GOLD};font-weight:700;">${esc(sec.title)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;border-collapse:collapse;">
        ${sec.rows.map(rowHtml).join("")}
      </table>
    </td></tr>`;

  const safetyHtml = safetyFlags.length
    ? `<tr><td style="padding:20px 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="border-collapse:collapse;background:#fdf0ef;border:1px solid #e5b4ae;border-radius:8px;">
          <tr><td style="padding:14px 16px;">
            <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a2423a;font-weight:700;">⚠ Safety flags — review before the session</div>
            <div style="margin-top:6px;font-size:15px;line-height:1.6;color:#7d2f28;font-weight:600;">${esc(safetyFlags.join(" · "))}</div>
          </td></tr>
        </table></td></tr>`
    : `<tr><td style="padding:20px 28px 0;">
        <div style="font-size:13px;color:${MUTED};">Safety screening: none reported.</div></td></tr>`;

  const contactHtml = [
    phone ? `<a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}" style="color:${INK};text-decoration:none;border-bottom:1px solid ${GOLD};">${esc(phone)}</a>` : "",
    email ? `<a href="mailto:${esc(email)}" style="color:${INK};text-decoration:none;border-bottom:1px solid ${GOLD};">${esc(email)}</a>` : "",
  ]
    .filter(Boolean)
    .join(`<span style="color:${RULE};padding:0 10px;">|</span>`);

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f1ea;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(
    safetyFlags.length ? `⚠ ${safetyFlags.join(", ")} — ` : "",
  )}${esc(phone || email)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0"
        style="width:100%;max-width:640px;background:#fffdf8;border:1px solid ${RULE};border-radius:14px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">

        <tr><td style="background:${MIDNIGHT};padding:24px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${GOLD};">Delta Roe · New Client Intake</div>
          <div style="font-size:28px;color:${CHAMPAGNE};margin-top:8px;line-height:1.2;">${esc(name)}</div>
        </td></tr>

        <tr><td style="padding:16px 28px 0;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;">
          ${contactHtml || `<span style="color:${MUTED};">No contact details given</span>`}
        </td></tr>

        ${safetyHtml}

        <tr><td style="padding:0 28px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${sections.map(sectionHtml).join("")}
          </table>
        </td></tr>

        <tr><td style="padding:26px 28px 24px;">
          <div style="border-top:1px solid ${RULE};padding-top:14px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:${MUTED};line-height:1.6;">
            Submitted ${esc(submitted)} Pacific.${email ? " Replying to this email goes straight to the client." : ""}
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table></body></html>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[intake] RESEND_API_KEY missing — submission logged only:\n" + text);
    return Response.json(
      { ok: false, error: "form delivery is not configured — please call the studio" },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Delta Roe Website <web@mail.deltaroe.com>",
        to: ["Info@deltaroe.com"],
        reply_to: email || undefined,
        subject: `New client intake — ${name}${safetyFlags.length ? " ⚠ safety flags" : ""}`,
        html,
        text,
      }),
    });
    const j = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) throw new Error(j.message || `send failed (${res.status})`);
    console.log(`[intake] sent ${j.id} for ${name}`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[intake] SEND FAILED — submission follows:\n" + text, e);
    return Response.json({ ok: false, error: "delivery failed — please call the studio" }, { status: 502 });
  }
}
