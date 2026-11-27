import type { Metadata } from "next";
import Link from "next/link";
import { FileDown, Mail, MessageCircle } from "lucide-react";
import { contact } from "@/config/observatorio";
import { categorias, fechaPublicacion, tamano } from "@/lib/categorias";
import { resumenesPublicaciones } from "@/lib/publicaciones";
import { CatalogoPublicaciones } from "@/components/publicacion/CatalogoPublicaciones";
import { EjemploTag, EjeTag } from "@/components/webinar/Etiquetas";

export const metadata: Metadata = {
  title: "Publicaciones y Boletines",
  description:
    "Boletines, documentos de trabajo, intervenciones judiciales y notas de datos del Observatorio ASDTSS sobre Derecho del Trabajo y de la Seguridad Social.",
  alternates: { canonical: "/publicaciones" },
};

export default function Publicaciones() {
  const publicaciones = resumenesPublicaciones();
  const boletin = publicaciones.find((p) => p.categoria === "boletines");
  const ejemplo = publicaciones.some((p) => p.ejemplo);

  return (
    <>
      <section aria-labelledby="publicaciones-titulo" className="border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue">Publicaciones y Boletines</p>
            <h1 id="publicaciones-titulo" className="mt-8 font-display text-[clamp(3rem,8.6vw,6rem)] leading-[0.9] tracking-[-0.025em] text-balance text-navy">
              Lo que el Observatorio publica
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Análisis por ejes temáticos, con la fuente y la fecha de cada dato. Todas las publicaciones se pueden leer en línea o descargar.
            </p>
          </div>
          <dl className="self-end border-t border-rule pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {categorias.map((c) => (
              <div key={c.slug} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-rule py-3 last:border-0">
                <dt>
                  <Link href={`/publicaciones?categoria=${c.slug}`} className="text-base font-semibold text-navy hover:underline hover:decoration-blue/50 hover:underline-offset-4">
                    {c.nombre}
                  </Link>
                </dt>
                <dd className="tnum text-sm font-semibold text-muted">{publicaciones.length > 0 && publicaciones.filter((p) => p.categoria === c.slug).length}</dd>
                <dd className="col-span-2 mt-0.5 text-sm text-muted">{c.descripcion}</dd>
              </div>
            ))}
          </dl>
        </div>
        {ejemplo && (
          <div className="border-t border-dashed border-heritage/40 bg-heritage/[0.04]">
            <p className="mx-auto max-w-7xl px-5 py-3 text-sm text-heritage lg:px-8">
              <strong className="font-semibold">Contenido de ejemplo.</strong> Los títulos, autores y fechas de esta página son de prueba y se reemplazarán
              con las publicaciones reales.
            </p>
          </div>
        )}
      </section>

      {boletin && (
        <section aria-labelledby="boletin-titulo" className="noche grano relative overflow-hidden text-paper">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8">
            <div className="lg:col-span-4">
              <p className="eyebrow text-gold">Último boletín</p>
              {boletin.numero != null && (
                <p className="tnum mt-4 font-display leading-[0.8] text-gold">
                  <span className="align-top text-2xl">n.º</span>
                  <span className="text-[clamp(6rem,14vw,10rem)]">{boletin.numero}</span>
                </p>
              )}
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {boletin.ejes.map((e) => (
                  <EjeTag key={e} slug={e} inverse />
                ))}
                {boletin.ejemplo && <EjemploTag inverse />}
              </div>
              <h2 id="boletin-titulo" className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium text-balance">
                <Link href={`/publicaciones/${boletin.slug}`} className="decoration-gold decoration-2 underline-offset-[0.2em] hover:underline">
                  {boletin.titulo}
                </Link>
              </h2>
              <p className="mt-3 text-paper/75">{fechaPublicacion(boletin.fecha)}</p>
              <p className="mt-5 max-w-2xl text-lg text-paper/90">{boletin.resumen}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={`/publicaciones/${boletin.slug}`} className="inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-white">
                  Leer el boletín
                </Link>
                {boletin.pdf && (
                  <a href={boletin.pdf} download className="inline-flex items-center justify-center gap-2 rounded-sm border border-paper/30 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-paper">
                    <FileDown className="size-4" aria-hidden />
                    PDF, {tamano(boletin.pdfKB!)}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {publicaciones.length ? (
        <CatalogoPublicaciones publicaciones={publicaciones} />
      ) : (
        <section aria-labelledby="sin-publicaciones" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
          <h2 id="sin-publicaciones" className="max-w-2xl font-serif text-2xl leading-snug text-navy">
            El primer boletín y los primeros documentos de trabajo están en preparación.
          </h2>
          <p className="mt-4 max-w-xl text-muted">Cada publicación se anunciará aquí con su fecha, eje temático, autoría y archivo descargable. Mientras tanto:</p>
          <ul className="mt-8 grid max-w-3xl gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
            <li className="bg-card">
              <Link href="/latitud-sudamericana/noviembre-2026" className="group block p-6">
                <span className="text-xs font-semibold text-blue">Latitud Sudamericana: Pensamiento Jurídico</span>
                <span className="mt-2 block font-semibold text-navy decoration-blue/40 underline-offset-4 group-hover:underline">Edición de noviembre de 2026: actualidad laboral de siete países</span>
              </Link>
            </li>
            <li className="bg-card">
              <Link href="/actualidad" className="group block p-6">
                <span className="text-xs font-semibold text-blue">Actualidad</span>
                <span className="mt-2 block font-semibold text-navy decoration-blue/40 underline-offset-4 group-hover:underline">Novedades laborales de la región, con su fuente original</span>
              </Link>
            </li>
          </ul>
        </section>
      )}

      <section aria-labelledby="recibir-titulo" className="border-t border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:px-8">
          <div className="lg:col-span-7">
            <h2 id="recibir-titulo" className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.08] text-balance text-navy">
              Reciba el boletín
            </h2>
            <p className="mt-4 max-w-lg text-muted">Escríbanos y le enviaremos cada nuevo número por correo o WhatsApp.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <a
              href={`mailto:${contact.email}?subject=Quiero%20recibir%20el%20bolet%C3%ADn%20del%20Observatorio`}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
            >
              <Mail className="size-4" aria-hidden />
              Pedir por correo
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noopener" className="enlace inline-flex items-center gap-2 self-center text-sm font-semibold text-navy">
              <MessageCircle className="size-4" aria-hidden />
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
