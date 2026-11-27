"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

// Copy the page link: for journalists and staff who share by email or chat, not only WhatsApp.
export function CopiarEnlace({ url, className = "" }: { url: string; className?: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copie el enlace:", url); // ponytail: fallback for browsers without clipboard permission
    }
  };
  return (
    <button type="button" onClick={copiar} className={className}>
      {copiado ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      <span aria-live="polite">{copiado ? "Enlace copiado" : "Copiar enlace"}</span>
    </button>
  );
}
