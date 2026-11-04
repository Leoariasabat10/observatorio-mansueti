import type { MetadataRoute } from "next";
import { siteConfig } from "@site";
import { getWebinars } from "@/lib/content";

export const dynamic = "force-static";

// Sample webinars are left out: they are not real events.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, priority: 1 },
    { url: `${siteConfig.url}/programa-academico`, priority: 0.9 },
    ...getWebinars()
      .filter((w) => !w.ejemplo)
      .map((w) => ({ url: `${siteConfig.url}/programa-academico/${w.slug}`, lastModified: new Date(w.start) })),
  ];
}
