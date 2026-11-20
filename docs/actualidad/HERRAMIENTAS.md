# Herramientas evaluadas (Actualidad)

| Herramienta | Decisión | Por qué |
|---|---|---|
| **Claude in Chrome** (extensión, ya conectada) | **Usada** | Controla el Chrome ya autenticado, sin tocar cookies ni APIs. Verificado: abre la página del Observatorio con sesión iniciada. |
| Pillow (Python, ya instalado) | **Usada** | `scripts/actualidad/optimizar.py`: WebP, máx. 1200 px, sin ampliar. |
| Node 22 (`.mts` sin compilar) | **Usada** | Puntuación, duplicados y registro sin dependencias nuevas. |
| Chrome DevTools MCP (`chromedevtools/chrome-devtools-mcp`) | Descartada | Redundante: Claude in Chrome ya funciona. Es el plan B si la extensión falla (`--autoConnect`, Chrome 144+). |
| Playwright MCP | Descartada | Abriría un perfil nuevo sin la sesión; solo como último recurso. |
| Skills de `skills.sh` ("browser-automation", "chrome-devtools", "image-optimization") | No instaladas | Solo se buscaron con `npx skills find`. No aportan nada que el flujo no cubra y añadir instrucciones de terceros aumenta el riesgo sin beneficio. |
| API de Meta / Graph | Prohibida | Regla 1 del encargo. |
