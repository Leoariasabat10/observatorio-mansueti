import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@site";
import { asociacion, contact, observatorio, social } from "@/config/observatorio";
import { categoriaPorSlug, fechaPublicacion } from "@/lib/categorias";
import { cifrasInicio } from "@/lib/cifras";
import { BUILD_NOW, resumenes } from "@/lib/content";
import { ejes } from "@/lib/ejes";
import { paises } from "@/lib/paises";
import { resumenesPublicaciones } from "@/lib/publicaciones";
import { AgendaBreve } from "@/components/inicio/AgendaBreve";
import { BarrasEjes } from "@/components/inicio/BarrasEjes";
import { LineaDeTiempo } from "@/components/inicio/LineaDeTiempo";
import { MapaPonentes } from "@/components/mapa/MapaPonentes";
import { Globo } from "@/components/inicio/Globo";
import { ProximaObservacion } from "@/components/inicio/ProximaObservacion";
import { Contador } from "@/components/ui/Contador";

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
  const ponentesPais = new Map(webinars.flatMap((w) => w.ponentes).map((p) => [p.nombre, p.pais]));
  const porPais = new Map<string, number>();
  for (const p of ponentesPais.values()) porPais.set(p, (porPais.get(p) ?? 0) + 1);
  const conteoPaises = [...porPais].map(([codigo, ponentes]) => ({ codigo, ponentes })).sort((x, y) => y.ponentes - x.ponentes);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion).replace(/</g, "\\u003c") }} />

      {/* Hero: the one signature moment of the page */}
      <section aria-labelledby="inicio-titulo" className="noche grano relative overflow-hidden text-paper">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative z-10 pt-16 pb-6 sm:pt-24 lg:max-w-[46rem] lg:pt-32 lg:pb-24">
            <p className="eyebrow text-gold">Observatorio de la {asociacion.acronym}</p>
            <h1 id="inicio-titulo" className="mt-8 font-display text-[clamp(3rem,8vw,7.75rem)] leading-[0.9] font-medium tracking-[-0.025em] text-balance">
              Una bitácora del trabajo en Sudamérica
            </h1>
            <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-paper/80">
              Seguimos los eventos, debates y decisiones del Derecho del Trabajo y de la Seguridad Social en Latinoamérica y Colombia, y los ordenamos por
              ejes temáticos.
            </p>
            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href="/programa-academico" className="inline-flex items-center gap-3 rounded-sm bg-paper px-6 py-3.5 text-sm font-semibold text-navy hover:bg-white">
                Ver el programa académico
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/publicaciones" className="enlace text-sm font-semibold text-paper">
                Publicaciones y boletines
              </Link>
            </div>
          </div>

          <div className="pointer-events-none relative -mx-[18%] -mt-4 -mb-[22%] sm:-mx-[8%] lg:absolute lg:inset-y-0 lg:right-[-14%] lg:m-0 lg:flex lg:w-[min(58rem,66vw)] lg:items-center">
            <Globo className="h-auto w-full" />
          </div>
        </div>

        <div className="relative z-10 border-t border-paper/15">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <ProximaObservacion webinars={webinars} buildNow={BUILD_NOW} />
          </div>
        </div>
      </section>

      {/* Featured figures: numbers as the graphic element */}
      <section aria-labelledby="cifras-inicio" className="bg-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
          <div className="revelar flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="cifras-inicio" className="max-w-xl font-display text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02] text-balance text-navy">
              Lo que el programa ha reunido hasta hoy
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Cada cifra indica su fuente y su fecha. Las que aún no tienen fuente se muestran como dato pendiente.
              {ejemplo && " Las tres primeras se calculan con el contenido de ejemplo."}
            </p>
          </div>

          <dl className="revelar-hijos mt-16 grid border-t border-navy sm:grid-cols-3">
            {cifras
              .filter((c) => c.valor != null)
              .map((c) => (
                <div key={c.label} className="flex flex-col border-b border-rule py-8 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0">
                  <dd className="order-1 font-display text-[clamp(5rem,11vw,9.5rem)] leading-[0.78] tracking-[-0.03em] text-navy">
                    <Contador valor={c.valor!} />
                  </dd>
                  <dt className="order-2 mt-6 text-base font-medium text-navy">{c.label}</dt>
                  <dd className="order-3 mt-1.5 text-xs leading-snug text-muted">
                    {c.fuente}
                    {c.fecha ? `, ${fechaCorta(c.fecha)}` : ""}
                    {c.ejemplo ? " (datos de ejemplo)" : ""}
                  </dd>
                </div>
              ))}
          </dl>

          <dl className="mt-4 grid gap-x-8 border-t border-rule sm:grid-cols-3">
            {cifras
              .filter((c) => c.valor == null)
              .map((c) => (
                <div key={c.label} className="flex items-baseline justify-between gap-4 border-b border-rule py-4">
                  <dt className="text-sm text-navy">{c.label}</dt>
                  <dd className="shrink-0 text-xs font-semibold text-muted">Dato pendiente</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      {/* Observatory dashboard */}
      <section aria-labelledby="tablero" className="diferido graticula border-y border-rule bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-blue">Tablero</p>
              <h2 id="tablero" className="titular mt-5 max-w-2xl font-display text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02] text-balance text-navy">
                El programa, observado
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Calendario, temas y procedencia de los ponentes, calculados con el contenido publicado en este sitio.
              {ejemplo && " Hoy muestra contenido de ejemplo."}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="revelar min-w-0 rounded-sm border border-rule bg-card p-6 sm:p-8 lg:col-span-12">
              <h3 className="text-sm font-semibold text-navy">Línea de tiempo</h3>
              <p className="mt-1 text-xs text-muted">Cada punto es un webinar: relleno si ya se realizó, con anillo si está por venir. Seleccione uno para abrirlo.</p>
              <div className="mt-8">
                <LineaDeTiempo webinars={webinars} buildNow={BUILD_NOW} />
              </div>
            </div>

            <div className="revelar min-w-0 rounded-sm border border-rule bg-card p-6 sm:p-8 lg:col-span-5">
              <h3 className="text-sm font-semibold text-navy">Actividad por eje</h3>
              <p className="mt-1 mb-8 text-xs text-muted">Webinars y publicaciones que tratan cada eje.</p>
              <BarrasEjes items={[...webinars, ...publicaciones]} />
            </div>

            <figure className="revelar min-w-0 rounded-sm border border-rule bg-card p-6 sm:p-8 lg:col-span-7">
              <figcaption className="text-sm font-semibold text-navy">Procedencia de los ponentes</figcaption>
              <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_12rem]">
                <MapaPonentes conteo={conteoPaises} />
                <ul className="text-sm text-muted">
                  {conteoPaises.map((c) => (
                    <li key={c.codigo} className="flex justify-between gap-3 border-b border-rule/70 py-1.5">
                      <span>{paises[c.codigo]?.nombre}</span>
                      <span className="tnum font-semibold text-navy">{c.ponentes}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Mission and axes */}
      <section aria-labelledby="mision" className="diferido border-y border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:py-36 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-blue">Qué es el Observatorio</p>
            <h2 id="mision" className="titular mt-6 font-display text-[clamp(2.6rem,5.6vw,5rem)] leading-[0.98] tracking-[-0.02em] text-balance text-navy lg:sticky lg:top-28">
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
            <h2 id="agenda" className="titular font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] text-navy">
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
            <h2 id="publicaciones-inicio" className="titular font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] text-navy">
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
                    <span className="mt-1.5 block text-base font-semibold leading-snug text-navy decoration-blue/40 underline-offset-4 group-hover:underline">{p.titulo}</span>
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
      <section aria-labelledby="escribanos" className="diferido border-t border-rule bg-paper">
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
            <a href={`mailto:${contact.email}`} className="enlace inline-flex items-center gap-2 self-center text-sm font-semibold text-navy">
              <Mail className="size-4" aria-hidden />
              Correo
            </a>
            <a href={mapa} target="_blank" rel="noopener" className="enlace inline-flex items-center gap-2 self-center text-sm font-semibold text-navy">
              <MapPin className="size-4" aria-hidden />
              Cómo llegar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
