# Model Context Protocol (MCP) en Cursor - Guía paso a paso

## Qué es MCP
Model Context Protocol (MCP) es una especificación para conectar a un modelo (IA) con "capacidades" externas (servidores) como:
- leer/escribir archivos
- listar directorios
- consultar sistemas externos (por ejemplo GitHub)

En Cursor, MCP permite que el asistente use herramientas conectadas (MCP servers) para obtener información real del proyecto y actuar en consecuencia.

## Objetivo de este repo
Usar un MCP server del tipo `filesystem` para que la IA pueda consultar información del directorio del proyecto `D:/Proyectos/git`.

---

## Requisitos
1. Node.js instalado en Windows (incluye `npm` y `npx`).
2. Cursor configurado para leer el archivo `.cursor/mcp.json`.

### 1) Instalar Node.js (necesario para `npx`)
1. Descarga Node.js LTS desde: https://nodejs.org/
2. Ejecuta el instalador y completa el asistente.
3. Cierra y vuelve a abrir PowerShell.

### 2) Verificar que `npx` funciona
En PowerShell ejecuta:
```powershell
node -v
npm -v
npx -v
```

Si alguno falla, repite la instalación o revisa que Node se haya agregado al `PATH`.

---

## Configurar el MCP server en Cursor

### Paso 1: Asegúrate de que existe `.cursor/mcp.json`
En este repo, el archivo ya existe: `.cursor/mcp.json`.

La configuración relevante es:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:/Proyectos/git"
      ]
    }
  }
}
```

Puntos clave:
- `command: "npx"`: Cursor ejecuta el servidor con `npx` (lo descarga/ejecuta).
- El argumento final `D:/Proyectos/git` define la raíz permitida del filesystem.
- El server solo debería acceder a rutas dentro de ese root.
- La primera vez puede tardar unos segundos porque `npx` descarga `@modelcontextprotocol/server-filesystem`.

### Paso 2: Reinicia Cursor
Después de modificar/crear `.cursor/mcp.json`, reinicia Cursor para que cargue el servidor MCP.

---

## Comprobar que funciona (desde Cursor)
Usa las 5+ consultas de prueba en `MCP_QUERIES.md`.

Indicador de que está funcionando:
- En las respuestas, la IA debería citar/usar contenido que provenga del archivo del proyecto.
- Cursor suele mostrar qué herramientas/MCP servers se usaron (según tu UI/configuración).

---

## Casos donde MCP es útil en proyectos reales
1. Navegación y análisis profundo del código
   - Pedir a la IA que inspeccione archivos concretos (por ejemplo `package.json`, módulos de rutas, tests) y construya un resumen con referencias reales.
2. Respuestas basadas en estado real del repo
   - Evitar que la IA “invente”: al pedir datos del proyecto (config, cambios, estructura), MCP permite consultar la fuente de verdad.
3. Automatizar tareas repetitivas de desarrollo
   - Por ejemplo: localizar endpoints, deducir dependencias, generar checks de consistencia, o preparar diffs con contexto del repo.
4. Integraciones externas (GitHub, CI, Issues, etc.)
   - Con servidores MCP dedicados, el asistente puede leer issues/PRs, revisar workflow de CI, o sugerir cambios ligados a tickets.
5. Control de permisos por root (seguridad)
   - El servidor `filesystem` restringido a un directorio reduce riesgos de que la IA acceda a rutas sensibles fuera del proyecto.

## Recomendaciones prácticas
- Restringe `root`/paths permitidos a lo mínimo necesario.
- Mantén la configuración (`.cursor/mcp.json`) versionada dentro del repo para que el equipo pueda reproducir el entorno.
- Cuando uses servidores como GitHub, usa tokens con permisos mínimos y evita exponer secretos en commits.

---

## Referencias
- Documentación de MCP en Cursor: https://cursor.sh/docs/mcp
- MCP filesystem server (paquete npm): https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem

