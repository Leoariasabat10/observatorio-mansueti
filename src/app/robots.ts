import type { MetadataRoute } from "next";
import { siteConfig } from "@site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin.html"] }, sitemap: `${siteConfig.url}/sitemap.xml` };
}
