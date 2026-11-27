"use client";

import { ArrowUpRight, PlayCircle } from "lucide-react";
import type { WebinarResumen } from "@/lib/content";
import { accionPrincipal, estadoDe } from "@/lib/webinar-time";
import { Acceso } from "./Acceso";
import { CuentaRegresiva } from "./CuentaRegresiva";
import { EstadoBadge } from "./Etiquetas";
import { useAhora } from "./useAhora";

// Status, countdown and the one action that fits the moment: sign up, join, or watch the recording.
export function PanelEstado({ w, buildNow }: { w: WebinarResumen; buildNow: number }) {
  const now = useAhora(buildNow);
  const estado = estadoDe(w.start, w.duracionMin, now);
  const accion = accionPrincipal(w, estado);
  const boton =
    "inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-white";

  return (
    <div className="rounded-sm bg-navy p-6 text-paper sm:p-8">
      <EstadoBadge estado={estado} inverse />
      {estado === "proximo" && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-paper/70">Comienza en</p>
          <CuentaRegresiva start={w.start} now={now} />
        </div>
      )}
      {estado === "en-vivo" && <p className="mt-5 font-serif text-2xl">La sesión está en curso.</p>}
      {estado === "pasado" && (
        <p className="mt-5 font-serif text-2xl">{w.grabacion ? "La grabación está disponible." : "Esta sesión ya se realizó."}</p>
      )}

      <div className="mt-8">
        {estado !== "pasado" && accion && (
          <a href={accion.href} target="_blank" rel="noopener" className={boton}>
            {accion.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
        {estado !== "pasado" && !accion && <Acceso w={w} vivo={estado === "en-vivo"} className="text-paper" />}
        {estado === "pasado" && w.grabacion && (
          <a href={w.grabacion} target="_blank" rel="noopener" className={boton}>
            <PlayCircle className="size-4" aria-hidden />
            Ver grabación
          </a>
        )}
      </div>
    </div>
  );
}
