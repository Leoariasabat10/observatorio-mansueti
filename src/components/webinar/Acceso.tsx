import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { contact } from "@/config/observatorio";
import type { WebinarResumen } from "@/lib/content";

// How to join when the session has no public sign-up link: the content's own note, the poster, and a person to ask.
// While the session is live, asking for the link becomes the block's one solid action: latecomers need it most.
export function Acceso({ w, vivo = false, className = "" }: { w: Pick<WebinarResumen, "acceso" | "afiche" | "titulo">; vivo?: boolean; className?: string }) {
  if (!w.acceso) return null;
  const mensaje = `Hola, quisiera el enlace para participar en «${w.titulo}».`;
  const whatsapp = `${contact.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  const correo = `mailto:${contact.email}?subject=${encodeURIComponent(`Enlace: ${w.titulo}`)}&body=${encodeURIComponent(mensaje)}`;
  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      <p className="font-semibold">Cómo participar</p>
      <p className="mt-1 opacity-80">
        {w.acceso} {vivo ? "Si no puede escanearlo, escríbanos y le enviamos el enlace." : "Si lo lee desde el celular, pídanos el enlace."}
      </p>
      {vivo && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
        >
          <MessageCircle className="size-4" aria-hidden />
          Pedir el enlace ahora
        </a>
      )}
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
        {!vivo && (
          <a href={whatsapp} target="_blank" rel="noopener" className="enlace inline-flex items-center gap-1.5">
            <MessageCircle className="size-3.5" aria-hidden />
            Por WhatsApp
          </a>
        )}
        <a href={correo} className="enlace inline-flex items-center gap-1.5">
          <Mail className="size-3.5" aria-hidden />
          Por correo
        </a>
        {w.afiche && (
          <a href={w.afiche} target="_blank" rel="noopener" className="enlace inline-flex items-center gap-1.5">
            Ver el afiche completo
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        )}
      </p>
    </div>
  );
}
