"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import type { WebinarResumen } from "@/lib/content";
import { esModeracion } from "@/lib/webinar-time";
import { paises } from "@/lib/paises";
import { accionPrincipal, estadoDe, fechaLarga, horaBogota } from "@/lib/webinar-time";
import { Reticula } from "@/components/brand/Reticula";
import { Acceso } from "./Acceso";
import { Afiche } from "./Afiche";
import { CuentaRegresiva } from "./CuentaRegresiva";
import { EjemploTag, EjeTag, EstadoBadge } from "./Etiquetas";
import { HoraLocal } from "./HoraLocal";
import { useAhora } from "./useAhora";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Live webinar first, else the next one, else the latest held. */
function elegir(ws: WebinarResumen[], now: number) {
  return (
    ws.find((w) => estadoDe(w.start, w.duracionMin, now) === "en-vivo") ??
    ws.find((w) => w.start > now) ??
    ws.at(-1)
  );
}

export function WebinarDestacado({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const w = elegir(webinars, now);
  if (!w) return null;

  const estado = estadoDe(w.start, w.duracionMin, now);
  const accion = accionPrincipal(w, estado);
  const titulo = { proximo: "Próxima sesión", "en-vivo": "Transmitiendo ahora", pasado: "Última sesión realizada" }[estado];
  const href = `/programa-academico/${w.slug}`;
  const ponentes = w.ponentes.filter((p) => !esModeracion(p));
  const moderacion = w.ponentes.filter(esModeracion);

  return (
    <section aria-labelledby="destacado-titulo" className="noche grano relative overflow-hidden text-paper">
      <Reticula className="pointer-events-none absolute top-1/2 -right-[22rem] w-[52rem] -translate-y-1/2 max-lg:hidden" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <Link href={href} className="group order-last block w-full max-w-[17rem] sm:max-w-xs lg:order-none lg:col-span-5 lg:max-w-none" tabIndex={-1} aria-hidden>
          <ViewTransition name={`afiche-${w.slug}`} share="morph" default="none">
            <Afiche w={w} priority className="sombra-larga transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:-translate-y-1" />
          </ViewTransition>
        </Link>

        <div className="lg:col-span-7">
          <p className="eyebrow text-gold">{titulo}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <EstadoBadge estado={estado} inverse />
            {w.ejes.map((e) => (
              <EjeTag key={e} slug={e} inverse />
            ))}
            {w.ejemplo && <EjemploTag inverse />}
          </div>

          <h2 id="destacado-titulo" className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] font-medium text-balance">
            <Link href={href} className="decoration-gold decoration-2 underline-offset-[0.2em] hover:underline">
              {w.titulo}
            </Link>
          </h2>

          <p className="mt-5 text-lg text-paper/90">
            <time dateTime={new Date(w.start).toISOString()}>
              {cap(fechaLarga(w.start))}, {horaBogota(w.start)}, hora de Bogotá
            </time>
            <HoraLocal start={w.start} className="mt-1 block text-sm text-sky" />
          </p>

          {estado === "proximo" && (
            <div className="mt-9">
              <p className="mb-3 text-sm text-paper/70">Comienza en</p>
              <CuentaRegresiva start={w.start} now={now} />
            </div>
          )}

          <div className="mt-9 border-t border-paper/15 pt-6">
            <h3 className="text-sm text-paper/70">{ponentes.length === 1 ? "Ponente" : `${ponentes.length} ponentes`}</h3>
            <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {ponentes.map((p) => (
                <li key={p.nombre} className="leading-snug">
                  <span className="block text-base font-semibold">{p.nombre}</span>
                  <span className="text-sm text-paper/70">{[p.cargo ?? p.institucion, paises[p.pais]?.nombre].filter((x, i, l) => x && !(i === 1 && l[0]?.includes(x))).join(", ")}</span>
                </li>
              ))}
            </ul>
            {moderacion.length > 0 && (
              <p className="mt-5 text-sm leading-relaxed text-paper/70">
                <span className="font-semibold text-paper">Moderación:</span> {moderacion.map((p) => p.nombre).join(", ")}
              </p>
            )}
          </div>

          {estado !== "pasado" && !accion && <Acceso w={w} vivo={estado === "en-vivo"} className="mt-8 border-l border-gold/60 pl-4 text-paper" />}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            {estado !== "pasado" && accion && (
              <a
                href={accion.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
              >
                {accion.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            {estado === "pasado" && w.grabacion && (
              <a
                href={w.grabacion}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-white"
              >
                Ver grabación
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            <Link
              href={href}
              className="enlace inline-flex items-center gap-2 self-center text-sm font-semibold text-paper"
            >
              {estado === "proximo" && <CalendarPlus className="size-4" aria-hidden />}
              {estado === "proximo" ? "Detalles y calendario" : "Ver detalles"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
