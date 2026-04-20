// 🔌 Importar capa de red
import { getTasks, createTask, deleteTask } from "./src/api/client.js";

// 📌 Elementos DOM
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// 🧠 Estado global
let tasks = [];
let loading = false;
let error = null;

// ==========================
// 🔄 ESTADOS UI
// ==========================

function setLoading(state) {
  loading = state;
  render();
}

function setError(message) {
  error = message;
  render();
}

// ==========================
// 🌐 API CALLS
// ==========================

// 📥 Cargar tareas
async function loadTasks() {
  try {
    setLoading(true);

    tasks = await getTasks();

    setError(null);
  } catch (err) {
    setError("Error cargando tareas");
  } finally {
    setLoading(false);
  }
}

// ➕ Crear tarea
async function addTask(title) {
  try {
    setLoading(true);

    const newTask = await createTask(title);

    tasks.push(newTask);

    setError(null);
  } catch (err) {
    setError("Error creando tarea");
  } finally {
    setLoading(false);
  }
}

// ❌ Eliminar tarea
async function removeTask(id) {
  try {
    setLoading(true);

    await deleteTask(id);

    tasks = tasks.filter(t => t.id !== id);

    setError(null);
  } catch (err) {
    setError("Error eliminando tarea");
  } finally {
    setLoading(false);
  }
}

// ==========================
// 🎨 RENDER
// ==========================

function render() {
  taskList.innerHTML = "";

  // ⏳ Loading
  if (loading) {
    const p = document.createElement("p");
    p.textContent = "Cargando...";
    taskList.appendChild(p);
    return;
  }

  // ❌ Error
  if (error) {
    const p = document.createElement("p");
    p.textContent = error;
    p.style.color = "red";
    taskList.appendChild(p);
    return;
  }

  // 📭 Vacío
  if (tasks.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay tareas";
    taskList.appendChild(p);
    return;
  }

  // 📋 Lista
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "flex justify-between border p-2";

    const span = document.createElement("span");
    span.textContent = task.title;

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.className = "text-red-500";
    btn.onclick = () => removeTask(task.id);

    li.appendChild(span);
    li.appendChild(btn);

    taskList.appendChild(li);
  });
}

// ==========================
// 🎯 EVENTOS
// ==========================

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = taskInput.value.trim();

  if (title.length < 3) {
    setError("La tarea debe tener al menos 3 caracteres");
    return;
  }

  addTask(title);
  taskInput.value = "";
});

// ==========================
// 🚀 INIT
// ==========================

loadTasks();