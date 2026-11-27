# Sistema de diseño: Observatorio ASDTSS

Documenta lo que ya existe en el código (`src/app/globals.css`, componentes). Si algo cambia, cambia el código y luego este archivo.

## Concepto
Un telescopio / bitácora de eventos regionales: retícula de coordenadas (`.graticula`), reticle, mapa de ponentes con rutas desde Bogotá. Un solo momento destacado por página; el resto es silencioso.

## Color (tokens en `globals.css`, tomados del logo)
| Token | Hex | Uso |
|---|---|---|
| `navy` | `#062265` | Texto, encabezados, superficies oscuras |
| `navy-deep` | `#03174A` | Pie de página |
| `blue` | `#1870C7` | Enlaces y acentos (AA sobre blanco) |
| `sky` | `#9CC9F5` | Azul sobre navy |
| `gold` | `#FCC833` | Filetes y puntos; nunca texto sobre blanco |
| `heritage` | `#8E2B14` | Solo el nombre del homenajeado y avisos de contenido de ejemplo/borrador |
| `paper` / `card` / `rule` / `muted` | `#f5f8fc` / `#fff` / `#dce3ee` / `#4a5878` | Fondo, tarjetas, líneas, texto secundario |

Colores de eje temático: `src/content/ejes.json`, siempre con el nombre del eje al lado del punto. El rojo `danger` se reserva para «en vivo».

## Tipografía
`Bodoni Moda` solo a tamaños grandes (títulos, cifras, fechas, encabezados de 20 px o más) + `Schibsted Grotesk` para texto, etiquetas y navegación. Cuerpo de lectura largo en `font-serif`. Cifras con `.tnum`. Los títulos de Actualidad largos (más de 85 caracteres) bajan de tamaño para no ocupar cinco líneas.

## Superficies y patrones
- Material: `.noche` (degradado navy), `.grano`, `.sombra-larga`; el dorado solo como filete o punto.
- Botones: uno sólido por bloque; las acciones secundarias son `.enlace`.
- Filtros: chips con `aria-pressed`, estado en la URL (`useFiltrosUrl`), transición con View Transitions nativas. Sin librerías de animación.
- Movimiento: solo CSS nativo y siempre respetando `prefers-reduced-motion`.
- Fichas: `<dl>` sobre `.graticula` con borde `rule` (publicaciones y Actualidad).

## Actualidad (`/actualidad`)
- Cabecera con retícula, título a gran escala y una nota lateral con el conteo de entradas.
- Filtros por país y por eje; contador accesible (`role="status"`).
- La entrada más reciente va destacada (imagen 3:2 + texto); el resto, agrupado por mes, en cuadrícula de 1/2/3 columnas con tarjeta: imagen 3:2 recortada arriba, fecha · país, título, extracto (nunca repite el título), eje y etiqueta «Evento realizado» cuando aplica.
- Detalle: título, autoría, enlace a la publicación original, imagen con crédito, texto fiel, ficha (fecha, país, eje, fuente, crédito de imagen), entradas relacionadas y navegación anterior/siguiente.
- Las notas de verificación se escriben como cita (`> **Nota de verificación.** …`) y se muestran en recuadro.
- Imágenes: capturas del visor de Facebook (no son archivos originales), nunca ampliadas; ilustraciones editoriales (mapas, piezas con datos verificados) siempre rotuladas.

## Lenguaje (acordado 2026-11-27)
- El programa académico habla de «sesiones» (sirve para webinars, conversatorios y encuentros), no de «webinars».
- Horas en formato de 12 horas, como en los afiches oficiales: «7:00 p. m.» (`horaBogota` en `src/lib/webinar-time.ts`).
- Trato de «usted» en todo el sitio.
- Títulos de portada de sección (h1) con tope de 6rem y sin eyebrow encima; los eyebrows existentes en secciones internas se conservan.
- Con enlace de reunión (campo `reunion`) el botón sólido es «Unirse en <plataforma>» y en vivo «Entrar ahora». Sin enlace público, «Cómo participar» ofrece WhatsApp, correo y afiche; en vivo, pedir el enlace pasa a ser el botón sólido.
- Las moderadoras se listan aparte y no cuentan como ponentes en cifras ni en el mapa (`esModeracion`).

## Prohibido (acordado)
Eyebrow o kicker sobre títulos nuevos, bordes laterales gruesos, texto con degradado, tarjetas anidadas, sombras duras, fotos genéricas o retratos inventados.
