"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Counts up once when it enters the viewport. The real number is in the HTML from the start
// (no-JS, crawlers and screen readers read it); reduced motion shows it immediately.
export function Contador({ valor, className = "" }: { valor: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(valor);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || valor === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.round(valor * (1 - Math.pow(2, -10 * p)))); // ease-out expo
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    setN(0); // before first paint after hydration, so the count starts from zero
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      <span aria-hidden>{n.toLocaleString("es-CO")}</span>
      <span className="sr-only">{valor.toLocaleString("es-CO")}</span>
    </span>
  );
}
