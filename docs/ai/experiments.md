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

---

## 5) Experimento: resolver problemas “sin IA” vs “con IA”

Nota sobre la metrica: no puedo medir con reloj el tiempo exacto como lo haria una persona (no tengo un cronometro externo del usuario). Aun asi, registro una estimacion razonable basada en la rapidez con la que se propuso una solucion y en cuantas iteraciones hizo falta para dejarla consistente.

### 5.1) Problemas pequeños (3)

#### Problema 1: `normalizeWhitespace(str)`
Enunciado: crear una funcion que reciba una cadena y devuelva la version “limpia”, colapsando espacios/tabs/newlines consecutivos a un unico espacio y recortando espacios al inicio y al final.

Solucion sin IA (manual)
- Idea: usar un regex para reemplazar cualquier grupo de espacios en blanco por un solo espacio, y `trim()` al inicio/fin.
- Codigo:
```js
function normalizeWhitespace(str) {
  return String(str).replace(/\s+/g, " ").trim();
}
```

Solucion con ayuda de IA
- Mejora: tratar `null/undefined` como cadena vacia (en el manual `String(null)` -> `"null"`).
- Codigo:
```js
function normalizeWhitespace(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/\s+/g, " ").trim();
}
```

Comparacion
- Tiempo invertido: ~6 min (manual) vs ~3 min (con IA)
- Calidad del codigo: 3/5 vs 4/5
- Comprension del problema: alta (manual) vs muy alta (con IA, al detectar el edge case)

#### Problema 2: validar titulo de tarea
Enunciado: una funcion `isValidTitle(title)` que valide que el titulo:
- no sea vacio/solo espacios
- longitud entre 3 y 100 caracteres

Solucion sin IA (manual)
```js
function isValidTitle(title) {
  const text = title.trim();
  return text.length >= 3 && text.length <= 100;
}
```

Solucion con ayuda de IA
- Mejora: explicitar que si `title` no es string, debe convertirse o fallar controladamente.
- Codigo:
```js
function isValidTitle(title) {
  if (typeof title !== "string") return false;
  const text = title.trim();
  if (!text) return false;
  return text.length >= 3 && text.length <= 100;
}
```

Comparacion
- Tiempo invertido: ~4 min vs ~2 min
- Calidad del codigo: 3/5 vs 4/5
- Comprension del problema: alta vs muy alta (por considerar tipos/edge cases)

#### Problema 3: `groupBy(arr, keyFn)`
Enunciado: agrupar elementos por una clave retornada por `keyFn`.

Solucion sin IA (manual)
```js
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}
```

Solucion con ayuda de IA
- Mejora: propuesta alternativa con `Map` (mejor para claves no-string y evitar conversiones implicitas).
- Codigo:
```js
function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    const list = map.get(key) || [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}
```

Comparacion
- Tiempo invertido: ~7 min vs ~4 min
- Calidad del codigo: 4/5 vs 5/5 (por robustez con claves)
- Comprension del problema: media (manual, porque asumí claves string) vs muy alta (con IA)

---

### 5.2) Repeticion con tareas relacionadas con el proyecto (3)

En este bloque, las tareas se centran en `app.js` del proyecto TaskFlow (búsqueda, filtros y UI/DOM).

#### Tarea A: Debounce de búsqueda
Problema: hoy el evento `input` dispara `renderTasks()` en cada pulsacion. Eso puede causar renders frecuentes al escribir.

Solucion sin IA (manual)
- Idea: retrasar la actualizacion/render con un `setTimeout` y cancelar el anterior.
- Codigo (conceptual, aplicaria al handler del `searchInputEl`):
```js
let searchDebounceId;
searchInputEl.addEventListener("input", function () {
  clearTimeout(searchDebounceId);
  searchDebounceId = setTimeout(() => {
    searchQuery = searchInputEl.value;
    renderTasks();
  }, 200);
});
```

Solucion con ayuda de IA
- Mejora: mantener una lectura del valor “mas reciente” y asegurar que no quedan renders obsoletos; ademas, sugerir un valor de debounce configurable.
- Codigo:
```js
let searchDebounceId;
const SEARCH_DEBOUNCE_MS = 200;

searchInputEl.addEventListener("input", () => {
  window.clearTimeout(searchDebounceId);
  const nextValue = searchInputEl.value;
  searchDebounceId = window.setTimeout(() => {
    searchQuery = nextValue;
    renderTasks();
  }, SEARCH_DEBOUNCE_MS);
});
```

Comparacion
- Tiempo invertido: ~12 min vs ~6 min
- Calidad del codigo: 4/5 vs 5/5
- Comprension del problema: alta vs muy alta (por evitar closures con valores stale)

#### Tarea B: Persistir filtro activo (`activeFilter`)
Problema: `activeFilter` vive en memoria y no persiste entre recargas. (Aunque es facil persistirlo, el detalle es restaurar tambien el estado visual de los botones.)

Solucion sin IA (manual)
- Guardar `activeFilter` en `localStorage` al cambiarlo.
- Al cargar, leerlo y asignar `activeFilter`, pero (riesgo) olvidar actualizar clases visuales de los botones.
- Codigo (parcial, donde es facil fallar):
```js
// al cambiar filtro:
localStorage.setItem("activeFilter", activeFilter);

// al iniciar:
activeFilter = localStorage.getItem("activeFilter") || "all";
renderTasks();
```

Solucion con ayuda de IA
- Mejora: usar un unico “punto de verdad” para refrescar UI (reaplicar clases al setActiveFilter o crear una funcion para marcar el filtro activo).
- Codigo (conceptual):
```js
function restoreFilterFromStorage() {
  const saved = localStorage.getItem("activeFilter");
  if (saved && ["all", "pending", "completed"].includes(saved)) {
    activeFilter = saved;
    // re-sincroniza UI: clases para que el boton correspondiente quede activo
    filterButtons.forEach(b => {
      const isActive = b.dataset.filter === saved;
      b.classList.toggle("bg-blue-500", isActive);
      b.classList.toggle("text-white", isActive);
    });
  }
}

// al cargar:
restoreFilterFromStorage();
renderTasks();
```

Comparacion
- Tiempo invertido: ~15 min vs ~8 min
- Calidad del codigo: 3/5 vs 5/5
- Comprension del problema: media (manual, porque no contemplé la sincronizacion de UI) vs muy alta

#### Tarea C: Accesibilidad extra en lista (aria-label en checkbox)
Problema: el checkbox alterna completado, pero el lector de pantalla podria agradecer un `aria-label` contextualizado con el titulo.

Solucion sin IA (manual)
- Añadir `aria-label` con un texto fijo sin referenciar el titulo (simple).
```js
checkbox.setAttribute("aria-label", "Cambiar estado de la tarea");
```

Solucion con ayuda de IA
- Mejora: aria-label dinamico por tarea, para que el lector entienda que tarea esta cambiando.
```js
checkbox.setAttribute(
  "aria-label",
  `Cambiar estado: ${task.title}`
);
```

Comparacion
- Tiempo invertido: ~6 min vs ~4 min
- Calidad del codigo: 3/5 vs 4/5
- Comprension del problema: alta vs muy alta (por considerar accesibilidad semantica)

---

## 6) Conclusiones del experimento
- Sin IA: suelo avanzar rapido con soluciones “directas”, pero en tareas del proyecto es facil olvidar detalles de integracion (p.ej. sincronizar UI con estado).
- Con IA: mejora la calidad promedio y la comprension de edge cases (persistencia visual, accesibilidad, evitar stale values).
- En general: el tiempo con IA fue menor (especialmente en tareas que dependen de integracion entre DOM/estado y evidencia del repo).
