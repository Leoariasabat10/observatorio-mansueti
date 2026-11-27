import Link from "next/link";
import { ArrowRight, ChartLine, Mail, MessageCircle, Scale, Users } from "lucide-react";
import ambitos from "@/content/ambitos.json";
import { siteConfig } from "@site";
import { asociacion, contact, observatorio, social, vicepresidente, vicepresidenta } from "@/config/observatorio";
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
import { SesionPortada } from "@/components/inicio/SesionPortada";
import { Contador } from "@/components/ui/Contador";
import { VideoMensaje } from "@/components/inicio/VideoMensaje";
import mensaje from "@/content/video-mensaje.json";

const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const iconosAmbito = { legislacion: Scale, empleo: ChartLine, colectivo: Users };

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
    addressCountry: "CO",
  },
  parentOrganization: { "@type": "Organization", name: asociacion.name, alternateName: asociacion.acronym, url: asociacion.url },
  sameAs: [...social.map((s) => s.href), asociacion.facebook],
};

const videoMensaje = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: mensaje.titulo,
  description: mensaje.descripcion,
  thumbnailUrl: `${siteConfig.url}${mensaje.poster}`,
  contentUrl: `${siteConfig.url}${mensaje.video}`,
  uploadDate: mensaje.fecha,
  duration: mensaje.duracionIso,
  inLanguage: "es",
  transcript: mensaje.transcripcion.join(" "),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoMensaje).replace(/</g, "\\u003c") }} />

      {/* While a session is upcoming or live, it is the first thing a visitor sees (join, share). */}
      <SesionPortada webinars={webinars} buildNow={BUILD_NOW} />

      {/* Hero: the one signature moment of the page */}
      <section aria-labelledby="inicio-titulo" className="noche grano relative overflow-hidden text-paper">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative z-10 pt-16 pb-6 sm:pt-24 lg:max-w-[46rem] lg:pt-32 lg:pb-24">
            <p className="eyebrow text-gold">Observatorio de la {asociacion.acronym}</p>
            <h1 id="inicio-titulo" className="mt-8 font-display text-[clamp(2.75rem,7.4vw,7rem)] leading-[0.92] font-medium tracking-[-0.025em] text-balance">
              Monitoreamos el trabajo en América Latina
            </h1>
            <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-paper/80">Legislación laboral, empleo y derecho colectivo, país por país.</p>
            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href="/programa-academico" className="inline-flex items-center gap-3 rounded-sm bg-paper px-6 py-3.5 text-sm font-semibold text-navy hover:bg-white">
                Ver el programa académico
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href="#lineas" className="enlace text-sm font-semibold text-paper">
                Qué investigamos
              </a>
            </div>
          </div>

          <div className="pointer-events-none relative -mx-[18%] -mt-4 -mb-[22%] sm:-mx-[8%] lg:absolute lg:inset-y-0 lg:right-[-14%] lg:m-0 lg:flex lg:w-[min(58rem,66vw)] lg:items-center">
            <Globo className="h-auto w-full" />
          </div>
        </div>

      </section>

      {/* Institutional message: video of the first president, quiet frame around it */}
      <section aria-labelledby="mensaje" className="border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-x-14 gap-y-10 px-5 py-20 sm:py-28 lg:grid-cols-12 lg:px-8">
          <div className="revelar lg:col-span-4 lg:pt-6">
            <h2 id="mensaje" className="font-display text-[clamp(2rem,3.1vw,2.875rem)] leading-[1.04] text-balance text-navy">
              {mensaje.titulo}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{mensaje.descripcion}</p>
          </div>

          <div className="revelar lg:sticky lg:top-28 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:self-start">
            <VideoMensaje src={mensaje.video} poster={mensaje.poster} subtitulos={mensaje.subtitulos} titulo={mensaje.titulo} duracion={mensaje.duracion} />
          </div>

          <div className="lg:col-span-4 lg:self-start">
            <dl className="border-t border-navy text-sm">
              <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5">
                <dt className="text-muted">Habla</dt>
                <dd className="text-right font-medium text-navy">{mensaje.ponente}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3.5">
                <dt className="text-muted">Duración</dt>
                <dd className="tnum font-medium text-navy">{mensaje.duracion} min</dd>
              </div>
            </dl>
            <details className="group/transcripcion mt-6">
              <summary className="enlace inline-block cursor-pointer list-none text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
                <span className="group-open/transcripcion:hidden">Leer la transcripción</span>
                <span className="hidden group-open/transcripcion:inline">Ocultar la transcripción</span>
              </summary>
              <div className="mt-5 max-h-80 space-y-4 overflow-y-auto border-l border-gold pr-2 pl-5 text-[0.9375rem] leading-relaxed text-navy">
                {mensaje.transcripcion.map((parrafo) => (
                  <p key={parrafo}>{parrafo}</p>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Vice presidencies: portrait + name, nothing invented beyond the role */}
      <section aria-label="Vicepresidencias" className="border-b border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl gap-x-14 gap-y-20 px-5 py-20 sm:py-28 md:grid-cols-2 lg:px-8">
          {[
            { ...vicepresidenta, nombre: `${vicepresidenta.title} ${vicepresidenta.name}`, alt: `Retrato de ${vicepresidenta.title} ${vicepresidenta.name}, ${vicepresidenta.role}`, id: "vicepresidencia", w: 854, h: 1280, w1: 427 },
            { ...vicepresidente, nombre: vicepresidente.name, alt: `${vicepresidente.name}, ${vicepresidente.role.charAt(0).toLowerCase()}${vicepresidente.role.slice(1)}`, id: "vicepresidencia-brasil", w: 1000, h: 1000, w1: 500 },
          ].map((v) => (
            <article key={v.id} aria-labelledby={v.id} className="revelar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.photoSm}
                srcSet={`${v.photoSm} ${v.w1}w, ${v.photo} ${v.w}w`}
                sizes="(min-width:768px) 40vw, 90vw"
                width={v.w}
                height={v.h}
                loading="lazy"
                decoding="async"
                alt={v.alt}
                className="sombra-larga aspect-[4/5] w-full max-w-sm object-cover object-top"
              />
              <p className="mt-8 text-sm font-semibold tracking-wide text-blue uppercase">{v.role}</p>
              <h2 id={v.id} className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] text-balance text-navy">
                {v.nombre}
              </h2>
              <span className="mt-6 block h-px w-16 bg-gold" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      {/* Research lines: the three areas, items only */}
      <section id="lineas" aria-labelledby="ambitos" className="scroll-mt-20 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
          <div className="revelar flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="ambitos" className="titular max-w-xl font-display text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02] text-balance text-navy">
              Líneas de investigación
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-muted">Lo que el Observatorio investiga en los países de América Latina.</p>
          </div>

          <div className="revelar-hijos mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {ambitos.map((a) => {
              const Icono = iconosAmbito[a.icono as keyof typeof iconosAmbito];
              return (
                <article key={a.slug} className="group relative flex flex-col overflow-hidden rounded-sm border border-rule bg-card p-7 transition-colors duration-300 hover:border-navy/30 sm:p-9">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-blue transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-full border border-navy/15 text-navy transition-colors duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-paper">
                      <Icono className="size-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="tnum text-sm text-muted">{a.temas.length} temas</span>
                  </div>
                  <h3 className="mt-9 font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.08] text-balance text-navy lg:min-h-[2.16em]">{a.titulo}</h3>
                  <ul className="mt-7 border-t border-rule">
                    {a.temas.map((t) => (
                      <li key={t} className="flex gap-3 border-b border-rule/70 py-3 text-[0.9375rem] leading-snug text-navy last:border-b-0">
                        <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-blue" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
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
              <p className="mt-1 text-xs text-muted">Cada punto es una sesión: relleno si ya se realizó, con anillo si está por venir. Seleccione uno para abrirlo.</p>
              <div className="mt-8">
                <LineaDeTiempo webinars={webinars} buildNow={BUILD_NOW} />
              </div>
            </div>

            <div className="revelar min-w-0 rounded-sm border border-rule bg-card p-6 sm:p-8 lg:col-span-5">
              <h3 className="text-sm font-semibold text-navy">Actividad por eje</h3>
              <p className="mt-1 mb-8 text-xs text-muted">Sesiones y publicaciones que tratan cada eje.</p>
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
                Su programa académico reúne a especialistas de distintos países en sesiones académicas periódicas. Sus publicaciones ordenan el análisis por ejes
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
                      Ver sesiones
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
              <p className="mt-3 text-sm leading-relaxed text-muted">Mientras tanto, la edición de noviembre de 2026 de Latitud Sudamericana reúne la actualidad laboral de siete países.</p>
              <Link href="/latitud-sudamericana/noviembre-2026" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline">
                Leer Latitud Sudamericana
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
          </div>
        </div>
      </section>
    </>
  );
}
