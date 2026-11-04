"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

// Filters live in the URL (?categoria=boletines&eje=seguridad-social): shareable links, back-button friendly.
// Changes morph the list with the View Transitions API (native, no animation library).

const EVENTO = "filtros-url";

function suscribir(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENTO, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENTO, cb);
  };
}
const leer = () => window.location.search;

function transicion(fn: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) return fn();
  document.startViewTransition(() => flushSync(fn));
}

export function useFiltrosUrl() {
  const params = new URLSearchParams(useSyncExternalStore(suscribir, leer, () => ""));

  const actualizar = (cambios: Record<string, string | null>) => {
    const q = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(cambios)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    const s = q.toString();
    transicion(() => {
      window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
      window.dispatchEvent(new Event(EVENTO));
    });
  };

  return { params, actualizar };
}
