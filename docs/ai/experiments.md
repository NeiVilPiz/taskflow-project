## Proceso (experimentos de IA + MCP)

Este documento resume el flujo completo realizado en el repo `D:/Proyectos/git` para:
- Comprobar que el servidor MCP `filesystem` funciona y permite acceder a contenido real del proyecto.
- Preparar plantillas de prompting para generar/refactorizar/documentar código de forma consistente.


## 1) Verificación del servidor MCP (filesystem)

### Config del servidor
La configuración usada está en `.cursor/mcp.json`, con el servidor:
- Tipo: `filesystem`
- Root permitido: `D:/Proyectos/git`
- Comando: `npx -y @modelcontextprotocol/server-filesystem D:/Proyectos/git`

### Objetivo
Confirmar que el MCP server responde correctamente con información real del proyecto, realizando al menos 5 consultas distintas.

### Evidencia (herramientas y resultados)
Para probarlo de forma determinista se ejecutaron múltiples llamadas MCP usando el SDK oficial en un entorno temporal (instalación del SDK en `TEMP` para no ensuciar el repo).

Llamadas realizadas (6 consultas distintas):
1. `list_allowed_directories`
   - Resultado: acceso permitido a `D:\Proyectos\git`
2. `list_directory` sobre el root
   - Resultado: listó carpetas y archivos del proyecto, incluyendo `app.js` e `index.html`
3. `read_file` de `README.md`
   - Resultado: devolvió el contenido del README (empezando por `# TaskFlow`)
4. `search_files` con patrón `app.js`
   - Resultado: devolvió la ruta `D:\Proyectos\git\app.js`
5. `get_file_info` de `index.html`
   - Resultado: metadatos del archivo (por ejemplo `size: 4400`, fechas, tipo archivo)
6. `directory_tree` del root
   - Resultado: árbol JSON con estructura del proyecto (por ejemplo `.cursor`, `.git`, `docs`, etc.)

Conclusión: el servidor MCP `filesystem` está funcionando y permite a la IA obtener contenido real dentro del root configurado.

---

## 2) Prompts de Prompt Engineering

### Objetivo
Crear una guía práctica de prompting con plantillas reutilizables para:
- Definir rol (p. ej. “actúa como un desarrollador senior”)
- few-shot prompting (ejemplos antes/después)
- pedir un “plan” como “paso a paso” (sin forzar razonamiento interno)
- restricciones claras de formato y contenido en la respuesta
- uso para generar código, refactorizar funciones y documentar el proyecto

### Cambios aplicados
Se creó/extendió `docs/ai/prompt-engineering.md` y se añadieron 13 prompts útiles (más que el mínimo pedido de 10), ajustando también el texto para evitar errores de formato.

---

## 3) Resultado final

En conjunto, el proyecto quedó con:
- `app.js` refactorizado en nombres para mejorar claridad.
- Verificación MCP completa (múltiples llamadas con resultados).
- Documentación de “prompt engineering” con plantillas copiables.

---

## 4) Archivos tocados
- `docs/ai/experiments.md`
- `docs/ai/prompt-engineering.md`
- `app.js`
