const express = require("express");
const cors = require("cors");

// Cargar configuración (Antes de usarlo)
const { PORT } = require("./config/env");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos temporal
let tasks = [];

// Ruta base
app.get("/", (req, res) => {
  res.send("API TaskFlow funcionando 🚀");
});

// Obtener tareas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Crear tarea
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ error: "Título inválido" });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Actualizar tarea
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Eliminar tarea
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  tasks = tasks.filter(t => t.id !== id);

  res.json({ message: "Tarea eliminada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});