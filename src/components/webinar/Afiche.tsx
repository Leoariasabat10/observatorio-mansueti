import Image from "next/image";
import type { WebinarResumen } from "@/lib/content";
import { ejePorSlug } from "@/lib/ejes";
import { fechaDia, fechaMes, horaBogota } from "@/lib/webinar-time";

type Props = {
  w: Pick<WebinarResumen, "titulo" | "start" | "ejes" | "afiche" | "aficheAlt">;
  size?: "thumb" | "full";
  priority?: boolean;
  className?: string;
};

// The real poster when there is one. Until then, a poster typeset from the webinar's own data,
// with a visible "Afiche pendiente" mark, so the slot is designed rather than an empty gray box.
export function Afiche({ w, size = "full", priority = false, className = "" }: Props) {
  if (w.afiche) {
    return (
      <Image
        src={w.afiche}
        alt={w.aficheAlt ?? ""}
        width={800}
        height={1000}
        sizes={size === "thumb" ? "112px" : "(min-width: 1024px) 420px, 90vw"}
        priority={priority}
        className={`aspect-[4/5] w-full rounded-sm object-cover ${className}`}
      />
    );
  }

  const ejes = w.ejes.map(ejePorSlug).filter((e) => e != null);

  if (size === "thumb") {
    return (
      <div aria-hidden className={`graticula relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-sm border border-rule bg-card p-2.5 ${className}`}>
        <span className="flex gap-1">
          {ejes.map((e) => (
            <span key={e.slug} className="size-1.5 rounded-full" style={{ background: e.color }} />
          ))}
        </span>
        <span className="tnum font-display text-4xl leading-none text-navy">{fechaDia(w.start)}</span>
        <span className="text-[0.625rem] font-semibold text-muted">Afiche pendiente</span>
      </div>
    );
  }

  return (
    <figure className={`graticula relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-sm border border-rule bg-card p-6 sm:p-8 ${className}`}>
      <figcaption className="sr-only">Afiche pendiente de {w.titulo}</figcaption>
      <div aria-hidden className="flex items-start justify-between gap-4">
        <Image src="/brand/emblema-320.webp" alt="" width={320} height={218} unoptimized className="h-12 w-auto" />
        <span className="rounded-sm border border-dashed border-heritage/50 px-2 py-1 text-[0.6875rem] font-semibold text-heritage">
          Afiche pendiente
        </span>
      </div>
      <div aria-hidden className="mt-auto">
        <p className="tnum flex items-baseline gap-3 font-display text-navy">
          <span className="text-[clamp(4.5rem,9vw,7rem)] leading-[0.8]">{fechaDia(w.start)}</span>
          <span className="text-2xl">{fechaMes(w.start)}</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-blue tnum">{horaBogota(w.start)} hora de Bogotá</p>
        <p className="mt-5 font-serif text-xl leading-snug text-balance text-navy">{w.titulo}</p>
        <div className="mt-6 h-[3px] w-full" style={{ background: `linear-gradient(to right, ${ejes.map((e, i) => `${e.color} ${(i / ejes.length) * 100}% ${((i + 1) / ejes.length) * 100}%`).join(", ")})` }} />
      </div>
    </figure>
  );
}
