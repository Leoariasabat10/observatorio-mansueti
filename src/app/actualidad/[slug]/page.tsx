import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ExternalLink } from "lucide-react";
import { siteConfig } from "@site";
import { observatorio } from "@/config/observatorio";
import { getActualidad, getNovedad, PAGINAS } from "@/lib/actualidad";
import { fechaPublicacion } from "@/lib/categorias";
import { ejePorSlug } from "@/lib/ejes";
import { paises } from "@/lib/paises";
import { EjemploTag, EjeTag, EventoRealizadoTag } from "@/components/webinar/Etiquetas";

export function generateStaticParams() {
  const todas = getActualidad();
  // Static export needs at least one param; with no entries the placeholder slug renders a 404.
  return todas.length ? todas.map((n) => ({ slug: n.slug })) : [{ slug: "_vacio" }];
}

export async function generateMetadata({ params }: PageProps<"/actualidad/[slug]">): Promise<Metadata> {
  const n = getNovedad((await params).slug);
  if (!n) return {};
  return {
    title: n.titulo,
    description: n.extracto,
    alternates: { canonical: `/actualidad/${n.slug}` },
    openGraph: { type: "article", title: n.titulo, description: n.extracto, ...(n.imagen && { images: [{ url: n.imagen, alt: n.imagenAlt }] }) },
    ...(n.ejemplo && { robots: { index: false, follow: true } }),
  };
}

export default async function NovedadPage({ params }: PageProps<"/actualidad/[slug]">) {
  const slug = (await params).slug;
  const n = getNovedad(slug);
  if (!n) notFound();
  const todas = getActualidad(); // newest first
  const i = todas.findIndex((x) => x.slug === slug);
  const mas = todas[i - 1]; // newer
  const menos = todas[i + 1]; // older
  const relacionadas = todas.filter((o) => o.slug !== slug && ((n.eje && o.eje === n.eje) || (n.pais && o.pais === n.pais))).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: n.titulo,
    datePublished: n.fecha,
    inLanguage: "es",
    url: `${siteConfig.url}/actualidad/${n.slug}`,
    publisher: { "@type": "Organization", name: observatorio.name, url: siteConfig.url },
    ...(n.autor && { author: { "@type": "Person", name: n.autor, ...(n.institucion && { affiliation: n.institucion }) } }),
    ...(n.imagen && { image: `${siteConfig.url}${n.imagen}` }),
  };
  const ficha: [string, React.ReactNode][] = [
    ["Fecha", fechaPublicacion(n.fecha)],
    ...(n.pais ? [["País", paises[n.pais].nombre] as [string, string]] : []),
    ...(n.eje ? [["Eje", ejePorSlug(n.eje)?.nombre] as [string, string | undefined]] : []),
    ...(n.autor ? [["Autoría", [n.autor, n.cargo, n.institucion].filter(Boolean).join(", ")] as [string, string]] : []),
    [
      "Fuente",
      <a key="f" href={n.urlOriginal} target="_blank" rel="noopener" className="enlace inline-flex items-center gap-1.5">
        {PAGINAS[n.pagina]}
        <ExternalLink className="size-3.5" aria-hidden />
      </a>,
    ],
    ...(n.credito ? [["Imagen", n.credito] as [string, string]] : []),
    ["Texto", "Reproducido de la publicación original."],
  ];
  const largo = n.titulo.length > 85;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="border-b border-rule bg-card">
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <Link href="/actualidad" className="inline-flex items-center gap-1 text-sm font-medium text-blue hover:underline">
            <ChevronLeft className="size-4" aria-hidden />
            Actualidad
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 pb-14 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="tnum text-sm text-muted">
              <time dateTime={n.fecha}>{fechaPublicacion(n.fecha)}</time>
              {n.pais && <span> · {paises[n.pais].nombre}</span>}
            </p>
            <h1 className={`mt-4 font-display leading-[1.04] text-balance text-navy ${largo ? "text-[clamp(1.9rem,3.6vw,3rem)]" : "text-[clamp(2.25rem,5vw,4rem)]"}`}>{n.titulo}</h1>
            {n.autor && (
              <p className="mt-6 text-lg text-navy">
                {n.autor}
                {(n.cargo || n.institucion) && <span className="text-muted"> ({[n.cargo, n.institucion].filter(Boolean).join(", ")})</span>}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {n.eje && <EjeTag slug={n.eje} />}
              {n.eventoRealizado && <EventoRealizadoTag />}
              {n.ejemplo && <EjemploTag />}
            </div>
            <a href={n.urlOriginal} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
              <ExternalLink className="size-4" aria-hidden />
              Ver la publicación original
            </a>
          </div>
          {n.imagen && (
            <figure className="lg:col-span-5">
              <Image src={n.imagen} alt={n.imagenAlt ?? ""} width={900} height={900} sizes="(min-width: 1024px) 460px, 92vw" priority className="h-auto w-full max-w-sm rounded-sm border border-rule lg:max-w-none" />
              {n.credito && <figcaption className="mt-2 max-w-sm text-xs leading-relaxed text-muted">{n.credito}</figcaption>}
            </figure>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <section aria-label="Texto" className="lg:col-span-8">
          <p className="max-w-[38em] font-serif text-xl leading-relaxed text-navy">{n.resumen}</p>
          {n.html.trim() && <div className="prosa mt-8 max-w-[38em]" dangerouslySetInnerHTML={{ __html: n.html }} />}
        </section>
        <aside aria-label="Ficha" className="lg:col-span-4">
          <dl className="graticula rounded-sm border border-rule bg-card p-6 text-sm">
            {ficha.map(([k, v]) => (
              <div key={k} className="border-b border-rule py-3 first:pt-0 last:border-0 last:pb-0">
                <dt className="text-muted">{k}</dt>
                <dd className="mt-0.5 font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {relacionadas.length > 0 && (
        <section aria-labelledby="relacionadas" className="border-t border-rule bg-card">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
            <h2 id="relacionadas" className="font-display text-3xl text-navy">
              Más de la misma región o eje
            </h2>
            <ul className="mt-8 grid gap-px border border-rule bg-rule md:grid-cols-3">
              {relacionadas.map((o) => (
                <li key={o.slug} className="bg-card">
                  <Link href={`/actualidad/${o.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-paper">
                    <span className="tnum text-xs text-muted">
                      {fechaPublicacion(o.fecha)}
                      {o.pais && ` · ${paises[o.pais].nombre}`}
                    </span>
                    <span className="font-serif text-xl leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">{o.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <nav aria-label="Entradas contiguas" className="border-t border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-8 sm:grid-cols-2 lg:px-8">
          {menos ? (
            <Link href={`/actualidad/${menos.slug}`} className="group flex items-start gap-3 py-2 pr-6">
              <ArrowLeft className="mt-1 size-4 shrink-0 text-blue" aria-hidden />
              <span>
                <span className="block text-xs text-muted">Anterior</span>
                <span className="font-serif text-lg leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">{menos.titulo}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {mas && (
            <Link href={`/actualidad/${mas.slug}`} className="group flex items-start justify-end gap-3 py-2 text-right sm:pl-6">
              <span>
                <span className="block text-xs text-muted">Siguiente</span>
                <span className="font-serif text-lg leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">{mas.titulo}</span>
              </span>
              <ArrowRight className="mt-1 size-4 shrink-0 text-blue" aria-hidden />
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
