"use client";

import Link from "next/link";
import type { WebinarResumen } from "@/lib/content";
import { estadoDe, fechaDia, fechaMes, horaBogota } from "@/lib/webinar-time";
import { EjeTag, EstadoBadge } from "@/components/webinar/Etiquetas";
import { useAhora } from "@/components/webinar/useAhora";

// Next two sessions plus the latest held one, so the home always shows what is coming and what just happened.
export function AgendaBreve({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const proximos = webinars.filter((w) => estadoDe(w.start, w.duracionMin, now) !== "pasado").slice(0, 2);
  const ultimo = webinars.filter((w) => w.end <= now).at(-1);
  const lista = [...proximos, ...(ultimo ? [ultimo] : [])];

  return (
    <ol className="border-t border-rule">
      {lista.map((w) => {
        const estado = estadoDe(w.start, w.duracionMin, now);
        return (
          <li key={w.slug} className="border-b border-rule">
            <Link href={`/programa-academico/${w.slug}`} className="group grid grid-cols-[3.5rem_1fr] gap-x-5 py-6 sm:grid-cols-[4.5rem_1fr]">
              <time dateTime={new Date(w.start).toISOString()} className={estado === "pasado" ? "text-muted" : "text-navy"}>
                <span className="tnum block font-display text-[2.6rem] leading-[0.85] sm:text-5xl">{fechaDia(w.start)}</span>
                <span className="mt-1 block text-sm font-semibold">{fechaMes(w.start)}</span>
                <span className="tnum block text-xs text-muted">{horaBogota(w.start)} h</span>
              </time>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <EstadoBadge estado={estado} />
                  <EjeTag slug={w.ejes[0]} />
                </span>
                <span className="mt-2.5 block font-serif text-xl leading-snug text-balance text-navy decoration-blue/40 underline-offset-4 group-hover:underline">
                  {w.titulo}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
