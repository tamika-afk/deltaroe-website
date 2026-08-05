import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import VagaroWidget from "./VagaroWidget";

// On-site booking. `bookingUrl` in lib/site.ts points here, so every "Book"
// button across the site lands clients on deltaroe.com rather than handing them
// off to a third-party scheduler mid-decision.
export const metadata: Metadata = {
  title: "Book a Session — Delta Roe, Elk Grove",
  description:
    "Book reiki, a sound bath, chakra alignment, or life coaching at Delta Roe in Old Town Elk Grove. Choose your session and time — or start with a free 30-minute discovery call.",
};

export default function BookPage() {
  return (
    <main>
      <div className="svc-hero">
        <div className="narrow">
          <div className="eyebrow">Book</div>
          <h1 style={{ marginTop: 14 }}>Choose your time</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Pick the session that calls to you and a time that fits your life.
            Not sure where to begin? Start with the free discovery call — thirty
            unhurried minutes, no pressure, no commitment.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          <VagaroWidget />
        </div>

        <div className="narrow" style={{ marginTop: 44 }}>
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.75 }}>
            Every session is by appointment, so the studio is always yours
            alone. New here? After you book, you&rsquo;ll be asked to complete a
            short <a href="/intake">intake form</a> — Tamika reads every word
            before you arrive, so your first hour starts where you actually are.
          </p>
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.75, marginTop: 14 }}>
            Prefer to book by phone, or the calendar isn&rsquo;t showing you what
            you need? Call or text{" "}
            <a href={SITE.phoneHref}>{SITE.phone}</a> and we&rsquo;ll take care
            of it.
          </p>
          {/* The cancellation terms belong where money is committed, not only
              on the policy page. Keep this wording identical to /policies,
              lib/faqs.ts, lib/roe-kb.ts and the intake consent checkbox. */}
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.75, marginTop: 14 }}>
            <strong>Before you book:</strong> rescheduling is free with 24
            hours&rsquo; notice. Inside 24 hours it&rsquo;s 50% of the session,
            and a no-show is the full amount — Delta Roe is one person holding
            one room, and that hour is kept for you alone. Genuine emergencies
            are handled by a human being, not a rule. Read the full{" "}
            <Link href="/policies">cancellation &amp; refund policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
