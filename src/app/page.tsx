import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@site";
import { asociacion, contact, observatorio, social } from "@/config/observatorio";
import { categoriaPorSlug, fechaPublicacion } from "@/lib/categorias";
import { cifrasInicio } from "@/lib/cifras";
import { BUILD_NOW, resumenes } from "@/lib/content";
import { ejes } from "@/lib/ejes";
import { resumenesPublicaciones } from "@/lib/publicaciones";
import { Mark } from "@/components/brand/Mark";
import { AgendaBreve } from "@/components/inicio/AgendaBreve";
import { LineaDeTiempo } from "@/components/inicio/LineaDeTiempo";
import { ProximoEnLinea } from "@/components/inicio/ProximoEnLinea";
import { Contador } from "@/components/ui/Contador";
import { EjemploTag } from "@/components/webinar/Etiquetas";

const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact.address.join(", ")}`)}`;

const organizacion = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: observatorio.name,
  alternateName: observatorio.shortName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.png`,
  email: contact.email,
  telephone: "+57 314 407 5302",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Carrera 7 # 17-57, oficina 705",
    addressLocality: "Bogotá",
    postalCode: "111221",
    addressCountry: "CO",
  },
  parentOrganization: { "@type": "Organization", name: asociacion.name, alternateName: asociacion.acronym, url: asociacion.url },
  sameAs: [...social.map((s) => s.href), asociacion.facebook],
};

export default function Inicio() {
  const webinars = resumenes();
  const publicaciones = resumenesPublicaciones();
  const cifras = cifrasInicio(webinars, BUILD_NOW);
  const ejemplo = webinars.some((w) => w.ejemplo);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section aria-labelledby="inicio-titulo" className="bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 pb-16 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue">Observatorio de la {asociacion.acronym}</p>
            <h1 id="inicio-titulo" className="mt-6 font-display text-[clamp(2.9rem,6.6vw,5.6rem)] leading-[0.95] tracking-[-0.015em] text-balance text-navy">
              Una bitácora del trabajo en Sudamérica
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Seguimos los eventos, debates y decisiones del Derecho del Trabajo y de la Seguridad Social en Latinoamérica y Colombia, y los ordenamos por
              ejes temáticos.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/programa-academico" className="inline-flex items-center justify-center rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue">
                Ver el programa académico
              </Link>
              <Link href="/publicaciones" className="inline-flex items-center justify-center rounded-sm border border-navy/25 px-6 py-3.5 text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy">
                Publicaciones y boletines
              </Link>
            </div>
            <ProximoEnLinea webinars={webinars} buildNow={BUILD_NOW} />
          </div>

          <figure className="mx-auto w-full max-w-[13rem] sm:max-w-xs lg:col-span-5 lg:max-w-none">
            <Mark className="h-auto w-full" priority large />
            <figcaption className="mt-4 text-center font-serif text-lg text-heritage italic sm:text-xl">«{observatorio.honoree}»</figcaption>
          </figure>
        </div>
      </section>

      {/* Featured figures */}
      <section aria-labelledby="cifras-inicio" className="graticula-inv relative bg-navy text-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <div className="revelar grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-gold">El Observatorio en cifras</p>
              <h2 id="cifras-inicio" className="mt-4 font-display text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] text-balance">
                Lo que el programa ha reunido hasta hoy
              </h2>
            </div>
            <div className="text-sm text-paper/75 lg:col-span-5">
              <p>Cada cifra indica su fuente y su fecha. Las que aún no tienen fuente aparecen como dato pendiente.</p>
              {ejemplo && <EjemploTag inverse className="mt-3" />}
            </div>
          </div>

          <dl className="revelar-hijos mt-12 grid grid-cols-2 gap-px border-y border-paper/15 bg-paper/15 lg:grid-cols-3">
            {cifras.map((c) => (
              <div key={c.label} className="flex flex-col gap-3 bg-navy px-3 py-7 sm:px-6 sm:py-8 lg:[&:nth-child(3n+1)]:pl-0 max-lg:[&:nth-child(odd)]:pl-0">
                <dt className="order-2 text-sm text-paper/90 sm:text-[0.9375rem]">{c.label}</dt>
                <dd className="order-3 -mt-2 text-[0.6875rem] leading-snug text-paper/55 sm:text-xs">
                  {c.fuente ? `Fuente: ${c.fuente}${c.fecha ? `, ${fechaCorta(c.fecha)}` : ""}${c.ejemplo ? " (datos de ejemplo)" : ""}` : "Fuente pendiente"}
                </dd>
                <dd className="order-1 font-display text-[clamp(2.9rem,7vw,5.25rem)] leading-[0.85] text-gold">
                  {c.valor == null ? (
                    <span className="inline-block rounded-sm border border-dashed border-gold/50 px-2.5 py-1 font-sans text-sm font-semibold">Dato pendiente</span>
                  ) : (
                    <Contador valor={c.valor} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="linea-tiempo" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <div className="revelar grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow text-blue">Bitácora</p>
            <h2 id="linea-tiempo" className="mt-4 font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-navy">
              El programa en el tiempo
            </h2>
          </div>
          <p className="max-w-md text-muted lg:col-span-6 lg:justify-self-end">
            Cada punto es un webinar. El color indica su eje y el relleno, si ya se realizó. Seleccione un punto para abrir la sesión.
          </p>
        </div>
        <div className="mt-10">
          <LineaDeTiempo webinars={webinars} buildNow={BUILD_NOW} />
        </div>
      </section>

      {/* Mission and axes */}
      <section aria-labelledby="mision" className="border-y border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-blue">Qué es el Observatorio</p>
            <h2 id="mision" className="mt-5 font-display text-[clamp(2.25rem,4.4vw,3.6rem)] leading-[1.02] text-balance text-navy lg:sticky lg:top-28">
              Un telescopio sobre el trabajo en la región
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div className="revelar max-w-[36em] space-y-5 text-[1.0625rem] leading-relaxed text-navy">
              <p>
                El Observatorio de la {asociacion.name} sigue los eventos, debates y decisiones que marcan el mundo del trabajo en Latinoamérica y en
                Colombia, y los registra en una bitácora abierta.
              </p>
              <p className="text-muted">
                Su programa académico reúne a especialistas de distintos países en webinars periódicos. Sus publicaciones ordenan el análisis por ejes
                temáticos.
              </p>
              <p className="text-muted">
                Lleva el nombre de {observatorio.honoree}.{" "}
                <span className="rounded-sm border border-dashed border-heritage/50 px-1.5 py-0.5 text-xs font-semibold text-heritage">Reseña pendiente</span>
              </p>
            </div>

            <h3 className="mt-14 text-sm font-semibold text-navy">Ejes temáticos</h3>
            <ul className="revelar-hijos mt-4 border-t border-rule">
              {ejes.map((e) => (
                <li key={e.slug} className="border-b border-rule">
                  <Link href={`/programa-academico?eje=${e.slug}`} className="group flex items-center gap-4 py-4">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: e.color }} />
                    <span className="font-serif text-xl text-navy">{e.nombre}</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-blue transition-transform duration-200 group-hover:translate-x-0.5">
                      Ver webinars
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Ejes provisionales, en revisión por el equipo del Observatorio.</p>
          </div>
        </div>
      </section>

      {/* Agenda + publications */}
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <section aria-labelledby="agenda" className="lg:col-span-7">
          <div className="flex items-end justify-between gap-6">
            <h2 id="agenda" className="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] text-navy">
              Agenda
            </h2>
            <Link href="/programa-academico" className="text-sm font-semibold text-blue hover:underline">
              Todo el programa
            </Link>
          </div>
          <div className="mt-6">
            <AgendaBreve webinars={webinars} buildNow={BUILD_NOW} />
          </div>
        </section>

        <section aria-labelledby="publicaciones-inicio" className="lg:col-span-5">
          <div className="flex items-end justify-between gap-6">
            <h2 id="publicaciones-inicio" className="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] text-navy">
              Publicaciones
            </h2>
            <Link href="/publicaciones" className="text-sm font-semibold text-blue hover:underline">
              Ver todas
            </Link>
          </div>
          {publicaciones.length ? (
            <ul className="revelar-hijos graticula mt-6 rounded-sm border border-rule bg-card px-6">
              {publicaciones.slice(0, 3).map((p) => (
                <li key={p.slug} className="border-b border-rule last:border-0">
                  <Link href={`/publicaciones/${p.slug}`} className="group block py-5">
                    <span className="text-xs font-semibold text-blue">
                      {categoriaPorSlug(p.categoria)?.singular}, {fechaPublicacion(p.fecha)}
                    </span>
                    <span className="mt-1.5 block font-serif text-lg leading-snug text-navy decoration-blue/40 underline-offset-4 group-hover:underline">{p.titulo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="graticula mt-6 rounded-sm border border-rule bg-card p-7">
              <p className="font-serif text-xl leading-snug text-navy">Los primeros boletines y documentos de trabajo se publicarán aquí.</p>
              <Link href="/publicaciones" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline">
                Ir a Publicaciones y Boletines
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Contact */}
      <section aria-labelledby="escribanos" className="border-t border-rule bg-paper">
        <div className="revelar mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:px-8">
          <div className="lg:col-span-6">
            <p className="eyebrow text-blue">Contacto</p>
            <h2 id="escribanos" className="mt-4 font-display text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] text-navy">
              Escríbanos
            </h2>
            <address className="mt-6 text-lg leading-relaxed text-navy not-italic">
              {contact.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:flex-nowrap lg:justify-end">
            <a href={contact.whatsapp} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue">
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp {contact.phoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center justify-center gap-2 rounded-sm border border-navy/30 px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
              <Mail className="size-4" aria-hidden />
              Correo
            </a>
            <a href={mapa} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-sm border border-navy/30 px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-navy">
              <MapPin className="size-4" aria-hidden />
              Cómo llegar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
