const taskService = require("../services/task.service");

// Adquirir tareas
function getTasks(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

// Crear tarea
function createTask(req, res) {
  const { title } = req.body;

  // Validación defensiva
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "Título inválido"
    });
  }

  const newTask = taskService.crearTarea({
    title: title.trim()
  });

  res.status(201).json(newTask);
}

// Eliminar tarea
function deleteTask(req, res) {
  const { id } = req.params;

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    res.status(500).json({
      error: "Error interno"
    });
  }
}

module.exports = {
  getTasks,
  createTask,
  deleteTask
};