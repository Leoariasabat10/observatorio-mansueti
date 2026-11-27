"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { WebinarResumen } from "@/lib/content";
import { ejePorSlug, ejes } from "@/lib/ejes";
import { fechaDia, fechaMes, horaBogota } from "@/lib/webinar-time";
import { useAhora } from "@/components/webinar/useAhora";

const W = 1000;
const H = 150;
const PAD = 28;
const AXIS = 96;
const DIA = 86_400_000;

// The program as a logbook on a time axis: one point per webinar, colored by its first axis.
// Held sessions are filled, upcoming ones are rings, and a "hoy" line moves with the visitor's clock.
export function LineaDeTiempo({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const scroller = useRef<HTMLDivElement>(null);

  // On narrow screens the axis scrolls: open it centered on "hoy", where the upcoming sessions are.
  // Measured only when the chart first comes into view, so it never forces layout of offscreen content.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const hoy = el.querySelector<SVGLineElement>("[data-hoy]");
      if (!hoy || el.scrollWidth <= el.clientWidth) return;
      el.scrollLeft = hoy.getBoundingClientRect().left - el.getBoundingClientRect().left - el.clientWidth / 2;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!webinars.length) return null;

  const first = new Date(Math.min(webinars[0].start, now));
  const last = new Date(Math.max(webinars.at(-1)!.start, now));
  const t0 = Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1);
  const t1 = Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 1, 1);
  const x = (t: number) => PAD + ((t - t0) / (t1 - t0)) * (W - 2 * PAD);

  const meses: number[] = [];
  for (let d = new Date(t0); d.getTime() <= t1; d.setUTCMonth(d.getUTCMonth() + 1)) meses.push(d.getTime());

  // Two sessions closer than ~10 days stack vertically instead of overlapping.
  const filas = new Map<string, number>();
  webinars.forEach((w, i) => {
    const prev = webinars[i - 1];
    filas.set(w.slug, prev && w.start - prev.start < 10 * DIA ? (filas.get(prev.slug)! + 1) % 2 : 0);
  });

  const usados = ejes.filter((e) => webinars.some((w) => w.ejes[0] === e.slug));

  return (
    <figure className="ldt">
      <div ref={scroller} className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0" tabIndex={0} role="region" aria-label="Línea de tiempo del programa, desplazable">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[640px]" aria-labelledby="ldt-titulo">
          <title id="ldt-titulo">Línea de tiempo de las sesiones del programa académico</title>
          <line x1={PAD} x2={W - PAD} y1={AXIS} y2={AXIS} stroke="#062265" strokeOpacity=".25" />
          {meses.map((m, i) => (
            <g key={m}>
              <line x1={x(m)} x2={x(m)} y1={AXIS - 4} y2={AXIS + 4} stroke="#062265" strokeOpacity=".35" />
              {i < meses.length - 1 && (
                <text x={x(m) + 6} y={AXIS + 22} className="fill-muted text-[12px] capitalize">
                  {fechaMes(m + 15 * DIA)} {new Date(m).getUTCFullYear()}
                </text>
              )}
            </g>
          ))}

          <g>
            <line data-hoy x1={x(now)} x2={x(now)} y1={14} y2={AXIS + 30} stroke="#062265" strokeDasharray="3 3" />
            <text x={x(now) + 6} y={22} className="fill-navy text-[12px] font-semibold">
              Hoy
            </text>
          </g>

          {webinars.map((w, i) => {
            const eje = ejePorSlug(w.ejes[0])!;
            const pasado = w.end <= now;
            const cy = AXIS - 26 - (filas.get(w.slug) ?? 0) * 26;
            return (
              <Link key={w.slug} href={`/programa-academico/${w.slug}`} className="ldt-punto" style={{ "--i": i } as React.CSSProperties} aria-label={`${w.titulo}, ${fechaDia(w.start)} ${fechaMes(w.start)}`}>
                <title>{`${w.titulo} (${fechaDia(w.start)} ${fechaMes(w.start)}, ${horaBogota(w.start)})`}</title>
                <line x1={x(w.start)} x2={x(w.start)} y1={cy + 8} y2={AXIS} stroke={eje.color} strokeOpacity=".5" />
                <circle cx={x(w.start)} cy={cy} r={14} fill="transparent" />
                <circle cx={x(w.start)} cy={cy} r={7} fill={pasado ? eje.color : "#fff"} stroke={pasado ? "#fff" : eje.color} strokeWidth={2} />
              </Link>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-muted">
        {usados.map((e) => (
          <span key={e.slug} className="inline-flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: e.color }} />
            {e.nombre}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-navy" /> realizado
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full border-2 border-navy" /> próximo
        </span>
      </figcaption>
    </figure>
  );
}
