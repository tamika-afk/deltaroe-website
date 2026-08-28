import type { Metadata } from "next";
import { getProducts, isPurchasable } from "@/lib/shopify";
import { SITE } from "@/lib/site";
import ShopClient from "./ShopClient";

// Products come from Shopify at request time, cached for 5 minutes. That cache
// is why a tag change in Shopify takes a few minutes to show up rather than
// being instant — a deliberate trade for not hammering the Storefront API.
export const revalidate = 300;

// ⚠️ Indexing is CONDITIONAL, on purpose. Google should not be sent a shelf of
// things nobody can buy: while every product is tagged "Coming Soon", the page
// stays noindex. The moment the first product is cleared for sale, the page
// starts indexing itself. Nobody has to remember to flip this.
export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  const open = products.some(isPurchasable);

  return {
    title: "The Apothecary — Delta Roe Candles, Ritual Goods & Sacred Objects",
    description:
      "The Delta Roe Apothecary: intention candles, ritual tea, sacred soap and Delta Roe apparel — poured, blended and charged in Elk Grove, California.",
    alternates: { canonical: "/shop" },
    robots: open ? undefined : { index: false },
    openGraph: {
      title: "The Apothecary — Delta Roe",
      description: "Candles, ritual goods and sacred objects from the Delta Roe studio.",
      url: `${SITE.url}/shop`,
      type: "website",
    },
  };
}

export default async function ShopPage() {
  const products = await getProducts();

  // Shopify unreachable, or nothing published yet. Say so plainly rather than
  // rendering an empty grid that looks broken.
  if (products.length === 0) {
    return (
      <main>
        <div className="svc-hero">
          <div className="narrow">
            <div className="eyebrow">The Apothecary</div>
            <h1 style={{ marginTop: 14 }}>Opening soon</h1>
            <p className="lede" style={{ marginTop: 16 }}>
              The shelves are being stocked — candles, ritual tea, sacred soap
              and Delta Roe apparel, poured and charged under our own name.{" "}
              <a href={`mailto:${SITE.email}`}>Write to us</a> and we&apos;ll tell
              you the moment it opens.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ShopClient products={products} />
    </main>
  );
}
