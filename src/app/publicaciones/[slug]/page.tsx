import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, FileDown, Share2 } from "lucide-react";
import { siteConfig } from "@site";
import { observatorio } from "@/config/observatorio";
import { categoriaPorSlug, fechaPublicacion, tamano } from "@/lib/categorias";
import { ejePorSlug } from "@/lib/ejes";
import { getPublicacion, getPublicaciones, type Publicacion } from "@/lib/publicaciones";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";

export function generateStaticParams() {
  return getPublicaciones().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/publicaciones/[slug]">): Promise<Metadata> {
  const p = getPublicacion((await params).slug);
  if (!p) return {};
  return {
    title: p.titulo,
    description: p.resumen,
    alternates: { canonical: `/publicaciones/${p.slug}` },
    openGraph: { type: "article", title: p.titulo, description: p.resumen, ...(p.portada && { images: [{ url: p.portada, alt: p.portadaAlt }] }) },
    ...(p.ejemplo && { robots: { index: false, follow: true } }),
  };
}

function jsonLd(p: Publicacion) {
  const url = `${siteConfig.url}/publicaciones/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: p.titulo,
    abstract: p.resumen,
    datePublished: p.fecha,
    inLanguage: "es",
    url,
    genre: categoriaPorSlug(p.categoria)?.singular,
    about: p.ejes.map((e) => ejePorSlug(e)?.nombre),
    author: p.autores.map((a) => ({ "@type": "Person", name: a.nombre, ...(a.institucion && { affiliation: a.institucion }) })),
    publisher: { "@type": "Organization", name: observatorio.name, url: siteConfig.url },
    ...(p.pdf && { encoding: { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: `${siteConfig.url}${p.pdf}` } }),
    ...(p.portada && { image: `${siteConfig.url}${p.portada}` }),
  };
}

export default async function PublicacionPage({ params }: PageProps<"/publicaciones/[slug]">) {
  const p = getPublicacion((await params).slug);
  if (!p) notFound();
  const cat = categoriaPorSlug(p.categoria)!;
  const url = `${siteConfig.url}/publicaciones/${p.slug}`;
  const compartir = `https://wa.me/?text=${encodeURIComponent(`${p.titulo}. ${url}`)}`;
  const relacionadas = getPublicaciones()
    .filter((o) => o.slug !== p.slug && o.ejes.some((e) => p.ejes.includes(e)))
    .slice(0, 3);
  const boton = "inline-flex items-center gap-2 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy";

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p)).replace(/</g, "\\u003c") }} />

      <header className="border-b border-rule bg-card">
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <Link href="/publicaciones" className="inline-flex items-center gap-1 text-sm font-medium text-blue hover:underline">
            <ChevronLeft className="size-4" aria-hidden />
            Publicaciones y Boletines
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 pb-14 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-20">
          <div className="lg:col-span-8">
            <p className="text-sm font-semibold text-blue">
              <Link href={`/publicaciones?categoria=${cat.slug}`} className="hover:underline">
                {cat.singular}
              </Link>
              {p.numero != null && <span className="tnum"> n.º {p.numero}</span>}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] text-balance text-navy">{p.titulo}</h1>
            <p className="mt-6 text-lg text-navy">
              {p.autores.map((a, i) => (
                <span key={a.nombre}>
                  {i > 0 && ", "}
                  {a.nombre}
                  {a.institucion && <span className="text-muted"> ({a.institucion})</span>}
                </span>
              ))}
            </p>
            <p className="mt-1 text-muted">
              <time dateTime={p.fecha}>{fechaPublicacion(p.fecha)}</time>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {p.ejes.map((e) => (
                <EjeTag key={e} slug={e} />
              ))}
              {p.ejemplo && <EjemploTag />}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.pdf ? (
                <a href={p.pdf} download className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue">
                  <FileDown className="size-4" aria-hidden />
                  Descargar PDF, {tamano(p.pdfKB!)}
                </a>
              ) : (
                <span className="rounded-sm border border-dashed border-muted/40 px-4 py-3 text-sm font-semibold text-muted">PDF pendiente</span>
              )}
              {p.enlace && (
                <a href={p.enlace} target="_blank" rel="noopener" className={boton}>
                  <ExternalLink className="size-4" aria-hidden />
                  Ver fuente original
                </a>
              )}
              <a href={compartir} target="_blank" rel="noopener" className={boton}>
                <Share2 className="size-4" aria-hidden />
                Compartir por WhatsApp
              </a>
            </div>
          </div>

          {p.portada && (
            <div className="lg:col-span-4">
              <Image src={p.portada} alt={p.portadaAlt ?? ""} width={600} height={800} sizes="(min-width: 1024px) 380px, 90vw" className="w-full max-w-xs rounded-sm border border-rule lg:max-w-none" priority />
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <section aria-labelledby="resumen" className="lg:col-span-8">
          <h2 id="resumen" className="eyebrow text-blue">
            Resumen
          </h2>
          <p className="mt-6 max-w-[38em] font-serif text-xl leading-relaxed text-navy">{p.resumen}</p>
          <div className="prosa mt-8 max-w-[38em]" dangerouslySetInnerHTML={{ __html: p.html }} />
        </section>

        <aside aria-label="Ficha" className="lg:col-span-4">
          <dl className="graticula rounded-sm border border-rule bg-card p-6 text-sm">
            {[
              ["Tipo", `${cat.singular}${p.numero != null ? ` n.º ${p.numero}` : ""}`],
              ["Fecha", fechaPublicacion(p.fecha)],
              ["Ejes", p.ejes.map((e) => ejePorSlug(e)?.nombre).join(", ")],
              ["Autoría", p.autores.map((a) => a.nombre).join(", ")],
              ["Editor", observatorio.shortName],
            ].map(([k, v]) => (
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
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <h2 id="relacionadas" className="font-display text-3xl text-navy">
              Del mismo eje
            </h2>
            <ul className={`mt-8 grid gap-px border border-rule bg-rule ${["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"][relacionadas.length]}`}>
              {relacionadas.map((o) => (
                <li key={o.slug} className="bg-card">
                  <Link href={`/publicaciones/${o.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-paper">
                    <span className="text-sm font-semibold text-blue">{categoriaPorSlug(o.categoria)?.singular}</span>
                    <span className="font-serif text-xl leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">{o.titulo}</span>
                    <span className="mt-auto text-xs text-muted">{fechaPublicacion(o.fecha)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
