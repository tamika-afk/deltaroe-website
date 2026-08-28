// Shopify Storefront API client for The Apothecary.
//
// ⚠️ NO ACCESS TOKEN IS NEEDED, and that is deliberate — not an oversight.
// Shopify's Storefront API allows *tokenless* access to exactly what this shop
// needs: products, collections, and cart read/write. Verified live against this
// store on 8/27/2026 (products, tags, collections and cartCreate all returned
// 200 with no auth header). A token would add a credential to rotate and leak
// for zero functional gain. `SHOPIFY_STOREFRONT_TOKEN` is still honoured if it
// is ever set — e.g. if Shopify tightens tokenless access — but nothing
// requires it today.
//
// ⚠️ Shopify's own docs claim product *tags* require a token. They do not, as
// of 2026-07 — tested, not assumed. But because the purchasability gate below
// reads tags, `isPurchasable` FAILS SAFE: no tags visible ⇒ not purchasable.
// If Shopify ever enforces the documented restriction, the shop degrades to
// "Coming Soon" everywhere rather than silently putting unapproved stock on
// sale. Never invert that default.

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "delta-roe.myshopify.com";
const API_VERSION = "2026-07";
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

// The tag that means "built, but not cleared for sale yet". Tamika controls
// the whole shop from Shopify by adding/removing this one tag — no deploy.
export const COMING_SOON_TAG = "coming soon";

export type ShopVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  selectedOptions: { name: string; value: string }[];
};

export type ShopProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  /** false when Shopify itself says nothing is in stock */
  availableForSale: boolean;
  price: number;
  currency: string;
  image: { url: string; alt: string } | null;
  variants: ShopVariant[];
  onlineStoreUrl: string;
};

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 300,
): Promise<T | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (token) headers["X-Shopify-Storefront-Access-Token"] = token;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    });
    if (!res.ok) {
      console.warn(`[shopify] HTTP ${res.status} from Storefront API`);
      return null;
    }
    const json = (await res.json()) as GqlResponse<T>;
    // Log rather than swallow: a bad field name makes Shopify reject the whole
    // query, and the page then renders "Opening soon" — which looks like an
    // empty catalogue, not a bug. This line is how you find out. Vercel → Logs.
    if (json.errors?.length) {
      console.warn(`[shopify] query errors: ${json.errors.map((e) => e.message).join(" | ")}`);
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    // The shop page must never take the site down. A Shopify outage degrades
    // to the "opening soon" state, it does not throw.
    console.warn(`[shopify] request failed: ${String(err)}`);
    return null;
  }
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  tags
  availableForSale
  onlineStoreUrl
  priceRange { minVariantPrice { amount currencyCode } }
  featuredImage { url altText }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount }
        selectedOptions { name value }
      }
    }
  }
`;
// ⚠️ Do NOT add `quantityAvailable` here. It requires the
// `unauthenticated_read_product_inventory` scope, which tokenless access does
// not grant, and Shopify rejects the WHOLE query rather than just that field —
// so the entire shop silently falls back to "Opening soon". Cost a debugging
// cycle on 8/27/2026. `availableForSale` carries everything the UI needs.

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  onlineStoreUrl: string | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string | null } | null;
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string };
        selectedOptions: { name: string; value: string }[];
      };
    }[];
  };
};

function normalise(p: RawProduct): ShopProduct {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    productType: p.productType || "Apothecary",
    // Tag matching is case-insensitive: Shopify preserves the case an admin
    // typed, so "Coming Soon" and "coming soon" must behave identically.
    tags: (p.tags || []).map((t) => t.toLowerCase()),
    availableForSale: p.availableForSale,
    price: Number(p.priceRange.minVariantPrice.amount),
    currency: p.priceRange.minVariantPrice.currencyCode,
    image: p.featuredImage ? { url: p.featuredImage.url, alt: p.featuredImage.altText || p.title } : null,
    variants: p.variants.edges.map(({ node: v }) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: Number(v.price.amount),
      selectedOptions: v.selectedOptions,
    })),
    onlineStoreUrl: p.onlineStoreUrl || `https://${DOMAIN}/products/${p.handle}`,
  };
}

/**
 * Every product published to the online store, newest last.
 * Archived and draft products are not exposed by the Storefront API at all,
 * so the four "Example product" placeholders never reach the site.
 */
export async function getProducts(): Promise<ShopProduct[]> {
  const data = await storefront<{ products: { edges: { node: RawProduct }[] } }>(
    `query { products(first: 50, sortKey: CREATED_AT) { edges { node { ${PRODUCT_FIELDS} } } } }`,
  );
  if (!data?.products?.edges) return [];
  return data.products.edges.map((e) => normalise(e.node));
}

/**
 * Can a customer actually buy this today?
 *
 * FAILS SAFE. Requires positive evidence that the product is cleared for sale:
 * tags must be readable, must NOT contain "coming soon", and Shopify must
 * report stock. Anything unexpected — no tags, API change, empty response —
 * lands on "not purchasable", which is the harmless direction to be wrong in.
 */
export function isPurchasable(p: ShopProduct): boolean {
  if (!p.tags || p.tags.length === 0) return false;
  if (p.tags.includes(COMING_SOON_TAG)) return false;
  if (!p.availableForSale) return false;
  return p.variants.some((v) => v.availableForSale);
}

/** Grouped for display, preserving Shopify's product-type grouping. */
export function groupByType(products: ShopProduct[]): [string, ShopProduct[]][] {
  const groups = new Map<string, ShopProduct[]>();
  for (const p of products) {
    const key = p.productType || "The Apothecary";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return [...groups.entries()];
}

export const SHOPIFY_DOMAIN = DOMAIN;
export const STOREFRONT_ENDPOINT = ENDPOINT;
