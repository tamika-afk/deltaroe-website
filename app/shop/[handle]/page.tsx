import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { getProduct, getProductHandles, isPurchasable } from "@/lib/shopify";
import ProductDetail from "./ProductDetail";

// Individual product pages exist for one reason above all others: without them
// every product in the shop shared the single /shop URL, so Google had nothing
// to rank per product and no place to attach a price, an image or a stock
// status. One indexable URL per product is the whole point.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const handles = await getProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  // Shopify descriptions open with the sentence that best sells the item, so
  // the first ~155 characters make a good meta description as-is.
  const summary = product.description.trim().replace(/\s+/g, " ").slice(0, 155);

  return {
    // Absolute — the root layout appends "| Delta Roe", which would otherwise
    // read "… The Delta Roe Apothecary | Delta Roe". Same reason the service
    // pages bypass the template.
    title: { absolute: `${product.title} — The Delta Roe Apothecary` },
    description: summary,
    alternates: { canonical: `${SITE.url}/shop/${product.handle}` },
    // A product nobody can buy yet shouldn't be collecting search traffic to a
    // dead end — it starts indexing itself when it goes on sale.
    robots: isPurchasable(product) ? undefined : { index: false },
    openGraph: {
      title: product.title,
      description: summary,
      url: `${SITE.url}/shop/${product.handle}`,
      type: "website",
      images: product.image ? [product.image.url] : ["/logo.png"],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const url = `${SITE.url}/shop/${product.handle}`;
  const sellable = isPurchasable(product);
  const availability = sellable
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  // ⚠️ Price the offer from variants a customer can ACTUALLY buy. FLY Queen
  // has a $9.99 eBook held at zero stock until digital delivery exists; quoting
  // it would advertise "from $9.99" and land people on a page where the
  // cheapest real option is the $19.99 paperback. Google treats that mismatch
  // as a reason to suppress the rich result, and rightly so. Falls back to all
  // variants only when nothing is buyable, so a Coming Soon product still
  // shows a sensible price.
  const sellableVariants = product.variants.filter((v) => v.availableForSale);
  const priced = sellableVariants.length > 0 ? sellableVariants : product.variants;
  const prices = priced.map((v) => v.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  // One Offer for a single buyable variant; AggregateOffer when there are
  // several, so Google shows a price range rather than picking one arbitrarily.
  const offers =
    priced.length > 1
      ? {
          "@type": "AggregateOffer",
          offerCount: priced.length,
          lowPrice: low,
          highPrice: high,
          priceCurrency: product.currency,
          availability,
          url,
          seller: { "@id": `${SITE.url}/#business` },
        }
      : {
          "@type": "Offer",
          price: low,
          priceCurrency: product.currency,
          availability,
          itemCondition: "https://schema.org/NewCondition",
          url,
          seller: { "@id": `${SITE.url}/#business` },
        };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description,
    image: product.image ? [product.image.url] : [`${SITE.url}/logo.png`],
    category: product.productType,
    brand: { "@type": "Brand", name: SITE.name },
    // Ties every product back to the business node in the root layout, so the
    // shop, the studio and Tamika resolve as one entity to search and AI.
    manufacturer: { "@id": `${SITE.url}/#business` },
    offers,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "The Apothecary", item: `${SITE.url}/shop` },
      { "@type": "ListItem", position: 3, name: product.title, item: url },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      <div className="svc-hero" style={{ paddingBottom: 28 }}>
        <div className="narrow">
          <div className="eyebrow">
            <Link href="/shop">The Apothecary</Link> · {product.productType}
          </div>
          <h1 style={{ marginTop: 14 }}>{product.title}</h1>
        </div>
      </div>

      <section style={{ paddingBottom: 56 }}>
        <div className="wrap">
          <div className="product-detail-grid">
            <div className="product-art has-photo" style={{ maxWidth: 520 }}>
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image.url} alt={product.image.alt} />
              ) : null}
            </div>

            <div>
              {!sellable && (
                <div className="eyebrow" style={{ color: "var(--gold-bright)", marginBottom: 10 }}>
                  Coming Soon
                </div>
              )}
              <p className="lede" style={{ whiteSpace: "pre-line" }}>{product.description}</p>
              <ProductDetail product={product} />
              <p style={{ marginTop: 28 }}>
                <Link href="/shop">← Back to The Apothecary</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
