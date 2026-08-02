"use client";

/* Vagaro's embedded booking widget.
   Their loader script expects to sit *inside* the .vagaro container it renders
   into, so it can't go through next/script (which appends to <head>/<body>).
   Instead the script element is created on mount and appended to the container,
   reproducing the DOM shape of Vagaro's own copy-paste snippet.

   Vagaro's snippet also ships a hardcoded title in Arial/#333 — dropped here,
   since dark grey on our near-black ground is unreadable; /book supplies its own
   heading in the site's type instead.

   The "Powered by Vagaro" links are theirs and are kept deliberately: provider
   attribution is often a condition of using the widget. They're styled down
   rather than removed. If Vagaro's terms turn out not to require them, the
   whole <p className={s.attrib}> block can go. */

import { useEffect, useRef } from "react";
import s from "./Book.module.css";

// Regenerated 8/1/2026 after setting "Redirect After Booking" to
// https://deltaroe.com/booked. NOTE: Vagaro mints a brand-new widget (and a new
// loader URL) every time that settings screen is saved — the old code silently
// keeps serving the old configuration. So any change on Settings → Booking
// Widget means pasting the fresh embed code in here, not just assuming it
// picked the change up.
const LOADER_SRC =
  "https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqqDpKqD3OcT3qmV35y6RuRFXoSlXYO61Cq7fYO61WO4pUUeJUtjP0dDxkJEvwRapWUgZawifCs7fYJEPwMc8?v=UM6Kxh9fm3H5YKc3o1PalsAVGoXveKtX2lYi5VTZyuM#";

export default function VagaroWidget() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    // Guard against React 18 strict-mode double-invoke and client-side
    // navigations re-adding the loader on top of an existing widget.
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = LOADER_SRC;
    script.async = true;
    el.appendChild(script);
  }, []);

  return (
    <div className={s.frame}>
      <div className={s.vagaroCard}>
        <div className="vagaro" ref={host} />
      </div>
      <p className={s.attrib}>
        <a href="https://www.vagaro.com/pro/" rel="noopener nofollow">
          Powered by Vagaro
        </a>
      </p>
      <noscript>
        <p className={s.fallback}>
          Online booking needs JavaScript switched on. Give the studio a call
          and we&rsquo;ll book you in by hand — it&rsquo;s no trouble at all.
        </p>
      </noscript>
    </div>
  );
}
