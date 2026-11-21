"use client";

import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { useFiltrosUrl } from "@/components/ui/useFiltrosUrl";
import { paises } from "@/lib/paises";
import { TIPOS, type Voz } from "@/lib/voces-tipos";

const MENSAJE = "Muy pronto: voces y perspectivas de nuestra región.";
const dia = (f: string) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${f}T12:00:00Z`));

function Miniatura({ v }: { v: Voz }) {
  const archivo = v.url.startsWith("/");
  if (archivo) {
    return (
      <video controls preload="none" poster={v.miniatura} className="aspect-video w-full bg-navy-deep object-cover" aria-label={`${v.titulo}, ${v.persona}`}>
        <source src={v.url} />
        <a href={v.url}>Descargar el video</a>
      </video>
    );
  }
  return (
    <a href={v.url} target="_blank" rel="noopener" aria-label={`Ver el video «${v.titulo}» (se abre en una pestaña nueva)`} className="group/v relative block aspect-video overflow-hidden bg-navy-deep">
      {v.miniatura ? <Image src={v.miniatura} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" className="object-cover" /> : <span aria-hidden className="graticula-inv absolute inset-0" />}
      <span aria-hidden className="absolute inset-0 grid place-items-center">
        <span className="grid size-14 place-items-center rounded-full bg-card/95 text-navy transition-transform duration-200 group-hover/v:scale-105 motion-reduce:transition-none">
          <Play className="ml-0.5 size-6 fill-current" />
        </span>
      </span>
    </a>
  );
}

function Tarjeta({ v, grande = false }: { v: Voz; grande?: boolean }) {
  return (
    <article className={grande ? "grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-center" : ""}>
      <div className={`overflow-hidden rounded-sm border border-rule ${grande ? "lg:col-span-7" : ""}`}>
        <Miniatura v={v} />
      </div>
      <div className={grande ? "lg:col-span-5" : "mt-5"}>
        <p className="tnum text-sm text-muted">
          {paises[v.pais].nombre} · {TIPOS[v.tipo]}
          {v.fecha && (
            <>
              {" · "}
              <time dateTime={v.fecha}>{dia(v.fecha)}</time>
            </>
          )}
        </p>
        {grande ? <h3 className="mt-3 font-display text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[1.08] text-balance text-navy">{v.titulo}</h3> : <h3 className="mt-2 font-serif text-[1.375rem] leading-snug text-balance text-navy">{v.titulo}</h3>}
        <p className="mt-2 text-sm font-semibold text-navy">{v.persona}</p>
        <p className={`mt-2 leading-relaxed text-muted ${grande ? "text-[1.0625rem]" : "line-clamp-3 text-[0.9375rem]"}`}>{v.descripcion}</p>
        {!v.url.startsWith("/") && (
          <a href={v.url} target="_blank" rel="noopener" className="enlace mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            Ver el video
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}

const chip = (on: boolean) =>
  `inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-200 ${on ? "border-navy bg-navy/[0.06] font-semibold text-navy" : "border-rule text-muted hover:border-navy/40 hover:text-navy"}`;

export function ListaVoces({ videos, paisesLista }: { videos: Voz[]; paisesLista: { codigo: string; nombre: string }[] }) {
  const { params, actualizar } = useFiltrosUrl();
  const q = params.get("pais");
  const pais = q && paisesLista.some((p) => p.codigo === q) ? q : null;
  const cuenta = (c: string) => videos.filter((v) => v.pais === c).length;
  const visibles = videos.filter((v) => !pais || v.pais === pais);
  const destacado = !pais ? visibles.find((v) => v.destacado) : undefined;
  const resto = visibles.filter((v) => v !== destacado);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
      <h2 id="por-pais" className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-navy">
        Por país
      </h2>
      <p className="mt-3 max-w-xl text-muted">{videos.length === 0 ? "Los doce países de Sudamérica tendrán su espacio. Aún no hay videos publicados." : "Elija un país para ver sus videos."}</p>

      {videos.length === 0 ? (
        <ul aria-labelledby="por-pais" className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {paisesLista.map((p) => (
            <li key={p.codigo} className="flex items-center justify-between gap-3 bg-card px-5 py-5">
              <span className="font-display text-xl text-navy">{p.nombre}</span>
              <span className="text-xs text-muted">Próximamente</span>
            </li>
          ))}
        </ul>
      ) : (
        <div role="group" aria-labelledby="por-pais" className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
          <button type="button" aria-pressed={pais === null} onClick={() => actualizar({ pais: null })} className={chip(pais === null)}>
            Todos los países
          </button>
          {paisesLista.map((p) => (
            <button key={p.codigo} type="button" aria-pressed={pais === p.codigo} onClick={() => actualizar({ pais: p.codigo })} className={chip(pais === p.codigo)}>
              {p.nombre}
              <span className="tnum text-xs opacity-70">{cuenta(p.codigo)}</span>
            </button>
          ))}
        </div>
      )}

      {videos.length === 0 ? (
        <p className="mt-14 max-w-xl border-l border-gold pl-5 font-display text-3xl leading-tight text-navy">{MENSAJE}</p>
      ) : (
        <>
          <p role="status" className="tnum mt-5 text-sm text-muted">
            {visibles.length} {visibles.length === 1 ? "video" : "videos"}
            {pais && ` · ${paises[pais].nombre}`}
          </p>
          {visibles.length === 0 && <p className="mt-10 max-w-xl border-l border-gold pl-5 text-lg text-muted">Aún no hay videos de {paises[pais!].nombre}. {MENSAJE}</p>}
          {destacado && (
            <div className="mt-12 border-b border-rule pb-14">
              <Tarjeta v={destacado} grande />
            </div>
          )}
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((v) => (
              <li key={v.url}>
                <Tarjeta v={v} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
