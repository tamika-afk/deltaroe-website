"use client";

// Browser-side cart, backed by Shopify's Storefront Cart API.
//
// The cart lives in Shopify, not in React state — so a customer's cart survives
// a refresh, and the "Checkout" button hands off to Shopify's own hosted
// checkout (`cart.checkoutUrl`). That matters for more than convenience:
// Shopify's checkout is what calculates sales tax, takes the card, and keeps
// Delta Roe out of PCI scope. We never see a card number.
//
// Tokenless, like the rest of lib/shopify.ts — see the note there.

import { STOREFRONT_ENDPOINT } from "./shopify";

const CART_ID_KEY = "dr_cart_id";

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  price: number;
  image: { url: string; alt: string } | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  currency: string;
  lines: CartLine[];
};

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount }
            image { url altText }
            product { title featuredImage { url altText } }
          }
        }
      }
    }
  }
`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: { amount: string };
          image: { url: string; altText: string | null } | null;
          product: { title: string; featuredImage: { url: string; altText: string | null } | null };
        };
      };
    }[];
  };
};

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  try {
    const res = await fetch(STOREFRONT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.errors?.length) return null;
    return (json.data ?? null) as T;
  } catch {
    return null;
  }
}

function normalise(raw: RawCart | null | undefined): Cart | null {
  if (!raw) return null;
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: Number(raw.cost.subtotalAmount.amount),
    currency: raw.cost.subtotalAmount.currencyCode,
    lines: raw.lines.edges.map(({ node: l }) => {
      const img = l.merchandise.image || l.merchandise.product.featuredImage;
      return {
        id: l.id,
        quantity: l.quantity,
        variantId: l.merchandise.id,
        variantTitle: l.merchandise.title,
        productTitle: l.merchandise.product.title,
        price: Number(l.merchandise.price.amount),
        image: img ? { url: img.url, alt: img.altText || l.merchandise.product.title } : null,
      };
    }),
  };
}

function readStoredId(): string | null {
  try {
    return window.localStorage.getItem(CART_ID_KEY);
  } catch {
    // Private windows and blocked site data throw here. A cart that starts
    // empty is fine; a page that crashes is not.
    return null;
  }
}

function storeId(id: string) {
  try {
    window.localStorage.setItem(CART_ID_KEY, id);
  } catch {
    /* non-fatal — the cart just won't survive a refresh */
  }
}

function clearStoredId() {
  try {
    window.localStorage.removeItem(CART_ID_KEY);
  } catch {
    /* non-fatal */
  }
}

/** Load the existing cart, if there is a usable one. */
export async function loadCart(): Promise<Cart | null> {
  const id = readStoredId();
  if (!id) return null;
  const data = await gql<{ cart: RawCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id },
  );
  // Shopify expires carts after ~10 days of inactivity, and returns null for
  // one that's gone. Drop the stale id rather than retrying it forever.
  if (!data?.cart) {
    clearStoredId();
    return null;
  }
  return normalise(data.cart);
}

/** Add a variant, creating the cart on first use. */
export async function addToCart(variantId: string, quantity = 1): Promise<Cart | null> {
  const existing = readStoredId();

  if (existing) {
    const data = await gql<{ cartLinesAdd: { cart: RawCart | null } }>(
      `mutation Add($id: ID!, $lines: [CartLineInput!]!) {
         cartLinesAdd(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
       }`,
      { id: existing, lines: [{ merchandiseId: variantId, quantity }] },
    );
    const cart = normalise(data?.cartLinesAdd?.cart);
    if (cart) return cart;
    // The stored cart was expired or invalid — fall through and make a new one.
    clearStoredId();
  }

  const data = await gql<{ cartCreate: { cart: RawCart | null } }>(
    `mutation Create($lines: [CartLineInput!]!) {
       cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { lines: [{ merchandiseId: variantId, quantity }] },
  );
  const cart = normalise(data?.cartCreate?.cart);
  if (cart) storeId(cart.id);
  return cart;
}

/** Set a line's quantity; 0 removes it. */
export async function setLineQuantity(lineId: string, quantity: number): Promise<Cart | null> {
  const id = readStoredId();
  if (!id) return null;

  if (quantity <= 0) {
    const data = await gql<{ cartLinesRemove: { cart: RawCart | null } }>(
      `mutation Remove($id: ID!, $lineIds: [ID!]!) {
         cartLinesRemove(cartId: $id, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
       }`,
      { id, lineIds: [lineId] },
    );
    return normalise(data?.cartLinesRemove?.cart);
  }

  const data = await gql<{ cartLinesUpdate: { cart: RawCart | null } }>(
    `mutation Update($id: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
     }`,
    { id, lines: [{ id: lineId, quantity }] },
  );
  return normalise(data?.cartLinesUpdate?.cart);
}
