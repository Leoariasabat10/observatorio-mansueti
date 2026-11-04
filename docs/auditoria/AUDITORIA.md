# Auditoría visual, 2026-11-04

Sitio auditado: https://observatorio-mansueti.vercel.app (commit 84cb8bc). Capturas en esta carpeta y en `docs/capturas/` (1440 y 375 px, páginas completas).

## Qué todavía se ve "generado"

1. **Hero de manual.** Título a la izquierda, logo a la derecha, dos botones debajo. Es el esquema por defecto de cualquier plantilla. El emblema es un PNG con fondo blanco: obliga a fondos blancos y se ve como una imagen pegada, no como parte del diseño.
2. **Una sola fórmula de sección, repetida.** Casi todas las secciones abren igual: raya dorada + etiqueta + título serif de ~46 px + párrafo a la derecha. Mismo padding vertical (py-16/py-20) en todas. No hay ritmo: nada respira más ni se aprieta más.
3. **Tres franjas azules iguales.** Destacado del programa, cifras del Inicio y último boletín usan el mismo azul plano con la misma cuadrícula.
4. **Escala tipográfica tímida fuera del hero.** El serif solo es protagonista en el título principal. Los números grandes (la idea más fuerte del sistema) aparecen a 60-80 px cuando podrían ser el elemento gráfico de la página.
5. **Botones clonados.** Cada sección termina con un par "botón sólido + botón con borde" con ícono genérico de Lucide. Es la firma más reconocible de una plantilla.
6. **Tarjetas en rejilla de 3.** "Del mismo eje" y el bloque de publicaciones del Inicio son rejillas uniformes con borde gris.
7. **El emblema rasterizado aparece 5 veces por página** (encabezado, hero, afiches, pie). Pierde valor y siempre arrastra el recuadro blanco.
8. **Sin materia ni profundidad.** Todo es color plano. No hay grano, ni degradados de azul trabajados, ni sombras largas. Por eso se siente "pantalla" y no "impreso".
9. **Movimiento uniforme.** Todo entra con el mismo desplazamiento de 28 px. No hay un momento firma ni transición entre páginas.
10. **El "observatorio" no se ve como observatorio.** El mapa y la línea de tiempo son buenos pero están en segundo plano y pequeños; no hay un tablero que se sienta instrumento.
11. **Ruido de etiquetas.** Muchas etiquetas punteadas "Contenido de ejemplo" y "Dato pendiente" compiten con el contenido. Son necesarias, pero pueden consolidarse en un solo aviso por bloque.
12. **Pie de página estándar** de cuatro columnas.

## Qué hacen los referentes y este sitio no

- **Stripe:** profundidad con degradados en capas y una sola animación firma en el hero; todo lo demás es quieto y preciso.
- **Linear:** contención; jerarquía tipográfica muy clara, luz y grano sutiles, movimiento medido.
- **Apple:** momentos de tipografía enorme y una historia contada al hacer scroll, con mucho aire alrededor.
- **The Economist:** sistema editorial (antetítulo, título, entradilla, firma), filetes finos, un solo acento de color y gráficos con estilo propio.
- **Pentagram / ganadores de Awwwards:** retícula disciplinada, tipografía como imagen, listas que muestran una vista previa al pasar el cursor, cero adorno sin función.

Resumen: este sitio está bien construido y es accesible, pero le falta un **momento firma**, **ritmo** entre secciones, **sistema editorial** y **materia**.

## Mejoras priorizadas (impacto primero)

| # | Mejora | Dónde | Impacto |
|---|---|---|---|
| 1 | **Hero firma "carta de navegación":** fondo azul profundo con degradado y grano; mapa de Sudamérica en malla de puntos con filetes de coordenadas y rumbos desde Bogotá; título enorme (≈9vw) con revelado por líneas; el próximo webinar como "coordenada" en vivo. El emblema sale del hero (queda en encabezado y pie, en versión sin fondo). | Inicio | Muy alto |
| 2 | **Sistema tipográfico editorial:** escala dramática (titulares de 96-160 px en escritorio), antetítulo + título + entradilla, números enormes como gráfico, tracking óptico, filetes de 1 px. Elegir par tipográfico (abajo). | Todo el sitio | Muy alto |
| 3 | **Ritmo de secciones:** alternar ancho completo, columna de lectura estrecha y rejillas desplazadas; paddings variables; quitar la fórmula raya + etiqueta en la mitad de las secciones. | Todo el sitio | Alto |
| 4 | **Programa académico como cartel editorial:** el destacado como portada de revista (afiche grande + fecha monumental + cuenta regresiva con dígitos que ruedan); la bitácora como tabla con filetes y **vista previa del afiche que sigue al cursor** en escritorio. | Programa | Alto |
| 5 | **Tablero del observatorio:** sección con mapa grande de puntos (países y eventos), línea de tiempo, barras por eje y contadores "odómetro". Datos tomados del contenido (marcados como ejemplo) y casillas "Dato pendiente". | Inicio | Alto |
| 6 | **Materia y profundidad:** grano SVG al 3 %, degradados radiales de marino (#0B2F85 → #03174A), sombras largas y suaves en afiches; dorado solo como filete o punto. | Todo el sitio | Medio-alto |
| 7 | **Movimiento con jerarquía:** un solo momento firma por página (hero), revelado por líneas en titulares, transiciones entre páginas (View Transitions), botones con micro-interacción de flecha; el resto quieto. | Todo el sitio | Medio-alto |
| 8 | **Sistema de botones y enlaces:** un primario sólido, enlaces de texto con subrayado animado; eliminar los pares de botones repetidos; íconos solo donde informan. | Todo el sitio | Medio |
| 9 | **Emblema vectorial o sin fondo:** recortar el fondo blanco del PNG para usarlo sobre azul; usarlo menos. | Marca | Medio |
| 10 | **Pie de página editorial:** nombre del Observatorio en serif a todo lo ancho, columnas compactas debajo. | Todo el sitio | Medio |
| 11 | **Publicaciones como índice de biblioteca:** años monumentales en el margen, portadas tipográficas por categoría. | Publicaciones | Medio |
| 12 | **Avisos de ejemplo consolidados:** un solo aviso por página y una marca discreta por elemento. | Todo el sitio | Bajo |

## Tipografía: dos opciones (captura `tipografia-opciones.jpg`)

- **A. Libre Caslon Display + Archivo** (actual). Clásica y sobria; alto contraste moderado.
- **B. Bodoni Moda + Schibsted Grotesk.** Didona de alto contraste con eje óptico (más "revista de lujo"), y una grotesca editorial diseñada para un grupo de medios. Recomendada para el salto premium.

Ambas OFL, autoalojadas con `next/font`, soporte completo de español.

## Herramientas propuestas para el bloque B

| Herramienta | Uso | Peso | Decisión |
|---|---|---|---|
| Motion (MIT) | Revelado por líneas, odómetro, vista previa que sigue al cursor | ~15-30 KB con carga parcial | Sí |
| CSS scroll-driven (nativo) | Revelados al scroll (ya en uso) | 0 KB | Mantener |
| View Transitions (nativo) | Transición entre páginas | 0 KB | Sí, si Next 16 lo permite en export estático |
| GSAP + ScrollTrigger | Secuencias largas de scroll | ~45 KB | No, salvo que Motion no alcance |
| Lenis (MIT) | Scroll suave | ~4 KB | No recomendado: altera el scroll nativo y la accesibilidad sin aportar a un sitio de lectura; puedo probarlo si lo pides |
| d3-geo (ya instalado) | Mapa de puntos generado al compilar | 0 KB en cliente | Sí |
| Three.js | Globo 3D | ~150 KB | No por ahora: la malla de puntos en SVG da el efecto sin costo |

## Bloque D: estado real del editor

- **Hecho:** Sveltia CMS en `/admin` (verificado en producción), colecciones de webinars, publicaciones y cifras, subida de afiches y PDF.
- **Falta:** el repositorio en la organización de GitHub (hoy `repo: ORGANIZACION/observatorio-asdtss`) y la forma de entrar de la clienta.
- **Compatibilidad con la exportación estática:** sin conflicto. Sveltia es una página estática que escribe en GitHub; Vercel publica cada cambio.
- **Opciones de acceso para la clienta:**
  1. **Cuenta de GitHub + botón "Iniciar sesión con GitHub"** mediante un conector OAuth gratuito en Cloudflare Workers (sveltia-cms-auth, MIT). Ella entra con usuario y clave, como en cualquier sitio. *Recomendada.* Requiere 15 minutos de configuración por parte de la agencia.
  2. **Token de GitHub pegado una vez.** Sin servidor extra, pero el token vence y es poco amigable.
  3. **Sin GitHub** (correo y clave): requiere otro proveedor (Decap + Netlify Identity o un CMS con nube propia). Más piezas y posibles costos. No recomendado.
- **Faltan colecciones:** ejes y contacto/redes (se agregarán en el bloque D).

## Asociación ASDTSS: portada como segunda fase (sin construir)

Estructura propuesta (benchmark aidtss.org, solo como arquitectura): encabezado institucional con sello; presentación y misión; homenaje a Hugo Roberto Mansueti; junta directiva; eventos y congresos; publicaciones; enlace al Observatorio como iniciativa de la Asociación; contacto. Alcance: una portada + páginas internas mínimas, reutilizando el sistema de contenido del Observatorio. Pendiente de aprobación.
