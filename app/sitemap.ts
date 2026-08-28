import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { ARTICLES } from "@/lib/journal";
import { getProductHandles } from "@/lib/shopify";

// The sitemap now reaches out to Shopify for product handles, so it can no
// longer be a pure function. If Shopify is unreachable, getProductHandles
// returns [] and the sitemap still renders every other page — a missing
// product section is survivable, a 500 on /sitemap.xml is not.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/book",
    "/services",
    "/sound-chakras",
    "/the-clearing",
    "/intake",
    "/memberships",
    "/events",
    "/soulful-journey",
    "/about",
    "/reviews",
    "/review",
    "/faq",
    "/gift-cards",
    "/corporate-wellness",
    "/shop",
    "/journal",
    "/contact",
    "/policies",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const servicePages = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const articlePages = ARTICLES.map((a) => ({
    url: `${SITE.url}/journal/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const productPages = (await getProductHandles()).map((handle) => ({
    url: `${SITE.url}/shop/${handle}`,
    changeFrequency: "daily" as const,
    // Below services (0.9) — the studio's sessions are still the business —
    // but above the general static pages, since these are the newest content
    // and the ones we most want crawled promptly.
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...articlePages, ...productPages];
}
