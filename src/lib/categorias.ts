// Publication categories and display helpers. Client-safe (no fs). Edit categories in src/content/categorias.json.
import data from "@/content/categorias.json";

export type Categoria = { slug: string; nombre: string; singular: string; descripcion: string };
export const categorias: Categoria[] = data;
export const categoriaPorSlug = (slug: string) => categorias.find((c) => c.slug === slug);

export const fechaPublicacion = (f: string) =>
  new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${f}T12:00:00Z`));

export const tamano = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toLocaleString("es-CO", { maximumFractionDigits: 1 })} MB` : `${kb} KB`);
