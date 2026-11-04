import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { contact } from "@/config/observatorio";
import { BUILD_NOW, resumenes } from "@/lib/content";
import { ExploradorWebinars } from "@/components/webinar/ExploradorWebinars";
import { ProgramaEnCifras } from "@/components/webinar/ProgramaEnCifras";
import { WebinarDestacado } from "@/components/webinar/WebinarDestacado";

export const metadata: Metadata = {
  title: "Programa académico",
  description:
    "Webinars del Observatorio ASDTSS sobre Derecho del Trabajo y de la Seguridad Social: próximas sesiones, inscripciones y grabaciones, en hora de Bogotá.",
  alternates: { canonical: "/programa-academico" },
};

export default function ProgramaAcademico() {
  const webinars = resumenes();
  const buildNow = BUILD_NOW;
  const ejemplo = webinars.some((w) => w.ejemplo);

  return (
    <>
      <section aria-labelledby="programa-titulo" className="border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow text-blue">Programa académico</p>
            <h1 id="programa-titulo" className="mt-6 font-display text-[clamp(2.9rem,7vw,5.75rem)] leading-[0.94] tracking-[-0.015em] text-balance text-navy">
              Webinars del Observatorio
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Sesiones en línea sobre Derecho del Trabajo y de la Seguridad Social, con ponentes de distintos países de Sudamérica. Cada sesión queda
              registrada en esta bitácora, con su grabación cuando existe.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-end border-t border-rule pt-6 text-sm sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <dt className="text-muted">Transmisión desde</dt>
              <dd className="mt-1 font-serif text-lg text-navy">Bogotá, Colombia</dd>
            </div>
            <div>
              <dt className="text-muted">Coordenadas de la sede</dt>
              <dd className="tnum mt-1 font-serif text-base whitespace-nowrap text-navy sm:text-lg">4°36′ N, 74°04′ O</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-muted">Todas las horas en</dt>
              <dd className="mt-1 font-serif text-lg text-navy">Hora de Bogotá (UTC−5)</dd>
            </div>
          </dl>
        </div>

        {ejemplo && (
          <div className="border-t border-dashed border-heritage/40 bg-heritage/[0.04]">
            <p className="mx-auto max-w-7xl px-5 py-3 text-sm text-heritage lg:px-8">
              <strong className="font-semibold">Contenido de ejemplo.</strong> Los títulos, fechas, ponentes y enlaces de esta página son de prueba y se
              reemplazarán con el programa real.
            </p>
          </div>
        )}
      </section>

      <WebinarDestacado webinars={webinars} buildNow={buildNow} />
      <ExploradorWebinars webinars={webinars} buildNow={buildNow} />
      <ProgramaEnCifras webinars={webinars} />

      <section aria-labelledby="proponer-titulo" className="revelar mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:px-8">
        <div className="lg:col-span-7">
          <h2 id="proponer-titulo" className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.08] text-balance text-navy">
            ¿Quiere proponer un tema o participar como ponente?
          </h2>
          <p className="mt-4 max-w-lg text-muted">Escríbanos con su propuesta y una breve reseña. El equipo del Observatorio le responderá.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <a href={contact.whatsapp} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue">
            <MessageCircle className="size-4" aria-hidden />
            Escribir por WhatsApp
          </a>
          <a href={`mailto:${contact.email}?subject=Propuesta%20para%20el%20programa%20acad%C3%A9mico`} className="inline-flex items-center justify-center gap-2 rounded-sm border border-navy/30 px-6 py-3.5 text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy">
            <Mail className="size-4" aria-hidden />
            Enviar un correo
          </a>
        </div>
      </section>
    </>
  );
}
