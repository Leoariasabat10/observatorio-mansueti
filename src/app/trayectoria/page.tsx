import type { Metadata } from "next";
import Image from "next/image";
import { asociacion, observatorio } from "@/config/observatorio";

export const metadata: Metadata = {
  title: "Trayectoria",
  description: "Cómo nació la Asociación Sudamericana de Derecho del Trabajo y de la Seguridad Social «Hugo Roberto Mansueti» (ASDTSS): el acta fundacional, el grupo fundador y imágenes del camino recorrido.",
  alternates: { canonical: "/trayectoria" },
};

// Fuente: acta fundacional de la ASDTSS (public/trayectoria/acta-fundacional.webp), Asunción, 20 de agosto de 2026.
// Los nombres respetan la escritura de cada apartado del acta. Grafías por revisar (REVISIÓN EDITORIAL):
//  - Bolivia: «Alfredo Menacho» (delegados) vs. «Manfredo Menacho» (Junta Ejecutiva).
//  - Perú: en el acta «José» aparece tachado ante «Luis Serrano»; se muestra «Luis Serrano».
type Miembro = { nombre: string; cargo?: string };
const fundadores: { pais: string; miembros: Miembro[] }[] = [
  { pais: "Argentina", miembros: [{ nombre: "Mauricio César Arese", cargo: "Presidente" }, { nombre: "Adriana Micale" }, { nombre: "Carlos Toselli" }] },
  { pais: "Bolivia", miembros: [{ nombre: "Alfredo Menacho" }, { nombre: "Manfredo Menacho", cargo: "Secretario general" }, { nombre: "Sonia Bellot" }] },
  { pais: "Brasil", miembros: [{ nombre: "Luciana Aboim" }, { nombre: "Tatiana Fiore" }, { nombre: "Domingos Savios Zainaghi", cargo: "Vicepresidente" }] },
  { pais: "Colombia", miembros: [{ nombre: "Juana María Montenegro Cantillo", cargo: "Vicepresidenta" }, { nombre: "Yaneth Vargas Sandoval" }] },
  { pais: "Ecuador", miembros: [{ nombre: "Pedro Cruz", cargo: "Vocal 1" }, { nombre: "Ivonne Núñez" }] },
  { pais: "Paraguay", miembros: [{ nombre: "Rocío Penayo" }, { nombre: "César Bernal", cargo: "Vocal 2" }, { nombre: "Eduardo Pérez Avid" }] },
  { pais: "Perú", miembros: [{ nombre: "Luis Serrano", cargo: "Tesorero" }, { nombre: "Ángel Delgado de la Matta" }] },
];

const CRED = "Archivo institucional; autoría por confirmar.";
// Los pies de foto solo repiten lo que se lee en las propias imágenes (pantallas y carteles).
const galeria: { src: string; w: number; h: number; alt: string; pie: string }[] = [
  { src: "panel-iv", w: 1600, h: 1462, alt: "Cuatro personas de pie sostienen certificados de participación frente a una pantalla con el Panel IV del congreso.", pie: "Panel IV, «La atomización del empleo y la erosión del contrato de trabajo tradicional». En pantalla: moderador Fernando Heisecke (Paraguay); Augusto Valenzuela (Guatemala), Tatiana Concepción Fiore de Almeida (Brasil) y César Arese (Argentina)." },
  { src: "panel-despidos-algoritmicos", w: 1600, h: 1066, alt: "Cuatro personas posan con certificados de participación frente a una pantalla del panel sobre despidos algorítmicos.", pie: "Panel «Despidos algorítmicos, scoring laboral y tutela judicial efectiva». En pantalla: moderadora María del Pilar Callizo (Paraguay); Luis Fernando Rodríguez (México), Vanahi Bello (República Dominicana) y Carlos Toselli (Argentina)." },
  { src: "panel-certificados", w: 1600, h: 897, alt: "Cuatro mujeres sostienen certificados de participación frente a una pantalla con tres nombres numerados.", pie: "Participantes de un panel del congreso. En pantalla: Luciana Aboim Machado, Juana María Montenegro y Verónica López." },
  { src: "sala-trabajo-digital", w: 1600, h: 1066, alt: "Una persona habla desde un atril ante un auditorio; al fondo, una pantalla y banderas de varios países.", pie: "Sesión «Trabajo Digital y Seguridad Social en la Era Algorítmica – Humanizar la Innovación»." },
  { src: "sala-plenaria", w: 1600, h: 1066, alt: "Auditorio lleno con una oradora en el atril a la izquierda y público sentado a la derecha.", pie: "Sala del congreso durante una intervención." },
  { src: "congreso-atril", w: 1200, h: 1600, alt: "Una oradora habla desde un atril frente a una pantalla del XXIII Congreso Iberoamericano en Asunción, Paraguay.", pie: "XXIII Congreso Iberoamericano del Derecho del Trabajo y de la Seguridad Social «Guillermo Cabanellas», Asunción, Paraguay." },
  { src: "intervencion-atril", w: 900, h: 900, alt: "Un hombre de traje habla ante un micrófono en un atril, con una escarapela en la solapa.", pie: "Intervención en el congreso." },
  { src: "encuentro-cinco", w: 1392, h: 1600, alt: "Cinco hombres de traje posan juntos en un vestíbulo de mármol; varios llevan una escarapela.", pie: "Encuentro entre participantes del congreso." },
  { src: "encuentro-vestibulo", w: 752, h: 1632, alt: "Tres personas posan juntas en un vestíbulo de mármol; dos llevan una escarapela.", pie: "Encuentro entre participantes del congreso." },
  { src: "asistentes-sala", w: 960, h: 960, alt: "Cuatro personas sentadas en una sala posan para una fotografía; una lleva una bolsa del congreso.", pie: "Asistentes antes de una sesión del congreso." },
];

function Foto({ f, prioridad = false }: { f: (typeof galeria)[number]; prioridad?: boolean }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-sm border border-rule bg-card">
        <Image src={`/trayectoria/${f.src}.webp`} alt={f.alt} width={f.w} height={f.h} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" priority={prioridad} className="h-auto w-full" />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">{f.pie}</figcaption>
    </figure>
  );
}

export default function Trayectoria() {
  return (
    <>
      <section aria-labelledby="trayectoria-titulo" className="graticula border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <h1 id="trayectoria-titulo" className="font-display text-[clamp(3rem,8.6vw,6rem)] leading-[0.9] tracking-[-0.025em] text-balance text-navy lg:col-span-8">
            Trayectoria
          </h1>
          <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            <p className="max-w-sm text-lg leading-relaxed text-muted">Así nació la Asociación a la que pertenece el Observatorio, quiénes la fundaron y algunas imágenes del camino recorrido.</p>
          </div>
        </div>
      </section>

      <div className="bg-paper">
        {/* Origen */}
        <section aria-labelledby="origen" className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-24">
          <div className="lg:col-span-7">
            <h2 id="origen" className="font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] text-balance text-navy">
              Una asociación sudamericana, constituida en Asunción
            </h2>
            <div className="prosa mt-8 max-w-[38em]">
              <p>
                El Observatorio forma parte de la {asociacion.name} «{observatorio.honoree}» ({asociacion.acronym}), un esfuerzo de colaboración regional dedicado al estudio del derecho del trabajo y la seguridad social.
              </p>
              <p>
                Según el acta fundacional, el 20 de agosto de 2026, a las 14:00, en Asunción, Paraguay, se reunieron los delegados de los países sudamericanos de la Asociación Iberoamericana del Trabajo y de la Seguridad Social «Guillermo Cabanellas» para conformar la nueva asociación. La reunión fue presidida por Eduardo Pérez Avid, presidente de esa asociación iberoamericana.
              </p>
              <p>
                Los delegados manifestaron por unanimidad la decisión de constituirla y aprobaron que llevara el nombre de «Hugo Roberto Mansueti», a propuesta ratificada por Domingos Savios Zainaghi. También aprobaron la primera Junta Ejecutiva, con un mandato de dos años, 2026-2028.
              </p>
              <p>
                El acta recoge además propuestas de actividades académicas en Argentina, Brasil, Bolivia y Colombia, y encarga a la Junta Ejecutiva redactar los estatutos y realizar las gestiones para poner en marcha la institución.
              </p>
            </div>
          </div>
          <aside aria-label="Hito de constitución" className="lg:col-span-5">
            <div className="graticula rounded-sm border border-rule bg-card p-7">
              <p className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.05] text-navy">
                <time dateTime="2026-08-20">20 de agosto de 2026</time>
              </p>
              <p className="mt-2 text-lg text-navy">Asunción, Paraguay</p>
              <p className="mt-5 text-sm leading-relaxed text-muted">Constitución de la ASDTSS, con delegados de Argentina, Bolivia, Brasil, Colombia, Ecuador, Paraguay y Perú.</p>
            </div>
            <figure className="mt-8">
              <a href="/trayectoria/acta-fundacional.webp" target="_blank" rel="noopener" aria-label="Abrir el acta fundacional en tamaño completo (se abre en una pestaña nueva)" className="block overflow-hidden rounded-sm border border-rule bg-card">
                <Image src="/trayectoria/acta-fundacional.webp" alt="Acta fundacional de la ASDTSS «Hugo Roberto Mansueti», con el texto de la reunión del 20 de agosto de 2026 en Asunción y las firmas de los participantes." width={1144} height={1144} sizes="(min-width: 1024px) 460px, 92vw" className="h-auto w-full" />
              </a>
              <figcaption className="mt-3 text-sm leading-relaxed text-muted">Acta fundacional de la ASDTSS. Toque la imagen para verla completa.</figcaption>
            </figure>
          </aside>
        </section>

        {/* Observatorio */}
        <section aria-labelledby="observatorio" className="border-y border-rule bg-card">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 lg:grid-cols-12 lg:gap-14 lg:px-8">
            <h2 id="observatorio" className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.1] text-navy lg:col-span-5">
              Y el Observatorio
            </h2>
            <p className="max-w-[38em] text-lg leading-relaxed text-muted lg:col-span-7">
              El Observatorio es la iniciativa de análisis, investigación y formación de la Asociación. El acta fundacional corresponde a la constitución de la Asociación; la fecha de puesta en marcha del Observatorio se publicará cuando exista una fuente institucional que la confirme.
            </p>
          </div>
        </section>

        {/* Grupo fundador */}
        <section aria-labelledby="fundadores" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <h2 id="fundadores" className="font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] text-navy">
            Grupo fundador
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">Delegados presentes en la reunión de constitución, por país, y los cargos de la Junta Ejecutiva 2026-2028 que el acta asigna a cada uno.</p>
          <ul className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {fundadores.map((g) => (
              <li key={g.pais} className="bg-card p-6 lg:p-7">
                <h3 className="font-display text-2xl text-navy">{g.pais}</h3>
                <ul className="mt-5 space-y-3">
                  {g.miembros.map((m) => (
                    <li key={m.nombre}>
                      <span className="font-semibold text-navy">{m.nombre}</span>
                      {m.cargo && <span className="block text-sm text-muted">{m.cargo}</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li aria-hidden className="hidden bg-card sm:block lg:col-span-2" />
          </ul>
        </section>

        {/* Imágenes */}
        <section aria-labelledby="imagenes" className="border-t border-rule">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
            <h2 id="imagenes" className="font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] text-navy">
              Imágenes del camino
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">Fotografías del XXIII Congreso Iberoamericano del Derecho del Trabajo y de la Seguridad Social «Guillermo Cabanellas», Asunción, Paraguay. Los pies de foto repiten solo lo que muestran las propias pantallas.</p>

            <figure className="mt-12">
              <div className="overflow-hidden rounded-sm border border-rule bg-card">
                <Image src="/trayectoria/grupo-congreso.webp" alt="Fotografía grupal de unas veinte personas de pie en una sala, con banderas de varios países al fondo; varias llevan credenciales." width={1280} height={866} sizes="(min-width: 1280px) 1216px, 92vw" priority className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">Fotografía grupal de participantes. {CRED}</figcaption>
            </figure>

            <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {galeria.map((f) => (
                <li key={f.src}>
                  <Foto f={f} />
                </li>
              ))}
            </ul>
            <p className="mt-12 text-sm text-muted">{CRED}</p>
          </div>
        </section>
      </div>
    </>
  );
}
