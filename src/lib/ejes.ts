// Thematic axes ("ejes"). Provisional list until the client delivers her axis matrices; edit src/content/ejes.json only.
import data from "@/content/ejes.json";

export type Eje = { slug: string; nombre: string; color: string };
export const ejes: Eje[] = data;
export const ejePorSlug = (slug: string) => ejes.find((e) => e.slug === slug);
