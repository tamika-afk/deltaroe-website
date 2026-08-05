import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

/* Cancellation, refund & return policy.
   Written 8/4/2026. Terms chosen by the studio: under 24 hours = 50%,
   no-show = 100%, and money paid becomes studio credit rather than cash back.

   ⚠️ THREE OTHER PLACES STATE THIS POLICY and were updated to match on the same
   day — if any term below changes, change them too or the site contradicts
   itself:
     1. lib/faqs.ts        — "What if I need to cancel or reschedule?"
     2. lib/roe-kb.ts      — the cancel/reschedule/refund chat answer
     3. app/intake/IntakeForm.tsx — the cancellation consent checkbox, which is
        the one a client actually signs. It must never promise softer terms
        than this page enforces.

   Two things here are law, not preference, and must not be "simplified":
   gift cards (CA Civil Code 1749.5) and the membership auto-renewal wording
   (CA Automatic Renewal Law). See the comments at those sections. */

export const metadata: Metadata = {
  title: "Cancellation, Refund & Return Policy",
  description:
    "Delta Roe's cancellation, refund and return policy for sessions, packages, memberships, gift cards and Apothecary orders in Elk Grove, California.",
};

const UPDATED = "August 4, 2026";

export default function PoliciesPage() {
  return (
    <main>
      <div className="svc-hero">
        <div className="narrow">
          <div className="eyebrow">The Fine Print, Kindly</div>
          <h1 style={{ marginTop: 14 }}>Cancellation, refunds &amp; returns</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Delta Roe is one person holding one room. When a session is booked,
            that hour belongs to you — and to no one else.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 8 }}>
        <div className="narrow">
          <p style={{ color: "var(--muted)" }}>
            Last updated {UPDATED}. These terms apply to sessions booked through
            Delta Roe, whether booked online, by phone, or in the studio.
          </p>

          <h2 style={{ marginTop: 40 }}>Sessions &amp; appointments</h2>
          <p>
            <strong>Rescheduling is always free with 24 hours&rsquo; notice</strong>{" "}
            — and rescheduling is genuinely preferred to cancelling. The week
            you feel too busy for your session is usually the week you need it
            most.
          </p>
          <ul>
            <li>
              <strong>More than 24 hours&rsquo; notice:</strong> reschedule or
              cancel at no charge.
            </li>
            <li>
              <strong>Less than 24 hours&rsquo; notice:</strong> 50% of the
              session price.
            </li>
            <li>
              <strong>No-show</strong> (no arrival and no contact):
              100% of the session price.
            </li>
            <li>
              <strong>Arriving late:</strong> your session still ends at its
              scheduled time, so the room stays calm for whoever comes next.
              Arriving more than 15 minutes late may mean the session cannot go
              ahead, and is treated as a late cancellation.
            </li>
          </ul>
          <p>
            <strong>Life is not tidy, and this policy is not a trap.</strong>{" "}
            Genuine emergencies, sudden illness, and family crises are handled
            by a human being, not a rule. Call{" "}
            <a href={SITE.phoneHref}>{SITE.phone}</a> and talk to Tamika.
          </p>

          <h2 style={{ marginTop: 40 }}>Refunds</h2>
          <p>
            Payments for sessions, packages and programs are refunded as{" "}
            <strong>studio credit</strong> rather than money back. Credit never
            expires, and it can be used for any service, membership or gift
            card.
          </p>
          <ul>
            <li>
              <strong>Unused packages and series</strong> convert to credit for
              the value of the sessions you have not yet taken.
            </li>
            <li>
              <strong>A session you are unhappy with:</strong> tell Tamika
              within 7 days. Something will be made right — usually a
              complimentary session, because the goal is that the work lands,
              not that a transaction closes.
            </li>
            <li>
              <strong>If the studio cancels</strong> for any reason, you receive
              a full refund to your original payment method, or credit if you
              prefer — your choice, not ours.
            </li>
          </ul>

          {/* CA Automatic Renewal Law (amended 1 July 2025): if a member can
              subscribe online they must be able to cancel online, at will,
              without obstruction — no "call us to cancel" gate. Affirmative
              consent is required at signup, and annual renewal reminders must
              be sent. Do not add hoops here. */}
          <h2 style={{ marginTop: 40 }}>Memberships</h2>
          <p>
            Memberships renew automatically each month until you cancel. You may{" "}
            <strong>cancel at any time, with no fee and no notice period</strong>
            . If you joined online, you can cancel online just as easily — you
            will never be asked to phone in to leave.
          </p>
          <ul>
            <li>
              Cancelling stops the next payment. The month already paid for
              stays yours to use in full.
            </li>
            <li>
              Part-months are not refunded in cash, but unused member sessions
              become studio credit.
            </li>
            <li>
              Member benefits end when the paid month ends.
            </li>
          </ul>

          {/* CA Civil Code 1749.5: gift certificates sold in California may NOT
              carry an expiration date, and service/dormancy/inactivity fees are
              prohibited. Balances under the statutory threshold are redeemable
              in cash — that threshold rose from $10 to $15 in April 2026.
              Never add an expiry or a fee here; both are unlawful. */}
          <h2 style={{ marginTop: 40 }}>Gift cards</h2>
          <ul>
            <li>
              <strong>Gift cards never expire</strong> and carry no fees of any
              kind. California law does not permit either.
            </li>
            <li>Gift cards are not refundable and cannot be exchanged for cash.</li>
            <li>
              If a gift card balance falls <strong>below $15</strong>, you may
              ask for the remaining balance in cash, as California law provides.
            </li>
            <li>
              Sessions paid for with a gift card follow the same cancellation
              terms as any other booking.
            </li>
          </ul>

          <h2 style={{ marginTop: 40 }}>The Apothecary — products</h2>
          <p>
            Physical goods may be returned <strong>within 30 days</strong> of
            delivery or pickup.
          </p>
          <ul>
            <li>
              <strong>Unopened and unused items:</strong> full refund to the
              original payment method.
            </li>
            <li>
              <strong>Opened candles, oils, teas and body products</strong>{" "}
              cannot be returned once used, for hygiene and safety reasons —
              unless the item arrived damaged or faulty.
            </li>
            <li>
              <strong>Damaged or wrong items:</strong> send a photo within 7
              days and a replacement or full refund follows, with no return
              shipping to pay.
            </li>
            <li>
              <strong>Crystals and jewellery</strong> are natural materials, so
              colour, shape and inclusions vary piece to piece. That variation
              is the point, and is not a fault.
            </li>
            <li>
              <strong>The Monthly Ritual Box</strong> can be cancelled at any
              time before the next box ships. Boxes already sent are not
              refundable.
            </li>
          </ul>
          <p style={{ color: "var(--muted)" }}>
            The Apothecary is currently a preview and nothing can be purchased
            yet. These terms take effect when the shop opens.
          </p>

          <h2 style={{ marginTop: 40 }}>How to cancel, reschedule or ask</h2>
          <p>
            Use the link in your booking confirmation, call{" "}
            <a href={SITE.phoneHref}>{SITE.phone}</a>, or email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. The studio is open{" "}
            {SITE.hours.map((h) => `${h.days} ${h.time}`).join(", ")}.
          </p>
          <p style={{ color: "var(--muted)", marginTop: 32 }}>
            Reiki, sound healing and coaching are complementary wellness
            practices and are not a substitute for medical or mental-health
            care. Nothing in this policy affects your rights under California
            law.
          </p>

          <p style={{ marginTop: 40 }}>
            <Link className="btn btn-solid" href={SITE.bookingUrl}>
              Book a session
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
