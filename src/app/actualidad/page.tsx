import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getActualidad } from "@/lib/actualidad";
import { fechaPublicacion } from "@/lib/categorias";
import { paises } from "@/lib/paises";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";

export const metadata: Metadata = {
  title: "Actualidad",
  description: "Novedades, eventos y aportes académicos que el Observatorio ASDTSS difunde sobre Derecho del Trabajo y de la Seguridad Social en Sudamérica.",
  alternates: { canonical: "/actualidad" },
};

export default function Actualidad() {
  const novedades = getActualidad();
  return (
    <>
      <section aria-labelledby="actualidad-titulo" className="border-b border-rule bg-card">
        <div className="mx-auto max-w-7xl px-5 pt-14 pb-12 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-16">
          <p className="eyebrow text-blue">Actualidad</p>
          <h1 id="actualidad-titulo" className="mt-8 font-display text-[clamp(3rem,8.6vw,8.25rem)] leading-[0.9] tracking-[-0.025em] text-balance text-navy">
            Lo que ocurre en la región
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Aportes académicos, eventos y noticias institucionales seleccionadas por el Observatorio, con enlace a la publicación original.
          </p>
        </div>
      </section>

      <section aria-label="Novedades" className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          {novedades.length === 0 ? (
            <p className="max-w-xl border-l border-gold pl-5 text-lg text-muted">Aún no hay novedades publicadas. Vuelva pronto.</p>
          ) : (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {novedades.map((n) => (
                <li key={n.slug}>
                  <Link href={`/actualidad/${n.slug}`} className="group block">
                    {n.imagen && (
                      <div className="aspect-[4/5] overflow-hidden rounded-sm border border-rule bg-card">
                        <Image src={n.imagen} alt={n.imagenAlt ?? ""} width={800} height={1000} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
                      </div>
                    )}
                    <p className="mt-5 text-sm text-muted">
                      <time dateTime={n.fecha}>{fechaPublicacion(n.fecha)}</time>
                      {n.pais && <span> · {paises[n.pais].nombre}</span>}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">{n.titulo}</h2>
                    {n.autor && <p className="mt-2 text-sm font-semibold text-navy">{n.autor}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                      {n.eje && <EjeTag slug={n.eje} />}
                      {n.ejemplo && <EjemploTag />}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-16 flex items-center gap-1.5 text-sm text-muted">
            <ArrowUpRight className="size-4" aria-hidden />
            Cada nota enlaza a la publicación original en Facebook.
          </p>
        </div>
      </section>
    </>
  );
}
