// TODO: replace with the real Google review short-link once the Google Business
// Profile is verified — in the GBP dashboard click "Ask for reviews" and copy the
// https://g.page/r/…/review link (see docs/gbp-kit.md, section 8).
export const REVIEW_URL = "https://g.page/r/REPLACE_ME/review";

export const YELP_URL = "https://www.yelp.com/biz/delta-roe-elk-grove";

export const SITE = {
  name: "Delta Roe",
  tagline: "Mind · Body · Spirit",
  description:
    "Reiki healing, sound baths, chakra alignment, and life coaching in historic Old Town Elk Grove, CA. A sanctuary to realign, restore, and recharge.",
  url: "https://deltaroe.com",
  phone: "(916) 206-1752",
  phoneHref: "tel:+19162061752",
  email: "Info@deltaroe.com",
  address: {
    street: "9075 Elk Grove Blvd, Suite 220A",
    city: "Elk Grove",
    state: "CA",
    zip: "95624",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Delta+Roe+9075+Elk+Grove+Blvd+Suite+220A+Elk+Grove+CA+95624",
  // Booking is on-site: /book hosts Vagaro's embedded calendar, so the dozen-plus
  // "Book" buttons around the site keep clients on deltaroe.com instead of handing
  // them to a third-party scheduler mid-decision. (Was the Wix scheduler; Square
  // was declined — see the launch checklist in CLAUDE.md.)
  bookingUrl: "/book",
  hours: [
    { days: "Tuesday – Saturday", time: "11:00 am – 9:00 pm" },
    { days: "Sunday – Monday", time: "Closed" },
  ],
  founder: "Tamika Banks",
  credentials: "Certified Reiki Master & Empowerment Life Coach",
};

// One nav, both headers: desktop row and the mobile menu.
// The Clearing + New Clients promoted per Mike 7/20; FAQ moved to the mobile
// extras (still linked in the footer) to keep the desktop row breathable.
export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/sound-chakras", label: "Chakras" },
  { href: "/the-clearing", label: "The Clearing" },
  { href: "/memberships", label: "Memberships" },
  { href: "/shop", label: "Apothecary" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/intake", label: "New Clients" },
] as const;

// Extra destinations that only fit in the roomier mobile menu.
export const NAV_MOBILE_EXTRA = [
  { href: "/faq", label: "FAQ" },
  { href: "/journal", label: "Journal" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;
