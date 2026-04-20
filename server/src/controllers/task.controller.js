const taskService = require("../services/task.service");

// Adquirir tareas
function getTasks(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

// Crear tarea
function createTask(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "Título inválido"
    });
  }

  try {
    const newTask = taskService.crearTarea({
      title: title.trim()
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}

// Eliminar tarea
function deleteTask(req, res, next) {
  const { id } = req.params;

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  deleteTask
};