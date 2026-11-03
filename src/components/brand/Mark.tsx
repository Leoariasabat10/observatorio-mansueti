import Image from "next/image";
import { observatorio } from "@/config/observatorio";

// Official emblem (scales, South America, globe) cropped from the client logo; the wordmark is set in HTML so it stays sharp.
// Source 1001×683. Pre-sized files: 320w for the header/footer (2x of 160px), 960w for the hero; Next's optimizer is skipped.
export function Mark({ className = "h-11 w-auto", priority = false, large = false }: { className?: string; priority?: boolean; large?: boolean }) {
  return (
    <Image
      src={large ? "/brand/emblema-960.webp" : "/brand/emblema-320.webp"}
      width={large ? 960 : 320}
      height={large ? 655 : 218}
      alt={`Emblema del ${observatorio.shortName}: balanza con mazo y casco sobre el mapa de Sudamérica`}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

