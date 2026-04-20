const BASE_URL = "http://localhost:3000/api/v1/tasks";

// 🔹 GET tareas
export async function getTasks() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("ERROR_FETCH_TASKS");
  return res.json();
}

// 🔹 POST tarea
export async function createTask(title) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "ERROR_CREATE_TASK");
  }

  return res.json();
}

// 🔹 DELETE tarea
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok && res.status !== 204) {
    throw new Error("ERROR_DELETE_TASK");
  }
}