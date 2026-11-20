"use client";

import Image from "next/image";
import Link from "next/link";
import { ejePorSlug } from "@/lib/ejes";
import { paises } from "@/lib/paises";
import type { ActualidadResumen } from "@/lib/actualidad";
import { useFiltrosUrl } from "@/components/ui/useFiltrosUrl";
import { EjemploTag, EjeTag, EventoRealizadoTag } from "@/components/webinar/Etiquetas";

const mes = (f: string) => {
  const t = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${f}T12:00:00Z`));
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const dia = (f: string) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${f}T12:00:00Z`));

function Meta({ n }: { n: ActualidadResumen }) {
  return (
    <p className="tnum text-sm text-muted">
      <time dateTime={n.fecha}>{dia(n.fecha)}</time>
      {n.pais && <span> · {paises[n.pais].nombre}</span>}
    </p>
  );
}

function Etiquetas({ n }: { n: ActualidadResumen }) {
  if (!n.eje && !n.eventoRealizado && !n.ejemplo) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      {n.eje && <EjeTag slug={n.eje} />}
      {n.eventoRealizado && <EventoRealizadoTag />}
      {n.ejemplo && <EjemploTag />}
    </div>
  );
}

function Destacada({ n }: { n: ActualidadResumen }) {
  return (
    <Link href={`/actualidad/${n.slug}`} className="group grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-center">
      {n.imagen && (
        <div className="overflow-hidden rounded-sm border border-rule bg-card lg:col-span-7">
          <Image src={n.imagen} alt={n.imagenAlt ?? ""} width={n.imagenW ?? 1200} height={n.imagenH ?? 800} priority fetchPriority="high" sizes="(min-width: 1024px) 700px, 92vw" className="aspect-[3/2] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transition-none" />
        </div>
      )}
      <div className="lg:col-span-5">
        <h2 className="font-display text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.08] text-balance text-navy group-hover:underline group-hover:decoration-blue/40 group-hover:underline-offset-4">{n.titulo}</h2>
        <div className="mt-4">
          <Meta n={n} />
        </div>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-muted">{n.extracto}</p>
        <Etiquetas n={n} />
      </div>
    </Link>
  );
}

function Tarjeta({ n }: { n: ActualidadResumen }) {
  return (
    <li>
      <Link href={`/actualidad/${n.slug}`} className="group flex h-full flex-col">
        {n.imagen && (
          <div className="overflow-hidden rounded-sm border border-rule bg-card">
            <Image src={n.imagen} alt={n.imagenAlt ?? ""} width={n.imagenW ?? 900} height={n.imagenH ?? 600} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" className="aspect-[3/2] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
          </div>
        )}
        <div className="mt-5">
          <Meta n={n} />
        </div>
        <h3 className="mt-2 font-serif text-[1.375rem] leading-snug text-balance text-navy group-hover:underline group-hover:decoration-blue/40 group-hover:underline-offset-4">{n.titulo}</h3>
        {n.autor && <p className="mt-2 text-sm font-semibold text-navy">{n.autor}</p>}
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">{n.extracto}</p>
        <Etiquetas n={n} />
      </Link>
    </li>
  );
}

const chip = (on: boolean) =>
  `inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-200 ${
    on ? "border-navy bg-navy/[0.06] font-semibold text-navy" : "border-rule text-muted hover:border-navy/40 hover:text-navy"
  }`;

export function ListaActualidad({ novedades }: { novedades: ActualidadResumen[] }) {
  const { params, actualizar } = useFiltrosUrl();
  const paisesUsados = [...new Set(novedades.flatMap((n) => (n.pais ? [n.pais] : [])))].sort((a, b) => paises[a].nombre.localeCompare(paises[b].nombre, "es"));
  const ejesUsados = [...new Set(novedades.flatMap((n) => (n.eje ? [n.eje] : [])))].filter((e) => ejePorSlug(e));
  const pq = params.get("pais");
  const pais = pq && paisesUsados.includes(pq) ? pq : null;
  const eq = params.get("eje");
  const eje = eq && ejesUsados.includes(eq) ? eq : null;

  const visibles = novedades.filter((n) => (!pais || n.pais === pais) && (!eje || n.eje === eje));
  const filtrando = Boolean(pais || eje);
  const primera: ActualidadResumen | undefined = filtrando ? undefined : visibles[0];
  const resto = filtrando ? visibles : visibles.slice(1);
  const grupos = new Map<string, ActualidadResumen[]>();
  for (const n of resto) grupos.set(mes(n.fecha), [...(grupos.get(mes(n.fecha)) ?? []), n]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
      {novedades.length === 0 ? (
        <p className="max-w-xl border-l border-gold pl-5 text-lg text-muted">Aún no hay novedades publicadas. Vuelva pronto.</p>
      ) : (
        <>
          <div className="space-y-3 border-y border-rule py-4" aria-label="Filtros">
            <div role="group" aria-label="Filtrar por país" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
              {[{ slug: null, nombre: "Todos los países" }, ...paisesUsados.map((c) => ({ slug: c, nombre: paises[c].nombre }))].map((c) => (
                <button key={c.slug ?? "todos"} type="button" aria-pressed={pais === c.slug} onClick={() => actualizar({ pais: c.slug })} className={chip(pais === c.slug)}>
                  {c.nombre}
                </button>
              ))}
            </div>
            {ejesUsados.length > 0 && (
              <div role="group" aria-label="Filtrar por eje temático" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
                {[{ slug: null, nombre: "Todos los ejes", color: "" }, ...ejesUsados.map((e) => ejePorSlug(e)!)].map((e) => (
                  <button key={e.slug ?? "todos"} type="button" aria-pressed={eje === e.slug} onClick={() => actualizar({ eje: e.slug })} className={chip(eje === e.slug)}>
                    {e.color && <span aria-hidden className="size-2 rounded-full" style={{ background: e.color }} />}
                    {e.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p role="status" className="tnum mt-5 text-sm text-muted">
            {visibles.length} {visibles.length === 1 ? "entrada" : "entradas"}
            {filtrando && (
              <>
                {" · "}
                <button type="button" onClick={() => actualizar({ pais: null, eje: null })} className="enlace font-semibold text-navy">
                  Quitar filtros
                </button>
              </>
            )}
          </p>

          {visibles.length === 0 && <p className="mt-10 max-w-xl border-l border-gold pl-5 text-lg text-muted">Ninguna entrada coincide con esos filtros.</p>}

          {primera && (
            <div className="mt-12 border-b border-rule pb-14">
              <Destacada n={primera} />
            </div>
          )}

          {[...grupos].map(([etiqueta, items]) => (
            <section key={etiqueta} aria-label={etiqueta} className="mt-14">
              <h2 className="flex items-baseline gap-4 border-b border-navy pb-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-navy">
                {etiqueta}
                <span aria-hidden className="tnum font-sans text-sm font-medium text-muted">
                  {items.length}
                </span>
                <span className="sr-only">, {items.length === 1 ? "1 entrada" : `${items.length} entradas`}</span>
              </h2>
              <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((n) => (
                  <Tarjeta key={n.slug} n={n} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
