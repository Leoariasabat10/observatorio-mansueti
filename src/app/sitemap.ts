import type { MetadataRoute } from "next";
import { siteConfig } from "@site";
import { getWebinars } from "@/lib/content";
import { getEdiciones } from "@/lib/latitud";
import { getActualidad } from "@/lib/actualidad";
import { getPublicaciones } from "@/lib/publicaciones";

export const dynamic = "force-static";

// Sample content is left out: it is not real.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, priority: 1 },
    { url: `${siteConfig.url}/programa-academico`, priority: 0.9 },
    { url: `${siteConfig.url}/trayectoria`, priority: 0.8 },
    { url: `${siteConfig.url}/voces`, priority: 0.8 },
    { url: `${siteConfig.url}/latitud-sudamericana`, priority: 0.8 },
    ...getEdiciones().map((e) => ({ url: `${siteConfig.url}/latitud-sudamericana/${e.slug}`, priority: 0.6 })),
    { url: `${siteConfig.url}/actualidad`, priority: 0.8 },
    { url: `${siteConfig.url}/publicaciones`, priority: 0.8 },
    ...getActualidad()
      .filter((n) => !n.ejemplo)
      .map((n) => ({ url: `${siteConfig.url}/actualidad/${n.slug}`, lastModified: new Date(n.fecha) })),
    ...getWebinars()
      .filter((w) => !w.ejemplo)
      .map((w) => ({ url: `${siteConfig.url}/programa-academico/${w.slug}`, lastModified: new Date(w.start) })),
    ...getPublicaciones()
      .filter((p) => !p.ejemplo)
      .map((p) => ({ url: `${siteConfig.url}/publicaciones/${p.slug}`, lastModified: new Date(p.fecha) })),
  ];
}
