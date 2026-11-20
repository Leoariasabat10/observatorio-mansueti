// Run: node --no-warnings scripts/actualidad/prueba.mts   (synthetic data only; fails loudly if the editorial logic breaks)
import assert from "node:assert/strict";
import fs from "node:fs";
import { entrada, estadoFinal, evaluar, huella, puntuar, resumen, slugify, type Config, type Post } from "./actualidad.mts";

const cfg: Config = JSON.parse(fs.readFileSync("actualidad.config.json", "utf8"));
const posts: Post[] = JSON.parse(fs.readFileSync("scripts/actualidad/muestra.json", "utf8"));
const rs = evaluar(posts, cfg, { procesados: [] });
const por = (id: string) => rs.find((r) => r.post.id_publicacion === id && !r.motivo.startsWith("Duplicado"))!;

assert.equal(puntuar({ pertinencia: 10, valor: 10, region: 10, fuente: 10, vigencia: 10 }, cfg.pesos), 10);
assert.throws(() => puntuar({ pertinencia: 11, valor: 1, region: 1, fuente: 1, vigencia: 1 }, cfg.pesos));
assert.equal(huella("¡Hola,  Mundo!"), huella("hola mundo"), "la huella ignora mayúsculas, signos y espacios");

assert.equal(por("SINT-001").decision, "incluido", "ejemplo de Perú: incluido");
assert.equal(por("SINT-002").decision, "descartado", "saludo genérico: descartado");
assert.equal(rs[2].decision, "descartado");
assert.match(rs[2].motivo, /Duplicado/, "mismo id: duplicado");
assert.equal(por("SINT-004").decision, "incluido");
assert.equal(por("SINT-004").imagen, "pendiente_permiso");
assert.equal(estadoFinal(por("SINT-004"), cfg), "revision", "imagen de tercero: nunca sale como borrador listo ni publicado");
assert.equal(por("SINT-005").decision, "pendiente", "sin título: pendiente");
assert.equal(por("SINT-006").decision, "pendiente", "inyección: pendiente");
assert.ok(por("SINT-006").alertas.length > 0, "inyección: se reporta");
assert.equal(por("SINT-007").decision, "pendiente", "puntaje intermedio: pendiente");

// Modo borrador nunca publica; automático sin aprobación tampoco.
assert.equal(estadoFinal(por("SINT-001"), cfg), "borrador");
assert.equal(estadoFinal(por("SINT-001"), { ...cfg, modo: "automatico" }), "borrador");
assert.equal(estadoFinal(por("SINT-001"), { ...cfg, modo: "automatico", aprobado_automatico: true }), "publicado");
assert.equal(estadoFinal(por("SINT-007"), { ...cfg, modo: "automatico", aprobado_automatico: true }), "revision", "dudosos siempre pendientes");

// Aprobación humana: publica solo si está incluido y con imagen utilizable.
const ok = { ...por("SINT-001"), post: { ...por("SINT-001").post, aprobado: true, imagen_origen: "x.png", imagen_permiso: "propia" as const }, imagen: "ok" as const };
assert.equal(estadoFinal(ok, cfg), "publicado");
assert.equal(estadoFinal({ ...ok, decision: "pendiente" }, cfg), "revision", "aprobado no salta la decisión editorial");
assert.equal(estadoFinal({ ...ok, imagen: "pendiente_permiso" }, cfg), "revision", "aprobado no salta el permiso de imagen");

// Descarte editorial explícito gana sobre la puntuación.
assert.equal(evaluar([{ ...posts[0], id_publicacion: "SINT-D", descartar: "duplicado" }], cfg, { procesados: [] })[0].decision, "descartado");

// Segunda corrida: lo ya registrado es duplicado.
const reg = { procesados: [{ id: "SINT-001", pagina: "observatorio", url: "", fecha: "", huella: por("SINT-001").huella, decision: "incluido" as const, motivo: "", procesado: "" }] };
assert.match(evaluar([posts[0]], cfg, reg)[0].motivo, /Duplicado/);

// Límite por página.
assert.equal(evaluar(posts.slice(0, 3), { ...cfg, maximo_posts_por_pagina: 1 }, { procesados: [] })[1].decision, "pendiente");

// Entrada generada: etiqueta de ejemplo y sin imagen sin permiso.
const md = entrada(por("SINT-001"), cfg);
assert.match(md, /ejemplo: true/);
assert.match(md, /estado: borrador/);
assert.doesNotMatch(entrada(por("SINT-004"), cfg), /^imagen:/m);
assert.equal(slugify("Año de la Reforma: ¡Ya!"), "ano-de-la-reforma-ya");
assert.ok(resumen("a ".repeat(400)).endsWith("…"));

console.log("actualidad: todas las pruebas pasan (datos sintéticos)");
