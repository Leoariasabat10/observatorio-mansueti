"use client";

import Link from "next/link";
import { FileDown } from "lucide-react";
import { categoriaPorSlug, categorias, fechaPublicacion, tamano } from "@/lib/categorias";
import { ejePorSlug, ejes } from "@/lib/ejes";
import type { PublicacionResumen } from "@/lib/publicaciones";
import { useFiltrosUrl } from "@/components/ui/useFiltrosUrl";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";

export function CatalogoPublicaciones({ publicaciones }: { publicaciones: PublicacionResumen[] }) {
  const { params, actualizar } = useFiltrosUrl();
  const cq = params.get("categoria");
  const categoria = cq && categoriaPorSlug(cq) ? cq : null;
  const jq = params.get("eje");
  const eje = jq && ejePorSlug(jq) ? jq : null;
  const aq = Number(params.get("anio"));
  const anios = [...new Set(publicaciones.map((p) => p.anio))].sort((a, b) => b - a);
  const anio = anios.includes(aq) ? aq : null;

  const base = publicaciones.filter((p) => (!eje || p.ejes.includes(eje)) && (!anio || p.anio === anio));
  const visibles = base.filter((p) => !categoria || p.categoria === categoria);
  const porAnio = new Map<number, PublicacionResumen[]>();
  for (const p of visibles) porAnio.set(p.anio, [...(porAnio.get(p.anio) ?? []), p]);

  return (
    <section aria-labelledby="catalogo-titulo" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
      <p className="eyebrow text-blue">Catálogo</p>
      <h2 id="catalogo-titulo" className="mt-4 font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-navy">
        Todas las publicaciones
      </h2>

      <div className="mt-8 space-y-4 border-y border-rule py-4">
        <div role="group" aria-label="Filtrar por categoría" className="-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: null, nombre: "Todas" }, ...categorias].map((c) => {
            const on = categoria === c.slug;
            const n = c.slug ? base.filter((p) => p.categoria === c.slug).length : base.length;
            return (
              <button
                key={c.slug ?? "todas"}
                type="button"
                aria-pressed={on}
                onClick={() => actualizar({ categoria: c.slug })}
                className={`flex shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                  on ? "bg-navy text-white" : "text-navy hover:bg-card"
                }`}
              >
                {c.nombre}
                <span className={`tnum text-xs font-medium ${on ? "text-white/70" : "text-muted"}`}>{n}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrar por eje temático" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
            {[{ slug: null, nombre: "Todos los ejes", color: "" }, ...ejes].map((e) => {
              const on = eje === e.slug;
              return (
                <button
                  key={e.slug ?? "todos"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => actualizar({ eje: e.slug })}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-200 ${
                    on ? "border-navy bg-navy/[0.06] font-semibold text-navy" : "border-rule text-muted hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {e.color && <span aria-hidden className="size-2 rounded-full" style={{ background: e.color }} />}
                  {e.nombre}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-3 text-sm text-muted">
            Año
            <select
              value={anio ?? ""}
              onChange={(ev) => actualizar({ anio: ev.target.value || null })}
              className="rounded-sm border border-rule bg-card px-3 py-2 text-sm font-semibold text-navy"
            >
              <option value="">Todos</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length === 1 ? "1 publicación" : `${visibles.length} publicaciones`}
      </p>

      {visibles.length === 0 ? (
        <div className="mt-12">
          <p className="font-serif text-2xl text-navy">No hay publicaciones con estos filtros.</p>
          <button
            type="button"
            onClick={() => actualizar({ categoria: null, eje: null, anio: null })}
            className="mt-5 rounded-sm border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:border-navy"
          >
            Quitar los filtros
          </button>
        </div>
      ) : (
        [...porAnio].map(([a, items]) => (
          <section key={a} aria-label={String(a)} className="mt-12">
            <h3 className="tnum font-display text-5xl leading-none text-muted/70">{a}</h3>
            <ol className="mt-4">
              {items.map((p) => (
                <FilaPublicacion key={p.slug} p={p} />
              ))}
            </ol>
          </section>
        ))
      )}
    </section>
  );
}

function FilaPublicacion({ p }: { p: PublicacionResumen }) {
  const cat = categoriaPorSlug(p.categoria)!;
  const href = `/publicaciones/${p.slug}`;
  return (
    <li style={{ viewTransitionName: `p-${p.slug}` }} className="revelar group grid gap-x-8 gap-y-3 border-t border-rule py-7 lg:grid-cols-[11rem_1fr_13rem]">
      <div className="flex items-baseline gap-3 lg:flex-col lg:gap-1">
        <span className="text-sm font-semibold text-blue">
          {cat.singular}
          {p.numero != null && <span className="tnum"> n.º {p.numero}</span>}
        </span>
        <time dateTime={p.fecha} className="text-sm text-muted">
          {fechaPublicacion(p.fecha)}
        </time>
      </div>

      <div className="min-w-0">
        <h4 className="font-serif text-xl leading-snug text-balance text-navy lg:text-[1.4rem]">
          <Link href={href} className="decoration-blue/40 decoration-1 underline-offset-4 group-hover:underline hover:decoration-blue">
            {p.titulo}
          </Link>
        </h4>
        <p className="mt-1.5 text-sm text-navy/80">{p.autores.map((a) => a.nombre).join(", ")}</p>
        <p className="mt-2 line-clamp-2 max-w-[60ch] text-sm text-muted">{p.resumen}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {p.ejes.map((e) => (
            <EjeTag key={e} slug={e} />
          ))}
          {p.ejemplo && <EjemploTag />}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-2 lg:flex-col lg:items-end">
        {p.pdf ? (
          <a
            href={p.pdf}
            download
            className="inline-flex items-center gap-2 rounded-sm bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue"
          >
            <FileDown className="size-4" aria-hidden />
            PDF, {tamano(p.pdfKB!)}
            <span className="sr-only">: {p.titulo}</span>
          </a>
        ) : (
          <span className="rounded-sm border border-dashed border-muted/40 px-3 py-2 text-xs font-semibold text-muted">PDF pendiente</span>
        )}
      </div>
    </li>
  );
}
