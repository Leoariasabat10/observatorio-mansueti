"use client";

import { Share2 } from "lucide-react";

// Share the session: the phone's own share sheet when there is one (WhatsApp, Facebook, Telegram…), WhatsApp otherwise.
// It is a real link to WhatsApp, so it still works before the page's JavaScript loads.
export function CompartirSesion({ titulo, texto, url, className = "" }: { titulo: string; texto: string; url: string; className?: string }) {
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`;
  const compartir = async (e: React.MouseEvent) => {
    if (!navigator.share) return; // desktop browsers without a share sheet follow the WhatsApp link
    e.preventDefault();
    try {
      await navigator.share({ title: titulo, text: texto, url });
    } catch {
      // closed by the visitor: nothing to do
    }
  };
  return (
    <a href={whatsapp} target="_blank" rel="noopener" onClick={compartir} className={className}>
      <Share2 className="size-4" aria-hidden />
      Compartir
    </a>
  );
}
