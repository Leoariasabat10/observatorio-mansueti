"use client";

import Link from "next/link";
import type { WebinarResumen } from "@/lib/content";
import { estadoDe, fechaLarga, horaBogota } from "@/lib/webinar-time";
import { useAhora } from "@/components/webinar/useAhora";

// One line under the hero with whatever is next (or live). Disappears when nothing is scheduled.
export function ProximoEnLinea({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const w = webinars.find((x) => estadoDe(x.start, x.duracionMin, now) !== "pasado");
  if (!w) return null;
  const vivo = estadoDe(w.start, w.duracionMin, now) === "en-vivo";

  return (
    <Link
      href={`/programa-academico/${w.slug}`}
      className="group mt-10 flex max-w-xl items-start gap-4 border-t border-rule pt-5 text-sm transition-colors"
    >
      <span aria-hidden className={`relative mt-1.5 size-2 shrink-0 rounded-full ${vivo ? "pulso bg-danger" : "bg-blue"}`} />
      <span>
        <span className="font-semibold text-navy">{vivo ? "Transmitiendo ahora: " : "Próximo webinar: "}</span>
        <span className="text-navy decoration-blue/40 underline-offset-4 group-hover:underline">{w.titulo}</span>
        <span className="block text-muted">
          {fechaLarga(w.start)}, <span className="tnum">{horaBogota(w.start)}</span> (hora de Bogotá)
        </span>
      </span>
    </Link>
  );
}
