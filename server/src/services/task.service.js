// Persistencia simulada
let tasks = [];

// Obtener todas las tareas
function obtenerTodas() {
  return tasks;
}

// Crear nueva tarea
function crearTarea(data) {
  const newTask = {
    id: Date.now().toString(),
    title: data.title,
    completed: false
  };

  tasks.push(newTask);
  return newTask;
}

// Eliminar tarea por ID
function eliminarTarea(id) {
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks.splice(index, 1);
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};