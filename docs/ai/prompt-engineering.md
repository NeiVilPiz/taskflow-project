Este es el Adaptador que traduce el lenguaje humano al de la IA el cual:
- Reduce los errores
- Aumenta la effectividad de la comunicacion
- Facilita ignorar detalles menos importantes

## Prompt Engineering (plantillas)

Notas rapidas:
- Define SIEMPRE un rol (que tipo de experto debe ser).
- Pide una estructura de salida clara (formato fijo).
- Cuando quieras refactor seguro, exige "no cambiar comportamiento" y "explicar riesgos".
- Para "razonamiento paso a paso", pide un "plan de pasos" (no el razonamiento interno).

### 1) Generar codigo (rol senior + restricciones de salida)
**Prompt (copia y pega):**
```text
Actua como un desarrollador senior de JavaScript/Node y tambien como mantenedor de proyectos reales.

Objetivo: generar codigo para implementar [DESCRIBE LA TAREA].

Requisitos:
1) No inventes APIs ni dependencias. Si falta info, pregunta antes.
2) Conserva el comportamiento existente y solo cambia lo necesario.
3) Entrega el resultado con este formato EXACTO:
   - Archivo(s) a modificar: [lista]
   - Cambios clave: [lista corta]
   - Codigo final: [un bloque por archivo con rutas y contenido]
4) Si necesitas supuestos, ponlos en "Supuestos" antes del codigo.

Contexto del proyecto (usa lo que ya te den / o solicita por MCP):
[PEGA AQUI EL CONTEXTO O CONSULTA MCP]

Implementa la solucion ahora.
```

### 2) Refactor de nombres (seguro + sin romper)
**Prompt:**
```text
Actua como un refactorista experto (JavaScript/DOM).

Tarea: refactoriza solo los nombres de variables/funciones para mejorar claridad.

Reglas:
1) No cambies la logica.
2) No toques ids/queries del HTML (si existen).
3) No cambies la estructura de datos.
4) Mantener la misma salida visible en la UI.

Entrega:
1) Lista de renombres propuestos (antes -> despues).
2) Confirmacion: "comportamiento esperado: sin cambios".
3) Codigo final completo del/los archivos modificados.

Archivo(s) a refactorizar:
[PEGA AQUI CONTENIDO O INDICA RUTA]
```

### 3) Few-shot: refactor (ejemplos antes/despues)
**Prompt:**
```text
Actua como un ingeniero senior.
Tarea: refactoriza los nombres para que sean descriptivos.

Estilo a seguir (few-shot):
Ejemplo 1:
Entrada: const input = document.getElementById("taskInput");
Salida:  const taskInputEl = document.getElementById("taskInput");

Ejemplo 2:
Entrada: let currentFilter = "all";
Salida:  let activeFilter = "all";

Ejemplo 3:
Entrada: function toggleTask(id) { ... }
Salida:  function toggleTaskCompletion(id) { ... }

Ahora aplica el mismo estilo al siguiente codigo (renombra TODO lo que sea razonable):
[PEGA AQUI CODIGO]

Entrega SOLO el codigo refactorizado, sin explicaciones extra.
```

### 4) Few-shot: documentar funciones (JSDoc consistente)
**Prompt:**
```text
Actua como un mantenedor de codigo (documentacion JSDoc).

Objetivo: documentar funciones existentes con JSDoc consistente.

Ejemplos (few-shot):
Ejemplo:
Entrada (sin doc):
function addTask(title) { ... }

Salida (con doc):
/**
 * Agrega una tarea valida.
 * @param {string} title
 * @returns {"ok" | "invalid" | "duplicate"}
 */
function addTask(title) { ... }

Aplica lo mismo al siguiente bloque. No cambies la logica.
[PEGA AQUI BLOQUE]

Entrega:
1) Codigo final con JSDoc.
2) Lista de funciones documentadas.
```

### 5) Razonamiento paso a paso (plan + chequeos)
**Prompt:**
```text
Actua como un ingeniero de debugging.

Problema: [DESCRIBE EL BUG O CAMBIO QUE QUIERES].

Entrega en este orden EXACTO:
1) Plan (pasos numerados 1..N) para resolverlo.
2) Hipotesis (2..5) sobre la causa probable.
3) Cambios propuestos (lista).
4) Confirmacion de efectos colaterales (posibles riesgos).
5) Codigo final si aplica.

Regla: no muestres razonamiento interno detallado; solo el plan y las decisiones.
```

### 6) Restricciones de respuesta (formato duro)
**Prompt:**
```text
Actua como un asistente que sigue formatos estrictos.

Reglas de salida:
- Nunca respondas con texto fuera de los bloques solicitados.
- Usa SOLO este formato:
- SUMMARY:
[1-3 lineas]
- ASSUMPTIONS:
[si hay]
- CHANGES:
[lista plana]
- CODE:
[pega el codigo; si hay varios archivos, antepone "FILE: ruta" antes de cada uno]

Tarea: [DESCRIBE].
Codigo o contexto:
[PEGA AQUI]
```

### 7) Documentar el proyecto (README/guia)
**Prompt:**
```text
Actua como un escritor tecnico y mantenedor.

Objetivo: mejorar la documentacion del proyecto.

Instrucciones:
1) Primero identifica: que hace el proyecto, como se usa, y como se extiende.
2) Luego propone una estructura de README.
3) Finalmente entrega un README completo listo para pegar.

Restricciones:
- No asumas funcionalidades no presentes en el codigo.
- Si falta info, pide que consultes archivos por MCP.

Archivos a revisar:
[lista de rutas o "usa MCP filesystem para leer..."]
```

### 8) Generar un refactor con criterios de calidad
**Prompt:**
```text
Actua como un code reviewer senior.

Quiero refactorizar [DESCRIBE AREA].

Criterios (usa estos):
- Legibilidad: nombres y responsabilidades claras
- Correctitud: no cambiar comportamiento
- Robustez: manejo de casos vacios/errores
- Seguridad: no abrir acceso a rutas fuera del root si hay MCP

Entrega:
1) Lista de problemas actuales (prioridad alta/med/baja).
2) Lista de cambios propuestos.
3) Codigo final del archivo refactorizado.

Contexto:
[PEGA AQUI O INDICA RUTAS]
```

### 9) Revisions tipo PR (encontrar riesgos)
**Prompt:**
```text
Actua como revisador de PR.

Revisa los cambios en [ARCHIVO/DIFF O TEXTO].

Busca:
- Bugs
- Inconsistencias de nombres y scopes
- Manejo de eventos (listeners) y doble renders
- Persistencia (localStorage) y edge cases

Entrega:
1) Hallazgos ordenados por severidad (alta, media, baja).
2) Para cada hallazgo: "Que veo" + "Riesgo" + "Como arreglarlo".
3) Si todo esta bien, di "No se detectaron issues relevantes" y menciona riesgos residuales.
```

### 10) Prompt para usar MCP y citar evidencia
**Prompt:**
```text
Actua como un asistente que trabaja con evidencia real del repo usando MCP filesystem.

Tarea: responde a la pregunta [PREGUNTA].

Reglas:
1) Antes de responder, consulta evidencias reales del proyecto con MCP.
2) Cita las rutas de archivos usados (ej: D:/Proyectos/git/app.js).
3) No inventes contenido.

Consultas necesarias:
- Lista archivos relevantes
- Lee los archivos clave
- Si aplica, busca un simbolo/funcion especifica

Luego responde con:
1) Resumen
2) Evidencia (lista de rutas)
3) Respuesta final
```

### 11) Prompt para transformar codigo (ej: nombres -> estilo)
**Prompt:**
```text
Actua como un automator de estilo.

Tarea: transforma el codigo para cumplir el estilo:
- Variables DOM con sufijo "El"
- Botones con sufijo "BtnEl"
- Contadores con sufijo "CountEl"
- Estado con nombres tipo "activeX" y "searchQuery"

Reglas:
1) No cambiar logica.
2) No tocar ids del HTML.
3) Mantener JSDoc existente si esta.

Entrega:
- Solo codigo final.
- No agregues explicaciones.

Codigo a transformar:
[PEGA AQUI]
```

### 12) Prompt para tests (cuando existan)
**Prompt:**
```text
Actua como un ingeniero de calidad (tests).

Objetivo: crear pruebas para [COMPORTAMIENTO].

Reglas:
1) Si no hay framework de tests, primero propone uno (con razones) y pregunta.
2) Si ya existe, usa el mismo.
3) Entrega al menos:
   - 3 casos "happy path"
   - 2 casos borde
   - 1 caso de regresion (para evitar el bug original)

Entrega:
1) Lista de archivos a crear/modificar
2) Codigo de tests
3) Como ejecutarlos (comando)
```

### 13) Prompt para guiar implementacion incremental
**Prompt:**
```text
Actua como un ingeniero de entregas incrementales.

Quiero implementar: [CARACTERISTICA].

Estrategia:
1) Propón un plan en 3 iteraciones maximo.
2) En cada iteracion, indica: objetivo, cambios, y como validar.
3) Luego ejecuta la iteracion 1 con el codigo minimo.

Restriccion:
- No avances mas de lo necesario para la iteracion 1.
```