"use client";

import { useSyncExternalStore } from "react";
import { horaBogota, horaEn, TZ } from "@/lib/webinar-time";

const sinCambios = () => () => {};
const zonaVisitante = () => Intl.DateTimeFormat().resolvedOptions().timeZone || TZ;

// Audiences across South America: when the visitor's clock differs from Bogotá, show their own time too.
export function HoraLocal({ start, className = "" }: { start: number; className?: string }) {
  const tz = useSyncExternalStore(sinCambios, zonaVisitante, () => TZ);
  if (tz === TZ) return null;
  const hora = horaEn(start, tz);
  if (hora === horaBogota(start)) return null;
  return (
    <span className={className}>
      En tu zona ({tz.split("/").pop()!.replace(/_/g, " ")}): <span className="tnum">{hora}</span>
    </span>
  );
}
