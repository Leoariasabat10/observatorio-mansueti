// Run: npm run check. Fails loudly if the Bogotá time rules break.
import assert from "node:assert/strict";
import { estadoDe, fechaLarga, horaBogota, restante, startMs } from "../src/lib/webinar-time.ts";

const s = startMs("2026-11-12", "18:00");
assert.equal(new Date(s).toISOString(), "2026-11-12T23:00:00.000Z"); // 18:00 Bogotá = 23:00 UTC
assert.equal(horaBogota(s).replace(/\s/g, " "), "6:00 p. m."); // 12-hour, as in the official posters
assert.match(fechaLarga(s), /jueves, 12 de noviembre de 2026/);
assert.equal(estadoDe(s, 90, s - 1), "proximo");
assert.equal(estadoDe(s, 90, s), "en-vivo");
assert.equal(estadoDe(s, 90, s + 89 * 60_000), "en-vivo");
assert.equal(estadoDe(s, 90, s + 90 * 60_000), "pasado");
assert.deepEqual(restante(s, s - (2 * 1440 + 3 * 60 + 5) * 60_000), { dias: 2, horas: 3, minutos: 5 });
assert.deepEqual(restante(s, s + 1), { dias: 0, horas: 0, minutos: 0 });
console.log("webinar-time OK");
