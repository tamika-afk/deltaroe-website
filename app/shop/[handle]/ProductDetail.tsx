"use client";

// Buy panel for a single product page. Shares lib/shopify-cart.ts with the
// shop grid, so a cart started on /shop carries over to /shop/[handle] and
// on to Shopify's checkout without the customer noticing a seam.

import { useCallback, useState } from "react";
import { isPurchasable, type ShopProduct } from "@/lib/shopify";
import { addToCart } from "@/lib/shopify-cart";

function money(n: number) {
  return `$${n.toFixed(2).replace(/\.00$/, "")}`;
}

export default function ProductDetail({ product }: { product: ShopProduct }) {
  const sellable = isPurchasable(product);
  const hasChoices = product.variants.length > 1;

  const [variantId, setVariantId] = useState(
    () => (product.variants.find((v) => v.availableForSale) || product.variants[0])?.id ?? "",
  );
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];

  const handleAdd = useCallback(async () => {
    if (!variant) return;
    setBusy(true);
    setError(null);
    const cart = await addToCart(variant.id, 1);
    setBusy(false);
    if (!cart) {
      setError("That didn't go through. Please try again, or call the studio.");
      return;
    }
    setAdded(true);
    // Send them to Shopify's checkout directly — on a single-product page the
    // intent is unambiguous, and an extra "view cart" step just loses people.
    window.location.href = cart.checkoutUrl;
  }, [variant]);

  return (
    <div style={{ marginTop: 22 }}>
      <div className="product-price" style={{ fontSize: 26, marginBottom: 16 }}>
        {money(variant?.price ?? product.price)}
      </div>

      {hasChoices && (
        <label style={{ display: "block", maxWidth: 320, marginBottom: 16 }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
            {product.variants[0]?.selectedOptions[0]?.name ?? "Option"}
          </span>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            aria-label={`Choose an option for ${product.title}`}
            style={{
              width: "100%",
              padding: "10px 12px",
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
          className="btn btn-solid"
          onClick={handleAdd}
          disabled={busy || !variant?.availableForSale}
          style={{ minWidth: 220 }}
        >
          {busy ? "Adding…" : added ? "Taking you to checkout…" : variant?.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      ) : (
        <button className="btn btn-ghost" disabled aria-disabled="true" style={{ minWidth: 220 }}>
          Coming Soon
        </button>
      )}

      <p className="product-detail" style={{ marginTop: 12 }}>
        Shipping and tax are calculated at checkout.
      </p>

      {error && (
        <p role="alert" style={{ color: "var(--gold-bright)", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
