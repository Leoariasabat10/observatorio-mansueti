import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { paises } from "@/lib/paises";
import { fechaPublicacion } from "@/lib/categorias";
import type { Edicion } from "@/lib/latitud";

export function Masthead({ nombre }: { nombre?: string }) {
  return (
    <header className="border-b-4 border-double border-navy bg-card">
      <div className="mx-auto max-w-7xl px-5 pt-10 pb-8 text-center lg:px-8 lg:pt-14 lg:pb-10">
        <h1 className="font-display text-[clamp(2.4rem,8vw,7rem)] leading-[0.92] tracking-[-0.02em] text-navy uppercase">Latitud Sudamericana</h1>
        <p className="mt-3 font-serif text-[clamp(1.1rem,2.2vw,1.6rem)] tracking-[0.18em] text-heritage uppercase">Pensamiento Jurídico</p>
        {nombre && <p className="sr-only">{nombre}</p>}
      </div>
      <div className="border-t border-navy">
        <p className="mx-auto max-w-7xl px-5 py-2.5 text-center text-xs tracking-wide text-muted uppercase lg:px-8">Derecho del Trabajo y de la Seguridad Social en Sudamérica · Magazine digital de la ASDTSS</p>
      </div>
    </header>
  );
}

export function EdicionVista({ e, otras }: { e: Edicion; otras: Edicion[] }) {
  return (
    <div className="bg-paper">
      <section aria-labelledby="edicion" className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="tnum text-sm font-semibold tracking-wide text-heritage uppercase">{e.etiqueta}</p>
          <h2 id="edicion" className="mt-3 font-display text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.05] text-balance text-navy">
            {e.titulo}
          </h2>
          {e.fecha && (
            <p className="mt-4 text-muted">
              Publicada el <time dateTime={e.fecha}>{fechaPublicacion(e.fecha)}</time>
            </p>
          )}
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            {e.articulos.length} {e.articulos.length === 1 ? "pieza" : "piezas"}, una por país. El magazine se propone difundir cada semana artículos, análisis y reflexiones sobre el pensamiento jurídico sudamericano.
          </p>
        </div>
        <figure className="lg:col-span-7">
          <Image src={e.portada} alt={`Portada de ${e.etiqueta.toLowerCase()} de Latitud Sudamericana: Pensamiento Jurídico, «${e.titulo}».`} width={e.portadaW} height={e.portadaH} priority sizes="(min-width: 1024px) 700px, 92vw" style={{ maxWidth: e.portadaW }} className="h-auto w-full rounded-sm border border-rule" />
        </figure>
      </section>

      <section aria-labelledby="piezas" className="border-t-2 border-navy bg-card">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <h2 id="piezas" className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-navy">
            En esta edición
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {e.articulos.map((a) => (
              <li key={a.pais}>
                <article>
                  <a href={a.imagen} target="_blank" rel="noopener" aria-label={`Abrir la lámina de ${paises[a.pais].nombre} en tamaño completo (se abre en una pestaña nueva)`} className="block overflow-hidden rounded-sm border border-rule">
                    <Image src={a.imagen} alt={`Lámina de ${paises[a.pais].nombre}: ${a.titulo}. El texto completo está en la imagen.`} width={1599} height={899} sizes="(min-width: 768px) 560px, 92vw" className="h-auto w-full" />
                  </a>
                  <p className="mt-4 text-sm font-semibold tracking-wide text-heritage uppercase">{paises[a.pais].nombre}</p>
                  <h3 className="mt-1 font-serif text-[1.5rem] leading-snug text-balance text-navy">{a.titulo}</h3>
                  {a.autor && <p className="mt-1 text-sm text-muted">Por {a.autor}</p>}
                  {a.resumen && <p className="mt-2 leading-relaxed text-muted">{a.resumen}</p>}
                  <a href={a.enlace ?? a.imagen} target="_blank" rel="noopener" className="enlace mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                    {a.enlace ? "Leer el artículo completo" : "Ver la lámina completa"}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {otras.length > 0 && (
        <nav aria-labelledby="anteriores" className="border-t border-rule">
          <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
            <h2 id="anteriores" className="font-display text-2xl text-navy">
              Otras ediciones
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {otras.map((o) => (
                <li key={o.slug}>
                  <Link href={`/latitud-sudamericana/${o.slug}`} className="enlace font-semibold text-navy">
                    {o.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}

export function SinEdiciones() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <p className="max-w-xl border-l border-gold pl-5 font-display text-3xl leading-tight text-navy">La primera edición semanal estará disponible próximamente.</p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">Latitud Sudamericana se propone difundir cada semana artículos, análisis y reflexiones sobre el pensamiento jurídico sudamericano, con énfasis en Derecho del Trabajo y Seguridad Social.</p>
      </div>
    </div>
  );
}
