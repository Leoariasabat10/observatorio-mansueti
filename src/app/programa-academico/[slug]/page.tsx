import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { CalendarPlus, ChevronLeft, Share2 } from "lucide-react";
import { siteConfig } from "@site";
import { observatorio } from "@/config/observatorio";
import { BUILD_NOW, getWebinar, getWebinars, type Webinar } from "@/lib/content";
import { ejePorSlug } from "@/lib/ejes";
import { paises } from "@/lib/paises";
import { fechaDia, fechaLarga, fechaMes, horaBogota, ics, modalidadTexto } from "@/lib/webinar-time";
import { Afiche } from "@/components/webinar/Afiche";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";
import { HoraLocal } from "@/components/webinar/HoraLocal";
import { PanelEstado } from "@/components/webinar/PanelEstado";

export function generateStaticParams() {
  return getWebinars().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programa-academico/[slug]">): Promise<Metadata> {
  const w = getWebinar((await params).slug);
  if (!w) return {};
  return {
    title: w.titulo,
    description: w.resumen,
    alternates: { canonical: `/programa-academico/${w.slug}` },
    openGraph: { type: "article", title: w.titulo, description: w.resumen, ...(w.afiche && { images: [{ url: w.afiche, alt: w.aficheAlt }] }) },
    // Sample content must never be indexed as a real event.
    ...(w.ejemplo && { robots: { index: false, follow: true } }),
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function jsonLd(w: Webinar) {
  const url = `${siteConfig.url}/programa-academico/${w.slug}`;
  const virtual = { "@type": "VirtualLocation", url: w.inscripcion ?? w.grabacion ?? url };
  const fisico = {
    "@type": "Place",
    name: w.lugar ?? "Bogotá",
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
  };
  const modo = { virtual: "OnlineEventAttendanceMode", presencial: "OfflineEventAttendanceMode", hibrida: "MixedEventAttendanceMode" }[w.modalidad];
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: w.titulo,
    description: w.resumen,
    startDate: `${w.fecha}T${w.hora}:00-05:00`,
    endDate: new Date(w.end).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: `https://schema.org/${modo}`,
    location: w.modalidad === "virtual" ? virtual : w.modalidad === "presencial" ? fisico : [virtual, fisico],
    image: [`${siteConfig.url}${w.afiche ?? "/opengraph-image.jpg"}`],
    url,
    inLanguage: "es",
    organizer: { "@type": "Organization", name: observatorio.name, url: siteConfig.url },
    performer: w.ponentes.map((p) => ({ "@type": "Person", name: p.nombre, ...(p.institucion && { affiliation: p.institucion }) })),
  };
}

export default async function WebinarPage({ params }: PageProps<"/programa-academico/[slug]">) {
  const w = getWebinar((await params).slug);
  if (!w) notFound();
  const { html, ...resumen } = w;
  const url = `${siteConfig.url}/programa-academico/${w.slug}`;
  const calendario = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics({ ...w, url, lugar: w.lugar }))}`;
  const compartir = `https://wa.me/?text=${encodeURIComponent(`${w.titulo}, ${fechaLarga(w.start)} a las ${horaBogota(w.start)} (hora de Bogotá). ${url}`)}`;
  const otros = getWebinars()
    .filter((o) => o.slug !== w.slug && o.ejes.some((e) => w.ejes.includes(e)))
    .slice(-3)
    .reverse();

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(w)).replace(/</g, "\\u003c") }} />

      <header className="border-b border-rule bg-card">
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <Link href="/programa-academico" className="inline-flex items-center gap-1 text-sm font-medium text-blue hover:underline">
            <ChevronLeft className="size-4" aria-hidden />
            Programa académico
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 pb-14 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-20">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {w.ejes.map((e) => (
                <EjeTag key={e} slug={e} />
              ))}
              {w.ejemplo && <EjemploTag />}
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] text-balance text-navy">{w.titulo}</h1>

            <div className="mt-8 flex items-start gap-6 border-t border-rule pt-6">
              <p aria-hidden className="tnum font-display text-6xl leading-[0.8] text-navy">
                {fechaDia(w.start)}
                <span className="mt-2 block text-center font-sans text-sm font-semibold">{fechaMes(w.start)}</span>
              </p>
              <div className="text-navy">
                <p className="text-lg">
                  <time dateTime={new Date(w.start).toISOString()}>
                    {cap(fechaLarga(w.start))}
                    <span className="block font-semibold">
                      <span className="tnum">{horaBogota(w.start)}</span> hora de Bogotá, {w.duracionMin} minutos
                    </span>
                  </time>
                </p>
                <HoraLocal start={w.start} className="mt-1 block text-sm text-blue" />
                <p className="mt-2 text-sm text-muted">{modalidadTexto(w)}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={calendario} download={`${w.slug}.ics`} className="inline-flex items-center gap-2 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
                <CalendarPlus className="size-4" aria-hidden />
                Agregar a mi calendario
              </a>
              <a href={compartir} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-sm border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
                <Share2 className="size-4" aria-hidden />
                Compartir por WhatsApp
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <PanelEstado w={resumen} buildNow={BUILD_NOW} />
            <ViewTransition name={`afiche-${w.slug}`} share="morph" default="none">
              <Afiche w={w} priority className="sombra-larga max-lg:max-w-sm" />
            </ViewTransition>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <section aria-labelledby="sobre" className="lg:col-span-7">
          <h2 id="sobre" className="eyebrow text-blue">
            Sobre el webinar
          </h2>
          <div className="prosa mt-6 max-w-[38em]" dangerouslySetInnerHTML={{ __html: html }} />
        </section>

        <section aria-labelledby="ponentes" className="lg:col-span-5">
          <h2 id="ponentes" className="eyebrow text-blue">
            {w.ponentes.length === 1 ? "Ponente" : "Ponentes"}
          </h2>
          <ul className="mt-6 border-t border-rule">
            {w.ponentes.map((p) => (
              <li key={p.nombre} className="border-b border-rule py-5">
                <p className="font-serif text-xl text-navy">{p.nombre}</p>
                <p className="mt-1 text-sm text-muted">{[p.rol, p.cargo, p.institucion].filter(Boolean).join(", ")}</p>
                <p className="mt-1 text-xs font-semibold text-navy">{paises[p.pais]?.nombre}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {otros.length > 0 && (
        <section aria-labelledby="otros" className="border-t border-rule bg-card">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <h2 id="otros" className="font-display text-3xl text-navy">
              Del mismo eje
            </h2>
            <ul className={`mt-8 grid gap-px border border-rule bg-rule ${["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"][otros.length]}`}>
              {otros.map((o) => (
                <li key={o.slug} className="bg-card">
                  <Link href={`/programa-academico/${o.slug}`} className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-paper">
                    <span className="tnum text-sm font-semibold text-muted">
                      {fechaDia(o.start)} {fechaMes(o.start)}, {horaBogota(o.start)} h
                    </span>
                    <span className="font-serif text-xl leading-snug text-navy group-hover:underline group-hover:decoration-blue/50 group-hover:underline-offset-4">
                      {o.titulo}
                    </span>
                    <span className="mt-auto text-xs text-muted">{o.ejes.map((e) => ejePorSlug(e)?.nombre).join(", ")}</span>
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
