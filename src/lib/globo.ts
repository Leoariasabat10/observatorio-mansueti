// Orthographic "telescope view" of South America as a halftone dot grid, computed at build time.
// Dots are sampled on an even screen grid and kept only where the point falls on land (Natural Earth 1:110m),
// so every dot is geographically exact. Routes are great circles from Bogotá to each South American capital.
import { geoCentroid, geoContains, geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries from "world-atlas/countries-110m.json";
import land from "world-atlas/land-110m.json";
import { paises } from "@/lib/paises";

export const GLOBO = 640; // viewBox size
const R = 300;
const PASO = 8.5; // dot pitch in viewBox units
const RADIO_PUNTO = 1.55;

// Real coordinates [lon, lat]. Office: Carrera 7 # 17-57, Bogotá.
export const BOGOTA: [number, number] = [-74.0722, 4.6045];
export const CAPITALES: { pais: string; ciudad: string; lonlat: [number, number] }[] = [
  { pais: "VE", ciudad: "Caracas", lonlat: [-66.9036, 10.4806] },
  { pais: "GY", ciudad: "Georgetown", lonlat: [-58.1553, 6.8013] },
  { pais: "SR", ciudad: "Paramaribo", lonlat: [-55.2038, 5.852] },
  { pais: "EC", ciudad: "Quito", lonlat: [-78.4678, -0.1807] },
  { pais: "PE", ciudad: "Lima", lonlat: [-77.0428, -12.0464] },
  { pais: "BR", ciudad: "Brasilia", lonlat: [-47.8825, -15.7942] },
  { pais: "BO", ciudad: "La Paz", lonlat: [-68.1193, -16.4897] },
  { pais: "PY", ciudad: "Asunción", lonlat: [-57.5759, -25.2637] },
  { pais: "CL", ciudad: "Santiago", lonlat: [-70.6693, -33.4489] },
  { pais: "AR", ciudad: "Buenos Aires", lonlat: [-58.3816, -34.6037] },
  { pais: "UY", ciudad: "Montevideo", lonlat: [-56.1645, -34.9011] },
];

const proj = geoOrthographic()
  .rotate([64, 16]) // centers the view on South America
  .scale(R)
  .translate([GLOBO / 2, GLOBO / 2])
  .clipAngle(90);
const path = geoPath(proj);

const topoC = countries as unknown as Topology<{ countries: GeometryCollection }>;
const topoL = land as unknown as Topology<{ land: GeometryCollection }>;
const todos = feature(topoC, topoC.objects.countries) as FeatureCollection<Geometry, { name: string }>;
const idsSud = new Set(Object.values(paises).filter((p) => p.sudamerica).map((p) => p.id));
const sudamerica: FeatureCollection = { type: "FeatureCollection", features: todos.features.filter((f) => idsSud.has(String(f.id))) as Feature[] };
const tierra = feature(topoL, topoL.objects.land) as unknown as FeatureCollection;

const r1 = (n: number) => Math.round(n * 10) / 10;
const punto = (x: number, y: number) => `M${r1(x - RADIO_PUNTO)} ${r1(y)}a${RADIO_PUNTO} ${RADIO_PUNTO} 0 1 0 ${RADIO_PUNTO * 2} 0a${RADIO_PUNTO} ${RADIO_PUNTO} 0 1 0 ${-RADIO_PUNTO * 2} 0`;

function calcular() {
  let sud = "";
  let resto = "";
  const c = GLOBO / 2;
  for (let y = c - R + PASO / 2; y < c + R; y += PASO) {
    // Offset every other row: a hexagonal halftone reads finer than a square grid.
    const fila = Math.round((y - (c - R)) / PASO);
    for (let x = c - R + (fila % 2 ? PASO / 2 : 0); x < c + R; x += PASO) {
      if ((x - c) ** 2 + (y - c) ** 2 > (R - 2) ** 2) continue;
      const ll = proj.invert!([x, y]);
      if (!ll) continue;
      if (geoContains(sudamerica, ll)) sud += punto(x, y);
      else if (geoContains(tierra, ll)) resto += punto(x, y);
    }
  }
  const origen = proj(BOGOTA)!;
  const rutas = CAPITALES.map((k) => ({
    ...k,
    d: path({ type: "LineString", coordinates: [BOGOTA, k.lonlat] }) ?? "",
    xy: proj(k.lonlat)!,
  }));
  return {
    sud,
    resto,
    esfera: path({ type: "Sphere" }) ?? "",
    graticula: path(geoGraticule().step([15, 15])()) ?? "",
    origen,
    rutas,
    centroSud: proj(geoCentroid(sudamerica))!,
  };
}

let cache: ReturnType<typeof calcular> | undefined;
export const globo = () => (cache ??= calcular());

/**
 * Static base layer of the globe (ring, sphere, graticule, dots) as an SVG document.
 * Served at /globo-base.svg and injected inline after load: inline SVG is not an LCP candidate, and
 * fetching it keeps ~2,000 dots out of the page HTML and the RSC payload (which would duplicate them).
 * Routes, Bogotá and labels are rendered on top by the Globo component.
 */
export function globoBaseSvg() {
  const g = globo();
  const c = GLOBO / 2;
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3)
    .map((a) => `<line x1="${c}" y1="${c - 318}" x2="${c}" y2="${c - (a % 30 === 0 ? 306 : 312)}" transform="rotate(${a} ${c} ${c})" stroke-opacity="${a % 30 === 0 ? 0.4 : 0.16}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GLOBO} ${GLOBO}" width="100%" height="100%" aria-hidden="true">
<defs><radialGradient id="globo-luz" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#123a9c" stop-opacity=".55"/><stop offset=".6" stop-color="#062265" stop-opacity=".25"/><stop offset="1" stop-color="#03174a" stop-opacity="0"/></radialGradient></defs>
<g stroke="#fff">${ticks}</g>
<path d="${g.esfera}" fill="url(#globo-luz)" stroke="#9cc9f5" stroke-opacity=".35"/>
<path d="${g.graticula}" fill="none" stroke="#9cc9f5" stroke-opacity=".1"/>
<path d="${g.resto}" fill="#9cc9f5" fill-opacity=".16"/>
<path d="${g.sud}" fill="#9cc9f5" fill-opacity=".62"/>
</svg>`;
}

