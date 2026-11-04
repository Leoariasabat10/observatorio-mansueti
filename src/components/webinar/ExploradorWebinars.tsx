"use client";

import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import type { WebinarResumen } from "@/lib/content";
import { ejePorSlug, ejes } from "@/lib/ejes";
import { estadoDe, fechaDia, fechaMes, fechaMesAnio, horaBogota, modalidadTexto, type Estado } from "@/lib/webinar-time";
import { useFiltrosUrl } from "@/components/ui/useFiltrosUrl";
import { Afiche } from "./Afiche";
import { EjemploTag, EjeTag, EstadoBadge } from "./Etiquetas";
import { useAhora } from "./useAhora";

type Filtro = "proximos" | "en-vivo" | "pasados" | "todos";
const FILTROS: { id: Filtro; label: string }[] = [
  { id: "proximos", label: "Próximos" },
  { id: "en-vivo", label: "En vivo" },
  { id: "pasados", label: "Realizados" },
  { id: "todos", label: "Todos" },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function entra(estado: Estado, f: Filtro) {
  if (f === "todos") return true;
  if (f === "pasados") return estado === "pasado";
  if (f === "en-vivo") return estado === "en-vivo";
  return estado !== "pasado";
}

export function ExploradorWebinars({ webinars, buildNow }: { webinars: WebinarResumen[]; buildNow: number }) {
  const now = useAhora(buildNow);
  const { params: q, actualizar: setUrl } = useFiltrosUrl();
  const fq = q.get("estado");
  const filtro = FILTROS.some((f) => f.id === fq) ? (fq as Filtro) : null;
  const jq = q.get("eje");
  const eje = jq && ejePorSlug(jq) ? jq : null;

  const conEstado = webinars.map((w) => ({ w, estado: estadoDe(w.start, w.duracionMin, now) }));
  const delEje = conEstado.filter((x) => !eje || x.w.ejes.includes(eje));
  const cuenta = (f: Filtro) => delEje.filter((x) => entra(x.estado, f)).length;
  const activo: Filtro = filtro ?? (conEstado.some((x) => x.estado !== "pasado") ? "proximos" : "pasados");

  const visibles = delEje
    .filter((x) => entra(x.estado, activo))
    .sort((a, b) => {
      const pa = a.estado === "pasado", pb = b.estado === "pasado";
      if (pa !== pb) return pa ? 1 : -1; // upcoming before held
      return pa ? b.w.start - a.w.start : a.w.start - b.w.start;
    });

  const grupos: { mes: string; items: typeof visibles }[] = [];
  for (const x of visibles) {
    const mes = cap(fechaMesAnio(x.w.start));
    if (grupos.at(-1)?.mes === mes) grupos.at(-1)!.items.push(x);
    else grupos.push({ mes, items: [x] });
  }

  const actualizar = (f: Filtro | null, j: string | null) => setUrl({ estado: f, eje: j });

  return (
    <section aria-labelledby="explorador-titulo" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
      <div>
        <div>
          <p className="eyebrow text-blue">Bitácora del programa</p>
          <h2 id="explorador-titulo" className="mt-4 font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-navy">
            Todos los webinars
          </h2>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y border-rule py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrar por estado">
            <div className="grid grid-cols-4 rounded-sm border border-rule bg-card p-1 sm:inline-flex">
              {FILTROS.map((f) => {
                const n = cuenta(f.id);
                const on = activo === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    disabled={n === 0 && !on}
                    onClick={() => actualizar(f.id, eje)}
                    className={`flex items-center justify-center gap-1.5 rounded-[2px] px-1.5 py-2 text-[0.8125rem] font-semibold whitespace-nowrap sm:gap-2 sm:px-3.5 sm:text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "bg-navy text-white" : "text-navy hover:bg-paper"
                    }`}
                  >
                    {f.id === "en-vivo" && <span aria-hidden className={`size-1.5 rounded-full ${n ? "bg-danger" : "bg-muted"}`} />}
                    {f.label}
                    <span className={`tnum text-xs font-medium ${on ? "text-white/70" : "text-muted"}`}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div role="group" aria-label="Filtrar por eje temático" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 xl:flex-nowrap xl:justify-end">
            {[{ slug: null, nombre: "Todos los ejes", color: "" }, ...ejes].map((e) => {
              const on = eje === e.slug;
              return (
                <button
                  key={e.slug ?? "todos"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => actualizar(filtro, e.slug)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 whitespace-nowrap text-[0.8125rem] transition-colors duration-200 ${
                    on ? "border-navy bg-navy/[0.06] font-semibold text-navy" : "border-rule text-muted hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {e.color && <span aria-hidden className="size-2 rounded-full" style={{ background: e.color }} />}
                  {e.nombre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length === 1 ? "1 webinar" : `${visibles.length} webinars`}
      </p>

      {grupos.length === 0 ? (
        <div className="mt-12 border-t border-rule pt-10">
          <p className="font-serif text-2xl text-navy">No hay webinars {eje ? `de ${ejePorSlug(eje)?.nombre}` : ""} en esta vista.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => actualizar("todos", eje)} className="rounded-sm border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:border-navy">
              Ver todos los estados
            </button>
            {eje && (
              <button type="button" onClick={() => actualizar(filtro, null)} className="rounded-sm border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:border-navy">
                Quitar el filtro de eje
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          {grupos.map((g) => (
            <section key={g.mes} aria-label={g.mes} className="mt-10 first:mt-0">
              <h3 className="mb-2 font-display text-3xl text-navy/70 italic">{g.mes}</h3>
              <ol>
                {g.items.map(({ w, estado }) => (
                  <FilaWebinar key={w.slug} w={w} estado={estado} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function FilaWebinar({ w, estado }: { w: WebinarResumen; estado: Estado }) {
  const href = `/programa-academico/${w.slug}`;
  const pasado = estado === "pasado";
  return (
    <li
      style={{ viewTransitionName: `w-${w.slug}` }}
      className="revelar group relative grid grid-cols-[4rem_1fr] gap-x-5 border-t border-rule py-7 sm:grid-cols-[5.5rem_1fr] lg:grid-cols-[6.5rem_1fr_5.5rem_12rem] lg:gap-x-8"
    >
      <time dateTime={new Date(w.start).toISOString()} className={`flex flex-col ${pasado ? "text-muted" : "text-navy"}`}>
        <span className="tnum font-display text-5xl leading-[0.82] lg:text-6xl">{fechaDia(w.start)}</span>
        <span className="mt-2 text-sm font-semibold">{fechaMes(w.start)}</span>
        <span className="tnum text-xs text-muted">{horaBogota(w.start)} h</span>
      </time>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <EstadoBadge estado={estado} />
          {w.ejes.map((e) => (
            <EjeTag key={e} slug={e} />
          ))}
        </div>
        <h4 className="mt-3 font-serif text-xl leading-snug text-balance text-navy lg:text-[1.4rem]">
          <Link href={href} className="decoration-blue/40 decoration-1 underline-offset-4 group-hover:underline hover:decoration-blue">
            {w.titulo}
          </Link>
        </h4>
        <p className="mt-2 text-sm text-muted">{w.ponentes.map((p) => p.nombre).join(", ")}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {modalidadTexto(w)}
          {w.ejemplo && <EjemploTag />}
        </p>
      </div>

      <Link href={href} tabIndex={-1} aria-hidden className="hidden self-start lg:block">
        <Afiche w={w} size="thumb" className="transition-transform duration-300 ease-[cubic-bezier(.23,1,.32,1)] group-hover:-translate-y-0.5" />
      </Link>

      <div className="col-start-2 mt-5 flex flex-wrap gap-2 lg:col-start-auto lg:mt-0 lg:flex-col lg:justify-center">
        {!pasado && w.inscripcion && (
          <a href={w.inscripcion} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue">
            {estado === "en-vivo" ? "Entrar ahora" : "Inscribirme"}
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">en {w.titulo}</span>
          </a>
        )}
        {pasado && w.grabacion && (
          <a href={w.grabacion} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy">
            <PlayCircle className="size-4" aria-hidden />
            Ver grabación
            <span className="sr-only">de {w.titulo}</span>
          </a>
        )}
        {pasado && !w.grabacion && <span className="px-1 py-2.5 text-xs text-muted">Sin grabación publicada</span>}
      </div>
    </li>
  );
}
