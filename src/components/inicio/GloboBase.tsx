"use client";

import { useEffect, useRef } from "react";

// Injects /globo-base.svg (sphere + dot grid, generated at build) inline once the page has loaded.
// Inline SVG never becomes the LCP element, and fetching it keeps the dots out of the page payload.
// It fades in under the routes; without JavaScript the routes and labels still show.
export function GloboBase() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let vivo = true;
    // Wait for load + an idle moment so parsing the dots never competes with the first render.
    const cargar = () => fetch("/globo-base.svg")
      .then((r) => (r.ok ? r.text() : ""))
      .then((svg) => {
        if (!vivo || !svg) return;
        el.innerHTML = svg;
        el.dataset.listo = "";
      })
      .catch(() => {});
    const ocioso = () => ("requestIdleCallback" in window ? requestIdleCallback(cargar, { timeout: 1500 }) : setTimeout(cargar, 300));
    if (document.readyState === "complete") ocioso();
    else window.addEventListener("load", ocioso, { once: true });
    return () => {
      vivo = false;
      window.removeEventListener("load", ocioso);
    };
  }, []);
  return <div ref={ref} aria-hidden className="globo-base absolute inset-0" />;
}
