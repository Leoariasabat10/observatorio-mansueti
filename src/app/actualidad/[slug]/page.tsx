import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { siteConfig } from "@site";
import { observatorio } from "@/config/observatorio";
import { getActualidad, getNovedad, PAGINAS } from "@/lib/actualidad";
import { fechaPublicacion } from "@/lib/categorias";
import { paises } from "@/lib/paises";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";

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
    description: n.resumen,
    alternates: { canonical: `/actualidad/${n.slug}` },
    openGraph: { type: "article", title: n.titulo, description: n.resumen, ...(n.imagen && { images: [{ url: n.imagen, alt: n.imagenAlt }] }) },
    ...(n.ejemplo && { robots: { index: false, follow: true } }),
  };
}

export default async function NovedadPage({ params }: PageProps<"/actualidad/[slug]">) {
  const n = getNovedad((await params).slug);
  if (!n) notFound();
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
            <p className="text-sm text-muted">
              <time dateTime={n.fecha}>{fechaPublicacion(n.fecha)}</time>
              {n.pais && <span> · {paises[n.pais].nombre}</span>}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] text-balance text-navy">{n.titulo}</h1>
            {n.autor && (
              <p className="mt-6 text-lg text-navy">
                {n.autor}
                {(n.cargo || n.institucion) && <span className="text-muted"> ({[n.cargo, n.institucion].filter(Boolean).join(", ")})</span>}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {n.eje && <EjeTag slug={n.eje} />}
              {n.ejemplo && <EjemploTag />}
            </div>
            <a href={n.urlOriginal} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
              <ExternalLink className="size-4" aria-hidden />
              Ver la publicación original
            </a>
          </div>
          {n.imagen && (
            <figure className="lg:col-span-5">
              <Image src={n.imagen} alt={n.imagenAlt ?? ""} width={800} height={1000} sizes="(min-width: 1024px) 460px, 92vw" className="w-full max-w-sm rounded-sm border border-rule lg:max-w-none" priority />
              {n.credito && <figcaption className="mt-2 text-xs text-muted">{n.credito}</figcaption>}
            </figure>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="max-w-[38em] font-serif text-xl leading-relaxed text-navy">{n.resumen}</p>
        {n.html.trim() && <div className="prosa mt-8 max-w-[38em]" dangerouslySetInnerHTML={{ __html: n.html }} />}
        <p className="mt-12 max-w-[38em] border-t border-rule pt-4 text-sm text-muted">Fuente: {PAGINAS[n.pagina]}. Texto reproducido de la publicación original.</p>
      </div>
    </article>
  );
}
