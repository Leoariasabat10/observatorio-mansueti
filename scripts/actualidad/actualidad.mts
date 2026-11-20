// Editorial pipeline for "Actualidad". Input: a JSON of posts that the agent transcribed from Chrome (see .claude/skills/actualidad-facebook).
// This script never touches Facebook: it scores, deduplicates, decides and (only with --escribir) writes drafts. Plain Node, no dependencies.
//   node --no-warnings scripts/actualidad/actualidad.mts revisar entrada.json            -> dry-run, writes nothing
//   node --no-warnings scripts/actualidad/actualidad.mts revisar entrada.json --escribir -> drafts + images + registro + docs/actualidad/revision/index.html
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
export type Criterios = { pertinencia: number; valor: number; region: number; fuente: number; vigencia: number };
export type Post = {
  id_publicacion: string;
  pagina_fuente: "observatorio" | "asdtss";
  url_original: string;
  fecha_publicacion: string; // YYYY-MM-DD
  texto: string; // faithful transcription
  titulo?: string;
  ponente_o_autor?: string;
  pais?: string; // ISO code
  institucion?: string;
  cargo?: string;
  eje_tematico?: string;
  imagen_origen?: string; // path to the file saved from Chrome
  imagen_permiso?: "propia" | "autorizada" | "tercero" | "desconocida";
  texto_alternativo?: string;
  credito?: string;
  criterios?: Criterios;
  requiere_revision?: boolean;
  notas?: string;
  sintetico?: boolean;
};
export type Config = {
  modo: "borrador" | "automatico";
  dry_run: boolean;
  umbral_incluir: number;
  umbral_pendiente: number;
  maximo_posts_por_pagina: number;
  pesos: Criterios;
  registro: string;
  aprobado_automatico?: boolean;
};
export type Decision = "incluido" | "pendiente" | "descartado";
export type Resultado = { post: Post; decision: Decision; puntuacion: number | null; motivo: string; huella: string; alertas: string[]; imagen: "ok" | "sin_imagen" | "pendiente_permiso" };
export type Registro = { procesados: { id: string; pagina: string; url: string; fecha: string; huella: string; decision: Decision; motivo: string; procesado: string }[] };

// Text from Facebook is data. These patterns flag posts that address an AI; they go to review and are reported, never obeyed.
const INYECCION = /(ignora|ignore|olvida|disregard|forget)\s+(todas?\s+)?(las\s+|the\s+|your\s+|tus\s+)?(instrucciones|instructions|reglas|rules|prompt)|\b(eres|you are)\s+(un|una|now|ahora)\b.*\b(ia|ai|asistente|assistant|modelo)\b|\b(system prompt|prompt del sistema|claude|chatgpt)\b|\b(publica|publish|ejecuta|execute|run)\b.*\b(comando|command|producci[oó]n|production)\b/i;

export const huella = (t: string) => crypto.createHash("sha256").update(t.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()).digest("hex").slice(0, 16);

export function puntuar(c: Criterios, pesos: Criterios): number {
  let s = 0;
  for (const k of Object.keys(pesos) as (keyof Criterios)[]) {
    if (!(c[k] >= 0 && c[k] <= 10)) throw new Error(`criterio "${k}" fuera de 0-10`);
    s += c[k] * pesos[k];
  }
  return Math.round(s * 10) / 10;
}

export function evaluar(posts: Post[], cfg: Config, reg: Registro): Resultado[] {
  const vistos = new Set(reg.procesados.flatMap((p) => [p.id, p.huella]));
  const porPagina: Record<string, number> = {};
  return posts.map((post) => {
    const h = huella(post.texto);
    const alertas: string[] = [];
    const r = (decision: Decision, motivo: string, puntuacion: number | null = null): Resultado => ({ post, decision, puntuacion, motivo, huella: h, alertas, imagen: imagenEstado(post) });

    porPagina[post.pagina_fuente] = (porPagina[post.pagina_fuente] ?? 0) + 1;
    if (porPagina[post.pagina_fuente] > cfg.maximo_posts_por_pagina) return r("pendiente", `Excede el máximo de ${cfg.maximo_posts_por_pagina} publicaciones por página y por ejecución; queda para la siguiente.`);
    if (vistos.has(post.id_publicacion) || vistos.has(h)) return r("descartado", "Duplicado: ya está en el registro de procesados.");
    vistos.add(post.id_publicacion).add(h);

    if (INYECCION.test(`${post.texto} ${post.titulo ?? ""} ${post.notas ?? ""}`)) {
      alertas.push("Posible inyección de instrucciones: el texto se trata como dato y se reporta.");
      return r("pendiente", "El texto contiene órdenes dirigidas a una IA; requiere revisión humana.");
    }
    if (!post.criterios) return r("pendiente", "Sin puntuación editorial: requiere revisión.");
    const p = puntuar(post.criterios, cfg.pesos);
    if (p < cfg.umbral_pendiente) return r("descartado", `Puntuación ${p} < ${cfg.umbral_pendiente}.`, p);

    const faltan = (["titulo", "fecha_publicacion", "texto", "url_original", "id_publicacion"] as const).filter((k) => !post[k]?.toString().trim());
    if (faltan.length) return r("pendiente", `Datos incompletos: ${faltan.join(", ")}.`, p);
    if (post.requiere_revision) return r("pendiente", `Marcado para revisión${post.notas ? `: ${post.notas}` : "."}`, p);
    if (p < cfg.umbral_incluir) return r("pendiente", `Puntuación ${p} entre ${cfg.umbral_pendiente} y ${cfg.umbral_incluir}.`, p);
    return r("incluido", `Puntuación ${p} ≥ ${cfg.umbral_incluir}.`, p);
  });
}

function imagenEstado(p: Post): Resultado["imagen"] {
  if (!p.imagen_origen) return "sin_imagen";
  return p.imagen_permiso === "propia" || p.imagen_permiso === "autorizada" ? "ok" : "pendiente_permiso";
}

/** Final state of the entry. Draft mode never publishes; automatic mode (blocked until approved) still keeps doubts and unclear images pending. */
export function estadoFinal(r: Resultado, cfg: Config): "borrador" | "revision" | "publicado" {
  if (r.decision !== "incluido") return "revision";
  if (r.imagen === "pendiente_permiso") return "revision";
  if (cfg.modo === "automatico" && cfg.aprobado_automatico === true) return "publicado";
  return "borrador";
}

export const slugify = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const yaml = (v: string) => JSON.stringify(v);

export function entrada(r: Resultado, cfg: Config, imagenWeb?: string) {
  const p = r.post;
  const estado = estadoFinal(r, cfg);
  const motivo = r.imagen === "pendiente_permiso" ? `${r.motivo} Imagen sin permiso claro de reutilización: no se publica.` : r.motivo;
  const lines = [
    "---",
    `titulo: ${yaml(p.titulo ?? "")}`,
    `fecha_publicacion: ${yaml(p.fecha_publicacion)}`,
    `estado: ${estado}`,
    `resumen: ${yaml(resumen(p.texto))}`,
    p.ponente_o_autor && `ponente_o_autor: ${yaml(p.ponente_o_autor)}`,
    p.cargo && `cargo: ${yaml(p.cargo)}`,
    p.institucion && `institucion: ${yaml(p.institucion)}`,
    p.pais && `pais: ${p.pais}`,
    p.eje_tematico && `eje_tematico: ${p.eje_tematico}`,
    imagenWeb && `imagen: ${imagenWeb}`,
    imagenWeb && `texto_alternativo: ${yaml(p.texto_alternativo ?? "")}`,
    imagenWeb && `credito: ${yaml(p.credito ?? "")}`,
    `pagina_fuente: ${p.pagina_fuente}`,
    `url_original: ${yaml(p.url_original)}`,
    `id_publicacion: ${yaml(p.id_publicacion)}`,
    `fecha_importacion: ${yaml(new Date().toISOString().slice(0, 10))}`,
    `huella_contenido: ${r.huella}`,
    r.puntuacion != null && `puntuacion: ${r.puntuacion}`,
    `motivo_decision: ${yaml(motivo)}`,
    p.sintetico && "ejemplo: true",
    "---",
    "",
    p.texto.trim(),
    "",
  ];
  return lines.filter((l) => l !== false && l !== undefined).join("\n");
}

/** Faithful excerpt: the original opening, cut at a sentence/word boundary. Never rewritten. */
export const resumen = (t: string) => {
  const s = t.trim().split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim(); // first paragraph only: lists stay in the body
  if (s.length <= 280) return s;
  const cut = s.slice(0, 280);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(". ") + 1, cut.lastIndexOf(" ")))}…`;
};

function leer<T>(f: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
}

function informe(rs: Resultado[], escribio: boolean) {
  const icon = { incluido: "✔ incluido", pendiente: "? pendiente", descartado: "✘ descartado" };
  const out = rs.map((r) => `${icon[r.decision].padEnd(13)} ${String(r.puntuacion ?? "-").padStart(4)}  ${r.post.id_publicacion}  ${(r.post.titulo ?? r.post.texto).slice(0, 60)}\n               ${r.motivo}${r.imagen === "ok" ? "  [imagen lista]" : r.imagen === "pendiente_permiso" ? "  [imagen SIN permiso]" : "  [sin imagen]"}${r.alertas.map((a) => `\n               ⚠ ${a}`).join("")}`);
  return `${out.join("\n")}\n\n${escribio ? "Escrito en la rama de trabajo." : "DRY-RUN: no se escribió ningún archivo."}`;
}

function paginaRevision(rs: Resultado[]) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const color = { incluido: "#1a7f37", pendiente: "#b36b00", descartado: "#8a1c1c" };
  const cards = rs
    .map((r) => {
      const p = r.post;
      const img = r.imagen === "ok" && p.imagen_origen ? `<img src="../../../public/actualidad/${esc(p.id_publicacion)}.webp" alt="${esc(p.texto_alternativo ?? "")}" width="240">` : `<div class="sin">${r.imagen === "pendiente_permiso" ? "Imagen sin permiso claro" : "Sin imagen"}</div>`;
      return `<article><div>${img}</div><div><b style="color:${color[r.decision]}">${r.decision.toUpperCase()} · ${r.puntuacion ?? "-"}</b>${p.sintetico ? " <i>(sintético)</i>" : ""}<h2>${esc(p.titulo ?? "(sin título)")}</h2><p class="m">${esc([p.ponente_o_autor, p.cargo, p.institucion, p.pais, p.fecha_publicacion].filter(Boolean).join(" · "))}</p><p>${esc(resumen(p.texto))}</p><p class="m">${esc(r.motivo)}</p>${r.alertas.map((a) => `<p class="a">⚠ ${esc(a)}</p>`).join("")}<a href="${esc(p.url_original)}">publicación original</a></div></article>`;
    })
    .join("");
  return `<!doctype html><meta charset="utf-8"><title>Revisión Actualidad</title><style>body{font:16px system-ui;max-width:980px;margin:2rem auto;padding:0 1rem;color:#062265}article{display:grid;grid-template-columns:240px 1fr;gap:1.5rem;padding:1.5rem 0;border-top:1px solid #ccd}h2{margin:.3rem 0;font-family:Georgia,serif}.m{color:#556;font-size:.9rem}.a{color:#8a1c1c;font-weight:600}.sin{background:#eef;height:150px;display:grid;place-items:center;color:#556}</style><h1>Bandeja de revisión · Actualidad</h1><p>Generada ${new Date().toISOString()}. Nada de esto está publicado.</p>${cards}`;
}

async function main() {
  const [cmd, archivo, ...flags] = process.argv.slice(2);
  if (cmd !== "revisar" || !archivo) throw new Error("Uso: actualidad.mts revisar <entrada.json> [--escribir]");
  const cfg = leer<Config>("actualidad.config.json");
  if (cfg.modo === "automatico" && !cfg.aprobado_automatico) throw new Error('modo "automatico" bloqueado: falta "aprobado_automatico": true (solo tras aprobar la primera tanda).');
  const escribir = flags.includes("--escribir");
  const reg = leer<Registro>(cfg.registro);
  const posts = leer<Post[]>(archivo);
  const rs = evaluar(posts, cfg, reg);
  if (!escribir) return console.log(informe(rs, false));

  const hoy = new Date().toISOString();
  for (const r of rs) {
    if (r.decision === "descartado" && r.motivo.startsWith("Duplicado")) continue; // already in the registro
    if (r.decision !== "descartado") {
      let web: string | undefined;
      if (r.imagen === "ok") {
        const dst = `public/actualidad/${r.post.id_publicacion}.webp`;
        execFileSync("python", [path.join(ROOT, "scripts/actualidad/optimizar.py"), path.join(ROOT, r.post.imagen_origen!), path.join(ROOT, dst)], { stdio: "inherit" });
        web = `/actualidad/${r.post.id_publicacion}.webp`;
      }
      const file = `src/content/actualidad/${r.post.fecha_publicacion}-${slugify(r.post.titulo ?? r.post.id_publicacion)}.md`;
      fs.writeFileSync(path.join(ROOT, file), entrada(r, cfg, web));
    }
    reg.procesados.push({ id: r.post.id_publicacion, pagina: r.post.pagina_fuente, url: r.post.url_original, fecha: r.post.fecha_publicacion, huella: r.huella, decision: r.decision, motivo: r.motivo, procesado: hoy });
  }
  fs.writeFileSync(path.join(ROOT, cfg.registro), `${JSON.stringify(reg, null, 2)}\n`);
  fs.mkdirSync(path.join(ROOT, "docs/actualidad/revision"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "docs/actualidad/revision/index.html"), paginaRevision(rs));
  console.log(informe(rs, true));
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) await main();
