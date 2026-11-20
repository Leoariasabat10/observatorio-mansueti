// Editorial illustration: a country highlighted on a plain map (Natural Earth via world-atlas, public domain).
// node scripts/actualidad/mapa-editorial.mjs <ISO2> <numeric-id> <Nombre> <out.html> [lon0 lat0 lon1 lat1]
// Then render the HTML to PNG with headless Chrome (see docs/actualidad/GUIA.md).
import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const [, , iso, id, nombre, out, ...bb] = process.argv;
const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const todos = feature(topo, topo.objects.countries).features;
const pais = todos.find((f) => f.id === id);
if (!pais) throw new Error(`id ${id} no encontrado`);
const W = 1200, H = 800;
const [lon0, lat0, lon1, lat1] = bb.length === 4 ? bb.map(Number) : [-95, -58, -30, 14];
const ventana = { type: "MultiPoint", coordinates: [[lon0, lat0], [lon1, lat1]] };
const proy = geoMercator().fitExtent([[W * 0.52, 60], [W - 50, H - 60]], ventana);
const path = geoPath(proy);
const vecinos = todos.filter((f) => f.id !== id).map((f) => `<path d="${path(f) ?? ""}" fill="#dfe6f3" stroke="#fff" stroke-width="1.2"/>`).join("");
const dest = `<path d="${path(pais)}" fill="#062265" stroke="#FCC833" stroke-width="3"/>`;
const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:#f3f6fb}
.l{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;color:#062265}
svg{position:absolute;inset:0}
.t{position:absolute;left:70px;top:210px;width:560px}
.k{font:600 20px/1 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#1870C7}
h1{font-size:86px;line-height:1;margin:28px 0 0;font-weight:500;letter-spacing:-.01em}
.r{width:70px;height:3px;background:#FCC833;margin:34px 0 26px}
p{font:22px/1.5 Arial,sans-serif;margin:0;color:#3d4d78}
.f{position:absolute;left:70px;bottom:44px;font:16px Arial,sans-serif;color:#6b7aa0}
</style><div class="l"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${vecinos}${dest}</svg>
<div class="t"><div class="k">Observatorio ASDTSS</div><h1>${nombre}</h1><div class="r"></div><p>Ilustración editorial</p></div>
<div class="f">Mapa: Natural Earth (dominio público). Ilustración, no fotografía.</div></div>`;
fs.writeFileSync(out, html);
console.log("ok", iso, out);
