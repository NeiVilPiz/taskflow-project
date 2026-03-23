// Elementos DOM
const taskFormEl = document.getElementById("taskForm");
const taskInputEl = document.getElementById("taskInput");
const taskListEl = document.getElementById("taskList");

const searchInputEl = document.getElementById("searchInput");

const doneCountEl = document.getElementById("done");
const todoCountEl = document.getElementById("todo");
const totalCountEl = document.getElementById("total");

const completeAllTasksBtnEl = document.getElementById("completeAll");
const clearCompletedTasksBtnEl = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll("[data-filter]");

const themeToggleBtnEl = document.getElementById("themeToggle");
const documentRootEl = document.documentElement;

const taskErrorEl = document.getElementById("taskError");

// Estado de la app
let tasks = [];
let activeFilter = "all";
let searchQuery = "";

// Storage
/**
 * Persiste el array `tasks` en `localStorage`.
 * @returns {void}
 */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Carga el array `tasks` desde `localStorage`.
 * Si el JSON está corrupto o no existe, inicializa un array vacío.
 * @returns {void}
 */
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (!stored) {
    tasks = [];
    return;
  }

  try {
    const parsed = JSON.parse(stored) || [];
    tasks = parsed.map(t => ({
      ...t,
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date()
    }));
  } catch {
    tasks = [];
  }
}

// Validaciones y feedback
/**
 * Valida el título de una tarea (longitud y contenido).
 * @param {string} title
 * @returns {boolean}
 */
function isValidTitle(title) {
  const text = title.trim();
  if (!text) return false;
  if (text.length < 3) return false;
  if (text.length > 100) return false;
  return true;
}

/**
 * Comprueba si el título ya existe en alguna tarea (comparación case-insensitive).
 * @param {string} title
 * @returns {boolean}
 */
function isDuplicateTitle(title) {
  const text = title.trim().toLowerCase();
  return tasks.some(t => t.title.toLowerCase() === text);
}

/**
 * Intenta actualizar el título de una tarea respetando las validaciones.
 * @param {{title: string}} task
 * @param {string} newTitle
 * @returns {boolean} `true` si se actualiza, `false` si no cumple validaciones.
 */
function tryUpdateTaskTitle(task, newTitle) {
  const text = newTitle.trim();
  if (!isValidTitle(text)) return false;

  const lowerNew = text.toLowerCase();
  const lowerOld = task.title.toLowerCase();

  if (lowerNew !== lowerOld && isDuplicateTitle(text)) {
    return false;
  }

  task.title = text;
  return true;
}

/**
 * Muestra un mensaje de error al usuario.
 * @param {string} message
 * @returns {void}
 */
function showTaskError(message) {
  taskErrorEl.textContent = message;
}

/**
 * Limpia el mensaje de error visible en la interfaz.
 * @returns {void}
 */
function clearTaskError() {
  taskErrorEl.textContent = "";
}

// Lógica de dominio: crear y filtrar
/**
 * Crea el objeto de una tarea nueva.
 * @param {string} title
 * @returns {{id: string, title: string, completed: boolean, createdAt: Date}}
 */
function createTaskObject(title) {
  return {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date()
  };
}

const Filters = {
  /**
  * Filtra por estado de la tarea según `activeFilter`.
   * @param {{completed: boolean}} task
   * @returns {boolean}
   */
  byStatus(task) {
    if (activeFilter === "pending") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  },
  /**
  * Filtra por búsqueda (subcadena en el título) según `searchQuery`.
   * @param {{title: string}} task
   * @returns {boolean}
   */
  bySearch(task) {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  }
};

/**
 * Obtiene las tareas filtradas según el filtro actual y la búsqueda.
 * @returns {Array<{id: string, title: string, completed: boolean, createdAt: Date}>}
 */
function getFilteredTasks() {
  return tasks
    .filter(Filters.byStatus)
    .filter(Filters.bySearch);
}

// Lógica de dominio: acciones sobre tareas
/**
 * Añade una tarea nueva si pasa validaciones (longitud y duplicados).
 * @param {string} title
 * @returns {"ok" | "invalid" | "duplicate"}
 */
function addTask(title) {
  const trimmed = title.trim();

  if (!isValidTitle(trimmed)) {
    showTaskError("La tarea debe tener entre 3 y 100 caracteres.");
    return "invalid";
  }

  if (isDuplicateTitle(trimmed)) {
    showTaskError("Ya existe una tarea con ese nombre.");
    return "duplicate";
  }

  clearTaskError();

  const task = createTaskObject(trimmed);
  tasks.push(task);
  renderTasks();
  return "ok";
}

/**
 * Alterna el estado `completed` de una tarea.
 * @param {string} id
 * @returns {void}
 */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }
  renderTasks();
}

/**
 * Elimina del array todas las tareas con el id indicado.
 * @param {string} id
 * @returns {void}
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

/**
 * Permite editar una tarea inline (doble click sobre el texto).
 * @param {string} id
 * @returns {void}
 */
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const li = taskListEl.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  const span = li.querySelector("span.flex-1");
  if (!span) return;

  const originalText = task.title;

  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = originalText;
  inputEdit.className = "flex-1 border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600";

  const finishEdit = (save) => {
    if (save) {
      const ok = tryUpdateTaskTitle(task, inputEdit.value);
      if (!ok) {
        inputEdit.classList.add("border-red-500");
        showTaskError("Título inválido o duplicado.");
        return; // deja que el usuario corrija
      }
      clearTaskError();
    }
    renderTasks();
  };

  inputEdit.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit(true);
    if (e.key === "Escape") finishEdit(false);
  });

  inputEdit.addEventListener("blur", () => finishEdit(true));

  li.replaceChild(inputEdit, span);
  inputEdit.focus();
  inputEdit.select();
}

/**
 * Marca como completadas todas las tareas.
 * @returns {void}
 */
function completeAllTasks() {
  tasks.forEach(task => {
    task.completed = true;
  });
  renderTasks();
}

/**
 * Elimina del array todas las tareas completadas.
 * @returns {void}
 */
function clearCompletedTasks() {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
}

// Render / UI
/**
 * Construye el elemento DOM `<li>` de una tarea.
 * @param {{id: string, title: string, completed: boolean}} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "flex items-center gap-3 border rounded-lg px-3 py-2 dark:border-gray-600";
  li.setAttribute("role", "listitem");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-checked", String(task.completed));
  checkbox.addEventListener("change", () => {
    toggleTask(task.id);
  });

  const span = document.createElement("span");
  span.textContent = task.title;
  span.className = "flex-1";

  if (task.completed) {
    span.classList.add("line-through", "text-gray-500");
  }

  span.addEventListener("dblclick", () => {
    editTask(task.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.className = "text-red-500";
  deleteBtn.setAttribute("aria-label", "Eliminar tarea");
  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Renderiza la lista completa según filtros/búsqueda y actualiza estadísticas.
 * @returns {void}
 */
function renderTasks() {
  taskListEl.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "text-center text-sm text-gray-500 py-2";
    empty.textContent = searchQuery
      ? "No se han encontrado tareas para esa búsqueda."
      : "No hay tareas. Añade la primera para empezar.";
    taskListEl.appendChild(empty);
    updateStats();
    saveTasks();
    return;
  }

  const fragment = document.createDocumentFragment();

  filteredTasks.forEach(task => {
    const li = createTaskElement(task);
    fragment.appendChild(li);
  });

  taskListEl.appendChild(fragment);

  updateStats();
  saveTasks();
}

/**
 * Actualiza los contadores de estadísticas en pantalla.
 * @returns {void}
 */
function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  totalCountEl.textContent = totalTasks;
  doneCountEl.textContent = completedTasks;
  todoCountEl.textContent = totalTasks - completedTasks;
}

// Tema oscuro
/**
 * Aplica el tema en la interfaz añadiendo/quitar la clase `dark`.
 * @param {boolean} isDark
 * @returns {void}
 */
function applyTheme(isDark) {
  if (isDark) {
    documentRootEl.classList.add("dark");
    themeToggleBtnEl.textContent = "Modo claro";
    themeToggleBtnEl.setAttribute("aria-pressed", "true");
  } else {
    documentRootEl.classList.remove("dark");
    themeToggleBtnEl.textContent = "Modo oscuro";
    themeToggleBtnEl.setAttribute("aria-pressed", "false");
  }
}

/**
 * Carga el tema desde `localStorage`.
 * Si no hay preferencia guardada, usa `prefers-color-scheme`.
 * @returns {void}
 */
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    applyTheme(true);
    return;
  }

  if (savedTheme === "light") {
    applyTheme(false);
    return;
  }

  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(prefersDark);
}

/**
 * Alterna el tema y lo guarda en `localStorage`.
 * @returns {void}
 */
function toggleTheme() {
  const isCurrentlyDark = documentRootEl.classList.contains("dark");
  const willBeDark = !isCurrentlyDark;

  applyTheme(willBeDark);
  localStorage.setItem("theme", willBeDark ? "dark" : "light");
}

// Eventos
taskFormEl.addEventListener("submit", function (e) {
  e.preventDefault();

  const result = addTask(taskInputEl.value);

  if (result === "ok") {
    taskInputEl.value = "";
  }
});

taskInputEl.addEventListener("input", clearTaskError);

searchInputEl.addEventListener("input", function () {
  searchQuery = searchInputEl.value;
  renderTasks();
});

/**
 * Cambia el filtro activo de tareas (todas/pendientes/completadas) y re-renderiza.
 * @param {HTMLButtonElement} button
 * @returns {void}
 */
function setActiveFilter(button) {
  activeFilter = button.dataset.filter;

  filterButtons.forEach(b => {
    const isActive = b === button;
    b.classList.toggle("bg-blue-500", isActive);
    b.classList.toggle("text-white", isActive);
  });

  renderTasks();
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => setActiveFilter(button));
});

completeAllTasksBtnEl.addEventListener("click", completeAllTasks);
clearCompletedTasksBtnEl.addEventListener("click", clearCompletedTasks);

themeToggleBtnEl.addEventListener("click", toggleTheme);

// Inicialización
loadTasks();
loadTheme();
renderTasks();