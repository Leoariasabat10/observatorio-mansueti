// South America map of where speakers join from, drawn as static SVG at build time
// (d3-geo + Natural Earth 1:110m via world-atlas). Zero JavaScript reaches the browser.
import { geoCentroid, geoGraticule, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { paises } from "@/lib/paises";

const W = 480;
const H = 600;
const BOGOTA: [number, number] = [-74.0722, 4.6045]; // Carrera 7 # 17-57, Bogotá

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const todos = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;
const idsSud = new Set(Object.values(paises).filter((p) => p.sudamerica).map((p) => p.id));
const sud = todos.features.filter((f) => idsSud.has(String(f.id)));
const proj = geoMercator().fitExtent([[24, 16], [W - 16, H - 16]], { type: "FeatureCollection", features: sud });
const path = geoPath(proj);

const pt = (lonlat: [number, number]) => proj(lonlat) as [number, number];

// Curved course from Bogotá to each country: a quadratic arc bent to one side, like a plotted route.
function rumbo(a: [number, number], b: [number, number]) {
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const k = 0.18;
  return `M${a[0]},${a[1]} Q${mx - dy * k},${my + dx * k} ${b[0]},${b[1]}`;
}

export type ConteoPais = { codigo: string; ponentes: number };

export function MapaPonentes({ conteo }: { conteo: ConteoPais[] }) {
  const porId = new Map(conteo.map((c) => [paises[c.codigo]?.id, c]));
  const origen = pt(BOGOTA);
  const lat = [0, -10, -20, -30, -40, -50];
  const grat = geoGraticule().step([10, 10]).extent([[-95, -60], [-30, 15]])();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="mapa-titulo mapa-desc" className="h-auto w-full">
      <title id="mapa-titulo">Mapa de Sudamérica con los países de origen de los ponentes</title>
      <desc id="mapa-desc">
        {conteo.map((c) => `${paises[c.codigo]?.nombre}: ${c.ponentes}`).join("; ")}. Las líneas parten de Colombia, sede del Observatorio.
      </desc>

      <path d={path(grat) ?? ""} fill="none" stroke="#062265" strokeOpacity=".07" />
      {lat.map((l) => {
        const [, y] = pt([-92, l]);
        return (
          <text key={l} x={4} y={y - 4} className="fill-muted text-[10px]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {l === 0 ? "0°" : `${-l}° S`}
          </text>
        );
      })}

      {sud.map((f: Feature<Geometry, { name: string }>) => {
        const c = porId.get(String(f.id));
        return (
          <path
            key={String(f.id)}
            d={path(f) ?? ""}
            fill={c ? "#1870C7" : "#FFFFFF"}
            fillOpacity={c ? 0.16 + Math.min(c.ponentes, 4) * 0.08 : 1}
            stroke="#062265"
            strokeOpacity={c ? 0.55 : 0.22}
            strokeWidth={0.8}
          >
            <title>{c ? `${f.properties.name}: ${c.ponentes} ${c.ponentes === 1 ? "ponente" : "ponentes"}` : f.properties.name}</title>
          </path>
        );
      })}

      {sud
        .filter((f) => porId.has(String(f.id)) && String(f.id) !== paises.CO.id)
        .map((f) => (
          <path key={`r${f.id}`} d={rumbo(origen, pt(geoCentroid(f) as [number, number]))} fill="none" stroke="#062265" strokeOpacity=".45" strokeDasharray="3 4" />
        ))}

      {sud
        .filter((f) => porId.has(String(f.id)) && String(f.id) !== paises.CO.id) // Colombia is marked by Bogotá
        .map((f) => {
          const [x, y] = pt(geoCentroid(f) as [number, number]);
          return <circle key={`p${f.id}`} cx={x} cy={y} r={4.5} fill="#062265" stroke="#fff" strokeWidth={2} />;
        })}

      <circle cx={origen[0]} cy={origen[1]} r={11} fill="none" stroke="#FCC833" strokeWidth={1.5} />
      <circle cx={origen[0]} cy={origen[1]} r={5} fill="#FCC833" stroke="#062265" strokeWidth={1.5} />
      <text x={origen[0] + 16} y={origen[1] - 6} className="fill-navy text-[13px] font-semibold">
        Colombia
      </text>
    </svg>
  );
}
