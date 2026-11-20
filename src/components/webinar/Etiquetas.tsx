import { ejePorSlug } from "@/lib/ejes";
import { estadoLabel, type Estado } from "@/lib/webinar-time";

// Axis color is never alone: the dot always sits next to the axis name.
export function EjeTag({ slug, inverse = false }: { slug: string; inverse?: boolean }) {
  const eje = ejePorSlug(slug);
  if (!eje) return null;
  return (
    <span className={`inline-flex items-center gap-2 text-[0.8125rem] font-medium ${inverse ? "text-paper/85" : "text-muted"}`}>
      <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: eje.color, boxShadow: inverse ? "0 0 0 2px rgb(255 255 255 / .9)" : undefined }} />
      {eje.nombre}
    </span>
  );
}

const estiloEstado: Record<Estado, string> = {
  proximo: "border-blue/40 text-blue",
  "en-vivo": "border-danger bg-danger text-white",
  pasado: "border-rule text-muted",
};

export function EstadoBadge({ estado, inverse = false }: { estado: Estado; inverse?: boolean }) {
  const cls = inverse && estado === "proximo" ? "border-sky/50 text-sky" : estiloEstado[estado];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {estado === "en-vivo" && <span aria-hidden className="pulso relative size-1.5 rounded-full bg-white" />}
      {estadoLabel[estado]}
    </span>
  );
}

export function EjemploTag({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  const color = inverse ? "border-gold/60 text-gold" : "border-heritage/50 text-heritage";
  return (
    <span className={`inline-flex items-center rounded-sm border border-dashed px-2 py-0.5 text-[0.6875rem] font-semibold ${color} ${className}`}>
      Contenido de ejemplo
    </span>
  );
}

/** Past event shown in the news archive: never presented as upcoming. */
export function EventoRealizadoTag() {
  return <span className="inline-flex items-center rounded-full border border-rule px-2.5 py-0.5 text-xs font-semibold text-muted">Evento realizado</span>;
}
