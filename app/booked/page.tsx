import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// Where the booking platform sends clients after they've booked. Deliberately
// kept out of app/sitemap.ts and noindexed — it's a destination you arrive at,
// not one you should find in search.
//
// The primary action here is the intake form, not a "thanks!" message: the
// moment just after booking is the most engaged a new client will ever be, and
// intake completed before the first visit is what lets Tamika prepare.
export const metadata: Metadata = {
  title: "You're booked — Delta Roe",
  description: "Your session at Delta Roe is confirmed. Here's what happens next.",
  robots: { index: false },
};

export default function BookedPage() {
  return (
    <main>
      <div className="svc-hero">
        <div className="narrow">
          <div className="eyebrow">Confirmed</div>
          <h1 style={{ marginTop: 14 }}>You&rsquo;re booked, friend.</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            That was the hard part — deciding you were worth the hour. A
            confirmation is on its way to your inbox with the date and time.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 8 }}>
        <div className="narrow">
          <div
            className="card"
            style={{ borderColor: "var(--gold)", textAlign: "center" }}
          >
            <div className="eyebrow">First time with us?</div>
            <h2 style={{ margin: "12px 0 14px" }}>
              Take five minutes for your intake form
            </h2>
            <p style={{ marginBottom: 22, opacity: 0.85, lineHeight: 1.65 }}>
              It&rsquo;s five gentle steps, and it&rsquo;s the difference between
              a good first session and a deep one. Tamika reads every word before
              you arrive — so the hour you&rsquo;ve booked starts where you
              actually are, instead of starting with introductions.
            </p>
            <a className="btn btn-solid" href="/intake">
              Complete your intake form →
            </a>
            <p style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
              Been here before? You can skip this — unless something meaningful
              has changed in your health or what you&rsquo;re carrying.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap grid-2">
          <div className="card">
            <h3>Before you come</h3>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Wear something you can rest comfortably in — you stay fully
              clothed for every session.
            </p>
            <p style={{ marginBottom: 10, lineHeight: 1.7 }}>
              Arrive five minutes early if you can. The studio is upstairs, and
              a few unhurried minutes beforehand are part of the work.
            </p>
            <p style={{ lineHeight: 1.7 }}>
              Drink water afterwards, and leave yourself a little room in the
              day. Most people don&rsquo;t want to rush off.
            </p>
          </div>
          <div className="card">
            <h3>Where to find us</h3>
            <p style={{ marginBottom: 12 }}>
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </p>
            <p style={{ marginBottom: 12 }}>
              <a href={SITE.mapsUrl}>Open in Google Maps →</a>
            </p>
            <p>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <br />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </div>

        <div className="narrow" style={{ marginTop: 40 }}>
          <p style={{ fontSize: 13.5, opacity: 0.7, lineHeight: 1.7 }}>
            Need to move it? Life happens — just give us at least 24 hours&rsquo;
            notice where you can, so the space can go to someone else who needs
            it. Call or text {SITE.phone} and we&rsquo;ll sort it out.
          </p>
        </div>

        <div className="narrow" style={{ textAlign: "center", marginTop: 40 }}>
          <a className="btn btn-ghost" href="/the-clearing">
            While you wait — try The Clearing
          </a>
        </div>
      </section>
    </main>
  );
}
