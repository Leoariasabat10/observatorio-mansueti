"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, Globe, MapPin, Video } from "lucide-react";
import { useFiltrosUrl } from "@/components/ui/useFiltrosUrl";
import { paises } from "@/lib/paises";
import { MODALIDADES, type EventoAgenda } from "@/lib/agenda-tipos";

const MENSAJE = "Próximamente encontrarás aquí encuentros y actividades laborales de nuestra región y del mundo.";
const fmt = (f: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-CO", { ...opts, timeZone: "UTC" }).format(new Date(`${f}T12:00:00Z`));
const fechaLarga = (e: EventoAgenda) => {
  if (!e.fechaFin || e.fechaFin === e.fecha) return fmt(e.fecha, { day: "numeric", month: "long", year: "numeric" });
  return `${fmt(e.fecha, { day: "numeric", month: "long" })} al ${fmt(e.fechaFin, { day: "numeric", month: "long", year: "numeric" })}`;
};

// "Today" in Bogotá. The server snapshot is the build date; the browser re-renders with the real one.
const hoyReal = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
const sinSuscripcion = () => () => {};

function Tarjeta({ e, pasado }: { e: EventoAgenda; pasado: boolean }) {
  const Icono = e.modalidad === "virtual" ? Video : MapPin;
  const lugar = [e.ciudad, e.pais && paises[e.pais].nombre].filter(Boolean).join(", ");
  return (
    <article className="grid gap-x-8 gap-y-4 border-t border-rule py-8 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="font-display text-2xl leading-tight text-navy">
          <time dateTime={e.fecha}>{fechaLarga(e)}</time>
        </p>
        {e.hora && (
          <p className="tnum mt-1 text-sm text-muted">
            {e.hora} <span>{e.zona}</span>
          </p>
        )}
      </div>
      <div className={e.imagen ? "md:col-span-6" : "md:col-span-9"}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/40 px-2.5 py-0.5 text-xs font-semibold text-blue">
            <Icono className="size-3.5" aria-hidden />
            {MODALIDADES[e.modalidad]}
          </span>
          {pasado && <span className="inline-flex items-center rounded-full border border-rule px-2.5 py-0.5 text-xs font-semibold text-muted">Evento realizado</span>}
          {lugar && <span className="text-sm text-muted">{lugar}</span>}
        </div>
        <h3 className="mt-3 font-serif text-[1.5rem] leading-snug text-balance text-navy">{e.nombre}</h3>
        <p className="mt-1 text-sm font-semibold text-navy">Organiza: {e.organizador}</p>
        <p className="mt-3 max-w-[42em] leading-relaxed text-muted">{e.descripcion}</p>
        <a href={e.enlace} target="_blank" rel="noopener" aria-label={`${pasado ? "Ver información de" : "Más información e inscripción:"} ${e.nombre} (sitio oficial, se abre en una pestaña nueva)`} className="enlace mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
          {pasado ? "Ver información oficial" : "Información e inscripción"}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      {e.imagen && (
        <div className="md:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-rule bg-card">
            <Image src={e.imagen} alt={e.imagenAlt ?? ""} fill sizes="(min-width: 768px) 280px, 92vw" className="object-contain" />
          </div>
        </div>
      )}
    </article>
  );
}

const chip = (on: boolean) =>
  `inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-200 ${on ? "border-navy bg-navy/[0.06] font-semibold text-navy" : "border-rule text-muted hover:border-navy/40 hover:text-navy"}`;

export function ListaAgenda({ eventos, hoyBuild }: { eventos: EventoAgenda[]; hoyBuild: string }) {
  const { params, actualizar } = useFiltrosUrl();
  const hoy = useSyncExternalStore(sinSuscripcion, hoyReal, () => hoyBuild);
  const fin = (e: EventoAgenda) => e.fechaFin ?? e.fecha;
  const proximos = eventos.filter((e) => fin(e) >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const anteriores = eventos.filter((e) => fin(e) < hoy).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const verAnteriores = params.get("ver") === "anteriores";
  const mq = params.get("modalidad");
  const modalidad = mq && mq in MODALIDADES ? mq : null;
  const lista = (verAnteriores ? anteriores : proximos).filter((e) => !modalidad || e.modalidad === modalidad);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
      {eventos.length === 0 ? (
        <div className="max-w-xl">
          <Globe className="size-8 text-blue" strokeWidth={1.5} aria-hidden />
          <p className="mt-6 border-l border-gold pl-5 font-display text-3xl leading-tight text-navy">{MENSAJE}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 border-y border-rule py-4">
            <div role="group" aria-label="Período" className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={!verAnteriores} onClick={() => actualizar({ ver: null })} className={chip(!verAnteriores)}>
                Próximos <span className="tnum text-xs opacity-70">{proximos.length}</span>
              </button>
              <button type="button" aria-pressed={verAnteriores} onClick={() => actualizar({ ver: "anteriores" })} className={chip(verAnteriores)}>
                Actividades anteriores <span className="tnum text-xs opacity-70">{anteriores.length}</span>
              </button>
            </div>
            <div role="group" aria-label="Filtrar por modalidad" className="flex flex-wrap gap-2">
              <button type="button" aria-pressed={modalidad === null} onClick={() => actualizar({ modalidad: null })} className={chip(modalidad === null)}>
                Todas las modalidades
              </button>
              {Object.entries(MODALIDADES).map(([k, v]) => (
                <button key={k} type="button" aria-pressed={modalidad === k} onClick={() => actualizar({ modalidad: k })} className={chip(modalidad === k)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <p role="status" className="tnum mt-5 text-sm text-muted">
            {lista.length} {lista.length === 1 ? "evento" : "eventos"}
          </p>
          {lista.length === 0 ? (
            <p className="mt-10 max-w-xl border-l border-gold pl-5 text-lg text-muted">{verAnteriores ? "No hay actividades anteriores con ese filtro." : MENSAJE}</p>
          ) : (
            <div className="mt-6 border-b border-rule">
              {lista.map((e) => (
                <Tarjeta key={e.enlace} e={e} pasado={verAnteriores} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
