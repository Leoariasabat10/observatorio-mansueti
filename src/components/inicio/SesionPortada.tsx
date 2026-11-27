"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@site";
import type { WebinarResumen } from "@/lib/content";
import { accionPrincipal, esModeracion, estadoDe, fechaDia, fechaLarga, fechaMes, horaBogota, modalidadTexto, restante } from "@/lib/webinar-time";
import { Afiche } from "@/components/webinar/Afiche";
import { Acceso } from "@/components/webinar/Acceso";
import { CompartirSesion } from "@/components/webinar/CompartirSesion";
import { HoraLocal } from "@/components/webinar/HoraLocal";
import { useAhora } from "@/components/webinar/useAhora";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function faltan(start: number, now: number) {
  const { dias, horas, minutos } = restante(start, now);
  const p = (n: number, s: string, pl: string) => `${n} ${n === 1 ? s : pl}`;
  if (dias > 0) return `Faltan ${p(dias, "día", "días")} y ${p(horas, "hora", "horas")}`;
  if (horas > 0) return `Faltan ${p(horas, "hora", "horas")} y ${p(minutos, "minuto", "minutos")}`;
  return `Faltan ${p(minutos, "minuto", "minutos")}`;
}

// First thing on the home page while a session is upcoming or live: what it is, when, and the two things
// a visitor came to do (join, share). It disappears by itself once the session is over.
export function SesionPortada({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const w = webinars.find((x) => estadoDe(x.start, x.duracionMin, now) !== "pasado");
  if (!w) return null;

  const estado = estadoDe(w.start, w.duracionMin, now);
  const vivo = estado === "en-vivo";
  const accion = accionPrincipal(w, estado);
  const href = `/programa-academico/${w.slug}`;
  const ponentes = w.ponentes.filter((p) => !esModeracion(p));
  const paises = new Set(ponentes.map((p) => p.pais)).size;
  const cuando = `${fechaLarga(w.start)}, ${horaBogota(w.start)} (hora de Bogotá)`;
  const textoCompartir = `${w.formato ? `${w.formato}: ` : ""}«${w.titulo}». ${cap(cuando)}, por ${w.plataforma ?? "transmisión en línea"}.`;

  return (
    <section aria-labelledby="sesion-portada" className="graticula border-b border-rule bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-8 pb-12 sm:pt-12 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8 lg:py-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-5">
            <time dateTime={new Date(w.start).toISOString()} className="flex shrink-0 flex-col items-center border-r border-rule pr-5 text-navy">
              <span className="tnum font-display text-[3.25rem] leading-[0.8] font-medium">{fechaDia(w.start)}</span>
              <span className="mt-1.5 text-xs font-semibold">{fechaMes(w.start)}</span>
            </time>
            <div className="min-w-0 text-sm leading-snug">
              <p className="flex items-center gap-2 font-semibold text-navy">
                <span aria-hidden className={`size-2 rounded-full ${vivo ? "pulso bg-danger" : "bg-gold"}`} />
                {vivo ? "En vivo ahora" : (w.formato ?? "Próxima sesión")}
              </p>
              <p className="mt-1 text-muted">
                {cap(fechaLarga(w.start).split(",")[0])}, {horaBogota(w.start)}, hora de Bogotá
              </p>
              <HoraLocal start={w.start} className="mt-0.5 block text-blue" />
            </div>
          </div>

          <h2 id="sesion-portada" className="mt-7 font-display text-[clamp(1.85rem,5.4vw,3.4rem)] leading-[1.04] font-medium text-balance text-navy">
            <Link href={href} className="decoration-gold decoration-2 underline-offset-[0.18em] hover:underline">
              {w.titulo}
            </Link>
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            {ponentes.length} {ponentes.length === 1 ? "ponente" : "ponentes"}
            {paises > 1 && ` de ${paises} países`}. {modalidadTexto(w)}.{" "}
            <span className="font-semibold text-navy">{vivo ? "La sesión está en curso." : `${faltan(w.start, now)}.`}</span>
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {accion && (
              <a
                href={accion.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-6 py-4 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-blue active:scale-[0.98]"
              >
                {accion.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
            <CompartirSesion
              titulo={w.titulo}
              texto={textoCompartir}
              url={`${siteConfig.url}${href}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-navy/30 px-6 py-4 text-base font-semibold text-navy transition-[border-color,transform] duration-200 hover:border-navy active:scale-[0.98]"
            />
          </div>
          {!accion && <Acceso w={w} vivo={vivo} className="mt-6 text-navy" />}

          <Link href={href} className="enlace mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            Horarios por país y ponentes
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <Link href={href} tabIndex={-1} aria-hidden className="block w-full max-w-[19rem] justify-self-center sm:max-w-sm lg:col-span-5 lg:justify-self-end">
          <ViewTransition name={`afiche-${w.slug}`} share="morph" default="none">
            <Afiche w={w} priority className="sombra-larga" />
          </ViewTransition>
        </Link>
      </div>
    </section>
  );
}
