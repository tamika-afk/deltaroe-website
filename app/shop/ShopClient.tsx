"use client";

// The Apothecary, backed by live Shopify data.
//
// Replaces the old ShopDemo, which shipped an invented catalogue and a cart
// that said "Demo mode" at checkout. Everything here — titles, prices, stock,
// images — comes from Shopify, so the website can no longer disagree with the
// system that takes the money.
//
// Products tagged "Coming Soon" in Shopify render but cannot be added to the
// cart. That gate is Tamika's switch: remove the tag in Shopify and the product
// goes on sale within ~5 minutes, with no deploy. See lib/shopify.ts.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isPurchasable, groupByType, type ShopProduct, type ShopVariant } from "@/lib/shopify";
import { addToCart, loadCart, setLineQuantity, type Cart } from "@/lib/shopify-cart";
import { SITE } from "@/lib/site";

/* Delta Roe mark — the fallback when a Shopify product has no image yet. */
function Mark({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Delta Roe emblem" width={size} height={size}>
      <path d="M50 4 L96 88 L4 88 Z" fill="none" stroke="var(--gold)" strokeWidth="3" />
      <path
        d="M50 46 C42 58 30 62 22 74 C34 78 44 76 50 70 C56 76 66 78 78 74 C70 62 58 58 50 46 Z"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3"
      />
      <path d="M50 46 C46 58 46 66 50 70 C54 66 54 58 50 46 Z" fill="var(--gold)" opacity="0.5" />
    </svg>
  );
}

function money(n: number) {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

function ProductCard({
  product,
  onAdd,
  busyId,
  addedId,
}: {
  product: ShopProduct;
  onAdd: (variantId: string) => void;
  busyId: string | null;
  addedId: string | null;
}) {
  const sellable = isPurchasable(product);
  const hasChoices = product.variants.length > 1;
  const [variantId, setVariantId] = useState(
    () => (product.variants.find((v) => v.availableForSale) || product.variants[0])?.id ?? "",
  );
  const variant: ShopVariant | undefined =
    product.variants.find((v) => v.id === variantId) || product.variants[0];

  const busy = busyId === variantId;
  const added = addedId === variantId;

  return (
    <article className="product-card">
      {/* The image and title link to /shop/[handle]. Each product having its
          own crawlable URL is what lets it rank in Google at all. */}
      <Link href={`/shop/${product.handle}`} className={product.image ? "product-art has-photo" : "product-art"}>
        {!sellable && <span className="product-badge">Coming Soon</span>}
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image.url} alt={product.image.alt} loading="lazy" />
        ) : (
          <Mark />
        )}
      </Link>
      <div className="product-body">
        <div className="product-head">
          <h3>
            <Link href={`/shop/${product.handle}`}>{product.title}</Link>
          </h3>
          <span className="product-price">{money(variant?.price ?? product.price)}</span>
        </div>
        <p className="product-desc">{product.description}</p>

        {hasChoices && (
          <label className="product-detail" style={{ display: "block", marginBottom: 10 }}>
            <select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              aria-label={`Size for ${product.title}`}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                color: "inherit",
                border: "1px solid var(--gold)",
                borderRadius: 4,
              }}
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                  {v.title}
                  {v.availableForSale ? "" : " — sold out"}
                </option>
              ))}
            </select>
          </label>
        )}

        {sellable ? (
          <button
            className="btn btn-ghost product-add"
            onClick={() => variant && onAdd(variant.id)}
            disabled={busy || !variant?.availableForSale}
          >
            {busy ? "Adding…" : added ? "Added ✓" : variant?.availableForSale ? "Add to Cart" : "Sold Out"}
          </button>
        ) : (
          <button className="btn btn-ghost product-add" disabled aria-disabled="true">
            Coming Soon
          </button>
        )}
      </div>
    </article>
  );
}

export default function ShopClient({ products }: { products: ShopProduct[] }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate any cart left from a previous visit.
  useEffect(() => {
    let live = true;
    loadCart().then((c) => {
      if (live && c) setCart(c);
    });
    return () => {
      live = false;
    };
  }, []);

  const groups = useMemo(() => groupByType(products), [products]);
  const anySellable = useMemo(() => products.some(isPurchasable), [products]);

  const handleAdd = useCallback(async (variantId: string) => {
    setBusyId(variantId);
    setError(null);
    const next = await addToCart(variantId, 1);
    setBusyId(null);
    if (!next) {
      setError("That didn't go through. Please try again, or call the studio.");
      return;
    }
    setCart(next);
    setAddedId(variantId);
    setDrawerOpen(true);
    window.setTimeout(() => setAddedId(null), 1500);
  }, []);

  const handleQty = useCallback(async (lineId: string, qty: number) => {
    const next = await setLineQuantity(lineId, qty);
    if (next) setCart(next);
  }, []);

  const count = cart?.totalQuantity ?? 0;

  return (
    <>
      <div className="svc-hero" style={{ paddingBottom: 36 }}>
        <div className="narrow">
          <div className="eyebrow">The Apothecary</div>
          <h1 style={{ marginTop: 14 }}>Take the sanctuary home</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Everything below is poured, blended, or charged under the Delta Roe
            name — the same materials that fill the studio.
          </p>
          {!anySellable && (
            <p className="lede" style={{ marginTop: 14, color: "var(--gold-bright)" }}>
              The shelves are being stocked. Every piece below is real and on its
              way — check back shortly, or{" "}
              <a href={`mailto:${SITE.email}`}>write to us</a> to be told first.
            </p>
          )}
        </div>
      </div>

      {groups.map(([type, items]) => (
        <section key={type} style={{ paddingTop: 8, paddingBottom: 40 }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 18 }}>{type}</div>
            <div className="shop-grid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} busyId={busyId} addedId={addedId} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {error && (
        <div className="wrap" style={{ paddingBottom: 24 }}>
          <p role="alert" style={{ color: "var(--gold-bright)" }}>{error}</p>
        </div>
      )}

      {count > 0 && (
        <button className="cart-fab" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} items`}>
          Cart · {count} · {money(cart?.subtotal ?? 0)}
        </button>
      )}

      {drawerOpen && (
        <div className="cart-overlay" onClick={() => setDrawerOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping cart">
            <div className="cart-head">
              <span className="eyebrow">Your Ritual</span>
              <button className="cart-close" onClick={() => setDrawerOpen(false)} aria-label="Close cart">
                ×
              </button>
            </div>

            {!cart || cart.lines.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>
            ) : (
              <>
                {cart.lines.map((l) => (
                  <div className="cart-line" key={l.id}>
                    <div>
                      <div className="cart-name">{l.productTitle}</div>
                      <div className="cart-sub">
                        {l.variantTitle !== "Default Title" && `${l.variantTitle} · `}
                        {money(l.price)}
                      </div>
                    </div>
                    <div className="cart-qty">
                      <button onClick={() => handleQty(l.id, l.quantity - 1)} aria-label="Decrease">−</button>
                      <span>{l.quantity}</span>
                      <button onClick={() => handleQty(l.id, l.quantity + 1)} aria-label="Increase">+</button>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  <span>Subtotal</span>
                  <span>{money(cart.subtotal)}</span>
                </div>
                <p className="product-detail" style={{ marginBottom: 12 }}>
                  Shipping and tax are calculated at checkout.
                </p>
                <a className="btn btn-solid" style={{ width: "100%" }} href={cart.checkoutUrl}>
                  Checkout
                </a>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
