/** @type {import('next').NextConfig} */

// Security headers, added 8/4/2026 after the deltaroe.com go-live.
//
// Two facts shaped what is enforced here vs. only reported:
//
// 1. Booking is the studio's revenue path. It runs on Vagaro's embedded widget,
//    which pulls scripts, styles, frames and fonts from hosts we don't control
//    and can't fully enumerate. A Content-Security-Policy that blocks one of
//    them breaks booking silently — worse than having no CSP at all.
// 2. So the CSP is split. The three directives that CANNOT break an ordinary
//    site (frame-ancestors / base-uri / object-src) are ENFORCED. The full
//    policy ships as Report-Only, where violations show up in the browser
//    console and break nothing. Once /book has been exercised with the console
//    open and it is clean, move REPORT_ONLY_CSP into the enforced header.
//
// Do not "tidy" this by merging the two. The split is the point.

const VAGARO = "https://*.vagaro.com https://www.vagaro.com";
const ANALYTICS =
  "https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com";

// Enforced. Each of these is safe on any ordinary site:
//   frame-ancestors — stops other sites embedding us (clickjacking on /book)
//   base-uri        — stops an injected <base> tag redirecting relative URLs
//   object-src      — kills <object>/<embed>, which nothing here uses
const ENFORCED_CSP = ["frame-ancestors 'self'", "base-uri 'self'", "object-src 'none'"].join("; ");

// Report-only. 'unsafe-inline' is required for scripts because the JSON-LD
// blocks are inline; a nonce would force every page to render dynamically and
// give up static generation. img-src stays broad (https:) so third-party
// review/booking imagery cannot break.
const REPORT_ONLY_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${VAGARO} ${ANALYTICS}`,
  `style-src 'self' 'unsafe-inline' ${VAGARO}`,
  "img-src 'self' data: blob: https:",
  `font-src 'self' data: ${VAGARO}`,
  `connect-src 'self' ${VAGARO} ${ANALYTICS} https://vitals.vercel-insights.com`,
  `frame-src 'self' ${VAGARO}`,
  `form-action 'self' ${VAGARO}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Vercel already sends max-age=63072000; this adds subdomain coverage and
  // preload eligibility. mail.deltaroe.com is DNS-only (no web server), so
  // includeSubDomains costs nothing here.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Belt-and-braces with frame-ancestors, for older browsers that ignore CSP.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site uses these; deny them outright.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: ENFORCED_CSP },
  { key: "Content-Security-Policy-Report-Only", value: REPORT_ONLY_CSP },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
