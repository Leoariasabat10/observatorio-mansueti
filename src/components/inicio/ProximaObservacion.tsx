"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WebinarResumen } from "@/lib/content";
import { ejePorSlug } from "@/lib/ejes";
import { estadoDe, fechaDia, fechaMes, horaBogota } from "@/lib/webinar-time";
import { useAhora } from "@/components/webinar/useAhora";

const anio = (ms: number) => new Intl.DateTimeFormat("es-CO", { year: "numeric", timeZone: "America/Bogota" }).format(ms);

// Readout under the hero: the next session as a coordinate, with its real state (próxima / en vivo)
// and a composed empty state when nothing is scheduled.
export function ProximaObservacion({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const w = webinars.find((x) => estadoDe(x.start, x.duracionMin, now) !== "pasado");

  if (!w) {
    return (
      <div className="flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper/70">
          <span className="font-semibold text-paper">Sin sesiones programadas por ahora.</span> El archivo del programa conserva las grabaciones.
        </p>
        <Link href="/programa-academico?estado=pasados" className="enlace text-sm font-semibold text-paper">
          Ver sesiones realizadas
        </Link>
      </div>
    );
  }

  const vivo = estadoDe(w.start, w.duracionMin, now) === "en-vivo";
  const eje = ejePorSlug(w.ejes[0]);

  return (
    <Link href={`/programa-academico/${w.slug}`} className="group grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 py-7 lg:grid-cols-[13rem_auto_1fr_auto] lg:gap-x-10">
      <p className="col-span-2 flex items-center gap-2.5 text-xs font-semibold tracking-wide text-paper/70 lg:col-span-1">
        <span aria-hidden className={`relative size-1.5 rounded-full ${vivo ? "pulso bg-danger" : "bg-gold"}`} />
        {vivo ? "Transmitiendo ahora" : "Próxima observación"}
      </p>
      <time dateTime={new Date(w.start).toISOString()} className="flex items-baseline gap-3">
        <span className="tnum font-display text-5xl leading-[0.8] font-medium">{fechaDia(w.start)}</span>
        <span className="text-sm leading-tight text-paper/80">
          {fechaMes(w.start)} {anio(w.start)}
          <span className="tnum block">{horaBogota(w.start)} h, Bogotá</span>
        </span>
      </time>
      <span className="col-span-2 min-w-0 lg:col-span-1">
        <span className="block font-serif text-xl leading-snug text-balance decoration-gold/60 underline-offset-4 group-hover:underline lg:text-2xl">{w.titulo}</span>
        {eje && <span className="mt-1 block text-xs text-paper/60">{eje.nombre}{w.ejemplo ? ", contenido de ejemplo" : ""}</span>}
      </span>
      <span aria-hidden className="hidden items-center gap-2 text-sm font-semibold text-gold lg:inline-flex">
        Ver sesión
        <ArrowRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
