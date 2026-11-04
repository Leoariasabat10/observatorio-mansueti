"use client";

import { useRef, useState, type FocusEvent, type PointerEvent } from "react";

// Poster preview for the logbook rows. Desktop with a fine pointer only: it follows the cursor;
// keyboard focus shows it anchored next to the row instead. Position is written straight to the
// element (no re-render per mouse move); only which poster is shown lives in state.
const finoQuery = "(hover: hover) and (pointer: fine)";
const ANCHO = 256;

export function useVistaPrevia() {
  const ref = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState<string | null>(null);

  const colocar = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const alto = ANCHO * 1.25;
    const left = Math.min(x + 28, window.innerWidth - ANCHO - 16);
    const top = Math.min(Math.max(y - alto / 2, 16), window.innerHeight - alto - 16);
    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  };

  return {
    ref,
    slug,
    fila: (s: string) => ({
      onPointerEnter: (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || !window.matchMedia(finoQuery).matches) return;
        colocar(e.clientX, e.clientY);
        setSlug(s);
      },
      onPointerMove: (e: PointerEvent) => {
        if (e.pointerType === "mouse") colocar(e.clientX, e.clientY);
      },
      onPointerLeave: () => setSlug(null),
    }),
    titulo: (s: string) => ({
      onFocus: (e: FocusEvent<HTMLElement>) => {
        if (!window.matchMedia(finoQuery).matches) return;
        const r = e.currentTarget.closest("li")!.getBoundingClientRect();
        colocar(r.right - ANCHO - 260, r.top + r.height / 2);
        setSlug(s);
      },
      onBlur: () => setSlug(null),
    }),
  };
}
