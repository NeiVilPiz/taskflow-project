# Consultas de prueba usando el MCP server `filesystem`

Estas consultas están pensadas para que Cursor use el MCP server `filesystem` y acceda al contenido real dentro del root `D:/Proyectos/git`.

## Cómo usarlas
1. Abre Cursor y asegúrate de que el chat/assistente tenga disponible el MCP `filesystem`.
2. Copia y pega cada prompt (del 1 al 5+).
3. Verifica que la respuesta incluya información que solo se puede obtener leyendo archivos del proyecto (por ejemplo `README.md`, `app.js`, `index.html`).

---

## 1) Listar archivos del proyecto (root)
**Prompt:**
> Usando el MCP server `filesystem`, lista los archivos y carpetas de primer nivel dentro del directorio del proyecto (root configurado). Devuélveme la lista en una sección llamada `Top-level`.

## 2) Leer el README
**Prompt:**
> Usando MCP `filesystem`, lee `README.md` y resume en 5 bullets: objetivo del proyecto, tecnologías, y qué funcionalidades describe.

## 3) Identificar una función clave en `app.js`
**Prompt:**
> Usando MCP `filesystem`, busca en `app.js` la función `clearCompletedTasks` y explica qué hace (entrada/salida y efectos). Si es necesario, cita el fragmento relevante.

## 4) Extraer el comportamiento de búsqueda/búsqueda de tareas
**Prompt:**
> Usando MCP `filesystem`, en `app.js` localiza cómo se implementa la búsqueda: variables relacionadas (por ejemplo `searchInput`, `searchText`) y la función/lógica que filtra por búsqueda. Resume el flujo completo.

## 5) Ver relación entre HTML y JS (tema oscuro)
**Prompt:**
> Usando MCP `filesystem`, revisa `index.html` y `app.js` para explicar cómo funciona el toggle de modo oscuro: qué elemento en el HTML se usa y qué funciones se ejecutan en el JS.

## 6) Comprobar consistencia: botones de UI vs handlers
**Prompt:**
> Usando MCP `filesystem`, verifica si los botones del HTML con ids `completeAll` y `clearCompleted` tienen listeners correspondientes en `app.js`. Si falta alguno, dímelo; si están, describe a qué funciones llaman.

